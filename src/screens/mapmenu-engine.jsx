/* ================================================================
   masilmap · 지도 메뉴 (Option A · 사이드 도크) — ENGINE
   실데이터(BUILDINGS / EXTERNAL_SPACES / COURSES / SERIES)에서
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

/* ---------- 2. 코스 / 시리즈 역참조 ---------- */
function mkCoursesOf(b)     { return (window.COURSES || []).filter((c) => (c.buildings || []).includes(b.id)); }
function mkCollectionsOf(b) { return window.seriesForBuilding ? window.seriesForBuilding(b.id) : []; }

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
   8. Leaflet 데이터맵 (CARTO Positron 타일)
   - 좌표계: BUILDINGS[].latlng (실 위경도)
   - view: { center: [lat, lng], zoom: number }  ↔ Leaflet center/zoom
   - searchedView 와 view 분리 → "이 지역 다시 검색" (Google 패턴)
   - mkInBounds(latlng, bounds): 리스트 필터 (bounds = LatLngBounds)
   ================================================================ */
const MK_HOME_VIEW = { center: [36.4, 127.8], zoom: 7 };

function mkInBounds(latlng, bounds) {
  if (!latlng || !bounds) return true;
  /* bounds: { north, south, east, west } 또는 Leaflet LatLngBounds */
  if (typeof bounds.contains === "function") return bounds.contains(latlng);
  const [lat, lng] = latlng;
  return lat >= bounds.south && lat <= bounds.north &&
         lng >= bounds.west  && lng <= bounds.east;
}

/* DivIcon: 카테고리 글리프 들어간 티어드롭 핀 */
function mkPinIcon(b, opts = {}) {
  const { selected = false, hovered = false, dim = false } = opts;
  const on = selected || hovered;
  const c = b.catColor || M.terra;
  const scale = selected ? 1.18 : on ? 1.06 : 0.92;
  const w = Math.round(30 * scale);
  const h = Math.round(40 * scale);
  /* glyph paths (SVG path d 문자열) */
  const GLYPHS = {
    eye:    '<path d="M2.5 12 C5.5 6.5 9 5.5 12 5.5 C15 5.5 18.5 6.5 21.5 12 C18.5 17.5 15 18.5 12 18.5 C9 18.5 5.5 17.5 2.5 12 Z" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="none" stroke-width="2"/>',
    ticket: '<path d="M4 8 L20 8 C20 9.5 21 9.6 21 11 C20 12 20 12 20 13.5 L20 16 L4 16 L4 13.5 C4 12 4 12 3 11 C4 9.6 4 9.5 4 8 Z" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    bed:    '<path d="M3 17 L3 8 M3 13 L21 13 L21 17 M6.5 13 L6.5 10.5 C6.5 9.9 7 9.5 7.6 9.5 L11 9.5 C11.6 9.5 12 9.9 12 10.5 L12 13" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    cup:    '<path d="M5 8.5 L16.5 8.5 L16.5 13 C16.5 15.7 14.2 17.5 11 17.5 C7.8 17.5 5 15.7 5 13 Z M16.5 9.5 L19 9.5 C20.4 9.5 20.9 11 20.4 12.3 C19.9 13.6 18.5 14 17 14" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    spark:  '<path d="M12 3.5 L13.4 9.2 C13.6 9.9 14.1 10.4 14.8 10.6 L20.5 12 L14.8 13.4 C14.1 13.6 13.6 14.1 13.4 14.8 L12 20.5 L10.6 14.8 C10.4 14.1 9.9 13.6 9.2 13.4 L3.5 12 L9.2 10.6 C9.9 10.4 10.4 9.9 10.6 9.2 Z" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  const glyphInner = GLYPHS[(b.cat && b.cat.glyph) || "eye"] || GLYPHS.eye;
  const glyphColor = on ? M.beige : c;
  const bodyFill = on ? c : M.beige;
  /* iconSize 영역 안에 핀 + 그림자가 나오도록 padding 포함 SVG */
  const html =
    `<div style="opacity:${dim ? 0.35 : 1};transition:opacity .15s;">` +
      `<svg width="${w}" height="${h}" viewBox="0 0 30 42" style="display:block;overflow:visible;">` +
        `<ellipse cx="15" cy="40.5" rx="6.5" ry="2.2" fill="rgba(31,39,56,0.28)"/>` +
        `<path d="M15 1 C23 1 30 7.5 30 16 C30 26 19 34 16 39 C15.4 39.9 14.6 39.9 14 39 C11 34 0 26 0 16 C0 7.5 7 1 15 1 Z" fill="${bodyFill}" stroke="${c}" stroke-width="2.4"/>` +
        `<g transform="translate(7.5,8.5)" stroke="${glyphColor}">${glyphInner}</g>` +
      `</svg>` +
    `</div>`;
  return window.L.divIcon({
    className: "mk-pin",
    html, iconSize: [w, h], iconAnchor: [w / 2, h - 1],
    popupAnchor: [0, -h + 2],
  });
}

/* Scholar 팔레트 클러스터 아이콘 — 줌아웃 시 그룹 표시 */
function mkClusterIcon(cluster) {
  const n = cluster.getChildCount();
  const size = n < 10 ? 36 : n < 50 ? 44 : 52;
  return window.L.divIcon({
    className: "mk-cluster",
    html:
      `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;` +
        `border-radius:50%;background:` + M.terra + `;color:` + M.beige + `;` +
        `border:2.5px solid ` + M.beige + `;box-shadow:0 0 0 5px rgba(211,172,43,0.32),0 4px 14px rgba(31,39,56,0.25);` +
        `font-weight:900;font-size:` + (n < 10 ? 14 : 13) + `px;letter-spacing:-0.02em;">` + n + `</div>`,
    iconSize: [size, size], iconAnchor: [size / 2, size / 2],
  });
}

function MKDataMap({
  items, allInView, selectedId, hoveredId, onSelect, onHover,
  view, setView, onMoved, routeIds, routeColor, tone = "light", showLegend = true,
}) {
  const containerRef = React.useRef(null);
  const mapRef       = React.useRef(null);
  const clusterRef   = React.useRef(null);     // L.markerClusterGroup
  const markersRef   = React.useRef({});       // id → L.marker
  const routeLayerRef = React.useRef(null);
  /* 콜백 ref — effect 의존성 줄이고 stale closure 방지 */
  const cb = React.useRef({ onSelect, onHover, onMoved, setView });
  cb.current = { onSelect, onHover, onMoved, setView };

  const dark = tone === "dark";

  /* ----- 지도 초기화 ----- */
  React.useEffect(() => {
    if (!window.L || !containerRef.current || mapRef.current) return;
    const map = window.L.map(containerRef.current, {
      center: (view && view.center) || MK_HOME_VIEW.center,
      zoom:   (view && view.zoom)   || MK_HOME_VIEW.zoom,
      minZoom: 6, maxZoom: 18,
      zoomControl: false, attributionControl: false,
      worldCopyJump: false,
    });
    const url = dark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    window.L.tileLayer(url, {
      subdomains: "abcd", maxZoom: 19,
      attribution: "&copy; OpenStreetMap &copy; CARTO",
    }).addTo(map);
    window.L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

    map.on("moveend zoomend", () => {
      const c = map.getCenter();
      const b = map.getBounds();
      const next = {
        center: [c.lat, c.lng],
        zoom: map.getZoom(),
        bounds: { north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() },
      };
      cb.current.setView && cb.current.setView(next);
      cb.current.onMoved && cb.current.onMoved();
    });

    /* 클러스터 그룹 — 줌 별로 합쳐졌다 분리됨 */
    if (window.L.markerClusterGroup) {
      const cluster = window.L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 13,    // 13 이상이면 모두 분리
        maxClusterRadius: 55,            // 픽셀 반경 — 작을수록 잘 안 합쳐짐
        iconCreateFunction: mkClusterIcon,
      });
      map.addLayer(cluster);
      clusterRef.current = cluster;
    }

    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 60);
    return () => { map.remove(); mapRef.current = null; markersRef.current = {}; clusterRef.current = null; };
  }, [dark]);

  /* ----- 외부에서 setView로 시점 갱신될 때 (전체 보기 / 코스 미리보기) ----- */
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !view || !view.center) return;
    const cur = map.getCenter();
    const moved = Math.abs(cur.lat - view.center[0]) > 0.0008
               || Math.abs(cur.lng - view.center[1]) > 0.0008
               || map.getZoom() !== view.zoom;
    if (moved) map.setView(view.center, view.zoom, { animate: true });
  }, [view && view.center && view.center[0], view && view.center && view.center[1], view && view.zoom]);

  /* ----- 마커 동기화 (cluster group에 추가) ----- */
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.L) return;
    const target = clusterRef.current || map;
    const want = new Set(items.filter((b) => b.latlng).map((b) => b.id));
    /* 사라진 것 제거 */
    for (const id of Object.keys(markersRef.current)) {
      if (!want.has(id)) { target.removeLayer(markersRef.current[id]); delete markersRef.current[id]; }
    }
    /* 새로 추가 */
    for (const b of items) {
      if (!b.latlng || markersRef.current[b.id]) continue;
      const marker = window.L.marker(b.latlng, {
        icon: mkPinIcon(b),
        riseOnHover: true, riseOffset: 250,
      });
      marker.bindTooltip(b.name, { direction: "top", offset: [0, -20], opacity: 0.95 });
      marker.on("click", (e) => {
        window.L.DomEvent.stopPropagation && window.L.DomEvent.stopPropagation(e);
        cb.current.onSelect && cb.current.onSelect(b.id);
      });
      marker.on("mouseover", () => cb.current.onHover && cb.current.onHover(b.id));
      marker.on("mouseout",  () => cb.current.onHover && cb.current.onHover(null));
      target.addLayer(marker);
      markersRef.current[b.id] = marker;
    }
  }, [items]);

  /* ----- 선택/호버/dim 상태 → 아이콘 갱신 ----- */
  React.useEffect(() => {
    for (const [id, m] of Object.entries(markersRef.current)) {
      const b = items.find((x) => x.id === id);
      if (!b) continue;
      const dim = routeIds ? !routeIds.includes(id) : false;
      m.setIcon(mkPinIcon(b, {
        selected: id === selectedId,
        hovered:  id === hoveredId,
        dim,
      }));
      if (id === selectedId) m.openTooltip && m.openTooltip();
    }
  }, [selectedId, hoveredId, routeIds, items]);

  /* ----- 코스 폴리라인 ----- */
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.L) return;
    if (routeLayerRef.current) { map.removeLayer(routeLayerRef.current); routeLayerRef.current = null; }
    if (routeIds && routeIds.length >= 2) {
      const pts = routeIds
        .map((id) => (window.BUILDINGS || []).find((b) => b.id === id))
        .filter((b) => b && b.latlng)
        .map((b) => b.latlng);
      if (pts.length >= 2) {
        const layer = window.L.layerGroup();
        window.L.polyline(pts, {
          color: routeColor || M.olive,
          weight: 3.5, opacity: 0.95,
          dashArray: "8 6", lineCap: "round", lineJoin: "round",
        }).addTo(layer);
        pts.forEach((p) => window.L.circleMarker(p, {
          radius: 5, color: routeColor || M.olive, weight: 2.5,
          fillColor: M.beige, fillOpacity: 1,
        }).addTo(layer));
        layer.addTo(map);
        routeLayerRef.current = layer;
      }
    }
  }, [routeIds, routeColor]);

  /* ----- 줌 동작 (HUD 버튼) ----- */
  const zoomBy = (f) => {
    const map = mapRef.current; if (!map) return;
    const z = Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), Math.round(map.getZoom() + (f > 1 ? 1 : -1))));
    map.setZoom(z);
  };
  const goHome = () => {
    const map = mapRef.current; if (!map) return;
    map.setView(MK_HOME_VIEW.center, MK_HOME_VIEW.zoom, { animate: true });
  };

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      background: dark ? "#10151E" : "#FBFCFB", overflow: "hidden",
    }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }}/>

      {/* HUD: 범례 (하단 중앙 — 도크와 겹치지 않게) */}
      {showLegend && (
        <div style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 14, zIndex: 500,
          display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center",
          background: dark ? "rgba(16,21,30,0.85)" : "rgba(255,255,255,0.94)",
          backdropFilter: "blur(6px)", padding: "8px 14px", borderRadius: 12, boxShadow: MS.cardSm,
          pointerEvents: "none",
        }}>
          <span style={{ fontFamily: MT.family, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", color: M.muted }}>유형</span>
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
      <div style={{ position: "absolute", bottom: 14, right: 14, zIndex: 500, display: "flex", flexDirection: "column", gap: 6 }}>
        <HudBtn dark={dark} onClick={goHome} title="전체 보기"><MIcon name="map" size={16} color={dark ? M.beigeAlt : M.ink}/></HudBtn>
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
      background: dark ? "rgba(16,21,30,0.85)" : "rgba(255,255,255,0.94)",
      color: dark ? M.beigeAlt : M.ink,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: 18, boxShadow: MS.cardSm,
      userSelect: "none",
    }}>{children}</div>
  );
}

Object.assign(window, {
  MK_CATS, MK_CAT_ORDER, MK_LENSES, MK_HOME_VIEW,
  mkExtSpaceOf, mkCatOf, mkCatColor, mkCoursesOf, mkCollectionsOf, mkExtMaps,
  mkExternalRefs, mkBuildings, useMapSaved, MKGlyph,
  mkInBounds, mkPinIcon, mkClusterIcon, MKDataMap, HudBtn,
});
