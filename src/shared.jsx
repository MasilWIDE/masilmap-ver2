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

  // 로그인 상태에 따라 메뉴 구성. 명시적 items 인자가 오면 그걸 우선.
  const navItems = items || (auth.isLoggedIn
    ? ["홈", "지도", "건축물", "코스", "컬렉션", "내 마실"]
    : ["홈", "지도", "건축물", "코스", "컬렉션"]);

  const handleClick = (label) => {
    switch (label) {
      case "홈":       return onNavigate("home", null, { homeLayout: "split" });
      case "지도":     return onNavigate("home", null, { homeLayout: "mapPrimary" });
      case "건축물":   return onNavigate("buildings");
      case "코스":     return onNavigate("course");
      case "컬렉션":
      case "저널":     return onNavigate("collection");
      case "내 마실":  return onNavigate("mypage");
      default:         return onNavigate("home");
    }
  };

  const activeLabel = (() => {
    if (route === "buildings")   return "건축물";
    if (route === "detail")      return "건축물";
    if (route === "home")        return t.homeLayout === "mapPrimary" ? "지도" : "홈";
    if (route === "course")      return "코스";
    if (route === "collection")  return "컬렉션";
    if (route === "mypage")      return "내 마실";
    if (route === "booking")     return "코스";
    return "홈";
  })();

  return (
    <header style={{
      padding: "22px 56px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: variant === "bare" ? "none" : `1px solid ${M.beigeAlt}`,
      background: variant === "transparent" ? "transparent" : M.beige,
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(6px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <div onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>
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
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: M.cream, padding: "10px 16px", borderRadius: 999, boxShadow: MS.cardSm, minWidth: 240 }}>
          <MIcon name="search" size={16} color={M.muted} />
          <input
            placeholder="건축물, 지역, 건축가…"
            style={{
              border: "none", outline: "none", background: "transparent",
              fontSize: 13, fontWeight: 600, color: M.ink, fontFamily: "inherit",
              flex: 1, minWidth: 0,
            }}/>
        </div>
        <span
          onClick={auth.isLoggedIn ? auth.logout : () => onNavigate("login")}
          style={{ fontSize: 13, color: M.ink, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
          {auth.isLoggedIn ? "로그아웃" : "로그인"}
        </span>
        {auth.isLoggedIn ? (
          <MButton kind="primary" size="md" onClick={() => onNavigate("mypage")}>내 마실 →</MButton>
        ) : (
          <MButton kind="primary" size="md" onClick={() => onNavigate("onboarding")}>마실 시작하기</MButton>
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
  const tones = {
    beige:  { bg: "#E5D6B8", stripe: "#D4C29E", text: "#7B6342" },
    cream:  { bg: "#EAD9BD", stripe: "#D9C29B", text: "#7B6342" },
    terra:  { bg: "#E8AE8C", stripe: "#D89472", text: "#6B2C18" },
    olive:  { bg: "#B6C39A", stripe: "#9AAD7C", text: "#3B4A22" },
    deep:   { bg: "#5A4332", stripe: "#48362A", text: "#E0CDB1" },
    night:  { bg: "#1F2230", stripe: "#2A2D3D", text: "#D9C29B" },
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

Object.assign(window, {
  MasilNav, MagCap, Hairline, ImgPlaceholder, MetaRow, Serial,
});
