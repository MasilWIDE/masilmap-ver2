/* ================================================================
   masilmap · 지도 메뉴 (Option A · 사이드 도크) — ENGINE
   실데이터(BUILDINGS / EXTERNAL_SPACES / COURSES / COLLECTIONS)에서
   파생 정보를 만들고, 탈색 데이터맵(팬·줌·클러스터)을 그린다.

   브랜드 토큰만 사용 (M / MT / MR / MS, MIcon). Scholar 팔레트:
   terra=네이비(#333D51) · olive=골드(#D3AC2B).
   ================================================================ */

/* ---------- 1. 마실 방식 카테고리 (사용자 정의 가능 분류) ----------
   typeKey(한옥/근현대/미술관) 같은 '양식'이 아니라
   "거기서 무엇을 하는가"로 나눈 운영 분류. 운영자가 늘리고 줄이는 전제.
   실데이터 신호(EXTERNAL_SPACES.type · metrics.visit)에서 자동 도출. */
const MK_CATS = {
  view:   { id: "view",   label: "둘러보기", short: "관람", glyph: "eye",    tone: "terra" },
  ticket: { id: "ticket", label: "예약 관람", short: "예약관람", glyph: "ticket", tone: "terra" },
  stay:   { id: "stay",   label: "머무는 곳", short: "숙박", glyph: "bed",    tone: "olive" },
  taste:  { id: "taste",  label: "맛보는 곳", short: "식음", glyph: "cup",    tone: "olive" },
  make:   { id: "make",   label: "손으로",   short: "체험", glyph: "spark",  tone: "olive" },
};
const MK_CAT_ORDER = ["view", "ticket", "stay", "taste", "make"];

function mkExtSpaceOf(b) {
  return (window.EXTERNAL_SPACES || []).find((s) => s.building === b.id) || null;
}
function mkCatOf(b) {
  const ext = mkExtSpaceOf(b);
  if (ext) {
    if (ext.type === "숙박") return MK_CATS.stay;
    if (ext.type === "식음") return MK_CATS.taste;
    if (ext.type === "체험") return MK_CATS.make;
  }
  const v = (b.metrics && b.metrics.visit) || "";
  if (/예약|해설|동반/.test(v)) return MK_CATS.ticket;
  return MK_CATS.view;
}
function mkCatColor(cat) { return cat.tone === "olive" ? M.olive : M.terra; }

/* ---------- 2. 코스 / 컬렉션 역참조 ---------- */
function mkCoursesOf(b)     { return (window.COURSES || []).filter((c) => (c.buildings || []).includes(b.id)); }
function mkCollectionsOf(b) { return (window.COLLECTIONS || []).filter((c) => (c.buildings || []).includes(b.id)); }

/* ---------- 3. 외부 지도 딥링크 (후발주자 전략) ----------
   사용자가 이미 쓰던 네이버·카카오·구글 지도에서 바로 보고 저장. */
function mkExtMaps(b) {
  const q = encodeURIComponent(`${b.name} ${b.region || ""}`.trim());
  return [
    { id: "naver",  name: "네이버 지도", dot: "#03C75A", ring: false, view: `https://map.naver.com/p/search/${q}`,    save: `https://map.naver.com/p/search/${q}` },
    { id: "kakao",  name: "카카오맵",    dot: "#FEE500", ring: true,  view: `https://map.kakao.com/?q=${q}`,           save: `https://map.kakao.com/?q=${q}` },
    { id: "google", name: "구글 지도",   dot: "#4285F4", ring: false, view: `https://www.google.com/maps/search/${q}`, save: `https://www.google.com/maps/search/${q}` },
  ];
}

/* ---------- 3b. 외부 전문 정보 링크 (마실지도는 핵심만, 깊이는 외부로) ----------
   마실그라운드(자체 심화 아카이브) · 건축사사무소(공식) · 문헌/위키.
   실제 전용 URL이 없으므로 검색·공식 도메인 기반 딥링크로 생성. */
function mkExternalRefs(b) {
  const q  = encodeURIComponent(`${b.name} ${b.architect || ""}`.trim());
  const aq = encodeURIComponent(`${b.architect || ""} 건축`.trim());
  return [
    { id: "masil",  name: "마실그라운드",   desc: "마실이 직접 기록한 심화 아카이브 · 도면 · 인터뷰", tone: "olive", badge: "MASIL", href: `https://www.masilwide.com/?s=${q}` },
    { id: "office", name: "건축사사무소",   desc: `${b.architect || "설계사"}의 공식 작품 정보`,         tone: "terra", badge: "OFFICIAL", href: `https://www.google.com/search?q=${aq}` },
    { id: "ref",    name: "문헌 · 위키",    desc: "개요 · 연혁 · 도면 출처를 더 찾아보기",              tone: "terra", badge: "REF", href: `https://namu.wiki/Search?q=${q}` },
  ];
}

/* ---------- 4. 큐레이션 렌즈 (지도 위 필터) ---------- */
const MK_LENSES = [
  { id: "all",      label: "전체",      icon: "map",      test: () => true },
  { id: "trending", label: "트렌딩",    icon: "sparkle",  test: (b) => (b.visited || 0) >= 8000 },
  { id: "award",    label: "어워드",    icon: "bookmark", test: (b) => ["leeum", "ddp", "soeul", "museumsan", "mmcas", "amorepacific"].includes(b.id) },
  { id: "hanok",    label: "한옥·전통", icon: "home",     test: (b) => b.typeKey === "hanok" },
  { id: "night",    label: "야경",      icon: "clock",    test: (b) => (b.tags || []).includes("야경") || ["ddp", "leeum", "jongrotower"].includes(b.id) },
  { id: "stay",     label: "머무는 곳", icon: "location", test: (b) => mkCatOf(b).id === "stay" },
  { id: "new",      label: "신규 등록", icon: "plus",     test: (b) => (b.year || 0) >= 2014 },
];

/* ---------- 5. 통합 빌딩 뷰 (지도 메뉴 전용, 메모이즈) ---------- */
function mkBuildings() {
  return (window.BUILDINGS || []).map((b) => {
    const cat = mkCatOf(b);
    return {
      ...b,
      cat,
      catColor: mkCatColor(cat),
      ext: mkExtSpaceOf(b),
      courses: mkCoursesOf(b),
      collections: mkCollectionsOf(b),
      extMaps: mkExtMaps(b),
    };
  });
}

/* ---------- 6. 저장 상태 (localStorage) ---------- */
const MK_SAVE_KEY = "masilmap.map.saved";
function useMapSaved() {
  const [saved, setSaved] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(MK_SAVE_KEY) || "[]"); } catch (e) { return []; }
  });
  const toggle = (id) => setSaved((prev) => {
    const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
    try { localStorage.setItem(MK_SAVE_KEY, JSON.stringify(next)); } catch (e) {}
    return next;
  });
  return [saved, toggle];
}

/* ---------- 7. 카테고리 글리프 (작은 라인 아이콘, 핀/칩 공용) ---------- */
function MKGlyph({ glyph, size = 14, color = "#fff", sw = 1.9 }) {
  const p = { stroke: color, strokeWidth: sw, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const wh = { width: size, height: size, viewBox: "0 0 24 24", style: { display: "block" } };
  switch (glyph) {
    case "eye":    return (<svg {...wh}><path d="M2.5 12 C5.5 6.5 9 5.5 12 5.5 C15 5.5 18.5 6.5 21.5 12 C18.5 17.5 15 18.5 12 18.5 C9 18.5 5.5 17.5 2.5 12 Z" {...p}/><circle cx="12" cy="12" r="3" {...p}/></svg>);
    case "ticket": return (<svg {...wh}><path d="M4 8 L20 8 C20 9.5 21 9.6 21 11 C20 12 20 12 20 13.5 L20 16 L4 16 L4 13.5 C4 12 4 12 3 11 C4 9.6 4 9.5 4 8 Z" {...p}/><path d="M9.5 8 L9.5 16" {...p} strokeDasharray="2 2"/></svg>);
    case "bed":    return (<svg {...wh}><path d="M3 17 L3 8 M3 13 L21 13 L21 17 M21 15.5 L3 15.5 M6.5 13 L6.5 10.5 C6.5 9.9 7 9.5 7.6 9.5 L11 9.5 C11.6 9.5 12 9.9 12 10.5 L12 13" {...p}/></svg>);
    case "cup":    return (<svg {...wh}><path d="M5 8.5 L16.5 8.5 L16.5 13 C16.5 15.7 14.2 17.5 11 17.5 C7.8 17.5 5 15.7 5 13 Z M16.5 9.5 L19 9.5 C20.4 9.5 20.9 11 20.4 12.3 C19.9 13.6 18.5 14 17 14" {...p}/><path d="M8 4 L8 6 M11 4 L11 6" {...p}/></svg>);
    case "spark":  return (<svg {...wh}><path d="M12 3.5 L13.4 9.2 C13.6 9.9 14.1 10.4 14.8 10.6 L20.5 12 L14.8 13.4 C14.1 13.6 13.6 14.1 13.4 14.8 L12 20.5 L10.6 14.8 C10.4 14.1 9.9 13.6 9.2 13.4 L3.5 12 L9.2 10.6 C9.9 10.4 10.4 9.9 10.6 9.2 Z" {...p}/></svg>);
    default:       return null;
  }
}

/* ================================================================
   8. 탈색 데이터맵 — 팬 / 줌 / 클러스터 / 코스 경로 / 호버
   - 좌표계: BUILDINGS[].coord (BASE 1200×1040 공간)
   - view: { cx, cy, zoom } → viewBox. 드래그 팬, +/− 줌, 클러스터 클릭 줌인
   - searchedView 와 view 분리 → "이 지역 다시 검색"(Google 패턴)
   ================================================================ */
const MK_BASE = { w: 1200, h: 1040 };
const MK_HOME_VIEW = { cx: 690, cy: 540, zoom: 1.0 };

function mkViewBox(view) {
  const vw = MK_BASE.w / view.zoom;
  const vh = MK_BASE.h / view.zoom;
  return { x: view.cx - vw / 2, y: view.cy - vh / 2, w: vw, h: vh };
}
function mkInView(coord, vb, pad = 0) {
  return coord[0] >= vb.x - pad && coord[0] <= vb.x + vb.w + pad &&
         coord[1] >= vb.y - pad && coord[1] <= vb.y + vb.h + pad;
}
/* 화면 px 기준 근접 클러스터링 (viewBox 단위 임계값 = px * vw / 컨테이너폭 근사) */
function mkClusters(items, view, thresholdVB) {
  const used = new Set();
  const out = [];
  for (let i = 0; i < items.length; i++) {
    if (used.has(items[i].id)) continue;
    const group = [items[i]];
    used.add(items[i].id);
    for (let j = i + 1; j < items.length; j++) {
      if (used.has(items[j].id)) continue;
      const dx = items[i].coord[0] - items[j].coord[0];
      const dy = items[i].coord[1] - items[j].coord[1];
      if (Math.hypot(dx, dy) < thresholdVB) { group.push(items[j]); used.add(items[j].id); }
    }
    if (group.length > 1) {
      const cx = group.reduce((s, g) => s + g.coord[0], 0) / group.length;
      const cy = group.reduce((s, g) => s + g.coord[1], 0) / group.length;
      out.push({ kind: "cluster", id: "cl-" + items[i].id, at: [cx, cy], members: group });
    } else {
      out.push({ kind: "pin", id: items[i].id, b: items[i] });
    }
  }
  return out;
}

function MKDataMap({
  items, allInView, selectedId, hoveredId, onSelect, onHover,
  view, setView, onMoved, routeIds, routeColor, tone = "light", showLegend = true,
}) {
  const svgRef = React.useRef(null);
  const drag = React.useRef(null);
  const vb = mkViewBox(view);
  const dark = tone === "dark";

  /* 색 (탈색 데이터맵) */
  const water    = dark ? "#10151E" : "#FBFCFB";
  const land     = dark ? "#1C2430" : "#E4E2D8";
  const landLine = dark ? "#2A3340" : "#CFCDC2";
  const block    = dark ? "#222A37" : "#DAD7CB";
  const grid     = dark ? "rgba(203,208,216,0.05)" : "rgba(31,39,56,0.045)";
  const tickInk  = dark ? "rgba(203,208,216,0.4)" : "rgba(31,39,56,0.3)";

  /* 클러스터 임계값: 줌 클수록 작아짐 → 줌인하면 분리 */
  const thresholdVB = 78 / view.zoom;
  const nodes = mkClusters(items, view, thresholdVB);

  /* ----- 팬 ----- */
  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy, moved: false };
    e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const sx = vb.w / rect.width, sy = vb.h / rect.height;
    const dx = (e.clientX - drag.current.x) * sx;
    const dy = (e.clientY - drag.current.y) * sy;
    if (Math.abs(e.clientX - drag.current.x) + Math.abs(e.clientY - drag.current.y) > 3) drag.current.moved = true;
    setView({ ...view, cx: clampX(drag.current.cx - dx, view.zoom), cy: clampY(drag.current.cy - dy, view.zoom) });
  };
  const onPointerUp = (e) => {
    const wasDrag = drag.current && drag.current.moved;
    drag.current = null;
    if (wasDrag) onMoved && onMoved();
  };
  const clampX = (x, z) => { const vw = MK_BASE.w / z; return Math.max(vw / 2 - 120, Math.min(MK_BASE.w - vw / 2 + 120, x)); };
  const clampY = (y, z) => { const vh = MK_BASE.h / z; return Math.max(vh / 2 - 120, Math.min(MK_BASE.h - vh / 2 + 120, y)); };

  const zoomBy = (f) => {
    const z = Math.max(0.8, Math.min(5, view.zoom * f));
    setView({ cx: clampX(view.cx, z), cy: clampY(view.cy, z), zoom: z });
    onMoved && onMoved();
  };
  const focusCluster = (node) => {
    const z = Math.min(5, view.zoom * 1.9);
    setView({ cx: clampX(node.at[0], z), cy: clampY(node.at[1], z), zoom: z });
    onMoved && onMoved();
  };

  /* 코스 경로 polyline (선택 코스의 건물들을 순서대로) */
  const routePts = routeIds ? routeIds.map((id) => {
    const b = (window.BUILDINGS || []).find((x) => x.id === id);
    return b ? b.coord : null;
  }).filter(Boolean) : null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: water, overflow: "hidden" }}>
      <svg
        ref={svgRef}
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        width="100%" height="100%"
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
        style={{ display: "block", cursor: drag.current ? "grabbing" : "grab", touchAction: "none" }}>

        {/* grid */}
        <defs>
          <pattern id="mkgrid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke={grid} strokeWidth="1"/>
          </pattern>
        </defs>
        <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill="url(#mkgrid)" />

        {/* 한반도 (탈색) */}
        <path d="M 700 100 C 760 110 800 160 790 220 C 780 270 810 300 820 340 C 830 380 870 400 880 460 C 890 510 870 560 820 590 C 770 620 740 640 740 680 L 740 750 C 740 800 700 830 660 830 C 600 830 560 800 540 760 C 520 720 530 680 510 660 C 480 620 480 580 510 540 C 540 500 540 460 520 420 C 500 380 510 340 540 310 C 580 280 620 270 650 240 C 670 210 680 170 700 100 Z"
          fill={land} stroke={landLine} strokeWidth="1.5"/>
        <ellipse cx="720" cy="980" rx="80" ry="35" fill={land} stroke={landLine} strokeWidth="1.5"/>

        {/* 데이터맵 텍스처 — 수도권 일대 옅은 블록 (줌인 시 도드라짐) */}
        {[[660,300,70,46],[742,300,40,34],[700,348,54,40],[770,338,44,30],[638,260,40,30],[792,372,48,34],[762,398,40,46],[690,402,34,30]].map((r, i) => (
          <rect key={i} x={r[0]} y={r[1]} width={r[2]} height={r[3]} rx="6" fill={block} opacity="0.9"/>
        ))}

        {/* region labels */}
        {[{x:705,y:205,t:"강원"},{x:672,y:330,t:"서울·경기"},{x:600,y:470,t:"충청"},{x:585,y:620,t:"전라"},{x:740,y:600,t:"경상"},{x:720,y:992,t:"제주"}].map((r, i) => (
          <text key={i} x={r.x} y={r.y} fontFamily="'JetBrains Mono', monospace" fontSize="13" fontWeight="600"
            letterSpacing="0.1em" fill={tickInk} textAnchor="middle" style={{ pointerEvents: "none" }}>{r.t}</text>
        ))}
        {/* coordinate ticks */}
        {[200,400,600,800,1000].map((y) => (
          <text key={y} x={vb.x + 14} y={y + 4} fontFamily="'JetBrains Mono', monospace" fontSize="11" fill={tickInk} style={{ pointerEvents: "none" }}>
            {(38 - y * 0.005).toFixed(2)}°
          </text>
        ))}

        {/* 코스 경로선 */}
        {routePts && routePts.length >= 2 && (
          <polyline points={routePts.map((p) => p.join(",")).join(" ")}
            fill="none" stroke={routeColor || M.olive} strokeWidth={3.5 / view.zoom}
            strokeDasharray={`${8 / view.zoom} ${6 / view.zoom}`} strokeLinecap="round" strokeLinejoin="round" opacity="0.95"/>
        )}
        {routePts && routePts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={5 / view.zoom} fill={M.beige} stroke={routeColor || M.olive} strokeWidth={2.5 / view.zoom}/>
        ))}

        {/* 노드 (핀 / 클러스터) */}
        {nodes.map((node) => node.kind === "cluster"
          ? <MKClusterNode key={node.id} node={node} zoom={view.zoom} onClick={() => focusCluster(node)} dark={dark}/>
          : <MKPinNode key={node.id} b={node.b} zoom={view.zoom}
              selected={node.b.id === selectedId} hovered={node.b.id === hoveredId}
              dim={routeIds ? !routeIds.includes(node.b.id) : false}
              onSelect={onSelect} onHover={onHover}/>
        )}
      </svg>

      {/* HUD: 범례 (하단 중앙 — 도크와 겹치지 않게) */}
      {showLegend && (
      <div style={{
        position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 14,
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center",
        background: dark ? "rgba(16,21,30,0.8)" : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(6px)", padding: "8px 14px", borderRadius: 12, boxShadow: MS.cardSm,
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", color: M.muted }}>유형</span>
        {MK_CAT_ORDER.map((k) => {
          const cat = MK_CATS[k];
          return (
            <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: dark ? M.beigeAlt : M.ink }}>
              <span style={{ display: "inline-flex" }}><MKGlyph glyph={cat.glyph} size={13} color={mkCatColor(cat)} sw={2.1}/></span>
              {cat.short}
            </span>
          );
        })}
      </div>
      )}

      {/* HUD: 줌 (우하단) */}
      <div style={{ position: "absolute", bottom: 14, right: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        <HudBtn dark={dark} onClick={() => setView({ ...MK_HOME_VIEW })} title="전체 보기"><MIcon name="map" size={16} color={dark ? M.beigeAlt : M.ink}/></HudBtn>
        <HudBtn dark={dark} onClick={() => zoomBy(1.6)}>+</HudBtn>
        <HudBtn dark={dark} onClick={() => zoomBy(0.625)}>−</HudBtn>
      </div>
    </div>
  );
}

function HudBtn({ children, onClick, dark, title }) {
  return (
    <div onClick={onClick} title={title} style={{
      width: 38, height: 38, borderRadius: 12, cursor: "pointer",
      background: dark ? "rgba(16,21,30,0.85)" : M.cream, color: dark ? M.beigeAlt : M.ink,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: 18, boxShadow: MS.cardSm,
    }}>{children}</div>
  );
}

/* ---------- 핀 노드 (SVG) — 카테고리 글리프 + 선택/호버 ---------- */
function MKPinNode({ b, zoom, selected, hovered, dim, onSelect, onHover }) {
  const c = b.catColor;
  const on = selected || hovered;
  const s = (selected ? 1.18 : on ? 1.06 : 0.92) / zoom;   // 줌 보정 — 화면상 크기 일정
  return (
    <g transform={`translate(${b.coord[0]}, ${b.coord[1]})`} style={{ cursor: "pointer", opacity: dim ? 0.35 : 1 }}
      onClick={(e) => { e.stopPropagation(); onSelect && onSelect(b.id); }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseEnter={() => onHover && onHover(b.id)} onMouseLeave={() => onHover && onHover(null)}>
      {selected && (
        <circle r="26" fill={c} opacity="0.16" transform={`scale(${1 / zoom})`}>
          <animate attributeName="r" from="16" to="34" dur="1.6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.28" to="0" dur="1.6s" repeatCount="indefinite"/>
        </circle>
      )}
      <g transform={`scale(${s}) translate(-15, -40)`}>
        {/* 그림자 */}
        <ellipse cx="15" cy="40" rx="7" ry="2.4" fill="rgba(31,39,56,0.22)"/>
        {/* 핀 몸체 (티어드롭) */}
        <path d="M15 1 C23 1 30 7.5 30 16 C30 26 19 34 16 39 C15.4 39.9 14.6 39.9 14 39 C11 34 0 26 0 16 C0 7.5 7 1 15 1 Z"
          fill={on ? c : M.beige} stroke={c} strokeWidth="2.4"/>
        {/* 글리프 */}
        <g transform="translate(7.5, 8.5)">
          <MKGlyphSvg glyph={b.cat.glyph} size={15} color={on ? M.beige : c}/>
        </g>
      </g>
      {(selected || hovered) && (
        <text x="0" y={(-46) * s} textAnchor="middle" fontFamily="Pretendard, Nunito, sans-serif"
          fontSize={13 / zoom} fontWeight="800" fill={M.ink}
          style={{ paintOrder: "stroke", stroke: M.beige, strokeWidth: 4 / zoom, strokeLinejoin: "round", pointerEvents: "none" }}>
          {b.name}
        </text>
      )}
    </g>
  );
}

/* glyph as raw svg paths (for embedding inside the pin <g>) */
function MKGlyphSvg({ glyph, size = 15, color = "#fff" }) {
  const p = { stroke: color, strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const sc = size / 24;
  const inner = (() => {
    switch (glyph) {
      case "eye":    return (<><path d="M2.5 12 C5.5 6.5 9 5.5 12 5.5 C15 5.5 18.5 6.5 21.5 12 C18.5 17.5 15 18.5 12 18.5 C9 18.5 5.5 17.5 2.5 12 Z" {...p}/><circle cx="12" cy="12" r="3" {...p}/></>);
      case "ticket": return (<><path d="M4 8 L20 8 C20 9.5 21 9.6 21 11 C20 12 20 12 20 13.5 L20 16 L4 16 L4 13.5 C4 12 4 12 3 11 C4 9.6 4 9.5 4 8 Z" {...p}/></>);
      case "bed":    return (<path d="M3 17 L3 8 M3 13 L21 13 L21 17 M6.5 13 L6.5 10.5 C6.5 9.9 7 9.5 7.6 9.5 L11 9.5 C11.6 9.5 12 9.9 12 10.5 L12 13" {...p}/>);
      case "cup":    return (<path d="M5 8.5 L16.5 8.5 L16.5 13 C16.5 15.7 14.2 17.5 11 17.5 C7.8 17.5 5 15.7 5 13 Z M16.5 9.5 L19 9.5 C20.4 9.5 20.9 11 20.4 12.3 C19.9 13.6 18.5 14 17 14" {...p}/>);
      case "spark":  return (<path d="M12 3.5 L13.4 9.2 C13.6 9.9 14.1 10.4 14.8 10.6 L20.5 12 L14.8 13.4 C14.1 13.6 13.6 14.1 13.4 14.8 L12 20.5 L10.6 14.8 C10.4 14.1 9.9 13.6 9.2 13.4 L3.5 12 L9.2 10.6 C9.9 10.4 10.4 9.9 10.6 9.2 Z" {...p}/>);
      default: return null;
    }
  })();
  return <g transform={`scale(${sc})`}>{inner}</g>;
}

/* ---------- 클러스터 노드 (SVG) ---------- */
function MKClusterNode({ node, zoom, onClick, dark }) {
  const n = node.members.length;
  const r = (n > 6 ? 24 : n > 3 ? 21 : 19) / zoom;
  return (
    <g transform={`translate(${node.at[0]}, ${node.at[1]})`} style={{ cursor: "pointer" }}
      onClick={(e) => { e.stopPropagation(); onClick(); }} onPointerDown={(e) => e.stopPropagation()}>
      <circle r={r * 1.32} fill={M.olive} opacity="0.18"/>
      <circle r={r} fill={M.terra} stroke={M.beige} strokeWidth={2.5 / zoom}/>
      <text textAnchor="middle" dy={r * 0.34} fontFamily="Pretendard, Nunito, sans-serif"
        fontSize={r * 0.92} fontWeight="900" fill={M.beige} style={{ pointerEvents: "none" }}>{n}</text>
    </g>
  );
}

Object.assign(window, {
  MK_CATS, MK_CAT_ORDER, MK_LENSES, MK_BASE, MK_HOME_VIEW,
  mkExtSpaceOf, mkCatOf, mkCatColor, mkCoursesOf, mkCollectionsOf, mkExtMaps,
  mkExternalRefs, mkBuildings, useMapSaved, MKGlyph,
  mkViewBox, mkInView, mkClusters, MKDataMap, MKPinNode, MKClusterNode, MKGlyphSvg, HudBtn,
});
