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
  // route 바뀌면 자동으로 drawer 닫기
  React.useEffect(() => { setDrawerOpen(false); }, [route]);

  // 로그인 상태에 따라 메뉴 구성. 명시적 items 인자가 오면 그걸 우선.
  const navItems = items || ["홈", "지도", "건축물", "코스", "시리즈"];

  const handleClick = (label) => {
    switch (label) {
      case "홈":       return onNavigate("home", null, { homeLayout: "spotlight" });
      case "지도":     return onNavigate("home", null, { homeLayout: "mapPrimary" });
      case "건축물":   return onNavigate("buildings");
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
    if (route === "buildings")   return "건축물";
    if (route === "detail")      return "건축물";
    if (route === "home") {
      if (t.homeLayout === "mapPrimary") return "지도";
      return "홈";
    }    if (route === "course")      return "코스";
    if (route === "collection")  return "시리즈";
    if (route === "mypage")      return "내 마실";
    if (route === "feed")        return "피드";
    if (route === "booking")     return "코스";
    return "홈";
  })();

  // === MOBILE NAV ===
  if (isMobile) {
    const search = window.__masilSearch || { query: "", setQuery: () => {} };
    return (
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
                  placeholder="건축물, 지역, 건축가…"
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
    );
  }

  // === DESKTOP NAV ===
  return (
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
            placeholder="건축물, 지역, 건축가…"
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
function ImgPlaceholder({ caption, ratio = "4/3", tone = "beige", style = {} }) {
  /* Scholar palette tones — neutral cream, navy, gold */
  const tones = {
    beige:  { bg: "#E8E4DC", stripe: "#D4D0C5", text: "#5A5F70" },  /* neutral cream */
    cream:  { bg: "#F4F3EA", stripe: "#DCD9CA", text: "#5A5F70" },  /* warm cream */
    terra:  { bg: "#8A95A8", stripe: "#6B7484", text: "#FFFFFF" },  /* navy gradient */
    olive:  { bg: "#E8D080", stripe: "#D3AC2B", text: "#3A3220" },  /* gold gradient */
    deep:   { bg: "#1F2738", stripe: "#333D51", text: "#F4F3EA" },  /* deep navy */
    night:  { bg: "#0F1622", stripe: "#1F2738", text: "#D3AC2B" },  /* black + gold */
  };
  const t = tones[tone] || tones.beige;
  return (
    <div style={{
      aspectRatio: ratio,
      background: `repeating-linear-gradient(45deg, ${t.bg} 0px, ${t.bg} 14px, ${t.stripe} 14px, ${t.stripe} 28px)`,
      borderRadius: MR.inner,
      position: "relative",
      overflow: "hidden",
      ...style,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end", padding: 16,
        background: "linear-gradient(to top, rgba(0,0,0,0.18), transparent 50%)",
      }}>
        {caption && (
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: t.text,
            background: "rgba(255,248,236,0.85)",
            padding: "4px 8px",
            borderRadius: 6,
            alignSelf: "flex-start",
          }}>📷 {caption}</span>
        )}
      </div>
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
});
