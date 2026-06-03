/* ================================================================
   masilmap — shared components (magazine layer on top of brand)
   브랜드 시스템(M, MT, MR, ...)을 베이스로, 매거진 톤에 필요한
   추가 컴포넌트(플레이스홀더, 헤어라인, 메타라인, 캡 등)를 정의.
   ================================================================ */

/* router-aware nav (replaces brand's MTopNav for prototype use).
   Keeps the same visual language but accepts onNavigate.
   Reads window.__masilT for current layout tweaks so "지도" highlights
   when home is in mapPrimary mode.
   Reads window.__masilAuth for login state — "내 마실" is hidden
   when logged out. */
function MasilNav({ route, onNavigate, items, variant = "default" }) {
  const t = window.__masilT || {};
  const auth = window.__masilAuth || { isLoggedIn: false, login: () => {}, logout: () => {} };
  const isMobile = window.useIsMobile ? window.useIsMobile() : false;
  const isTablet = window.useIsTablet ? window.useIsTablet() : false;
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  // route 바뀌면 자동으로 drawer 닫기
  React.useEffect(() => { setDrawerOpen(false); }, [route]);
  // 로그인 모달 전역 이벤트 수신
  React.useEffect(() => {
    const h = () => setShowLoginModal(true);
    window.addEventListener("masil-need-login", h);
    return () => window.removeEventListener("masil-need-login", h);
  }, []);

  // 로그인 상태에 따라 메뉴 구성. 명시적 items 인자가 오면 그걸 우선.
  const navItems = items || ["홈", "지도", "공간", "코스", "컬렉션"];

  const handleClick = (label) => {
    switch (label) {
      case "홈":       return onNavigate("home", null, { homeLayout: "spotlight" });
      case "지도":     return onNavigate("home", null, { homeLayout: "mapPrimary" });
      case "공간":      return onNavigate("buildings");
      case "코스":     return onNavigate("course");
      case "시리즈":
      case "컬렉션":
      case "저널":     return onNavigate("collection");
      case "내 마실":  return onNavigate("mypage");
      case "피드":     return onNavigate("feed");
      default:         return onNavigate("home");
    }
  };

  const activeLabel = (() => {
    if (route === "buildings")   return "공간";
    if (route === "detail")      return "공간";
    if (route === "home") {
      if (t.homeLayout === "mapPrimary") return "지도";
      return "홈";
    }    if (route === "course")      return "코스";
    if (route === "collection")  return "컬렉션";
    if (route === "mypage")      return "내 마실";
    if (route === "feed")        return "피드";
    if (route === "booking")     return "코스";
    return "홈";
  })();

  // === MOBILE NAV ===
  if (isMobile) {
    const search = window.__masilSearch || { query: "", setQuery: () => {} };
    return (
      <>
      {showLoginModal && <LoginPromptModal onNavigate={onNavigate} onClose={() => setShowLoginModal(false)}/>}
      <header style={{
        padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: variant === "bare" ? "none" : `1px solid ${M.beigeAlt}`,
        background: M.beige,
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div onClick={() => onNavigate("home", null, { homeLayout: "spotlight" })} style={{ cursor: "pointer" }}>
          <MasilmapLogo size={22}/>
        </div>
        <button onClick={() => setDrawerOpen((o) => !o)} style={{
          width: 40, height: 40, borderRadius: 10,
          background: drawerOpen ? `${M.terra}14` : "transparent",
          border: `1px solid ${M.beigeAlt}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", padding: 0,
        }} aria-label="메뉴">
          <span style={{ fontSize: 20, color: M.ink, lineHeight: 1 }}>
            {drawerOpen ? "×" : "☰"}
          </span>
        </button>

        {drawerOpen && (
          <div style={{
            position: "fixed", top: 68, left: 0, right: 0, bottom: 0,
            background: "rgba(31,39,56,0.4)", zIndex: 60,
          }} onClick={() => setDrawerOpen(false)}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: M.beige,
              padding: "20px 20px 32px",
              borderBottom: `1px solid ${M.beigeAlt}`,
              boxShadow: MS.cardLg,
              maxHeight: "calc(100vh - 68px)",
              overflowY: "auto",
            }}>
              {/* 검색 */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: M.cream, padding: "12px 16px", borderRadius: 999,
                boxShadow: MS.cardSm, marginBottom: 20,
              }}>
                <MIcon name="search" size={16} color={M.muted}/>
                <input
                  placeholder="공간, 지역, 건축가…"
                  value={search.query || ""}
                  onChange={(e) => {
                    search.setQuery(e.target.value);
                    if (e.target.value && route !== "home" && route !== "buildings" && route !== "detail") {
                      onNavigate("buildings");
                      setDrawerOpen(false);
                    }
                  }}
                  style={{
                    border: "none", outline: "none", background: "transparent",
                    fontSize: 14, fontWeight: 600, color: M.ink, fontFamily: "inherit",
                    flex: 1, minWidth: 0,
                  }}/>
              </div>

              {/* 메뉴 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
                {navItems.map((it) => {
                  const on = it === activeLabel;
                  return (
                    <div key={it} onClick={() => handleClick(it)} style={{
                      padding: "14px 16px", borderRadius: 12,
                      fontSize: 15, fontWeight: 700,
                      color: on ? M.terra : M.ink,
                      background: on ? `${M.terra}14` : "transparent",
                      cursor: "pointer",
                    }}>{it}</div>
                  );
                })}
              </div>

              {/* 인증 */}
              <div style={{
                paddingTop: 16, borderTop: `1px solid ${M.beigeAlt}`,
                display: "flex", gap: 10,
              }}>
                <div onClick={auth.isLoggedIn ? auth.logout : () => onNavigate("login")} style={{
                  flex: 1, padding: "12px 16px", borderRadius: 999,
                  border: `1px solid ${M.beigeAlt}`,
                  fontSize: 13, fontWeight: 700, color: M.ink,
                  textAlign: "center", cursor: "pointer",
                }}>{auth.isLoggedIn ? "로그아웃" : "로그인"}</div>
                {auth.isLoggedIn ? (
                  <MButton kind="primary" size="md" onClick={() => onNavigate("mypage")} style={{ flex: 1, justifyContent: "center" }}>내 마실 →</MButton>
                ) : (
                  <MButton kind="primary" size="md" onClick={() => onNavigate("intro")} style={{ flex: 1, justifyContent: "center", background: M.olive, color: M.terraDeep }}>마실 시작하기</MButton>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      </>
    );
  }

  // === DESKTOP NAV ===
  return (
    <>
    {showLoginModal && <LoginPromptModal onNavigate={onNavigate} onClose={() => setShowLoginModal(false)}/>}
    <header style={{
      padding: "22px 56px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: variant === "bare" ? "none" : `1px solid ${M.beigeAlt}`,
      background: variant === "transparent" ? "transparent" : M.beige,
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(6px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, minWidth: 0 }}>
        <div onClick={() => onNavigate("home", null, { homeLayout: "spotlight" })} style={{ cursor: "pointer", flexShrink: 0 }}>
          <MasilmapLogo size={26} />
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {navItems.map((it) => {
            const on = it === activeLabel;
            return (
              <span
                key={it}
                onClick={() => handleClick(it)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontSize: 13, fontWeight: 700,
                  color: on ? M.terra : M.ink,
                  background: on ? `${M.terra}14` : "transparent",
                  cursor: "pointer",
                  letterSpacing: "-0.005em",
                  transition: "background .15s",
                  whiteSpace: "nowrap",
                }}>{it}</span>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        {!isTablet && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: M.cream, padding: "10px 16px", borderRadius: 999, boxShadow: MS.cardSm, flex: "0 1 200px", minWidth: 140 }}>
          <MIcon name="search" size={16} color={M.muted} />
          <input
            placeholder="공간, 지역, 건축가…"
            value={(window.__masilSearch && window.__masilSearch.query) || ""}
            onChange={(e) => {
              const s = window.__masilSearch;
              if (s && s.setQuery) s.setQuery(e.target.value);
              // 검색 시작하면 홈/지도 또는 건축물 화면으로 자동 이동
              if (e.target.value && route !== "home" && route !== "buildings" && route !== "detail") {
                onNavigate("buildings");
              }
            }}
            style={{
              border: "none", outline: "none", background: "transparent",
              fontSize: 13, fontWeight: 600, color: M.ink, fontFamily: "inherit",
              flex: 1, minWidth: 0,
            }}/>
          {(window.__masilSearch && window.__masilSearch.query) && (
            <span onClick={() => window.__masilSearch.setQuery("")} style={{
              cursor: "pointer", color: M.muted, fontSize: 14, fontWeight: 700,
              padding: "0 4px",
            }}>×</span>
          )}
        </div>
        )}
        <span
          onClick={auth.isLoggedIn ? auth.logout : () => onNavigate("login")}
          style={{ fontSize: 13, color: M.ink, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
          {auth.isLoggedIn ? "로그아웃" : "로그인"}
        </span>
        {auth.isLoggedIn ? (
          <>
            <MButton kind="primary" size="md" onClick={() => onNavigate("feed")} style={{ background: M.olive, color: M.terraDeep }}>피드</MButton>
            <MButton kind="primary" size="md" onClick={() => onNavigate("mypage")}>내 마실 →</MButton>
          </>
        ) : (
          <MButton kind="primary" size="md" onClick={() => onNavigate("intro")} style={{ background: M.olive, color: M.terraDeep }}>마실 시작하기</MButton>
        )}
      </div>
    </header>
    </>
  );
}

/* magazine-style category cap — uppercase tracked label */
function MagCap({ children, color, style = {} }) {
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11, fontWeight: 600,
      letterSpacing: "0.14em", textTransform: "uppercase",
      color: color || M.muted,
      whiteSpace: "nowrap",
      ...style,
    }}>{children}</div>
  );
}

/* hairline divider with optional label sitting on top */
function Hairline({ label, color = M.beigeAlt, style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, ...style }}>
      <div style={{ flex: 1, height: 1, background: color }} />
      {label && (
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, fontWeight: 600,
          letterSpacing: "0.16em", textTransform: "uppercase",
          color: M.muted,
        }}>{label}</span>
      )}
      {label && <div style={{ flex: 1, height: 1, background: color }} />}
    </div>
  );
}

/* striped image placeholder w/ caption + ratio */
function ImgPlaceholder({ caption, ratio = "4/3", tone = "beige", style = {}, src }) {
  const palettes = {
    beige: { from: "#D6CEBD", to: "#BDB39E", text: "#7A6F60" },
    cream: { from: "#E4DECE", to: "#CEC5B0", text: "#7A6F60" },
    terra: { from: "#4A5870", to: "#333D51", text: "#A8B4C8" },
    olive: { from: "#C8A420", to: "#9C7E1A", text: "#FFF8EC" },
    deep:  { from: "#2B3549", to: "#1F2738", text: "#8899B2" },
    night: { from: "#1C2840", to: "#0F1522", text: "#D3AC2B" },
  };
  const p = palettes[tone] || palettes.beige;
  const [imgErr, setImgErr] = React.useState(false);

  /* src가 직접 지정된 경우 실제 이미지 사용 */
  if (src && !imgErr) {
    return (
      <div style={{ aspectRatio: ratio, position: "relative", overflow: "hidden", borderRadius: MR.inner, ...style }}>
        <img src={src} alt={caption || ""} onError={() => setImgErr(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}/>
        {caption && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.45))", padding: "20px 12px 10px" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff",
              background: "rgba(0,0,0,0.32)", padding: "3px 7px", borderRadius: 5 }}>{caption}</span>
          </div>
        )}
      </div>
    );
  }

  /* 팔레트 컬러 기반 아트 카드 (외부 이미지 없음 — 일관성·빠른 로딩) */
  return (
    <div style={{
      aspectRatio: ratio,
      background: `linear-gradient(145deg, ${p.from} 0%, ${p.to} 100%)`,
      borderRadius: MR.inner,
      position: "relative",
      overflow: "hidden",
      ...style,
    }}>
      {/* 격자 텍스처 */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: [
          "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "28px 28px",
      }}/>
      {/* 중앙 원형 장식 */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "38%", paddingBottom: "38%",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}/>
      {/* 캡션 */}
      {caption && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.28))",
          padding: "20px 12px 10px",
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9.5, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: p.text, opacity: 0.85,
          }}>{caption}</span>
        </div>
      )}
    </div>
  );
}

/* metadata row — label · value · label · value with bullets */
function MetaRow({ items, style = {} }) {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: "4px 14px", alignItems: "baseline",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11, fontWeight: 500,
      letterSpacing: "0.05em",
      color: M.muted,
      ...style,
    }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <span>
            <span style={{ opacity: 0.7 }}>{it.label}</span>
            <span style={{ marginLeft: 6, color: M.ink, fontWeight: 700 }}>{it.value}</span>
          </span>
          {i < items.length - 1 && <span style={{ color: M.faint }}>·</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

/* big serial number (#001) used as a magazine anchor */
function Serial({ children, size = 13, color }) {
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: size, fontWeight: 600,
      letterSpacing: "0.05em",
      color: color || M.muted,
    }}>{children}</span>
  );
}

/* ================================================================
   찜(북마크) 상태 — localStorage 영속 + 전역 동기화.
   로그인 필요 시 masil-need-login 이벤트를 통해 모달 표시.
   ================================================================ */
const MASIL_SAVED_KEY = "masil_saved_v1";
function masilLoadSaved() {
  try {
    const raw = localStorage.getItem(MASIL_SAVED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) { return new Set(); }
}
function masilPersistSaved(set) {
  try { localStorage.setItem(MASIL_SAVED_KEY, JSON.stringify([...set])); } catch (e) {}
}
function useBookmarks() {
  const [savedIds, setSavedIds] = React.useState(masilLoadSaved);
  React.useEffect(() => {
    const h = () => setSavedIds(masilLoadSaved());
    window.addEventListener("masil-saved-change", h);
    return () => window.removeEventListener("masil-saved-change", h);
  }, []);
  const toggle = (id, { requireLogin = true } = {}) => {
    const auth = window.__masilAuth || { isLoggedIn: false };
    if (requireLogin && !auth.isLoggedIn) {
      window.dispatchEvent(new CustomEvent("masil-need-login"));
      return;
    }
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      masilPersistSaved(next);
      window.dispatchEvent(new Event("masil-saved-change"));
      return next;
    });
  };
  const has = (id) => savedIds.has(id);
  return { savedIds, toggle, has };
}

/* 로그인 유도 모달 */
function LoginPromptModal({ onNavigate, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(31,39,56,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: M.beige, borderRadius: 24, padding: "36px 32px",
        maxWidth: 380, width: "100%", textAlign: "center",
        boxShadow: "0 24px 64px rgba(31,39,56,0.22)",
        animation: "slideUp .2s ease-out",
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔖</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", marginBottom: 8 }}>
          로그인이 필요해요
        </div>
        <p style={{ fontSize: 14, color: M.muted, fontWeight: 600, lineHeight: 1.6, margin: "0 0 24px" }}>
          찜한 공간은 로그인 후 어디서든 확인할 수 있어요.<br/>
          간편하게 소셜 로그인으로 시작해보세요.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <MButton kind="primary" size="lg" onClick={() => { onClose(); onNavigate("login"); }}>
            로그인 / 회원가입
          </MButton>
          <div onClick={onClose} style={{
            fontSize: 13, fontWeight: 700, color: M.muted, cursor: "pointer", padding: "8px 0",
          }}>나중에 하기</div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   코스 완주(정복) 상태 — localStorage 영속 + 컴포넌트 간 동기화.
   시리즈 진행률·도장·뱃지가 모두 이 상태를 읽는다.
   ================================================================ */
const MASIL_DONE_KEY = "masil_done_courses_v1";
function masilLoadDone() {
  try {
    const raw = localStorage.getItem(MASIL_DONE_KEY);
    if (raw == null) return new Set(["jongmyo", "ddp-night"]); // 데모 시드: 첫 방문에 살아있어 보이도록
    return new Set(JSON.parse(raw));
  } catch (e) { return new Set(); }
}
function masilSaveDone(set) {
  try { localStorage.setItem(MASIL_DONE_KEY, JSON.stringify([...set])); } catch (e) {}
}
function useDoneCourses() {
  const [done, setDone] = React.useState(masilLoadDone);
  React.useEffect(() => {
    const h = () => setDone(masilLoadDone());
    window.addEventListener("masil-done-change", h);
    return () => window.removeEventListener("masil-done-change", h);
  }, []);
  const toggle = (id) => setDone((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    masilSaveDone(next);
    window.dispatchEvent(new Event("masil-done-change"));
    return next;
  });
  const setOne = (id, val) => setDone((prev) => {
    const next = new Set(prev);
    val ? next.add(id) : next.delete(id);
    masilSaveDone(next);
    window.dispatchEvent(new Event("masil-done-change"));
    return next;
  });
  return { done, toggle, setOne };
}

Object.assign(window, {
  MasilNav, MagCap, Hairline, ImgPlaceholder, MetaRow, Serial,
  useDoneCourses, masilLoadDone,
  useBookmarks, masilLoadSaved, LoginPromptModal,
});
