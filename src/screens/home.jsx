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
            <Serial size={10} color={accent}>#{b.no}</Serial>
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
          <Serial color={accent}>#{b.no}</Serial>
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
function FilterBar({ activeType, setActiveType, activeRegion, setActiveRegion }) {
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "center", padding: "0 56px", flexWrap: "wrap" }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <MagCap style={{ marginRight: 6 }}>TYPE</MagCap>
        {TYPES.map((t) => {
          const on = t.id === activeType;
          return (
            <span key={t.id} onClick={() => setActiveType(t.id)} style={{
              padding: "8px 14px", borderRadius: 999,
              fontSize: 12, fontWeight: 700,
              background: on ? M.ink : "transparent",
              color: on ? M.cream : M.ink,
              border: on ? "none" : `1px solid ${M.beigeAlt}`,
              cursor: "pointer",
              transition: "all .15s",
              whiteSpace: "nowrap",
            }}>
              {t.name}
              <span style={{ marginLeft: 6, opacity: 0.5, fontSize: 11 }}>{t.count}</span>
            </span>
          );
        })}
      </div>
      <div style={{ width: 1, height: 28, background: M.beigeAlt }}/>
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <MagCap style={{ marginRight: 6 }}>REGION</MagCap>
        {[{id:"all", name:"전국"}, ...REGIONS].map((r) => {
          const on = r.id === activeRegion;
          return (
            <span key={r.id} onClick={() => setActiveRegion(r.id)} style={{
              padding: "8px 14px", borderRadius: 999,
              fontSize: 12, fontWeight: 700,
              background: on ? `${M.terra}1f` : "transparent",
              color: on ? M.terra : M.ink,
              border: on ? `1px solid ${M.terra}40` : `1px solid ${M.beigeAlt}`,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}>{r.name}</span>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- HERO 헤더 (editorial 변형용) ---------- */
function MasilHero({ onNavigate }) {
  return (
    <section style={{ padding: "32px 56px 24px" }}>
      <Hairline label={`ISSUE · 2026 SPRING · VOL.07`} style={{ marginBottom: 28 }}/>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "end" }}>
        <div>
          <MagCap color={M.terra} style={{ marginBottom: 16 }}>
            마실맵 · 이번 주의 동네
          </MagCap>
          <h1 style={{
            fontSize: 72, fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.02, color: M.ink, margin: 0,
            textWrap: "pretty",
          }}>
            한국에 지어진 <span style={{ color: M.terra, fontStyle: "italic", fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>모든 건축</span>은<br/>
            한 번쯤 걸어볼 가치가 있다.
          </h1>
          <div style={{ display: "flex", gap: 12, marginTop: 32, alignItems: "center" }}>
            <MButton kind="primary" size="lg" onClick={() => onNavigate("home")}>지도에서 둘러보기</MButton>
            <MButton kind="outline" size="lg" onClick={() => onNavigate("collection")}>이번 호 컬렉션 →</MButton>
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

/* ---------- 메인 화면 ---------- */
function HomeScreen({ route, onNavigate, t }) {
  const [selectedId, setSelectedId] = React.useState(BUILDINGS[0].id);
  const [activeType, setActiveType]   = React.useState("all");
  const [activeRegion, setActiveRegion] = React.useState("all");

  const filtered = BUILDINGS.filter((b) => {
    if (activeType !== "all" && b.typeKey !== activeType) return false;
    return true;
  });

  const selected = BUILDINGS.find((b) => b.id === selectedId);
  const layout = t.homeLayout;

  return (
    <MPage>
      <MasilNav route={route} onNavigate={onNavigate} variant={layout === "mapPrimary" ? "transparent" : "default"} />

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
              <span style={{ color: M.terra, fontFamily: "'Noto Serif KR', serif", fontStyle: "italic", fontWeight: 700 }}>마실</span> 다녀올까요?
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

      {/* 필터 */}
      <div style={{ paddingBottom: 24 }}>
        <FilterBar
          activeType={activeType} setActiveType={setActiveType}
          activeRegion={activeRegion} setActiveRegion={setActiveRegion}
        />
      </div>

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

      {/* === MAP-PRIMARY 레이아웃 === */}
      {layout === "mapPrimary" && (
        <section style={{ position: "relative", height: "calc(100vh - 92px)", minHeight: 700, padding: "0 24px 24px" }}>
          <div style={{ position: "absolute", inset: "0 24px 24px", borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.cardLg }}>
            <MasilMap buildings={filtered} selectedId={selectedId} onSelect={setSelectedId} />
          </div>

          {/* 플로팅 좌측 패널 */}
          <div style={{
            position: "absolute", top: 24, left: 56, width: 380,
            background: M.cream, borderRadius: MR.cardLg, padding: 24,
            boxShadow: MS.cardLg,
          }}>
            <MagCap color={M.terra} style={{ marginBottom: 10 }}>NOW EXPLORING · 전국</MagCap>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0, color: M.ink, textWrap: "pretty" }}>
              지도 위에서<br/>오늘 갈 곳을 골라요
            </h2>
            <p style={{ fontSize: 13, color: M.muted, lineHeight: 1.6, margin: "12px 0 16px", fontWeight: 500 }}>
              핀을 눌러 건축물을 확인하고, 가까운 곳끼리 묶으면 하루 코스가 됩니다.
            </p>
            <Hairline label={`${filtered.length} RESULTS`} style={{ marginBottom: 12 }}/>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 360, overflow: "auto" }}>
              {filtered.slice(0, 5).map((b) => (
                <BuildingListCard key={b.id} b={b} selected={b.id === selectedId} onClick={() => setSelectedId(b.id)} variant="compact"/>
              ))}
            </div>
          </div>

          {/* 플로팅 우측 — 선택된 건물 큰 카드 */}
          {selected && (
            <div style={{
              position: "absolute", top: 24, right: 56, width: 360,
              background: M.cream, borderRadius: MR.cardLg,
              boxShadow: MS.cardLg, overflow: "hidden",
              cursor: "pointer",
            }} onClick={() => onNavigate("detail", selected.id)}>
              <ImgPlaceholder ratio="4/3" tone={selected.pinTone === "olive" ? "olive" : "beige"} caption={`${selected.name} 외관`} style={{ borderRadius: 0 }}/>
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                  <Serial color={selected.pinTone === "olive" ? M.olive : M.terra}>#{selected.no}</Serial>
                  <MagCap>{selected.region}</MagCap>
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, marginBottom: 4 }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginBottom: 12 }}>{selected.architect} · {selected.year}</div>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: M.ink, fontWeight: 500, margin: "0 0 14px" }}>{selected.intro}</p>
                <MButton kind="primary" size="md">자세히 보기 →</MButton>
              </div>
            </div>
          )}
        </section>
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
                  <Serial color={M.terra}>#{selected.no}</Serial>
                  <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: "4px 0 4px" }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: M.muted, fontWeight: 600 }}>{selected.architect} · {selected.year} · {selected.region}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: M.ink, fontWeight: 500, margin: "10px 0 12px" }}>{selected.intro}</p>
                  <MButton kind="primary" size="sm" onClick={() => onNavigate("detail", selected.id)}>상세 →</MButton>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* 컬렉션 프리뷰 밴드 — 모든 레이아웃 공통 */}
      <section style={{ padding: "32px 56px 64px", background: M.beigeAlt, borderTop: `1px solid ${M.beigeAlt}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 24 }}>
          <div>
            <MagCap color={M.terra} style={{ marginBottom: 8 }}>EDITORS' PICK · 2026 SPRING</MagCap>
            <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0, color: M.ink }}>
              이번 호 큐레이션
            </h2>
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: M.terra, cursor: "pointer" }} onClick={() => onNavigate("collection")}>
            전체 보기 →
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {COLLECTIONS.slice(0, 3).map((c) => (
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
                  }}>{c.no} · {c.tag}</span>
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.025em", color: M.cream, lineHeight: 1.1 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,248,236,0.8)", marginTop: 4, fontWeight: 600 }}>{c.subtitle}</div>
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <p style={{ fontSize: 13, color: M.ink, lineHeight: 1.6, margin: 0, fontWeight: 500, textWrap: "pretty" }}>{c.blurb}</p>
                <Hairline style={{ margin: "16px 0 12px" }}/>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: M.muted, fontWeight: 700 }}>
                    <span>EDITOR · {c.editor}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: M.muted, fontWeight: 600 }}>
                    <span>{c.count} 곳</span>
                    <span>·</span>
                    <span>{c.readTime}분</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <MFooter />
    </MPage>
  );
}

Object.assign(window, { HomeScreen });
