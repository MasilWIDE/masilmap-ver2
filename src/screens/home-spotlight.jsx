/* ================================================================
   masilmap · 메인 페이지 — 임팩트 변형 2종
   - SearchCenterHero : 구글형 중앙 검색 히어로 (떠다니는 검색어 + 드롭다운)
   - SpotlightHome    : 검색 히어로 + 큐레이션 섹션
   - MosaicHome       : 건축 사진 모자이크 월 (한눈에 526곳의 밀도)
   ================================================================ */

/* 결정적 픽 (고정 — 에디터가 고른 스포트라이트) */
function mkFeatured(n = 6) {
  const ids = ["leeum", "ddp", "jongmyo", "museumsan", "soeul", "bonte", "amorepacific", "seonyudo"];
  const list = ids.map((id) => (window.BUILDINGS || []).find((b) => b.id === id)).filter(Boolean);
  return list.slice(0, n);
}
function palToneStyle(b) {
  const pal = b.palette || "#333D51";
  return `linear-gradient(135deg, ${pal} 0%, ${pal}cc 55%, ${pal}88 100%)`;
}

/* ---------------------------------------------------------------
   떠다니는 검색 제안어 & 버블 레이아웃 정의
--------------------------------------------------------------- */
const FLOAT_QUERIES = [
  "이번주 주말 남친과 갈만한곳",
  "오늘 아이랑 걷기 좋은곳",
  "중랑구에 2시간 걸을만한곳",
  "분위기 있는 한옥 건축",
  "혼자 걷기 좋은 서울 미술관",
  "데이트하기 좋은 건축 코스",
  "아이와 함께 안도 타다오",
  "주말 오전 성수동 산책",
  "비 오는 날 실내 건축 탐방",
  "서울에서 걸어볼 골목",
];

const BUBBLE_DEFS = [
  { idx: 0, top: "21%", left:  "2%",   anim: "mFloat1", dur: "6s",   delay: "0s"    },
  { idx: 1, top: "41%", left:  "1.5%", anim: "mFloat2", dur: "8s",   delay: "1.2s"  },
  { idx: 2, top: "63%", left:  "3%",   anim: "mFloat3", dur: "7s",   delay: "0.5s"  },
  { idx: 3, top: "81%", left:  "10%",  anim: "mFloat4", dur: "9.5s", delay: "2.1s"  },
  { idx: 4, top: "17%", right: "2%",   anim: "mFloat2", dur: "7.5s", delay: "0.8s"  },
  { idx: 5, top: "40%", right: "1.5%", anim: "mFloat1", dur: "8.5s", delay: "1.9s"  },
  { idx: 6, top: "62%", right: "3.5%", anim: "mFloat3", dur: "6.5s", delay: "0.3s"  },
  { idx: 7, top: "80%", right: "9%",   anim: "mFloat4", dur: "10s",  delay: "2.5s"  },
  { idx: 8, top: "10%", left:  "27%",  anim: "mFloat1", dur: "7.2s", delay: "1.5s"  },
  { idx: 9, top: "89%", right: "24%",  anim: "mFloat2", dur: "8.2s", delay: "0.7s"  },
];

/* ---------------------------------------------------------------
   SearchCenterHero — 구글형 중앙 검색바 + 떠다니는 검색어 버블
--------------------------------------------------------------- */
function SearchCenterHero({ onNavigate, isMobile }) {
  const [query, setQuery]   = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const containerRef = React.useRef(null);

  /* 스크롤 감지 → 네이버/구글처럼 상단 검색창으로 시선 안내 */
  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* 키프레임 CSS 한 번만 주입 */
  React.useEffect(() => {
    const ID = "masil-search-hero-kf";
    if (document.getElementById(ID)) return;
    const s = document.createElement("style");
    s.id = ID;
    s.textContent = `
      @keyframes mFloat1 {
        0%,100%{transform:translate(0,0)}
        33%{transform:translate(7px,-11px)}
        66%{transform:translate(-5px,8px)}
      }
      @keyframes mFloat2 {
        0%,100%{transform:translate(0,0)}
        25%{transform:translate(-9px,11px)}
        75%{transform:translate(6px,-8px)}
      }
      @keyframes mFloat3 {
        0%,100%{transform:translate(0,0)}
        40%{transform:translate(9px,-13px)}
        80%{transform:translate(-5px,7px)}
      }
      @keyframes mFloat4 {
        0%,100%{transform:translate(0,0)}
        50%{transform:translate(10px,10px)}
      }
      .msil-bubble {
        transition: background .2s, border-color .2s, color .2s, transform .2s;
      }
      .msil-bubble:hover {
        background: rgba(211,172,43,0.18) !important;
        border-color: rgba(211,172,43,0.45) !important;
        color: #D3AC2B !important;
        transform: scale(1.05) !important;
      }
    `;
    document.head.appendChild(s);
  }, []);

  /* 바깥 클릭 시 드롭다운 닫기 */
  React.useEffect(() => {
    const h = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setFocused(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const doSearch = (q) => {
    const t = (q || query).trim();
    if (!t) return;
    if (window.__masilSearch?.setQuery) window.__masilSearch.setQuery(t);
    setFocused(false);
    onNavigate("buildings");
  };

  const quickCourses   = (window.COURSES   || []).slice(0, 3);
  const quickBuildings = (window.BUILDINGS || []).slice(0, 3);

  return (
    <section style={{
      position: "relative",
      height: isMobile ? "86vh" : "90vh",
      minHeight: isMobile ? 520 : 660,
      overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: `radial-gradient(ellipse 85% 65% at 50% 38%, #2B3549 0%, ${M.ink} 72%)`,
    }}>

      {/* 격자 패턴 */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: [
          "linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "54px 54px",
      }}/>

      {/* 중앙 골드 글로우 */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 50% 38% at 50% 44%, rgba(211,172,43,0.11) 0%, transparent 70%)",
      }}/>

      {/* 떠다니는 버블 (데스크탑 전용) */}
      {!isMobile && BUBBLE_DEFS.map(({ idx, anim, dur, delay, ...pos }) => (
        <div
          key={idx}
          className="msil-bubble"
          onClick={() => doSearch(FLOAT_QUERIES[idx])}
          style={{
            position: "absolute", ...pos,
            animation: `${anim} ${dur} ease-in-out infinite ${delay}`,
            padding: "9px 17px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.065)",
            border: "1px solid rgba(255,255,255,0.13)",
            backdropFilter: "blur(8px)",
            color: "rgba(244,243,234,0.68)",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            userSelect: "none",
            zIndex: 2,
          }}
        >
          {FLOAT_QUERIES[idx]}
        </div>
      ))}

      {/* 중앙 콘텐츠 */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center",
        width: "100%",
        padding: isMobile ? "0 22px" : "0 24px",
      }}>

        {/* 모노 라벨 */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11.5, fontWeight: 700, letterSpacing: "0.24em",
          color: M.olive, marginBottom: 22,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ width: 26, height: 1.5, background: M.olive, display: "inline-block", opacity: 0.8 }}/>
          MASILMAP · 마실맵
          <span style={{ width: 26, height: 1.5, background: M.olive, display: "inline-block", opacity: 0.8 }}/>
        </div>

        {/* 헤드라인 */}
        <h1 style={{
          fontFamily: "'Noto Serif KR', serif",
          fontSize: isMobile ? 40 : 68,
          fontWeight: 900,
          letterSpacing: "-0.03em",
          lineHeight: 1.08,
          color: "#fff",
          margin: "0 0 38px",
          textWrap: "balance",
          textShadow: "0 2px 28px rgba(0,0,0,0.45)",
        }}>
          오늘은 어디로<br/>
          <span style={{ color: M.olive }}>마실</span> 다녀올까요?
        </h1>

        {/* 검색바 + 드롭다운 */}
        <div ref={containerRef} style={{
          position: "relative",
          width: "100%",
          maxWidth: isMobile ? "100%" : 610,
        }}>
          {/* 입력 행 */}
          <div style={{
            display: "flex", alignItems: "center", gap: 0,
            background: focused ? "#fff" : "rgba(255,255,255,0.96)",
            border: `2.5px solid ${focused ? M.olive : "transparent"}`,
            borderRadius: focused ? "28px 28px 0 0" : 999,
            padding: "8px 8px 8px 22px",
            boxShadow: focused
              ? `0 0 0 5px rgba(211,172,43,0.13), 0 8px 48px rgba(0,0,0,0.4)`
              : "0 10px 52px rgba(0,0,0,0.48)",
            transition: "box-shadow .25s, border-color .2s, border-radius .18s",
          }}>
            <MIcon name="search" size={20} color={focused ? M.terra : M.muted}/>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={(e) => { if (e.key === "Enter") doSearch(query); }}
              placeholder="공간, 코스, 지역, 건축가 검색…"
              style={{
                flex: 1, border: "none", outline: "none",
                background: "transparent",
                fontSize: 16, fontWeight: 600,
                color: M.ink, fontFamily: "inherit",
                padding: "11px 12px",
                minWidth: 0,
              }}
            />
            {query.length > 0 && (
              <div
                onClick={() => setQuery("")}
                style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: M.beigeAlt,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0, marginRight: 8,
                }}
              >
                <span style={{ fontSize: 13, color: M.muted, fontWeight: 700, lineHeight: 1 }}>×</span>
              </div>
            )}
            <button
              onClick={() => doSearch(query)}
              style={{
                padding: isMobile ? "11px 20px" : "13px 28px",
                borderRadius: 999, border: "none", cursor: "pointer",
                background: M.terra, color: "#fff",
                fontSize: 15, fontWeight: 800,
                fontFamily: "inherit", flexShrink: 0,
                boxShadow: "0 4px 18px rgba(51,61,81,0.38)",
                transition: "background .15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = M.terraDeep}
              onMouseLeave={(e) => e.currentTarget.style.background = M.terra}
            >
              찾기
            </button>
          </div>

          {/* 드롭다운 추천 */}
          {focused && (
            <div style={{
              position: "absolute", left: 0, right: 0, top: "100%",
              background: "#fff",
              border: `2.5px solid ${M.olive}`,
              borderTop: "none",
              borderRadius: "0 0 28px 28px",
              boxShadow: "0 28px 72px rgba(0,0,0,0.28)",
              overflow: "hidden",
              zIndex: 200,
              textAlign: "left",
            }}>
              {/* 코스 추천 섹션 */}
              <div style={{ padding: "18px 20px 10px" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em",
                  color: M.terra, fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: 10,
                }}>
                  <span style={{
                    width: 3, height: 14, borderRadius: 2,
                    background: M.terra, display: "inline-block",
                  }}/>
                  COURSE · 코스 추천
                </div>
                {quickCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => { setFocused(false); onNavigate("course", c.id); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 13,
                      padding: "9px 10px", borderRadius: 14, cursor: "pointer",
                      transition: "background .15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = M.cream}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: c.cover || M.terra,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <MIcon name="walk" size={18} color="rgba(255,255,255,0.9)"/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: M.ink, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 2 }}>
                        {c.duration} · {c.difficulty}
                      </div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: M.terra, flexShrink: 0 }}>→</span>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: M.beigeAlt, margin: "2px 18px" }}/>

              {/* 건축물 추천 섹션 */}
              <div style={{ padding: "10px 20px 18px" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em",
                  color: M.olive, fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: 10, marginTop: 6,
                }}>
                  <span style={{
                    width: 3, height: 14, borderRadius: 2,
                    background: M.olive, display: "inline-block",
                  }}/>
                  SPACE · 공간 추천
                </div>
                {quickBuildings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => { setFocused(false); onNavigate("detail", b.id); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 13,
                      padding: "9px 10px", borderRadius: 14, cursor: "pointer",
                      transition: "background .15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = M.cream}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: b.palette || M.beigeAlt,
                      border: `1px solid ${M.beigeAlt}`,
                    }}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: M.ink, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                        {b.name}
                      </div>
                      <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 2 }}>
                        {b.region} · {b.architect}
                      </div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: M.olive, flexShrink: 0 }}>→</span>
                  </div>
                ))}

                {/* 전체 탐색 링크 */}
                <div style={{
                  marginTop: 12, paddingTop: 12,
                  borderTop: `1px solid ${M.beigeAlt}`,
                  display: "flex", gap: 12, justifyContent: "center",
                }}>
                  <span
                    onClick={() => { setFocused(false); onNavigate("buildings"); }}
                    style={{ fontSize: 12, fontWeight: 800, color: M.terra, cursor: "pointer" }}
                  >
                    공간 전체 보기 →
                  </span>
                  <span style={{ color: M.beigeAlt }}>|</span>
                  <span
                    onClick={() => { setFocused(false); onNavigate("course"); }}
                    style={{ fontSize: 12, fontWeight: 800, color: M.olive, cursor: "pointer" }}
                  >
                    코스 전체 보기 →
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 모바일: 가로 스크롤 제안어 칩 */}
        {isMobile && (
          <div style={{
            display: "flex", gap: 8, marginTop: 20,
            overflowX: "auto", width: "100%",
            paddingBottom: 4,
          }}>
            {FLOAT_QUERIES.slice(0, 6).map((text, i) => (
              <div
                key={i}
                onClick={() => doSearch(text)}
                style={{
                  padding: "8px 14px", borderRadius: 999, flexShrink: 0,
                  background: "rgba(255,255,255,0.09)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(244,243,234,0.75)",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background .15s, color .15s",
                }}
              >
                {text}
              </div>
            ))}
          </div>
        )}

        {/* 데스크탑 힌트 */}
        {!isMobile && (
          <p style={{
            marginTop: 26,
            fontSize: 11.5, color: "rgba(244,243,234,0.35)",
            fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.06em",
          }}>
            주변에 떠다니는 검색어를 클릭하거나 직접 입력해 보세요
          </p>
        )}
      </div>

      {/* 스크롤 유도 화살표 — 스크롤 전에만 표시 */}
      {!scrolled && (
        <div style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          animation: "mFloat2 2.5s ease-in-out infinite",
          pointerEvents: "none",
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(244,243,234,0.45)", fontFamily: "'JetBrains Mono', monospace" }}>SCROLL</span>
          <div style={{ width: 1, height: 28, background: "rgba(244,243,234,0.25)" }}/>
        </div>
      )}

      {/* 하단 페이드아웃 */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 110,
        background: `linear-gradient(transparent, ${M.ink})`,
        pointerEvents: "none",
      }}/>
    </section>
  );
}

/* ---------------------------------------------------------------
   SPOTLIGHT HOME — 검색 히어로 + 큐레이션 섹션
--------------------------------------------------------------- */
function SpotlightHome({ onNavigate }) {
  const isMobile = useIsMobile();

  return (
    <div style={{ background: M.ink, color: M.cream }}>
      <SearchCenterHero onNavigate={onNavigate} isMobile={isMobile}/>
      <MasilRecommender onNavigate={onNavigate} isMobile={isMobile}/>
      <SpotlightResume onNavigate={onNavigate} isMobile={isMobile}/>
      <SpotlightMapBand onNavigate={onNavigate} isMobile={isMobile}/>
      <SpotlightNeighborhood onNavigate={onNavigate} isMobile={isMobile}/>
      <SpotlightCollections onNavigate={onNavigate} isMobile={isMobile}/>
    </div>
  );
}

/* ───────────────────────────────────────────────
   이번엔 어디로 마실 갈까요? — 상황/기분 기반 추천
   가입·로그인 없이도 작동. 그날 기분과 상황만 고르면 코스를 추천.
─────────────────────────────────────────────── */
function MasilRecommender({ onNavigate, isMobile }) {
  const [mood, setMood] = React.useState(null);
  const sh = useMasilShared();
  const matches = mood
    ? MX_COURSES.filter((c) => (c.moods || []).includes(mood))
    : [];
  const moodLabel = mood ? (mxMood(mood) || {}).label : "";

  const surprise = () => {
    const pool = MX_COURSES;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const m = (pick.moods || [])[0] || (MX_MOODS[0] || {}).id;
    setMood(m);
  };

  return (
    <section style={{ background: M.beige, color: M.ink, padding: isMobile ? "40px 20px" : "72px 56px", borderTop: `1px solid ${M.cream}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <MIcon name="sparkle" size={18} color={M.olive}/>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: M.olive }}>FOR YOU · 오늘의 마실</span>
        </div>
        <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 30 : 52, fontWeight: 900, letterSpacing: "-0.035em", margin: 0, color: M.ink, lineHeight: 1.05, textWrap: "balance" }}>
          이번엔 어디로 <span style={{ color: M.olive }}>마실</span> 갈까요?
        </h2>
        <p style={{ fontSize: isMobile ? 14.5 : 17, color: M.muted, fontWeight: 500, margin: "12px 0 0", maxWidth: 560, textWrap: "pretty" }}>
          취향을 미리 정할 필요 없어요. 그날 기분과 상황만 고르면, 걷기 좋은 코스를 바로 추천해 드려요.
        </p>

        {/* 상황 칩 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 26 }}>
          {MX_MOODS.map((m) => {
            const on = m.id === mood;
            return (
              <button key={m.id} onClick={() => setMood(on ? null : m.id)} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: isMobile ? "11px 16px" : "13px 20px", borderRadius: 999, cursor: "pointer",
                fontSize: isMobile ? 14 : 15, fontWeight: 800, fontFamily: "inherit",
                background: on ? M.terra : M.cream,
                color: on ? "#fff" : M.ink,
                border: `1.5px solid ${on ? M.terra : M.beigeAlt}`,
                transition: "all .15s",
              }}>
                <MIcon name={m.icon} size={16} color={on ? "#fff" : M.olive}/>
                {m.label}
              </button>
            );
          })}
          <button onClick={surprise} style={{
            padding: isMobile ? "11px 16px" : "13px 20px", borderRadius: 999, cursor: "pointer",
            fontSize: isMobile ? 14 : 15, fontWeight: 800, fontFamily: "inherit",
            background: "transparent", color: M.terra, border: `1.5px dashed ${M.terra}`,
          }}>🎲 아무거나 골라줘</button>
        </div>

        {/* 결과 */}
        {mood && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: isMobile ? 17 : 20, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>"{moodLabel}" 마실, 이런 코스 어때요?</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: M.muted }}>{matches.length}곳</span>
            </div>
            {matches.length === 0 ? (
              <div style={{ padding: "28px 16px", borderRadius: MR.cardLg, background: M.cream, border: `1px dashed ${M.beigeAlt}`, fontSize: 14, color: M.muted, fontWeight: 600, textAlign: "center" }}>
                이 상황에 맞는 코스를 준비 중이에요. 다른 상황도 골라보세요.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 18 }}>
                {matches.slice(0, 3).map((c) => {
                  const ch = mxChannel(c.channelId);
                  return (
                    <div key={c.id} onClick={() => onNavigate("walkcourse", c.id)} style={{ cursor: "pointer", background: M.cream, borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.card, border: `1px solid ${M.beigeAlt}` }}>
                      <div style={{ height: 150, background: c.cover, position: "relative", display: "flex", alignItems: "flex-end", padding: 16 }}>
                        <span style={{ position: "absolute", top: 12, left: 12, padding: "4px 9px", borderRadius: 999, background: c.official ? M.terra : "rgba(255,255,255,0.92)", color: c.official ? "#fff" : M.muted, fontSize: 10, fontWeight: 800 }}>{c.official ? "공식" : "유저 코스"}</span>
                        <span style={{ color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700 }}>{c.distance} · {c.duration}</span>
                      </div>
                      <div style={{ padding: 18 }}>
                        <div style={{ fontSize: 19, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", lineHeight: 1.25 }}>{c.title}</div>
                        <p style={{ fontSize: 13, color: M.muted, lineHeight: 1.55, margin: "8px 0 12px", fontWeight: 500, textWrap: "pretty" }}>{c.summary}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, borderTop: `1px solid ${M.beigeAlt}` }}>
                          <span style={{ width: 24, height: 24, borderRadius: "50%", background: ch.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>{ch.name[0]}</span>
                          <span style={{ fontSize: 12.5, fontWeight: 800, color: M.ink }}>{ch.name}</span>
                          <span style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 800, color: M.terra }}>코스 보기 →</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* 이어 걷기 — 로그인 시에만. 걷던 코스 + 추천 다음 코스 + 정복 임박 배지 */
function SpotlightResume({ onNavigate, isMobile }) {
  const auth = window.__masilAuth || { isLoggedIn: false };
  const sh = useMasilShared();
  if (!auth.isLoggedIn) return null;

  const curCh = mxChannel(sh.s.currentChannelId);
  const inProgress = MX_COURSES
    .filter((c) => sh.myCoursesSet.has(c.id))
    .map((c) => ({ c, pr: mxCourseProgress(c, sh.done) }))
    .filter((x) => !x.pr.complete && x.pr.done > 0)
    .sort((a, b) => b.pr.pct - a.pr.pct);
  const resume = inProgress[0];
  const nearBadge = MX_BADGES
    .map((b) => ({ b, bp: mxBadgeProgress(b, sh.done) }))
    .filter((x) => !x.bp.got && x.bp.tot - x.bp.done === 1)[0];

  return (
    <section style={{ background: M.terraDeep, color: M.cream, padding: isMobile ? "28px 20px" : "40px 56px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", background: curCh.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff" }}>{curCh.name[0]}</span>
        <span style={{ fontSize: isMobile ? 16 : 19, fontWeight: 800, letterSpacing: "-0.01em" }}>{curCh.name}님, 이어서 걸어요</span>
        <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: M.olive }}>FOR YOU</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : (resume && nearBadge ? "1.4fr 1fr" : "1fr"), gap: 16 }}>
        {resume ? (
          <div onClick={() => onNavigate("walkcourse", resume.c.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: isMobile ? 14 : 20, background: "rgba(255,248,236,0.08)", border: "1px solid rgba(255,248,236,0.18)", borderRadius: MR.cardLg, padding: isMobile ? 16 : 20 }}>
            <div style={{ width: isMobile ? 60 : 76, height: isMobile ? 60 : 76, borderRadius: 16, background: resume.c.cover, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff" }}>
              <span style={{ fontSize: isMobile ? 17 : 21, fontWeight: 900, whiteSpace: "nowrap", lineHeight: 1 }}>{resume.pr.done}/{resume.pr.tot}</span>
              <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.85, marginTop: 3 }}>방문</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: M.olive, letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace" }}>이어 걷기 · {resume.pr.pct}%</div>
              <div style={{ fontSize: isMobile ? 19 : 23, fontWeight: 900, letterSpacing: "-0.02em", color: "#fff", marginTop: 4, lineHeight: 1.2 }}>{resume.c.title}</div>
              <div style={{ marginTop: 12, height: 8, borderRadius: 999, background: "rgba(255,248,236,0.2)", overflow: "hidden" }}>
                <div style={{ width: `${resume.pr.pct}%`, height: "100%", borderRadius: 999, background: M.olive }}/>
              </div>
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: M.olive, flexShrink: 0 }}>→</span>
          </div>
        ) : (
          <div onClick={() => onNavigate("home", null, { homeLayout: "mapPrimary" })} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 16, background: "rgba(255,248,236,0.08)", border: "1px solid rgba(255,248,236,0.18)", borderRadius: MR.cardLg, padding: isMobile ? 16 : 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: M.olive, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MIcon name="walk" size={26} color={M.terraDeep}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: isMobile ? 18 : 21, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>첫 코스를 시작해 보세요</div>
              <div style={{ fontSize: 13.5, color: "rgba(244,243,234,0.75)", fontWeight: 500, marginTop: 4 }}>마실 앱에서 동네 코스를 따라 걸으면 여기서 이어집니다.</div>
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: M.olive }}>→</span>
          </div>
        )}

        {nearBadge && (
          <div onClick={() => onNavigate("mypage")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 16, background: "rgba(255,248,236,0.08)", border: `1px solid ${M.olive}55`, borderRadius: MR.cardLg, padding: isMobile ? 16 : 20 }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(211,172,43,0.18)", border: `2px solid ${M.olive}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MIcon name="sparkle" size={24} color={M.olive}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: M.olive, letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace" }}>정복 임박 · 1코스 남음</div>
              <div style={{ fontSize: isMobile ? 17 : 19, fontWeight: 900, color: "#fff", marginTop: 4, letterSpacing: "-0.02em" }}>{nearBadge.b.name}</div>
              <div style={{ fontSize: 12.5, color: "rgba(244,243,234,0.7)", fontWeight: 500, marginTop: 2 }}>{nearBadge.b.desc}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* 동네 추천 코스 밴드 — 채널이 만든 산책 코스 (마실 앱 데이터) */
function SpotlightNeighborhood({ onNavigate, isMobile }) {
  const sh = useMasilShared();
  const hood = mxHood(sh.s.hood);
  const courses = mxCoursesByHood(sh.s.hood).slice(0, 3);
  return (
    <section style={{ background: M.beige, color: M.ink, padding: isMobile ? "40px 20px" : "72px 56px", borderTop: `1px solid ${M.cream}` }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <MIcon name="location" size={18} color={M.olive}/>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: M.olive }}>THIS WEEK · 이 동네</span>
          </div>
          <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 28 : 44, fontWeight: 900, letterSpacing: "-0.03em", margin: 0, color: M.ink }}>
            {hood.name}, 오늘 걷기 좋아요
          </h2>
          <div style={{ fontSize: isMobile ? 14 : 16, color: M.muted, fontWeight: 500, marginTop: 8 }}>{hood.sub} · 채널이 만든 산책 코스 {mxCoursesByHood(sh.s.hood).length}</div>
        </div>
        <a href="Masil App.html" style={{ fontSize: 13, fontWeight: 800, color: M.terra, textDecoration: "none", whiteSpace: "nowrap" }}>마실 앱에서 더 보기 →</a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
        {courses.map((c) => {
          const ch = mxChannel(c.channelId);
          const pr = mxCourseProgress(c, sh.done);
          const following = sh.myCoursesSet.has(c.id);
          return (
            <div key={c.id} onClick={() => onNavigate("walkcourse", c.id)} style={{ cursor: "pointer", background: M.cream, borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.card, border: `1px solid ${M.beigeAlt}`, display: "block" }}>
              <div style={{ height: 150, background: c.cover, position: "relative", display: "flex", alignItems: "flex-end", padding: 16 }}>
                <span style={{ position: "absolute", top: 12, left: 12, padding: "4px 9px", borderRadius: 999, background: c.official ? M.terra : "rgba(255,255,255,0.9)", color: c.official ? "#fff" : M.muted, fontSize: 10, fontWeight: 800, whiteSpace: "nowrap" }}>{c.official ? "공식" : "유저 코스"}</span>
                {following && <span style={{ position: "absolute", top: 12, right: 12, padding: "4px 9px", borderRadius: 999, background: M.olive, color: M.terraDeep, fontSize: 10, fontWeight: 900 }}>{pr.complete ? "완주 ★" : `${pr.done}/${pr.tot}`}</span>}
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", lineHeight: 1.25 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: M.muted, fontWeight: 600, margin: "8px 0 0" }}>{c.distance} · {c.duration} · 지점 {c.stops.length}곳</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${M.beigeAlt}` }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: ch.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>{ch.name[0]}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: M.ink }}>{ch.name}</span>
                  {ch.official && <MIcon name="sparkle" size={11} color={M.olive}/>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* 지도 밴드 — 마실맵의 핵심 정체성: 지도 위에 펼쳐진 건축 (라이트 톤) */
function SpotlightMapBand({ onNavigate, isMobile }) {
  const Map = window.MasilMap;
  const toMap = () => onNavigate("home", null, { homeLayout: "mapPrimary" });
  const stats = [["526", "공간"], ["47", "코스"], ["18", "컬렉션"]];
  return (
    <section style={{ background: M.beige, color: M.ink, padding: isMobile ? "44px 20px" : "80px 56px", borderTop: `1px solid ${M.beigeAlt}` }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.9fr 1.1fr", gap: isMobile ? 28 : 56, alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ width: 30, height: 2, background: M.olive }}/>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: M.olive }}>EXPLORE THE MAP · 지도</span>
          </div>
          <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 30 : 52, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.08, margin: 0, color: M.ink, textWrap: "balance" }}>
            지도 위에 펼쳐진<br/>한국의 모든 공간
          </h2>
          <p style={{ fontSize: isMobile ? 15 : 17, color: M.muted, fontWeight: 500, lineHeight: 1.7, margin: "20px 0 0", maxWidth: 440, textWrap: "pretty" }}>
            천 년 된 목조 건축부터 어제 완공된 미술관까지 — 전국 526곳을 지도 한 장에 펼쳐 두었습니다. 가까운 동네부터 천천히 걸어보세요.
          </p>
          <div style={{ display: "flex", gap: isMobile ? 24 : 40, margin: "28px 0 30px" }}>
            {stats.map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: isMobile ? 32 : 44, fontWeight: 900, letterSpacing: "-0.04em", color: M.terra, lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", color: M.muted, marginTop: 7 }}>{l}</div>
              </div>
            ))}
          </div>
          <MButton kind="primary" size="lg" onClick={toMap} icon={<MIcon name="map" size={17} color={M.cream}/>}>
            지도에서 둘러보기 →
          </MButton>
        </div>
        <div onClick={toMap} style={{ position: "relative", height: isMobile ? 320 : 460, borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.cardLg, border: `1px solid ${M.beigeAlt}`, cursor: "pointer" }}>
          {Map ? <Map buildings={window.BUILDINGS || []} selectedId={null} onSelect={toMap} compact/> : null}
        </div>
      </div>
    </section>
  );
}

/* 시리즈 정복 띠 */
function SpotlightCollections({ onNavigate, isMobile }) {
  const cols = (window.SERIES || []).slice(0, 3);
  const sc = window.seriesCourses || (() => []);
  return (
    <section style={{ background: M.cream, color: M.ink, padding: isMobile ? "40px 20px" : "64px 56px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
        <h2 style={{ fontSize: isMobile ? 26 : 38, fontWeight: 900, letterSpacing: "-0.03em", margin: 0, color: M.ink }}>시리즈 정복</h2>
        <span onClick={() => onNavigate("collection")} style={{ fontSize: 13, fontWeight: 800, color: M.terra, cursor: "pointer" }}>전체 보기 →</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
        {cols.map((c) => (
          <div key={c.id} onClick={() => onNavigate("collection", c.id)} style={{ cursor: "pointer" }}>
            <div style={{ aspectRatio: "4/3", borderRadius: MR.cardLg, background: c.cover, position: "relative", overflow: "hidden", boxShadow: MS.card }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,18,28,0.6), transparent 55%)" }}/>
              <div style={{ position: "absolute", top: 14, right: 14, padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.4)", fontSize: 10.5, fontWeight: 800, color: "#fff" }}>{c.kind}</div>
              <div style={{ position: "absolute", left: 16, bottom: 14, right: 16 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.8)" }}>{c.no} · {sc(c).length} 코스</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginTop: 3 }}>{c.title}</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: M.muted, fontWeight: 500, lineHeight: 1.55, marginTop: 12, textWrap: "pretty" }}>{c.intro}</p>
          </div>
        ))}
      </div>

      {/* 공간 제보 CTA */}
      <div style={{
        marginTop: 36, padding: isMobile ? "20px" : "24px 28px",
        borderRadius: MR.cardLg, background: M.cream,
        border: `1.5px dashed ${M.beigeAlt}`,
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: M.ink, letterSpacing: "-0.01em", marginBottom: 4 }}>
            걷기 좋은 공간을 발견하셨나요?
          </div>
          <div style={{ fontSize: 13, color: M.muted, fontWeight: 600 }}>
            지도에 없는 공간을 제보해 주시면 마실맵 팀이 검토 후 등록합니다.
          </div>
        </div>
        <MButton kind="outline" size="md" onClick={() => onNavigate("upload-quick")}>
          📍 공간 제보하기
        </MButton>
      </div>
    </section>
  );
}

Object.assign(window, { mkFeatured, palToneStyle, SearchCenterHero, SpotlightHome, MasilRecommender, SpotlightResume, SpotlightMapBand, SpotlightNeighborhood, SpotlightCollections });
