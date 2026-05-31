/* ================================================================
   masilmap — 통합 분류 엔진 (하나의 분류 · 두 가지 뷰)
   지도(mapmenu)와 건축물 리스트(buildings)가 같은 필터 상태·렌즈·태그를
   공유한다. 렌즈 = 저장된 검색식(프리셋), 상세필터 = 수동 조절.
   폴크소노미 태그는 공유 저장소(userTags)에서 읽고, 운영자 병합/승격 반영.
   ================================================================ */

/* ---------- 기본 렌즈 (코드 정의) ---------- */
const TX_BASE_LENSES = [
  { id: "all",      label: "전체",      icon: "map",      test: () => true },
  { id: "trending", label: "트렌딩",    icon: "sparkle",  test: (b) => (b.visited || 0) >= 8000 },
  { id: "award",    label: "어워드",    icon: "bookmark", award: true },
  { id: "hanok",    label: "한옥·전통", icon: "home",     test: (b) => b.typeKey === "hanok" },
  { id: "night",    label: "야경",      icon: "clock",    tag: "야경" },
  { id: "new",      label: "신규 등록", icon: "plus",     test: (b) => (b.year || 0) >= 2014 },
];

/* ---------- 태그 정규화 (병합 규칙 적용) ---------- */
function txCanon(tag, store) {
  const merges = (store && store.tagMerges) || {};
  let t = tag, guard = 0;
  while (merges[t] && guard++ < 8) t = merges[t];
  return t;
}

/* 한 건물의 공개 태그 = 원천 태그(data) + 방문자 태그(임계 이상), 병합·금지 반영 */
function txBuildingTags(b, store) {
  const min = (window.TAG_PUBLIC_MIN || 2);
  const banned = new Set((store && store.bannedTags) || []);
  const out = new Map(); // canon -> {tag, votes, source}
  (b.tags || []).forEach((raw) => {
    const t = txCanon(raw, store);
    if (banned.has(t)) return;
    out.set(t, { tag: t, votes: (out.get(t)?.votes || 0), source: "base" });
  });
  const uv = ((store && store.userTags) || {})[b.id] || {};
  Object.entries(uv).forEach(([raw, votes]) => {
    const t = txCanon(raw, store);
    if (banned.has(t)) return;
    const prev = out.get(t);
    if (prev) prev.votes += votes;
    else if (votes >= min) out.set(t, { tag: t, votes, source: "folk" });
    else out.set("__pending__" + t, { tag: t, votes, source: "pending" }); // 임계 미만 (본인에게만)
  });
  return [...out.values()].filter((x) => x.source !== "pending");
}
function txBuildingTagNames(b, store) { return txBuildingTags(b, store).map((x) => x.tag); }

/* 모든 태그 + 카운트 (운영자/필터 UI용) */
function txAllTags(store) {
  const counts = {};
  (window.BUILDINGS || []).forEach((b) => {
    txBuildingTagNames(b, store).forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
  });
  return Object.entries(counts).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
}

/* ---------- 통합 렌즈 목록 (기본 + 운영자 승격) ---------- */
function txLenses(store) {
  const promoted = ((store && store.promotedLenses) || []).map((l) => ({ id: l.id, label: l.label, icon: "bookmark", tag: l.tag }));
  return [...TX_BASE_LENSES, ...promoted];
}
function txLensTest(lens, store) {
  if (lens.test) return lens.test;
  if (lens.award) { const ids = new Set((store && store.awardIds) || []); return (b) => ids.has(b.id); }
  if (lens.tag)  return (b) => txBuildingTagNames(b, store).includes(lens.tag);
  return () => true;
}

/* ---------- 통합 필터 엔진 ----------
   state: { lens, q, uses:Set(useKey), regions:Set, tags:Set, yearMin, yearMax } */
function txFilter(buildings, state, store) {
  const s = state || {};
  const lens = (txLenses(store).find((l) => l.id === s.lens)) || TX_BASE_LENSES[0];
  const lensTest = txLensTest(lens, store);
  const q = (s.q || "").trim().toLowerCase();
  return buildings.filter((b) => {
    if (!lensTest(b)) return false;
    if (s.styles && s.styles.size && !s.styles.has(b.typeKey)) return false;
    if (s.uses && s.uses.size && !s.uses.has(b.useKey)) return false;
    if (s.regions && s.regions.size) {
      const prov = (b.region || "").split(" ")[0];
      if (!s.regions.has(prov)) return false;
    }
    if (s.yearMin && (b.year || 0) < s.yearMin) return false;
    if (s.yearMax && (b.year || 9999) > s.yearMax) return false;
    if (s.tags && s.tags.size) {
      const bt = new Set(txBuildingTagNames(b, store));
      for (const t of s.tags) if (!bt.has(t)) return false;
    }
    if (q) {
      const hay = `${b.name} ${b.nameEn || ""} ${b.region} ${b.architect || ""} ${b.style || ""} ${txBuildingTagNames(b, store).join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/* 빈 필터 상태 */
function txEmptyState() { return { lens: "all", q: "", styles: new Set(), uses: new Set(), regions: new Set(), tags: new Set(), yearMin: 0, yearMax: 0 }; }
function txActiveCount(s) {
  return (s.styles?.size || 0) + (s.uses?.size || 0) + (s.regions?.size || 0) + (s.tags?.size || 0) + (s.yearMin ? 1 : 0) + (s.yearMax ? 1 : 0);
}

/* 양식(typeKey) 라벨 + 지역(province) 목록 — 데이터에서 도출 */
const TX_STYLES = [
  { key: "hanok",  label: "한옥·전통" },
  { key: "modern", label: "근현대" },
  { key: "museum", label: "미술관·박물관" },
];
function txProvinces() {
  const set = new Set();
  (window.BUILDINGS || []).forEach((b) => set.add((b.region || "").split(" ")[0]));
  return [...set].filter(Boolean);
}
function txStyleCount(key, store) { return (window.BUILDINGS || []).filter((b) => b.typeKey === key).length; }

Object.assign(window, {
  TX_BASE_LENSES, TX_STYLES, txProvinces, txStyleCount, txCanon, txBuildingTags, txBuildingTagNames, txAllTags,
  txLenses, txLensTest, txFilter, txEmptyState, txActiveCount,
});
