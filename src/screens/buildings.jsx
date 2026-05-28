/* ================================================================
   masilmap — 건축물 인덱스 (BuildingsIndexScreen)
   상단 EDITOR'S PICKS 3개 고정 + 하단 masilground 톤 3-col 그리드
   ================================================================ */

/* ---------- Featured 카드 (Editor's Picks용) ---------- */
function FeaturedCard({ b, onClick, variant = "compact" }) {
  const accent = b.pinTone === "olive" ? M.olive : M.terra;
  const sizes = {
    large:   { aspect: "16/10", titleSize: 32, padding: 28, showIntro: true },
    medium:  { aspect: "16/9",  titleSize: 22, padding: 22, showIntro: false },
    compact: { aspect: "4/3",   titleSize: 20, padding: 18, showIntro: false },
  }[variant];

  return (
    <div onClick={onClick} style={{
      position: "relative", height: "100%",
      borderRadius: MR.card, overflow: "hidden",
      boxShadow: MS.card, cursor: "pointer",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ position: "relative", aspectRatio: sizes.aspect, overflow: "hidden" }}>
        <ImgPlaceholder
          ratio={sizes.aspect}
          tone={b.pinTone === "olive" ? "olive" : "beige"}
          caption={`${b.name} · 큐레이터 노트`}
          style={{ borderRadius: 0, height: "100%" }}
        />
        <div style={{
          position: "absolute", top: 12, left: 12, display: "flex", gap: 6,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
            color: M.cream, background: `${M.ink}cc`,
            padding: "4px 9px", borderRadius: 6,
          }}>EDITOR'S PICK</span>
        </div>
      </div>

      <div style={{
        padding: sizes.padding,
        background: M.cream, flex: 1,
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <MagCap style={{ fontSize: 10 }}>{b.region} · {b.style}</MagCap>
        </div>
        <div style={{
          fontSize: sizes.titleSize, fontWeight: 900,
          letterSpacing: "-0.02em", lineHeight: 1.2, color: M.ink,
        }}>{b.name}</div>
        <div style={{ fontSize: 11, color: M.muted, fontWeight: 600 }}>
          {b.architect} · {b.year}
        </div>
        {sizes.showIntro && (
          <p style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: 15, lineHeight: 1.7, color: M.ink,
            margin: "8px 0 0", fontWeight: 400,
            display: "-webkit-box", WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3, overflow: "hidden",
          }}>{b.intro}</p>
        )}
      </div>
    </div>
  );
}

/* ---------- masilground 톤 그리드 카드 ---------- */
function GridCard({ b, onClick }) {
  const accent = b.pinTone === "olive" ? M.olive : M.terra;
  return (
    <div onClick={onClick} style={{ cursor: "pointer" }}>
      <ImgPlaceholder
        ratio="4/3"
        tone={b.pinTone === "olive" ? "olive" : "beige"}
        caption={`${b.name} 외관`}
        style={{ borderRadius: MR.card, marginBottom: 14 }}
      />
      <div style={{ padding: "0 2px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <MagCap style={{ fontSize: 10 }}>{b.region}</MagCap>
        </div>
        <div style={{
          fontSize: 18, fontWeight: 800, letterSpacing: "-0.015em",
          color: M.ink, lineHeight: 1.25, marginBottom: 4,
        }}>
          {b.name} <span style={{ color: M.muted, fontWeight: 500 }}>/ {b.architect}</span>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: M.muted,
        }}>
          {b.style} · {b.year}
        </div>
      </div>
    </div>
  );
}

/* ---------- 필터 드롭다운 칩 (masilmap.com 스타일) ---------- */
function FilterChip({ label, badge = 0, open, onToggle, children, width = 280, icon = "filter", prominent = false }) {
  const active = badge > 0;
  return (
    <div data-filter-chip style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: prominent ? "10px 40px" : "10px 16px",
          borderRadius: 999,
          background: active
            ? `${M.terra}14`
            : (prominent ? `${M.olive}14` : M.cream),
          border: `1px solid ${active ? `${M.terra}55` : (prominent ? `${M.olive}55` : M.beigeAlt)}`,
          fontSize: prominent ? 14 : 13,
          fontWeight: prominent ? 800 : 700,
          color: active ? M.terra : M.ink,
          cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
          transition: "all .15s",
        }}>
        <MIcon name={icon} size={13} color={active ? M.terra : M.ink}/>
        <span>{label}</span>
        {active && (
          <span style={{
            background: M.terra, color: M.cream,
            fontSize: 10, fontWeight: 800,
            padding: "1px 7px", borderRadius: 999, lineHeight: 1.4,
          }}>{badge}</span>
        )}
        <MIcon name="chevron" size={11} color={M.muted}
          style={{ transform: `rotate(${open ? -90 : 90}deg)`, transition: "transform .15s" }}/>
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute", top: "calc(100% + 8px)", left: 0,
            background: M.beige,
            border: `1px solid ${M.beigeAlt}`,
            borderRadius: 18,
            boxShadow: "0 12px 32px rgba(58,46,34,0.15)",
            padding: 18, width, zIndex: 60,
          }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ---------- 체크박스 행 ---------- */
function CheckRow({ checked, onChange, label, count, disabled, dot }) {
  return (
    <label style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 4px", borderRadius: 8,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      fontSize: 13, fontWeight: 600, color: M.ink,
    }}>
      <input type="checkbox" checked={checked} disabled={disabled}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        style={{ accentColor: M.terra, width: 15, height: 15 }}/>
      {dot && <span style={{ width: 8, height: 8, borderRadius: 999, background: dot, flexShrink: 0 }}/>}
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && (
        <span style={{ fontSize: 11, color: M.muted, fontWeight: 700 }}>{count}</span>
      )}
    </label>
  );
}

/* ---------- 라디오 행 ---------- */
function RadioRow({ value, current, onChange, label }) {
  const on = value === current;
  return (
    <label onClick={() => onChange(value)} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "6px 12px", borderRadius: 999,
      background: on ? M.terra : "transparent",
      color: on ? M.cream : M.ink,
      border: on ? "none" : `1px solid ${M.beigeAlt}`,
      fontSize: 12, fontWeight: 700, cursor: "pointer",
      marginRight: 6, marginBottom: 6,
    }}>{label}</label>
  );
}

/* ---------- 용도 필터 (1차 → 2차 hierarchical, ArchDaily 톤) ---------- */
function UseFilterChip({ uses, setUses, open, onToggle }) {
  // 첫 데이터 있는 1차로 기본값
  const firstWithData = USE_TYPES.find((c) => (c.children || []).some((s) => useCountFor(s.id) > 0));
  const [activeCat, setActiveCat] = React.useState((firstWithData || USE_TYPES[0]).id);

  const cat = USE_TYPES.find((c) => c.id === activeCat) || USE_TYPES[0];

  // 1차 카테고리별 합계
  const totalFor = (cat1) => (cat1.children || []).reduce((s, sub) => s + useCountFor(sub.id), 0);

  const toggleSub = (id) => {
    const next = new Set(uses);
    next.has(id) ? next.delete(id) : next.add(id);
    setUses(next);
  };
  const selectAllInCat = (cat1) => {
    const next = new Set(uses);
    (cat1.children || []).forEach((s) => next.add(s.id));
    setUses(next);
  };
  const clearCat = (cat1) => {
    const next = new Set(uses);
    (cat1.children || []).forEach((s) => next.delete(s.id));
    setUses(next);
  };

  const subSelectedCount = (cat.children || []).filter((s) => uses.has(s.id)).length;
  const subTotal = (cat.children || []).length;

  return (
    <FilterChip label="용도" badge={uses.size}
      open={open} onToggle={onToggle}
      icon="settings" width={620} prominent>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, maxHeight: 440 }}>
        {/* === 좌측: 1차 (법정 용도) === */}
        <div style={{ overflowY: "auto", paddingRight: 4, borderRight: `1px solid ${M.beigeAlt}` }}>
          <div style={{ fontSize: 11, color: M.muted, fontWeight: 800, letterSpacing: "0.06em",
            textTransform: "uppercase", padding: "0 6px 8px" }}>
            1차 · 법정 용도
          </div>
          {USE_TYPES.map((c) => {
            const total = totalFor(c);
            const isEmpty = (c.children || []).length === 0;
            const on = activeCat === c.id;
            return (
              <div key={c.id} onClick={() => setActiveCat(c.id)} style={{
                padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: on ? `${M.terra}10` : "transparent",
                color: isEmpty ? M.faint : (on ? M.terra : M.ink),
                fontSize: 13, fontWeight: on ? 800 : 600,
                marginBottom: 1,
              }}>
                <span>{c.name}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {!isEmpty && (
                    <span style={{ fontSize: 11, color: M.muted, fontWeight: 700 }}>{total}</span>
                  )}
                  <span style={{ fontSize: 12, color: on ? M.terra : M.faint }}>›</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* === 우측: 2차 (세부 유형) === */}
        <div style={{ overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: M.ink }}>{cat.name}</div>
            {(cat.children || []).length > 0 && (
              <div style={{ display: "flex", gap: 8 }}>
                <span onClick={() => selectAllInCat(cat)} style={{
                  fontSize: 11, fontWeight: 700, color: M.terra,
                  cursor: "pointer",
                }}>전체</span>
                <span style={{ color: M.faint, fontSize: 11 }}>·</span>
                <span onClick={() => clearCat(cat)} style={{
                  fontSize: 11, fontWeight: 700, color: M.muted,
                  cursor: "pointer",
                }}>해제</span>
              </div>
            )}
          </div>

          {(cat.children || []).length === 0 ? (
            <div style={{
              padding: "20px 8px", color: M.muted, fontSize: 12, fontWeight: 600,
              fontStyle: "italic",
            }}>
              (현재 해당 건물 없음)
            </div>
          ) : (
            cat.children.map((sub) => (
              <CheckRow key={sub.id}
                checked={uses.has(sub.id)}
                onChange={() => toggleSub(sub.id)}
                label={sub.name}
                count={useCountFor(sub.id)}/>
            ))
          )}

          {subTotal > 0 && (
            <div style={{ marginTop: 12, paddingTop: 10,
              borderTop: `1px solid ${M.beigeAlt}`,
              fontSize: 11, color: M.muted, fontWeight: 700,
            }}>
              {cat.name} · {subSelectedCount} / {subTotal} 선택
            </div>
          )}
        </div>
      </div>

      {uses.size > 0 && (
        <div onClick={() => setUses(new Set())} style={{
          marginTop: 12, padding: "8px 0", textAlign: "center",
          fontSize: 12, fontWeight: 700, color: M.terra,
          cursor: "pointer", borderTop: `1px solid ${M.beigeAlt}`,
        }}>모두 해제 ({uses.size})</div>
      )}
    </FilterChip>
  );
}

/* 2차 id별 BUILDINGS 카운트 (UseFilterChip이 호출) */
const useCountCache = { v: null };
function useCountFor(subId) {
  if (!useCountCache.v) {
    const c = {};
    (window.BUILDINGS || []).forEach((b) => { if (b.useKey) c[b.useKey] = (c[b.useKey] || 0) + 1; });
    useCountCache.v = c;
  }
  return useCountCache.v[subId] || 0;
}

/* ---------- 인덱스 화면 ---------- */
const ITEMS_PER_PAGE = 20;
const parseGfa = (s) => {
  const m = String(s || "").replace(/,/g, "").match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
};

/* 지역 매핑 — region 문자열 첫 단어로 광역권 묶기 */
const KR_PROVINCES = [
  { id: "kr-seoul",       name: "서울",            matches: ["서울"] },
  { id: "kr-gyeonggi",    name: "경기·인천",       matches: ["경기", "인천"] },
  { id: "kr-gangwon",     name: "강원",            matches: ["강원"] },
  { id: "kr-chungcheong", name: "충청·대전·세종", matches: ["충북", "충남", "대전", "세종"] },
  { id: "kr-jeolla",      name: "전라·광주",       matches: ["전북", "전남", "광주"] },
  { id: "kr-gyeongsang",  name: "경상·부산·대구·울산", matches: ["경북", "경남", "부산", "대구", "울산"] },
  { id: "kr-jeju",        name: "제주",            matches: ["제주"] },
];
const INTL_COUNTRIES = [
  { id: "intl-jp",    name: "일본",  flag: "🇯🇵" },
  { id: "intl-cn",    name: "중국",  flag: "🇨🇳" },
  { id: "intl-us",    name: "미국",  flag: "🇺🇸" },
  { id: "intl-eu",    name: "유럽",  flag: "🌍" },
  { id: "intl-other", name: "그 외", flag: "🌏" },
];
const provinceIdOf = (b) => {
  const prov = String(b.region || "").split(" ")[0];
  const m = KR_PROVINCES.find((p) => p.matches.includes(prov));
  return m ? m.id : null;
};
const inputStyle = {
  width: "100%", padding: "8px 12px", borderRadius: 10,
  border: `1px solid ${M.beigeAlt}`,
  background: M.cream, color: M.ink,
  fontSize: 13, fontWeight: 600, fontFamily: "inherit",
  outline: "none",
};

function BuildingsIndexScreen({ onNavigate, searchQuery }) {
  // 페이지
  const [page, setPage] = React.useState(1);

  // 필터 dropdown open 상태 (단일)
  const [openMenu, setOpenMenu] = React.useState(null);
  const toggleMenu = (k) => setOpenMenu((cur) => (cur === k ? null : k));

  // 필터 state
  const [projects, setProjects] = React.useState(new Set(["building"]));     // 기본 건축물
  const [regions, setRegions]   = React.useState(new Set());                  // 지역 키 set
  const [uses, setUses]         = React.useState(new Set());                  // typeKey set
  const [areaType, setAreaType] = React.useState("gfa");                      // 대지/건축/연면적
  const [areaMin, setAreaMin]   = React.useState(0);
  const [areaMax, setAreaMax]   = React.useState(200000);
  const [floorsType, setFloorsType] = React.useState("above");                // 지상/지하
  const [floorsMin, setFloorsMin]   = React.useState(1);
  const [floorsMax, setFloorsMax]   = React.useState(50);

  // 필터 변경 시 페이지 리셋
  const setUsesAndReset = (s)  => { setUses(s);     setPage(1); };
  const onChangeArea    = ()   => { setPage(1); };
  const onChangeFloors  = ()   => { setPage(1); };

  // 검색어 바뀌면 첫 페이지로
  React.useEffect(() => { setPage(1); }, [searchQuery]);

  // dropdown 외부 클릭 시 닫기
  React.useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("[data-filter-chip]")) setOpenMenu(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Editor's Picks
  const picks = (() => {
    const pickIds = ["kongkan", "buseoksa", "bonte"];
    const found = pickIds.map((id) => BUILDINGS.find((b) => b.id === id)).filter(Boolean);
    return found.length === 3 ? found : BUILDINGS.slice(0, 3);
  })();

  // 지역별 카운트 (한국 광역권만, 현재 데이터 기준)
  const provinceCounts = (() => {
    const c = {};
    BUILDINGS.forEach((b) => {
      const id = provinceIdOf(b);
      if (id) c[id] = (c[id] || 0) + 1;
    });
    return c;
  })();
  const krTotal = Object.values(provinceCounts).reduce((a, b) => a + b, 0);

  // 필터링
  const q = (searchQuery || "").trim().toLowerCase();
  const filtered = BUILDINGS.filter((b) => {
    if (q) {
      const hay = `${b.name} ${b.nameEn || ""} ${b.region} ${b.architect} ${b.style} ${(b.tags || []).join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (regions.size > 0) {
      const id = provinceIdOf(b);
      if (!id || !regions.has(id)) return false;
    }
    if (uses.size > 0 && !uses.has(b.useKey)) return false;
    if (areaType === "gfa") {
      const g = parseGfa(b.metrics?.gfa);
      if (g < areaMin || g > areaMax) return false;
    }
    if (floorsType === "above") {
      const f = b.metrics?.floors || 0;
      if (f < floorsMin || f > floorsMax) return false;
    }
    return true;
  });

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const showPicks  = safePage === 1;

  // 활성 배지 계산
  const regionBadge  = regions.size;
  const usesBadge    = uses.size;
  const areaBadge    = (areaMin > 0 || areaMax < 200000) ? 1 : 0;
  const floorsBadge  = (floorsMin > 1 || floorsMax < 50 || floorsType !== "above") ? 1 : 0;
  const projectBadge = 0; // 항상 "건축물" 기본 → 배지 없음

  // (용도 카운트는 UseFilterChip 내부에서 useCountFor() 호출로 처리)

  // 체크박스 토글 헬퍼
  const toggleSet = (set, val, setter, resetPage = true) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setter(next);
    if (resetPage) setPage(1);
  };

  return (
    <MPage>
      <MasilNav route="buildings" onNavigate={onNavigate}/>

      {/* HERO 헤더 — 컴팩트 */}
      <section style={{ padding: "24px 56px 12px" }}>
        <Hairline label="ALL BUILDINGS · 526 PLACES" style={{ marginBottom: 16 }}/>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <h1 style={{
            fontSize: 44, fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.05, color: M.ink, margin: 0,
            textWrap: "balance",
          }}>
            한국에 지어진{" "}
            <span style={{ color: M.terra, fontFamily: "'Noto Serif KR', serif", fontStyle: "italic", fontWeight: 700 }}>모든 건축</span>의 인덱스.
          </h1>
          <p style={{
            fontSize: 13, lineHeight: 1.6,
            color: M.muted, fontWeight: 500, margin: 0,
            maxWidth: 340, textWrap: "pretty",
          }}>
            526곳을 카테고리·지역·시대로 펼쳐 두었습니다. 매월 에디터가 새 픽을 고릅니다.
          </p>
        </div>
      </section>

      {/* EDITOR'S PICKS — 1페이지에만 노출 */}
      {showPicks && (
        <section style={{ padding: "16px 56px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <MagCap color={M.terra}>EDITOR'S PICKS · 2026 SPRING</MagCap>
              <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em", margin: 0, color: M.ink }}>
                이번 호의 세 건축
              </h2>
            </div>
            <span style={{ fontSize: 12, color: M.terra, fontWeight: 800, cursor: "pointer" }}
              onClick={() => onNavigate("collection")}>
              큐레이션 컬렉션 전체 보기 →
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}>
            {picks.map((p) => (
              <FeaturedCard
                key={p.id}
                b={p}
                onClick={() => onNavigate("detail", p.id)}
                variant="compact"
              />
            ))}
          </div>
        </section>
      )}

      {/* STICKY FILTER (스크롤 내려도 nav 바로 아래 고정) */}
      <div style={{
        position: "sticky", top: 71, zIndex: 40,
        background: M.beige,
        borderBottom: `1px solid ${M.beigeAlt}`,
        boxShadow: "0 4px 12px rgba(58,46,34,0.04)",
      }}>
        <div style={{ padding: "0 56px" }}>
          <Hairline label={`ALL · ${filtered.length} / ${BUILDINGS.length} PLACES${totalPages > 1 ? ` · PAGE ${safePage}/${totalPages}` : ""}`} />
        </div>
        <section style={{ padding: "14px 56px 16px" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center", flexWrap: "wrap", position: "relative" }}>

            {/* === 프로젝트 === */}
            <FilterChip label="프로젝트" badge={projectBadge}
              open={openMenu === "project"} onToggle={() => toggleMenu("project")}
              icon="map" width={240}>
              <div style={{ fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 8 }}>
                카테고리 선택
              </div>
              <CheckRow checked={projects.has("building")}
                onChange={() => {/* always on for this page */}} disabled
                dot={M.terra}
                label="건축물 (현재 페이지)"/>
              <CheckRow checked={false} disabled dot="#F0A0A0" label="인테리어"/>
              <CheckRow checked={false} disabled dot="#4A5570" label="계획안"/>
              <CheckRow checked={false} disabled dot={M.olive}     label="여행지"/>
              <div style={{ fontSize: 10, color: M.muted, fontWeight: 600, marginTop: 8 }}>
                ※ 다른 카테고리는 준비중
              </div>
            </FilterChip>

            {/* === 지역 === */}
            <FilterChip label="지역" badge={regionBadge}
              open={openMenu === "region"} onToggle={() => toggleMenu("region")}
              icon="location" width={320}>
              {/* 한국 섹션 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: M.ink, fontWeight: 800 }}>🇰🇷 한국</span>
                <span style={{ fontSize: 11, color: M.muted, fontWeight: 700 }}>{krTotal}곳</span>
              </div>
              {KR_PROVINCES.map((p) => (
                <CheckRow key={p.id}
                  checked={regions.has(p.id)}
                  onChange={() => toggleSet(regions, p.id, setRegions)}
                  label={p.name}
                  count={provinceCounts[p.id] || 0}/>
              ))}

              {/* 국제 섹션 */}
              <div style={{
                marginTop: 14, paddingTop: 12,
                borderTop: `1px solid ${M.beigeAlt}`,
                display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6,
              }}>
                <span style={{ fontSize: 12, color: M.ink, fontWeight: 800 }}>🌏 국제</span>
                <span style={{ fontSize: 10, color: M.terra, fontWeight: 800 }}>준비중</span>
              </div>
              {INTL_COUNTRIES.map((c) => (
                <CheckRow key={c.id}
                  checked={false} disabled
                  label={`${c.flag} ${c.name}`}/>
              ))}
              <div style={{ fontSize: 10, color: M.muted, fontWeight: 600, marginTop: 8 }}>
                ※ 국제 건축은 큐레이션 준비중입니다
              </div>

              {regions.size > 0 && (
                <div onClick={() => { setRegions(new Set()); setPage(1); }} style={{
                  marginTop: 10, padding: "8px 0", textAlign: "center",
                  fontSize: 12, fontWeight: 700, color: M.terra,
                  cursor: "pointer", borderTop: `1px solid ${M.beigeAlt}`,
                }}>모두 해제</div>
              )}
            </FilterChip>

            {/* === 용도 (1차 → 2차 hierarchical) === */}
            <UseFilterChip uses={uses} setUses={setUses}
              open={openMenu === "use"} onToggle={() => toggleMenu("use")}/>

            {/* === 면적 === */}
            <FilterChip label="면적" badge={areaBadge}
              open={openMenu === "area"} onToggle={() => toggleMenu("area")}
              icon="filter" width={300}>
              <div style={{ fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 8 }}>
                면적 종류
              </div>
              <div style={{ marginBottom: 14 }}>
                <RadioRow value="site"  current={areaType} onChange={setAreaType} label="대지면적"/>
                <RadioRow value="floor" current={areaType} onChange={setAreaType} label="건축면적"/>
                <RadioRow value="gfa"   current={areaType} onChange={setAreaType} label="연면적"/>
              </div>
              <div style={{ fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 8 }}>
                범위 (㎡)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center" }}>
                <input type="number" value={areaMin} min={0} max={areaMax}
                  onChange={(e) => { setAreaMin(Math.max(0, +e.target.value || 0)); onChangeArea(); }}
                  style={inputStyle}/>
                <span style={{ color: M.muted }}>~</span>
                <input type="number" value={areaMax} min={areaMin}
                  onChange={(e) => { setAreaMax(Math.max(areaMin, +e.target.value || 0)); onChangeArea(); }}
                  style={inputStyle}/>
              </div>
              {areaType !== "gfa" && (
                <div style={{ fontSize: 10, color: M.muted, fontWeight: 600, marginTop: 8 }}>
                  ※ 현재 데이터는 <strong style={{ color: M.terra }}>연면적</strong>만 등록되어 있어요
                </div>
              )}
              {(areaMin > 0 || areaMax < 200000) && (
                <div onClick={() => { setAreaMin(0); setAreaMax(200000); setPage(1); }} style={{
                  marginTop: 10, padding: "8px 0", textAlign: "center",
                  fontSize: 12, fontWeight: 700, color: M.terra,
                  cursor: "pointer", borderTop: `1px solid ${M.beigeAlt}`,
                }}>초기화</div>
              )}
            </FilterChip>

            {/* === 층수 === */}
            <FilterChip label="층수" badge={floorsBadge}
              open={openMenu === "floors"} onToggle={() => toggleMenu("floors")}
              icon="filter" width={280}>
              <div style={{ fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 8 }}>
                층 종류
              </div>
              <div style={{ marginBottom: 14 }}>
                <RadioRow value="above" current={floorsType} onChange={setFloorsType} label="지상"/>
                <RadioRow value="below" current={floorsType} onChange={setFloorsType} label="지하"/>
              </div>
              <div style={{ fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 8 }}>
                범위
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center" }}>
                <input type="number" value={floorsMin} min={1} max={floorsMax}
                  onChange={(e) => { setFloorsMin(Math.max(1, +e.target.value || 1)); onChangeFloors(); }}
                  style={inputStyle}/>
                <span style={{ color: M.muted }}>~</span>
                <input type="number" value={floorsMax} min={floorsMin}
                  onChange={(e) => { setFloorsMax(Math.max(floorsMin, +e.target.value || floorsMin)); onChangeFloors(); }}
                  style={inputStyle}/>
              </div>
              {floorsType === "below" && (
                <div style={{ fontSize: 10, color: M.muted, fontWeight: 600, marginTop: 8 }}>
                  ※ 지하층 데이터는 별도 등록 필요
                </div>
              )}
              {(floorsMin > 1 || floorsMax < 50 || floorsType !== "above") && (
                <div onClick={() => { setFloorsMin(1); setFloorsMax(50); setFloorsType("above"); setPage(1); }} style={{
                  marginTop: 10, padding: "8px 0", textAlign: "center",
                  fontSize: 12, fontWeight: 700, color: M.terra,
                  cursor: "pointer", borderTop: `1px solid ${M.beigeAlt}`,
                }}>초기화</div>
              )}
            </FilterChip>

            {/* 우측: 전체 초기화 (필터 활성시만) */}
            {(regionBadge + usesBadge + areaBadge + floorsBadge) > 0 && (
              <div onClick={() => {
                setRegions(new Set()); setUses(new Set());
                setAreaMin(0); setAreaMax(200000);
                setFloorsType("above"); setFloorsMin(1); setFloorsMax(50);
                setPage(1);
              }} style={{
                position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                padding: "8px 12px",
                fontSize: 12, fontWeight: 700, color: M.muted,
                cursor: "pointer", textDecoration: "underline",
              }}>모든 필터 초기화</div>
            )}
          </div>
        </section>
      </div>

      {/* 4-COL 그리드 (masilground 톤) · 20개/페이지 */}
      <section style={{ padding: "32px 56px 64px" }}>
        {filtered.length === 0 ? (
          <div style={{
            padding: "80px 0", textAlign: "center",
            color: M.muted, fontWeight: 600,
          }}>
            선택한 필터에 해당하는 건축물이 없습니다.
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "40px 24px",
          }}>
            {pageItems.map((b) => (
              <GridCard key={b.id} b={b} onClick={() => onNavigate("detail", b.id)} />
            ))}
          </div>
        )}

        {/* 페이지네이션 — totalPages > 1일 때만 노출 */}
        {totalPages > 1 && (
          <div style={{
            marginTop: 56, padding: "20px 0",
            borderTop: `1px solid ${M.beigeAlt}`,
            display: "flex", justifyContent: "center", alignItems: "center", gap: 4,
            fontSize: 13, fontWeight: 700, color: M.ink,
          }}>
            <span
              onClick={() => safePage > 1 && setPage(safePage - 1)}
              style={{
                padding: "6px 12px",
                color: safePage > 1 ? M.ink : M.muted,
                opacity: safePage > 1 ? 1 : 0.4,
                cursor: safePage > 1 ? "pointer" : "not-allowed",
              }}>← PREV</span>

            {(() => {
              // 노출할 페이지 번호 계산: 처음·끝·현재 주변 ±1
              const set = new Set([1, totalPages, safePage, safePage - 1, safePage + 1]);
              const nums = [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
              const out = [];
              for (let i = 0; i < nums.length; i++) {
                if (i > 0 && nums[i] - nums[i - 1] > 1) {
                  out.push(<span key={`dot-${i}`} style={{ padding: "6px 4px", color: M.muted }}>…</span>);
                }
                const n = nums[i];
                const on = n === safePage;
                out.push(
                  <span key={n} onClick={() => setPage(n)} style={{
                    padding: "6px 12px", borderRadius: 6, cursor: "pointer",
                    background: on ? M.terra : "transparent",
                    color: on ? M.cream : M.ink,
                  }}>{n}</span>
                );
              }
              return out;
            })()}

            <span
              onClick={() => safePage < totalPages && setPage(safePage + 1)}
              style={{
                padding: "6px 12px",
                color: safePage < totalPages ? M.ink : M.muted,
                opacity: safePage < totalPages ? 1 : 0.4,
                cursor: safePage < totalPages ? "pointer" : "not-allowed",
              }}>NEXT →</span>
          </div>
        )}
      </section>

      <MFooter />
    </MPage>
  );
}

Object.assign(window, {
  BuildingsIndexScreen, FeaturedCard, GridCard,
  FilterChip, CheckRow, RadioRow, UseFilterChip, useCountFor,
  KR_PROVINCES, INTL_COUNTRIES, provinceIdOf, parseGfa, inputStyle,
});
