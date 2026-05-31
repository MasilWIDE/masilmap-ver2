/* ================================================================
   masilmap — HOME / 지도 기반 랜딩
   레이아웃 변형 3종 (homeLayout):
     - split:       지도 좌 + 리스트 우 (50/50)            기본
     - mapPrimary:  지도 풀블리드 + 플로팅 패널 (탐색 우선)
     - editorial:   상단 매거진 헤로 + 그리드 + 작은 지도 (잡지 우선)
   ================================================================ */

/* ---------- 추상 지도 (한반도 모티프, SVG) ---------- */
function MasilMap({ buildings, selectedId, onSelect, tone = "beige", compact = false, width = 1200, height = 700 }) {
  const bg = tone === "deep" ? "#3A2E22" : M.beige;
  const land = tone === "deep" ? "#4A3D2F" : "#EAD9BD";
  const landLine = tone === "deep" ? "#5C4D3D" : "#D4C29E";
  const water = tone === "deep" ? "#2F2519" : M.beige;   /* match page canvas (white) */
  const grid = tone === "deep" ? "rgba(255,248,236,0.06)" : "rgba(58,46,34,0.06)";

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      background: water, borderRadius: compact ? MR.card : 0,
      overflow: "hidden",
    }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid slice"
        width="100%" height="100%"
        style={{ display: "block" }}>
        {/* graph paper grid */}
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={grid} strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* abstract Korean peninsula */}
        <path
          d="M 700 100
             C 760 110 800 160 790 220
             C 780 270 810 300 820 340
             C 830 380 870 400 880 460
             C 890 510 870 560 820 590
             C 770 620 740 640 740 680
             L 740 750
             C 740 800 700 830 660 830
             C 600 830 560 800 540 760
             C 520 720 530 680 510 660
             C 480 620 480 580 510 540
             C 540 500 540 460 520 420
             C 500 380 510 340 540 310
             C 580 280 620 270 650 240
             C 670 210 680 170 700 100 Z"
          fill={land}
          stroke={landLine}
          strokeWidth="1.5"
        />
        {/* Jeju */}
        <ellipse cx="720" cy="980" rx="80" ry="35" fill={land} stroke={landLine} strokeWidth="1.5" />

        {/* faint coast contour */}
        <path
          d="M 730 130 C 780 140 815 175 805 230 M 690 760 C 660 780 620 780 590 760"
          fill="none" stroke={landLine} strokeWidth="1" opacity="0.5"
        />

        {/* region labels */}
        {[
          { x: 700, y: 200, t: "강원" },
          { x: 670, y: 320, t: "서울·경기" },
          { x: 600, y: 460, t: "충청" },
          { x: 580, y: 600, t: "전라" },
          { x: 730, y: 600, t: "경상" },
          { x: 720, y: 990, t: "제주" },
        ].map((r, i) => (
          <text key={i} x={r.x} y={r.y}
            fontFamily="'JetBrains Mono', monospace"
            fontSize="11" fontWeight="600"
            letterSpacing="0.1em"
            fill={tone === "deep" ? "rgba(245,235,220,0.5)" : "rgba(58,46,34,0.4)"}
            textAnchor="middle">
            {r.t.toUpperCase()}
          </text>
        ))}

        {/* coordinate ticks */}
        {[200, 400, 600, 800, 1000].map((y) => (
          <g key={y}>
            <line x1="20" y1={y} x2="32" y2={y} stroke={tone === "deep" ? "#5C4D3D" : "#B89E7A"} strokeWidth="1" />
            <text x="38" y={y+4} fontFamily="'JetBrains Mono', monospace" fontSize="9" fill={tone === "deep" ? "#7B6342" : "#8A7A65"}>
              {(38 - y * 0.005).toFixed(2)}°
            </text>
          </g>
        ))}

        {/* pins */}
        {buildings.map((b) => {
          const on = b.id === selectedId;
          const c = b.pinTone === "olive" ? M.olive : M.terra;
          return (
            <g
              key={b.id}
              transform={`translate(${b.coord[0]}, ${b.coord[1]})`}
              onClick={() => onSelect(b.id)}
              style={{ cursor: "pointer" }}>
              {on && (
                <circle r="34" fill={c} opacity="0.18">
                  <animate attributeName="r" from="22" to="44" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.35" to="0" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}
              <g transform={`scale(${on ? 1.15 : 0.85}) translate(-10, -26)`}>
                <path
                  d="M10 0 C15 0 19 4 19 9 C19 14 14 19 11 22 C10.5 23 9.5 23 9 22 C6 19 1 14 1 9 C1 4 5 0 10 0 Z"
                  fill={c}/>
                <circle cx="10" cy="9" r="4" fill={M.cream}/>
              </g>
              {on && (
                <text x="0" y="-32" textAnchor="middle"
                  fontFamily="Pretendard, Nunito, sans-serif"
                  fontSize="13" fontWeight="800" fill={M.ink}
                  style={{ paintOrder: "stroke", stroke: M.cream, strokeWidth: 4, strokeLinejoin: "round" }}>
                  {b.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* HUD top-left */}
      <div style={{
        position: "absolute", top: 16, left: 16,
        background: tone === "deep" ? "rgba(58,46,34,0.85)" : "rgba(255,248,236,0.92)",
        backdropFilter: "blur(4px)",
        borderRadius: 14,
        padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: MS.cardSm,
      }}>
        <MIcon name="map" size={16} color={tone === "deep" ? M.beigeAlt : M.terra} />
        <MagCap color={tone === "deep" ? M.beigeAlt : M.ink}>
          MASILMAP · 526 places
        </MagCap>
      </div>

      {/* HUD bottom-right zoom */}
      <div style={{
        position: "absolute", bottom: 16, right: 16,
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        {["+", "−"].map((c) => (
          <div key={c} style={{
            width: 36, height: 36, borderRadius: 12,
            background: tone === "deep" ? "rgba(58,46,34,0.85)" : M.cream,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: tone === "deep" ? M.beigeAlt : M.ink,
            fontWeight: 800, fontSize: 18,
            boxShadow: MS.cardSm,
            cursor: "pointer",
          }}>{c}</div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 빌딩 카드 (리스트용) ---------- */
function BuildingListCard({ b, onClick, selected = false, variant = "default" }) {
  const accent = b.pinTone === "olive" ? M.olive : M.terra;

  if (variant === "compact") {
    return (
      <div onClick={onClick} style={{
        display: "flex", gap: 14, padding: "14px 16px",
        background: selected ? M.cream : "transparent",
        borderRadius: MR.card,
        border: `1px solid ${selected ? `${accent}50` : "transparent"}`,
        cursor: "pointer",
        transition: "all .15s",
      }}>
        <div style={{ width: 72, height: 72, flexShrink: 0 }}>
          <ImgPlaceholder ratio="1/1" tone={b.pinTone === "olive" ? "olive" : "beige"} style={{ borderRadius: 14 }}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <MagCap style={{ fontSize: 9 }}>{b.region}</MagCap>
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: M.ink, letterSpacing: "-0.01em", marginBottom: 2 }}>
            {b.name}
          </div>
          <div style={{ fontSize: 11, color: M.muted, fontWeight: 600 }}>
            {b.architect} · {b.year}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} style={{
      background: M.cream,
      borderRadius: MR.card,
      padding: 14,
      cursor: "pointer",
      boxShadow: selected ? MS.cardLg : MS.cardSm,
      border: `1.5px solid ${selected ? accent : "transparent"}`,
      transition: "all .2s",
    }}>
      <div style={{ position: "relative", marginBottom: 14 }}>
        <ImgPlaceholder ratio="4/3" tone={b.pinTone === "olive" ? "olive" : "beige"} caption={`${b.name} 외관`}/>
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          <MChip color={accent} size="sm">{b.style}</MChip>
        </div>
        <div style={{
          position: "absolute", top: 10, right: 10,
          width: 32, height: 32, borderRadius: 999,
          background: "rgba(255,248,236,0.95)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <MIcon name="bookmark" size={14} color={M.ink} />
        </div>
      </div>
      <div style={{ padding: "0 4px 4px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
          <MagCap>{b.region}</MagCap>
        </div>
        <div style={{ fontSize: 19, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 4 }}>
          {b.name}
        </div>
        <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginBottom: 10 }}>
          {b.architect} · {b.year} · {b.type}
        </div>
        <div style={{ fontSize: 13, color: M.ink, lineHeight: 1.55, fontWeight: 500, textWrap: "pretty" }}>
          {b.intro}
        </div>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, fontSize: 11, color: M.muted, fontWeight: 700 }}>
            <span>♡ {b.saved.toLocaleString()}</span>
            <span>방문 {b.visited.toLocaleString()}</span>
          </div>
          <MIcon name="arrow" size={16} color={accent} />
        </div>
      </div>
    </div>
  );
}

/* ---------- 필터 바 ---------- */
/* ---------- 필터 바 (5-chip dropdown · BuildingsIndexScreen과 동일) ---------- */
function FilterBar({ onFilteredChange, searchQuery = "" }) {
  const [openMenu, setOpenMenu] = React.useState(null);
  const toggleMenu = (k) => setOpenMenu((cur) => (cur === k ? null : k));

  const [projects, setProjects]     = React.useState(new Set(["building"]));
  const [regions, setRegions]       = React.useState(new Set());
  const [uses, setUses]             = React.useState(new Set());
  const [areaType, setAreaType]     = React.useState("gfa");
  const [areaMin, setAreaMin]       = React.useState(0);
  const [areaMax, setAreaMax]       = React.useState(200000);
  const [floorsType, setFloorsType] = React.useState("above");
  const [floorsMin, setFloorsMin]   = React.useState(1);
  const [floorsMax, setFloorsMax]   = React.useState(50);

  // 외부 클릭 시 dropdown 닫기
  React.useEffect(() => {
    const h = (e) => { if (!e.target.closest("[data-filter-chip]")) setOpenMenu(null); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  // 지역별 / 용도별 카운트
  const provinceCounts = React.useMemo(() => {
    const c = {};
    BUILDINGS.forEach((b) => { const id = provinceIdOf(b); if (id) c[id] = (c[id] || 0) + 1; });
    return c;
  }, []); // BUILDINGS는 fixture라 변동 없음
  const krTotal = React.useMemo(() => Object.values(provinceCounts).reduce((a, b) => a + b, 0), [provinceCounts]);
  // 필터링 (useMemo로 stable ref)
  const q = (searchQuery || "").trim().toLowerCase();
  const filtered = React.useMemo(() => BUILDINGS.filter((b) => {
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
  }), [q, regions, uses, areaType, areaMin, areaMax, floorsType, floorsMin, floorsMax]);

  // 부모에 필터 결과 통지 (filtered ref 변화 시에만)
  React.useEffect(() => {
    if (onFilteredChange) onFilteredChange(filtered);
  }, [filtered]);

  // 배지
  const regionBadge  = regions.size;
  const usesBadge    = uses.size;
  const areaBadge    = (areaMin > 0 || areaMax < 200000) ? 1 : 0;
  const floorsBadge  = (floorsMin > 1 || floorsMax < 50 || floorsType !== "above") ? 1 : 0;
  const projectBadge = 0;

  const toggleSet = (set, val, setter) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setter(next);
  };

  return (
    <div style={{
      display: "flex", gap: 10, alignItems: "center", justifyContent: "center",
      flexWrap: "wrap", padding: "0 56px", position: "relative",
    }}>
      {/* 프로젝트 */}
      <FilterChip label="프로젝트" badge={projectBadge}
        open={openMenu === "project"} onToggle={() => toggleMenu("project")}
        icon="map" width={240}>
        <div style={{ fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 8 }}>카테고리 선택</div>
        <CheckRow checked={projects.has("building")} disabled dot={M.terra} label="건축물 (현재 페이지)"/>
        <CheckRow checked={false} disabled dot="#F0A0A0" label="인테리어"/>
        <CheckRow checked={false} disabled dot="#4A5570" label="계획안"/>
        <CheckRow checked={false} disabled dot={M.olive}  label="여행지"/>
        <div style={{ fontSize: 10, color: M.muted, fontWeight: 600, marginTop: 8 }}>※ 다른 카테고리는 준비중</div>
      </FilterChip>

      {/* 지역 */}
      <FilterChip label="지역" badge={regionBadge}
        open={openMenu === "region"} onToggle={() => toggleMenu("region")}
        icon="location" width={320}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: M.ink, fontWeight: 800 }}>🇰🇷 한국</span>
          <span style={{ fontSize: 11, color: M.muted, fontWeight: 700 }}>{krTotal}곳</span>
        </div>
        {KR_PROVINCES.map((p) => (
          <CheckRow key={p.id} checked={regions.has(p.id)}
            onChange={() => toggleSet(regions, p.id, setRegions)}
            label={p.name} count={provinceCounts[p.id] || 0}/>
        ))}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${M.beigeAlt}`,
          display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: M.ink, fontWeight: 800 }}>🌏 국제</span>
          <span style={{ fontSize: 10, color: M.terra, fontWeight: 800 }}>준비중</span>
        </div>
        {INTL_COUNTRIES.map((c) => (
          <CheckRow key={c.id} checked={false} disabled label={`${c.flag} ${c.name}`}/>
        ))}
        {regions.size > 0 && (
          <div onClick={() => setRegions(new Set())} style={{
            marginTop: 10, padding: "8px 0", textAlign: "center",
            fontSize: 12, fontWeight: 700, color: M.terra,
            cursor: "pointer", borderTop: `1px solid ${M.beigeAlt}`,
          }}>모두 해제</div>
        )}
      </FilterChip>

      {/* 용도 (1차 → 2차 hierarchical) */}
      <UseFilterChip uses={uses} setUses={setUses}
        open={openMenu === "use"} onToggle={() => toggleMenu("use")}/>

      {/* 면적 */}
      <FilterChip label="면적" badge={areaBadge}
        open={openMenu === "area"} onToggle={() => toggleMenu("area")}
        icon="filter" width={300}>
        <div style={{ fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 8 }}>면적 종류</div>
        <div style={{ marginBottom: 14 }}>
          <RadioRow value="site"  current={areaType} onChange={setAreaType} label="대지면적"/>
          <RadioRow value="floor" current={areaType} onChange={setAreaType} label="건축면적"/>
          <RadioRow value="gfa"   current={areaType} onChange={setAreaType} label="연면적"/>
        </div>
        <div style={{ fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 8 }}>범위 (㎡)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center" }}>
          <input type="number" value={areaMin} min={0} max={areaMax}
            onChange={(e) => setAreaMin(Math.max(0, +e.target.value || 0))} style={inputStyle}/>
          <span style={{ color: M.muted }}>~</span>
          <input type="number" value={areaMax} min={areaMin}
            onChange={(e) => setAreaMax(Math.max(areaMin, +e.target.value || 0))} style={inputStyle}/>
        </div>
        {areaType !== "gfa" && (
          <div style={{ fontSize: 10, color: M.muted, fontWeight: 600, marginTop: 8 }}>
            ※ 현재 데이터는 <strong style={{ color: M.terra }}>연면적</strong>만 등록되어 있어요
          </div>
        )}
        {(areaMin > 0 || areaMax < 200000) && (
          <div onClick={() => { setAreaMin(0); setAreaMax(200000); }} style={{
            marginTop: 10, padding: "8px 0", textAlign: "center",
            fontSize: 12, fontWeight: 700, color: M.terra,
            cursor: "pointer", borderTop: `1px solid ${M.beigeAlt}`,
          }}>초기화</div>
        )}
      </FilterChip>

      {/* 층수 */}
      <FilterChip label="층수" badge={floorsBadge}
        open={openMenu === "floors"} onToggle={() => toggleMenu("floors")}
        icon="filter" width={280}>
        <div style={{ fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 8 }}>층 종류</div>
        <div style={{ marginBottom: 14 }}>
          <RadioRow value="above" current={floorsType} onChange={setFloorsType} label="지상"/>
          <RadioRow value="below" current={floorsType} onChange={setFloorsType} label="지하"/>
        </div>
        <div style={{ fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 8 }}>범위</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center" }}>
          <input type="number" value={floorsMin} min={1} max={floorsMax}
            onChange={(e) => setFloorsMin(Math.max(1, +e.target.value || 1))} style={inputStyle}/>
          <span style={{ color: M.muted }}>~</span>
          <input type="number" value={floorsMax} min={floorsMin}
            onChange={(e) => setFloorsMax(Math.max(floorsMin, +e.target.value || floorsMin))} style={inputStyle}/>
        </div>
        {floorsType === "below" && (
          <div style={{ fontSize: 10, color: M.muted, fontWeight: 600, marginTop: 8 }}>
            ※ 지하층 데이터는 별도 등록 필요
          </div>
        )}
        {(floorsMin > 1 || floorsMax < 50 || floorsType !== "above") && (
          <div onClick={() => { setFloorsMin(1); setFloorsMax(50); setFloorsType("above"); }} style={{
            marginTop: 10, padding: "8px 0", textAlign: "center",
            fontSize: 12, fontWeight: 700, color: M.terra,
            cursor: "pointer", borderTop: `1px solid ${M.beigeAlt}`,
          }}>초기화</div>
        )}
      </FilterChip>

      {(regionBadge + usesBadge + areaBadge + floorsBadge) > 0 && (
        <div onClick={() => {
          setRegions(new Set()); setUses(new Set());
          setAreaMin(0); setAreaMax(200000);
          setFloorsType("above"); setFloorsMin(1); setFloorsMax(50);
        }} style={{
          position: "absolute", right: 56, top: "50%", transform: "translateY(-50%)",
          padding: "8px 12px", fontSize: 12, fontWeight: 700, color: M.muted,
          cursor: "pointer", textDecoration: "underline",
        }}>모든 필터 초기화</div>
      )}
    </div>
  );
}

/* ---------- HERO 헤더 (editorial 변형용) ---------- */
function MasilHero({ onNavigate }) {
  return (
    <section style={{ padding: "32px 56px 24px" }}>
      <Hairline label={`마실맵 · 한국 건축 산책 가이드`} style={{ marginBottom: 28 }}/>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "end" }}>
        <div>
          <MagCap color={M.terra} style={{ marginBottom: 16 }}>
            마실맵 · 동네 산책
          </MagCap>
          <h1 style={{
            fontSize: 72, fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.02, color: M.ink, margin: 0,
            textWrap: "pretty",
          }}>
            한국에 지어진 <span style={{ color: M.olive, fontWeight: 900 }}>모든 건축</span>은<br/>
            한 번쯤 걸어볼 가치가 있다.
          </h1>
          <div style={{ display: "flex", gap: 12, marginTop: 32, alignItems: "center" }}>
            <MButton kind="primary" size="lg" onClick={() => onNavigate("home")}>지도에서 둘러보기</MButton>
            <MButton kind="outline" size="lg" onClick={() => onNavigate("collection")}>컬렉션 둘러보기 →</MButton>
          </div>
        </div>
        <div>
          <p style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: 17, lineHeight: 1.75,
            color: M.ink, fontWeight: 400,
            margin: 0, textWrap: "pretty",
          }}>
            마실맵은 한국의 건축물을 천천히 걷는 여행 안내서입니다. 천 년 된 목조 건축부터 어제 완공된 미술관까지,
            526곳의 건축물과 47개의 코스를 지도 위에 함께 펼쳐 두었습니다.
          </p>
          <div style={{ marginTop: 20, display: "flex", gap: 24, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: M.muted, fontWeight: 600 }}>
            <span>526 PLACES</span>
            <span>·</span>
            <span>47 COURSES</span>
            <span>·</span>
            <span>12 EDITORS</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- ViewportPanel: 좌측 — 현재 지도 영역의 건축물 리스트 ---------- */
function ViewportPanel({ buildings, selectedId, onSelect, isMobile = false }) {
  return (
    <div style={{
      width: isMobile ? "100%" : 360,
      height: isMobile ? "auto" : "100%",
      maxHeight: isMobile ? "100%" : "none",
      background: M.cream, borderRadius: MR.cardLg, padding: isMobile ? 14 : 20,
      boxShadow: MS.cardLg,
      display: "flex", flexDirection: "column", gap: 10,
      overflow: "hidden",
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: M.terra,
            animation: "pulse 1.6s ease-in-out infinite" }}/>
          <MagCap color={M.terra}>NOW EXPLORING · 전국</MagCap>
        </div>
        <div style={{
          fontSize: 18, fontWeight: 800, color: M.ink,
          letterSpacing: "-0.015em", lineHeight: 1.25,
        }}>
          현재 지도 영역에 <span style={{ color: M.terra }}>{buildings.length}곳</span>
        </div>
        <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 4 }}>
          지도를 이동하면 목록이 따라 갱신됩니다
        </div>
      </div>

      <Hairline />

      <div style={{
        display: "flex", flexDirection: "column", gap: 6,
        overflowY: "auto", paddingRight: 4, flex: 1, minHeight: 0,
      }}>
        {buildings.length === 0 ? (
          <div style={{ padding: "40px 8px", textAlign: "center", color: M.muted,
            fontSize: 13, fontWeight: 600 }}>
            현재 영역에 표시할 건축물이 없습니다
          </div>
        ) : (
          buildings.map((b) => (
            <BuildingListCard key={b.id} b={b}
              selected={b.id === selectedId}
              onClick={() => onSelect(b.id)}
              variant="compact"/>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------- PinPopupCard: 좌측 list 옆에 슬라이드 확장 (Naver/Google Maps 톤) ---------- */
function PinPopupCard({ b, onClose, onNavigate, isMobile = false }) {
  const accent = b.pinTone === "olive" ? M.olive : M.terra;
  return (
    <div style={{
      width: isMobile ? "100%" : 380,
      height: isMobile ? "auto" : "100%",
      maxHeight: isMobile ? "70vh" : "100%",
      overflowY: "auto",
      background: M.cream, borderRadius: MR.cardLg,
      boxShadow: MS.cardLg,
      animation: "slideInLeft .2s ease-out",
    }}>
      {/* 이미지 영역 */}
      <div style={{ position: "relative" }}>
        <ImgPlaceholder
          ratio="16/10"
          tone={b.pinTone === "olive" ? "olive" : "beige"}
          style={{ borderRadius: 0 }}/>


        {/* 우상단: 닫기 X */}
        <div onClick={onClose} style={{
          position: "absolute", top: 12, right: 12,
          width: 28, height: 28, borderRadius: 999,
          background: "rgba(58,46,34,0.7)", color: M.cream,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, cursor: "pointer",
        }}>×</div>

        {/* 우하단: PHOTO 인디케이터 */}
        <div style={{
          position: "absolute", bottom: 12, right: 12,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
          color: M.cream, background: "rgba(58,46,34,0.7)",
          padding: "4px 9px", borderRadius: 6,
        }}>PHOTO · 1/8</div>
      </div>

      {/* 본문 */}
      <div style={{ padding: 20 }}>
        {/* 칩: 스타일 + 거리 */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          <MChip color={accent} size="sm">{b.style}</MChip>
          <MChip color={M.muted} bg={M.beige} size="sm">📍 {b.region}</MChip>
        </div>

        {/* 이름 + 건축가 (클릭 시 상세 화면) */}
        <div
          onClick={() => onNavigate("detail", b.id)}
          style={{
            fontSize: 22, fontWeight: 900, color: M.ink,
            letterSpacing: "-0.02em", marginBottom: 2,
            cursor: "pointer",
            transition: "color .15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
          onMouseLeave={(e) => (e.currentTarget.style.color = M.ink)}>
          {b.name} <span style={{ fontSize: 13, color: accent, fontWeight: 800 }}>↗</span>
        </div>
        <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginBottom: 14 }}>
          {b.architect} · {b.year}
        </div>

        {/* 인용 박스 */}
        <div style={{
          padding: "12px 14px", borderRadius: 12,
          background: M.beige, border: `1px solid ${M.beigeAlt}`,
          fontFamily: "'Noto Serif KR', serif",
          fontSize: 13, fontStyle: "italic", color: M.ink, lineHeight: 1.55,
          marginBottom: 14,
        }}>"{b.intro}"</div>

        {/* 메트릭스 박스 (2칸) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          <div style={{
            background: M.beige, padding: "10px 12px", borderRadius: 10,
            border: `1px solid ${M.beigeAlt}`,
          }}>
            <div style={{ fontSize: 10, color: M.muted, fontWeight: 700, marginBottom: 2 }}>연면적</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: M.ink }}>{b.metrics?.gfa || "—"}</div>
          </div>
          <div style={{
            background: M.beige, padding: "10px 12px", borderRadius: 10,
            border: `1px solid ${M.beigeAlt}`,
          }}>
            <div style={{ fontSize: 10, color: M.muted, fontWeight: 700, marginBottom: 2 }}>관람</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: M.ink }}>{b.metrics?.visit || "—"}</div>
          </div>
        </div>

        {/* 액션: 북마크 + 공유 + 자세히 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 999,
              background: M.beige, border: `1px solid ${M.beigeAlt}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}><MIcon name="bookmark" size={16} color={M.ink}/></div>
            <div style={{
              width: 36, height: 36, borderRadius: 999,
              background: M.beige, border: `1px solid ${M.beigeAlt}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}><MIcon name="share" size={16} color={M.ink}/></div>
          </div>
          <MButton kind="primary" size="md" onClick={() => onNavigate("detail", b.id)}>
            더 자세히 보기 →
          </MButton>
        </div>

        {/* 외부 링크 (선택적) */}
        <div style={{
          marginTop: 12, paddingTop: 12,
          borderTop: `1px solid ${M.beigeAlt}`,
          display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 10, color: M.muted, fontWeight: 800,
            letterSpacing: "0.1em", textTransform: "uppercase" }}>
            EXTERNAL
          </span>
          <span style={{
            padding: "5px 10px", borderRadius: 999, background: `${accent}14`,
            color: accent, fontSize: 11, fontWeight: 700, cursor: "pointer",
          }}>📍 MasilGround ↗</span>
          <span style={{
            padding: "5px 10px", borderRadius: 999, background: M.beige,
            border: `1px solid ${M.beigeAlt}`,
            color: M.ink, fontSize: 11, fontWeight: 700, cursor: "pointer",
          }}>🔗 외부 자료 ↗</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- COVER 레이아웃: 매거진 표지 + 검색 + 픽 (홈 기본) ---------- */
function CoverHomeLayout({ onNavigate }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const px = pageX(isMobile, isTablet);
  const featuredCol = SERIES[0]; // 안도 타다오 시리즈
  if (!featuredCol) return null; // 시리즈 데이터 없을 때 안전 종료
  const featCourses = seriesCourses(featuredCol);
  const featBuildings = seriesBuildingCount(featuredCol);
  const picks = ["kongkan", "buseoksa", "bonte"]
    .map((id) => BUILDINGS.find((b) => b.id === id))
    .filter(Boolean);
  const featuredCourses = COURSES.slice(0, 2);

  const submitSearch = (q) => {
    if (window.__masilSearch && window.__masilSearch.setQuery) {
      window.__masilSearch.setQuery(q);
    }
    onNavigate("buildings");
  };

  return (
    <>
      {/* === SECTION 1: 매거진 표지 (B) === */}
      <section style={{ padding: `8px ${px}px ${isMobile ? 36 : 56}px` }}>
        <Hairline label={`MASILMAP · SERIES · ${featuredCol.no}`} style={{ marginBottom: 28 }}/>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr",
          gap: isMobile ? 16 : 48,
          alignItems: "stretch",
        }}>
          {/* 좌측: 큰 표지 블록 */}
          <div
            onClick={() => onNavigate("collection", featuredCol.id)}
            style={{
              position: "relative",
              borderRadius: MR.cardLg,
              background: featuredCol.cover,
              color: M.cream,
              padding: isMobile ? "32px 24px" : "48px 44px",
              minHeight: isMobile ? 360 : 480,
              cursor: "pointer",
              overflow: "hidden",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              boxShadow: MS.cardLg,
            }}>
            {/* 코너 모노 텍스트 */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, fontWeight: 600, letterSpacing: "0.14em",
              color: "rgba(244,243,234,0.7)",
            }}>
              <span>MASILMAP · SERIES · {featuredCol.no}</span>
              <span>{featuredCol.kind}</span>
            </div>

            {/* 표지 본문 */}
            <div>
              <div style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: 18, opacity: 0.85, marginBottom: 14, fontWeight: 400,
              }}>
                a masilmap series
              </div>
              <h1 style={{
                fontSize: isMobile ? 56 : 96, fontWeight: 900,
                letterSpacing: "-0.045em", lineHeight: 0.95,
                margin: "0 0 18px", textWrap: "balance",
              }}>{featuredCol.title}</h1>
              <div style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: 22, fontWeight: 500, opacity: 0.92,
              }}>{featuredCol.subtitle}</div>
            </div>

            {/* 하단 메타 */}
            <div style={{
              paddingTop: 18,
              borderTop: `1px solid rgba(244,243,234,0.25)`,
              display: "flex", justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            }}>
              <span>{featCourses.length} 코스 · {featBuildings} 건축물</span>
              <span>{featuredCol.kind}</span>
            </div>
          </div>

          {/* 우측: 에디터 노트 */}
          <div style={{
            background: M.cream,
            borderRadius: MR.cardLg,
            padding: "40px 32px",
            boxShadow: MS.card,
            display: "flex", flexDirection: "column", gap: 18,
          }}>
            <MagCap color={M.terra}>SERIES · {featuredCol.kind} 정복</MagCap>
            <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
              {featCourses.length} 코스 · {featBuildings} 건축물
            </div>

            <blockquote style={{
              margin: 0, padding: 0,
              fontFamily: "'Noto Serif KR', serif",
              fontSize: 22, lineHeight: 1.55, color: M.ink,
              fontWeight: 500, letterSpacing: "-0.005em",
              textWrap: "pretty",
            }}>
              {featuredCol.intro}
            </blockquote>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {featCourses.map((cc) => (
                <span key={cc.id} style={{ padding: "6px 12px", borderRadius: 999, background: M.beige, border: `1px solid ${M.beigeAlt}`, fontSize: 12, fontWeight: 700, color: M.ink }}>{(cc.title || "").split(",")[0]}</span>
              ))}
            </div>

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
              <Hairline style={{ marginBottom: 8 }}/>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 800, color: M.olive }}>
                  <MIcon name="sparkle" size={15} color={M.olive}/> {featuredCol.badge}
                </div>
                <MButton kind="primary" size="md" onClick={() => onNavigate("collection", featuredCol.id)}>
                  시리즈 정복하기 →
                </MButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION 2: 검색 (A) === */}
      <section style={{
        padding: `${isMobile ? 36 : 56}px ${px}px`,
        background: M.cream,
        borderTop: `1px solid ${M.beigeAlt}`,
        borderBottom: `1px solid ${M.beigeAlt}`,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <MagCap color={M.terra} style={{ marginBottom: 14 }}>EXPLORE</MagCap>
          <h2 style={{
            fontSize: isMobile ? 28 : 40, fontWeight: 900,
            letterSpacing: "-0.025em", lineHeight: 1.1,
            color: M.ink, margin: "0 0 28px",
            textWrap: "balance",
          }}>
            어디로 <span style={{ color: M.olive, fontWeight: 900 }}>마실</span> 다녀올까요?
          </h2>

          <SearchHero onSubmit={submitSearch}/>

          <div style={{
            marginTop: 18,
            display: "flex", justifyContent: "center",
            gap: 8, flexWrap: "wrap",
            fontSize: 12, color: M.muted, fontWeight: 600,
          }}>
            <span>추천 검색:</span>
            {["공간 사옥", "안도 다다오", "한옥", "미술관"].map((kw, i) => (
              <span key={kw} onClick={() => submitSearch(kw)} style={{
                color: M.terra, fontWeight: 700, cursor: "pointer",
                padding: "0 4px",
              }}>{kw}{i < 3 ? " ·" : ""}</span>
            ))}
          </div>
        </div>
      </section>

      {/* === SECTION 3: THIS WEEK 픽 === */}
      <section style={{ padding: `${isMobile ? 36 : 56}px ${px}px ${isMobile ? 20 : 32}px` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <div>
            <MagCap color={M.terra} style={{ marginBottom: 6 }}>EDITOR'S PICK · 에디터 픽</MagCap>
            <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: 0 }}>
              에디터가 고른 세 건축
            </h2>
          </div>
          <span onClick={() => onNavigate("buildings")} style={{
            fontSize: 13, fontWeight: 800, color: M.terra, cursor: "pointer",
          }}>전체 보기 →</span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 20,
        }}>
          {picks.map((b) => (
            <div key={b.id} onClick={() => onNavigate("detail", b.id)} style={{
              borderRadius: MR.card, overflow: "hidden",
              background: M.cream, boxShadow: MS.cardSm,
              cursor: "pointer",
            }}>
              <ImgPlaceholder
                ratio="4/3"
                tone={b.pinTone === "olive" ? "olive" : "beige"}
                caption={`${b.name} 외관`}
                style={{ borderRadius: 0 }}/>
              <div style={{ padding: 18 }}>
                <MagCap>{b.region} · {b.style}</MagCap>
                <div style={{ fontSize: 20, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", margin: "8px 0 4px" }}>
                  {b.name}
                </div>
                <div style={{ fontSize: 12, color: M.muted, fontWeight: 600 }}>
                  {b.architect} · {b.year}
                </div>
                <p style={{ fontSize: 13, color: M.ink, lineHeight: 1.55, margin: "12px 0 0", fontWeight: 500,
                  display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden",
                }}>{b.intro}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === SECTION 4: NEXT COURSE === */}
      <section style={{ padding: `${isMobile ? 20 : 32}px ${px}px ${isMobile ? 56 : 80}px` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <div>
            <MagCap color={M.olive} style={{ marginBottom: 6 }}>NEXT COURSE · 도슨트와 함께</MagCap>
            <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: 0 }}>
              다음 마실 코스
            </h2>
          </div>
          <span onClick={() => onNavigate("course")} style={{
            fontSize: 13, fontWeight: 800, color: M.terra, cursor: "pointer",
          }}>전체 코스 →</span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: 20,
        }}>
          {featuredCourses.map((c) => (
            <div key={c.id} onClick={() => onNavigate("course", c.id)} style={{
              borderRadius: MR.cardLg, overflow: "hidden",
              background: M.cream, boxShadow: MS.cardSm,
              cursor: "pointer",
              display: "grid", gridTemplateColumns: "180px 1fr", minHeight: 200,
            }}>
              {/* 좌: 코스 표지 */}
              <div style={{
                background: c.cover, color: M.cream, padding: 18,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em" }}>
                  {c.type === "도슨트" ? "DOCENT COURSE" : "SELF COURSE"}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.85 }}>{c.buildings.length}곳</div>
                  <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.7, marginTop: 4 }}>★ {c.rating}</div>
                </div>
              </div>

              {/* 우: 코스 정보 */}
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 19, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  {c.name}
                </div>
                <p style={{
                  fontSize: 13, color: M.muted, lineHeight: 1.55, margin: 0, fontWeight: 500,
                  display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden",
                }}>{c.blurb}</p>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 11, color: M.muted, fontWeight: 700 }}>
                    {c.duration} · {c.difficulty}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: M.terra }}>
                    {c.price === 0 ? "무료" : `₩${c.price.toLocaleString()}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ---------- SearchHero: cover 레이아웃의 큰 검색 박스 ---------- */
function SearchHero({ onSubmit }) {
  const [val, setVal] = React.useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (val.trim()) onSubmit(val.trim()); }}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        background: M.beige,
        border: `1.5px solid ${M.beigeAlt}`,
        borderRadius: 999,
        padding: "8px 8px 8px 24px",
        boxShadow: MS.card,
      }}>
      <MIcon name="search" size={18} color={M.muted}/>
      <input
        value={val} onChange={(e) => setVal(e.target.value)}
        placeholder="건축물, 지역, 건축가, 키워드…"
        style={{
          flex: 1, border: "none", outline: "none", background: "transparent",
          fontSize: 16, fontWeight: 600, color: M.ink, fontFamily: "inherit",
          minWidth: 0, padding: "10px 0",
        }}/>
      <MButton kind="primary" size="lg">찾아보기 →</MButton>
    </form>
  );
}

/* ---------- 지도 페이지 전용 빠른 필터 (FastFive 톤) ---------- */
const MAP_QUICK_FILTERS = [
  { id: "all",    label: "전체",       match: () => true },
  { id: "picks",  label: "✨ 추천",    match: (b) => ["kongkan", "buseoksa", "bonte"].includes(b.id) },
  { id: "hanok",  label: "한옥",       match: (b) => b.typeKey === "hanok" },
  { id: "modern", label: "근현대",     match: (b) => b.typeKey === "modern" },
  { id: "museum", label: "미술관",     match: (b) => b.typeKey === "museum" },
];

/* ---------- 메인 화면 ---------- */
function HomeScreen({ route, onNavigate, t, searchQuery }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [selectedId, setSelectedId] = React.useState(BUILDINGS[0]?.id ?? null);
  const [filtered, setFiltered]     = React.useState(BUILDINGS);
  const [mapQuickFilter, setMapQuickFilter] = React.useState("all");

  const selected = BUILDINGS.find((b) => b.id === selectedId);
  const layout = t.homeLayout;

  // 지도 페이지 전용 filtered (quickFilter + 상단 nav 검색어)
  const mapFiltered = React.useMemo(() => {
    const f = MAP_QUICK_FILTERS.find((x) => x.id === mapQuickFilter) || MAP_QUICK_FILTERS[0];
    const q = (searchQuery || "").trim().toLowerCase();
    return BUILDINGS.filter((b) => {
      if (!f.match(b)) return false;
      if (q) {
        const hay = `${b.name} ${b.nameEn || ""} ${b.region} ${b.architect} ${b.style} ${(b.tags || []).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [mapQuickFilter, searchQuery]);

  return (
    <MPage>
      <MasilNav route={route} onNavigate={onNavigate} variant="default" />

      {/* 헤더 영역 — 변형별 다르게 */}
      {layout === "editorial" && <MasilHero onNavigate={onNavigate} />}

      {layout === "split" && (
        <section style={{ padding: "32px 56px 24px" }}>
          <Hairline label="EXPLORE · MAP & LIST" style={{ marginBottom: 20 }}/>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 32 }}>
            <h1 style={{
              fontSize: 56, fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.04, color: M.ink, margin: 0,
              textWrap: "pretty",
            }}>
              오늘은 어느 동네를<br/>
              <span style={{ color: M.olive, fontWeight: 900 }}>마실</span> 다녀올까요?
            </h1>
            <div style={{ maxWidth: 360, textAlign: "right" }}>
              <p style={{ fontSize: 14, color: M.muted, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                지도 위 핀을 누르면 자세한 이야기가 펼쳐집니다.
                오른쪽 목록은 현재 보고 있는 영역의 건축물입니다.
              </p>
              <div style={{ marginTop: 12, display: "inline-flex", gap: 6 }}>
                <MagCap>526 PLACES</MagCap>
                <MagCap color={M.terra}>· 47 COURSES</MagCap>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 필터 바 — split / editorial 에서만. mapPrimary / cover는 자체 UI 사용 */}
      {(layout === "split" || layout === "editorial") && (
        <div style={{ paddingBottom: 24 }}>
          <FilterBar onFilteredChange={setFiltered} searchQuery={searchQuery}/>
        </div>
      )}

      {/* === COVER 레이아웃 (매거진 표지 + 검색 + 픽 · 새 기본 홈) === */}
      {layout === "cover" && (
        <CoverHomeLayout onNavigate={onNavigate}/>
      )}

      {/* === SPOTLIGHT 레이아웃 (시네마틱 히어로 · 임팩트) === */}
      {layout === "spotlight" && (
        <SpotlightHome onNavigate={onNavigate}/>
      )}

      {/* === MOSAIC 레이아웃 (건축 사진 모자이크 월) === */}
      {layout === "mosaic" && (
        <MosaicHome onNavigate={onNavigate}/>
      )}

      {/* === SPLIT 레이아웃 === */}
      {layout === "split" && (
        <section style={{ padding: "0 56px 64px", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 24, height: 720 }}>
          <div style={{ borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.card }}>
            <MasilMap buildings={filtered} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "auto", paddingRight: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 4px" }}>
              <MagCap>{filtered.length} RESULTS · 가까운 순</MagCap>
              <span style={{ fontSize: 12, fontWeight: 700, color: M.terra, cursor: "pointer" }}>↕ 정렬</span>
            </div>
            {filtered.map((b) => (
              <BuildingListCard
                key={b.id} b={b}
                selected={b.id === selectedId}
                onClick={() => { setSelectedId(b.id); }}
                variant="compact"
              />
            ))}
            {selected && (
              <div style={{ padding: 12, textAlign: "center" }}>
                <MButton kind="outline" size="md" onClick={() => onNavigate("detail", selected.id)}>
                  {selected.name} 상세 보기 →
                </MButton>
              </div>
            )}
          </div>
        </section>
      )}

      {/* === MAP-PRIMARY 레이아웃 (Option A · 사이드 도크 — mapmenu.jsx) === */}
      {layout === "mapPrimary" && (
        <MapMenuLayout onNavigate={onNavigate} searchQuery={searchQuery} isMobile={isMobile} />
      )}

      {/* === EDITORIAL 레이아웃 === */}
      {layout === "editorial" && (
        <>
          <Hairline label="THIS WEEK · 526 PLACES ON THE MAP" style={{ margin: "8px 56px 24px" }}/>
          <section style={{ padding: "0 56px 64px", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 32 }}>
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
                {filtered.slice(0, 6).map((b) => (
                  <BuildingListCard key={b.id} b={b} onClick={() => onNavigate("detail", b.id)} />
                ))}
              </div>
              <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
                <MButton kind="outline" size="lg">더 둘러보기</MButton>
              </div>
            </div>
            <div style={{ position: "sticky", top: 88, height: "fit-content" }}>
              <MagCap color={M.terra} style={{ marginBottom: 12 }}>MAP VIEW</MagCap>
              <div style={{ height: 420, borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.card }}>
                <MasilMap buildings={filtered} selectedId={selectedId} onSelect={setSelectedId} compact />
              </div>
              {selected && (
                <div style={{ marginTop: 16, padding: 18, background: M.cream, borderRadius: MR.card, boxShadow: MS.cardSm }}>
                  <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: "0 0 4px" }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: M.muted, fontWeight: 600 }}>{selected.architect} · {selected.year} · {selected.region}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: M.ink, fontWeight: 500, margin: "10px 0 12px" }}>{selected.intro}</p>
                  <MButton kind="primary" size="sm" onClick={() => onNavigate("detail", selected.id)}>상세 →</MButton>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* 시리즈 프리뷰 밴드 — split / editorial 에서만 (cover는 자체 큐레이션, mapPrimary는 풀맵) */}
      {(layout === "split" || layout === "editorial") && (
      <section style={{ padding: "32px 56px 64px", background: M.beigeAlt, borderTop: `1px solid ${M.beigeAlt}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 24 }}>
          <div>
            <MagCap color={M.terra} style={{ marginBottom: 8 }}>SERIES · 코스 정복</MagCap>
            <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0, color: M.ink }}>
              시리즈 정복
            </h2>
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: M.terra, cursor: "pointer" }} onClick={() => onNavigate("collection")}>
            전체 보기 →
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {SERIES.slice(0, 3).map((c) => {
            const cc = seriesCourses(c);
            return (
            <div key={c.id} onClick={() => onNavigate("collection", c.id)} style={{
              background: M.cream, borderRadius: MR.cardLg, overflow: "hidden",
              boxShadow: MS.cardSm, cursor: "pointer",
            }}>
              <div style={{
                height: 200, background: c.cover, position: "relative",
                display: "flex", alignItems: "flex-end", padding: 20,
              }}>
                <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 6 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
                    color: M.cream, background: "rgba(255,248,236,0.15)",
                    padding: "5px 9px", borderRadius: 6,
                    border: `1px solid rgba(255,248,236,0.3)`,
                  }}>{c.no} · {c.kind}</span>
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.025em", color: M.cream, lineHeight: 1.1 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,248,236,0.8)", marginTop: 4, fontWeight: 600 }}>{c.subtitle}</div>
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <p style={{ fontSize: 13, color: M.ink, lineHeight: 1.6, margin: 0, fontWeight: 500, textWrap: "pretty" }}>{c.intro}</p>
                <Hairline style={{ margin: "16px 0 12px" }}/>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: M.muted, fontWeight: 700 }}>
                    <span>{cc.length} 코스 정복</span>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: M.olive, fontWeight: 800 }}>
                    <MIcon name="sparkle" size={12} color={M.olive}/> {c.badge}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </section>
      )}

      <MFooter />
    </MPage>
  );
}

Object.assign(window, { HomeScreen, MasilMap });
