/* ================================================================
   masilmap — LOCKED BRAND SYSTEM (v1.0)
   Single source of truth for all future pages. Import this file
   and use its tokens / primitives only — do not redeclare colors,
   buttons, chips, or the logo elsewhere.

   Direction: Option B · Community / Warm Beige
   Locked on: 2026-05-24
   ================================================================ */

/* ---------- 1. COLOR TOKENS ---------- *
   2026-05-29: Scholar palette — 오래된 금색으로 마감 처리한 양장본 느낌.
   네이비(#333D51) / 골드(#D3AC2B) / 블루그레이(#CBD0D8) / 스칼라 크림(#F4F3EA).
   변수명은 호환을 위해 유지 (terra=primary brand, olive=secondary). */
const M = {
  /* surfaces */
  beige:     "#FFFFFF",   /* primary background — pure white page canvas */
  beigeAlt:  "#CBD0D8",   /* secondary surface · dividers — cool blue-gray */
  cream:     "#F4F3EA",   /* card surface — warm Scholar cream */

  /* brand · navy (primary — was terracotta) */
  terra:     "#333D51",   /* primary brand — CTA, headlines, active state */
  terraSoft: "#7A8497",   /* soft navy — highlight, hover */
  terraDeep: "#1F2738",   /* deep navy — pressed, dense */

  /* brand · gold (secondary — was olive) */
  olive:     "#D3AC2B",   /* secondary brand — accent, tag */
  oliveSoft: "#E8D080",   /* light gold — decorative */
  oliveDeep: "#9C7E1A",   /* deep gold — pressed */

  /* text */
  ink:       "#1F2738",   /* primary text — deep navy */
  muted:     "#6B7484",   /* secondary text · captions */
  faint:     "rgba(31,39,56,0.45)",
};

/* ---------- 2. TYPE TOKENS ---------- *
   Font: Nunito for body + headings (warmth + roundness),
         Quicksand for wordmark only.                        */
const MT = {
  family:       "'Nunito', 'Quicksand', system-ui, sans-serif",
  familyMark:   "'Quicksand', system-ui, sans-serif",

  /* sizes / weights — use these names everywhere */
  display:      { size: 64, weight: 900, line: 1.04, ls: "-0.025em" },
  h1:           { size: 40, weight: 900, line: 1.1,  ls: "-0.02em" },
  h2:           { size: 28, weight: 900, line: 1.2,  ls: "-0.015em" },
  h3:           { size: 22, weight: 900, line: 1.25, ls: "-0.01em" },
  h4:           { size: 18, weight: 800, line: 1.3 },
  bodyLg:       { size: 16, weight: 600, line: 1.6 },
  body:         { size: 14, weight: 600, line: 1.6 },
  caption:      { size: 12, weight: 700, line: 1.4 },
  micro:        { size: 11, weight: 700, line: 1.4 },
};

/* ---------- 3. SHAPE TOKENS ---------- */
const MR = {
  pill:   999,    /* buttons, chips, nav pill */
  card:   24,     /* primary card radius */
  cardLg: 28,     /* hero / CTA card */
  cardSm: 18,     /* small list card */
  inner:  16,     /* image slot inside card */
  field:  20,     /* search / input field */
};

const MS = {
  cardSm: "0 3px 10px rgba(58,46,34,0.05)",
  card:   "0 6px 22px rgba(58,46,34,0.06)",
  cardLg: "0 16px 40px rgba(58,46,34,0.10)",
  float:  "0 4px 14px rgba(58,46,34,0.08)",
};

const MSP = {
  pageX:  48,   /* page horizontal padding (web) */
  pageXM: 20,   /* page horizontal padding (mobile) */
  gap:    24,
  gapSm:  12,
};

/* ---------- 4. LOGO (house-in-pin + Quicksand wordmark) ---------- *
   PinHouse: symbol only. MasilmapLogo: symbol + wordmark.
   Color rules: pin terra by default; on dark/colored bg pass color=M.cream. */
function PinHouse({ size = 22, color = M.terra, hole = M.cream }) {
  return (
    <svg viewBox="0 0 200 260" width={size} height={size * 1.3} fill="none">
      <path d="M100 16 C145 16 180 49 180 92 C180 138 132 188 108 222 C103 229 97 229 92 222 C68 188 20 138 20 92 C20 49 55 16 100 16 Z" fill={color}/>
      <circle cx="100" cy="92" r="44" fill={hole}/>
      <path d="M100 66 L132 92 L124 92 L124 116 L76 116 L76 92 L68 92 Z" fill={color}/>
    </svg>
  );
}

function MasilmapLogo({ size = 22, color = M.terra, hole = M.cream, wmColor }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <PinHouse size={size} color={color} hole={hole}/>
      <span style={{
        fontFamily: MT.familyMark, fontWeight: 700,
        fontSize: size * 0.95, letterSpacing: "-0.01em",
        color: wmColor ?? color, lineHeight: 1,
      }}>masilmap</span>
    </div>
  );
}

/* ---------- 5. BUTTONS (all pill) ---------- */
function MButton({ children, kind = "primary", size = "md", as = "div", icon, iconRight, onClick, style = {} }) {
  const sizes = {
    sm: { pad: "8px 14px",  fs: 12, weight: 800 },
    md: { pad: "10px 18px", fs: 13, weight: 800 },
    lg: { pad: "12px 22px", fs: 14, weight: 900 },
  }[size];
  const kinds = {
    primary:   { bg: M.terra,    color: M.cream, border: "none" },
    secondary: { bg: M.cream,    color: M.ink,   border: `1px solid transparent`, boxShadow: MS.cardSm },
    ghost:     { bg: "transparent", color: M.ink, border: "none" },
    onTerra:   { bg: M.cream,    color: M.terra, border: "none" },   /* reverse on terra surface */
    olive:     { bg: M.olive,    color: M.cream, border: "none" },
    outline:   { bg: "transparent", color: M.ink, border: `1.5px solid ${M.ink}` },
  }[kind];
  const Comp = as;
  return (
    <Comp onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: sizes.pad, borderRadius: MR.pill,
      fontFamily: MT.family, fontSize: sizes.fs, fontWeight: sizes.weight,
      whiteSpace: "nowrap", cursor: "pointer",
      ...kinds, ...style,
    }}>
      {icon}
      {children}
      {iconRight}
    </Comp>
  );
}

/* ---------- 6. NAV PILL (top bar segmented nav) ---------- */
function MNav({ items, active }) {
  return (
    <div style={{
      display: "inline-flex", gap: 4, alignItems: "center",
      background: M.cream, padding: 6, borderRadius: MR.pill,
      boxShadow: MS.cardSm,
    }}>
      {items.map((it) => {
        const on = it === active;
        return (
          <span key={it} style={{
            padding: on ? "10px 22px" : "10px 16px",
            borderRadius: MR.pill,
            background: on ? M.terra : "transparent",
            color: on ? M.cream : M.ink,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>{it}</span>
        );
      })}
    </div>
  );
}

/* ---------- 7. CHIPS / TAGS ---------- */
function MChip({ children, color = M.terra, bg, size = "md" }) {
  const sizes = {
    sm: { fs: 11, pad: "4px 9px" },
    md: { fs: 12, pad: "6px 12px" },
    lg: { fs: 13, pad: "8px 14px" },
  }[size];
  /* if bg is omitted, derive a 12% tint of color */
  const tint = bg ?? `${color}1f`;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: sizes.pad, borderRadius: MR.pill,
      background: tint, color, fontWeight: 700, fontSize: sizes.fs,
      whiteSpace: "nowrap", fontFamily: MT.family,
    }}>{children}</span>
  );
}

/* ---------- 8. CARD (the workhorse container) ---------- */
function MCard({ children, surface = M.cream, radius = MR.card, pad = 20, shadow = MS.card, style = {} }) {
  return (
    <div style={{
      background: surface, borderRadius: radius, padding: pad,
      boxShadow: shadow, ...style,
    }}>{children}</div>
  );
}

/* ---------- 9. AVATAR DOT + STACK (community signal) ---------- */
function MAvatar({ initial, color = M.terra, size = 28, border = M.cream }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, background: color, color: M.cream,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: size * 0.42, border: `2px solid ${border}`,
      fontFamily: MT.family,
    }}>{initial}</div>
  );
}

function MAvatarStack({ colors = [M.terra, M.olive, M.terraDeep, M.oliveSoft], size = 26, border = M.cream }) {
  return (
    <div style={{ display: "flex" }}>
      {colors.map((c, i) => (
        <div key={i} style={{
          width: size, height: size, borderRadius: 999, background: c,
          border: `2px solid ${border}`, marginLeft: i === 0 ? 0 : -size * 0.38,
        }}/>
      ))}
    </div>
  );
}

/* ---------- 10. ICONS (rounded, 1.8 stroke default) ---------- *
   Names: home, map, users, user, heart, search, walk, sparkle,
          bookmark, calendar, clock, location, arrow, chevron,
          plus, share, settings, bell, camera, edit                 */
function MIcon({ name, size = 20, color = M.ink, stroke = 1.8, style = {} }) {
  const p = { stroke: color, strokeWidth: stroke, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const v = `0 0 24 24`;
  const wh = { width: size, height: size, viewBox: v, style };
  switch (name) {
    case "home":      return (<svg {...wh}><path d="M4 11 L12 4 L20 11 L20 20 L4 20 Z" {...p}/></svg>);
    case "map":       return (<svg {...wh}><path d="M3 6 L9 4 L15 6 L21 4 L21 18 L15 20 L9 18 L3 20 Z M9 4 L9 18 M15 6 L15 20" {...p}/></svg>);
    case "users":     return (<svg {...wh}><circle cx="9" cy="9" r="3" {...p}/><circle cx="17" cy="10" r="2.5" {...p}/><path d="M3 19 C3 15.5 5.5 14 9 14 C12.5 14 15 15.5 15 19 M15 19 C15 16.5 17 15 19 15 C20 15 21 15.5 21 17" {...p}/></svg>);
    case "user":      return (<svg {...wh}><circle cx="12" cy="9" r="3.5" {...p}/><path d="M5 20 C5 16 8 14 12 14 C16 14 19 16 19 20" {...p}/></svg>);
    case "heart":     return (<svg {...wh}><path d="M12 21 C5 16 3 12 3 8.5 C3 6 5 4 7.5 4 C9.5 4 11 5 12 6.5 C13 5 14.5 4 16.5 4 C19 4 21 6 21 8.5 C21 12 19 16 12 21 Z" {...p}/></svg>);
    case "search":    return (<svg {...wh}><circle cx="11" cy="11" r="6.5" {...p}/><path d="M16 16 L21 21" {...p}/></svg>);
    case "walk":      return (<svg {...wh}><circle cx="13" cy="4.5" r="1.8" {...p}/><path d="M10 21 L12 14 L9 11 L11 7 L14 9 L17 11 M12 14 L15 17 L17 21" {...p}/></svg>);
    case "sparkle":   return (<svg {...wh}><path d="M12 3 L13.5 10.5 L21 12 L13.5 13.5 L12 21 L10.5 13.5 L3 12 L10.5 10.5 Z" {...p}/></svg>);
    case "bookmark":  return (<svg {...wh}><path d="M6 3 L18 3 L18 21 L12 16.5 L6 21 Z" {...p}/></svg>);
    case "calendar":  return (<svg {...wh}><rect x="3" y="5" width="18" height="16" rx="2" {...p}/><path d="M3 10 L21 10 M8 3 L8 7 M16 3 L16 7" {...p}/></svg>);
    case "clock":     return (<svg {...wh}><circle cx="12" cy="12" r="9" {...p}/><path d="M12 7 L12 12 L16 14" {...p}/></svg>);
    case "location":  return (<svg {...wh}><path d="M12 22 C7 16 4 13 4 9 C4 5.5 7 3 12 3 C17 3 20 5.5 20 9 C20 13 17 16 12 22 Z" {...p}/><circle cx="12" cy="9" r="2.5" {...p}/></svg>);
    case "arrow":     return (<svg {...wh}><path d="M5 12 L19 12 M13 6 L19 12 L13 18" {...p}/></svg>);
    case "chevron":   return (<svg {...wh}><path d="M9 6 L15 12 L9 18" {...p}/></svg>);
    case "plus":      return (<svg {...wh}><path d="M12 5 L12 19 M5 12 L19 12" {...p}/></svg>);
    case "share":     return (<svg {...wh}><circle cx="6" cy="12" r="2.5" {...p}/><circle cx="18" cy="6" r="2.5" {...p}/><circle cx="18" cy="18" r="2.5" {...p}/><path d="M8 11 L16 7 M8 13 L16 17" {...p}/></svg>);
    case "settings":  return (<svg {...wh}><circle cx="12" cy="12" r="3" {...p}/><path d="M12 2 L13 5 L16 4 L17 7 L20 8 L19 11 L22 12 L19 13 L20 16 L17 17 L16 20 L13 19 L12 22 L11 19 L8 20 L7 17 L4 16 L5 13 L2 12 L5 11 L4 8 L7 7 L8 4 L11 5 Z" {...p} strokeWidth={stroke * 0.7}/></svg>);
    case "bell":      return (<svg {...wh}><path d="M6 16 L6 10 C6 6.5 8.5 4 12 4 C15.5 4 18 6.5 18 10 L18 16 L20 19 L4 19 Z M10 21 C10.5 22 11.2 22.5 12 22.5 C12.8 22.5 13.5 22 14 21" {...p}/></svg>);
    case "camera":    return (<svg {...wh}><path d="M3 8 L7 8 L9 5 L15 5 L17 8 L21 8 L21 19 L3 19 Z" {...p}/><circle cx="12" cy="13" r="3.5" {...p}/></svg>);
    case "edit":      return (<svg {...wh}><path d="M14 4 L20 10 L9 21 L3 21 L3 15 Z M13 5 L19 11" {...p}/></svg>);
    case "filter":    return (<svg {...wh}><path d="M3 5 L21 5 L14 13 L14 20 L10 18 L10 13 Z" {...p}/></svg>);
    default:          return null;
  }
}

/* ---------- 11. SEARCH FIELD ---------- */
function MSearch({ placeholder = "검색해 보세요", icon = "📍", onSearch, defaultValue = "" }) {
  return (
    <div style={{
      background: M.cream, borderRadius: MR.field, padding: "14px 18px",
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: MS.card,
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <input
        placeholder={placeholder}
        defaultValue={defaultValue}
        style={{
          flex: 1, border: "none", outline: "none", background: "transparent",
          fontSize: 14, fontWeight: 600, color: M.ink, fontFamily: MT.family,
        }}
      />
      <MButton kind="primary" size="md">찾아보기</MButton>
    </div>
  );
}

/* ---------- 12. TOP NAV (page header) ---------- */
function MTopNav({ active = "홈", items = ["홈", "지도", "이웃", "모임", "저널"], ctaLabel = "마실 시작하기 →" }) {
  return (
    <div style={{
      padding: "20px 48px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      fontFamily: MT.family,
    }}>
      <MasilmapLogo size={26}/>
      <MNav items={items} active={active}/>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: M.ink, fontWeight: 700, cursor: "pointer" }}>로그인</span>
        <MButton kind="primary" size="md">{ctaLabel}</MButton>
      </div>
    </div>
  );
}

/* ---------- 13. FOOTER (page bottom) ---------- */
function MFooter() {
  return (
    <div style={{
      padding: "20px 48px 24px", borderTop: `1px solid ${M.beigeAlt}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontSize: 12, color: M.muted, fontWeight: 700, fontFamily: MT.family,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <MasilmapLogo size={16}/>
        <span>· 마실그라운드의 B2C 서비스</span>
      </div>
      <span>© 2026 마실그라운드 — 우리 동네를 더 깊이 알아가는 친구 🏘️</span>
    </div>
  );
}

/* ---------- 14. PAGE SHELL (background + font defaults) ---------- *
   NOTE: overflowX: "clip" prevents horizontal blow-out without creating
   a scrolling context — so descendant `position: sticky` still works.
   (overflow: hidden would kill sticky on all child screens.) */
function MPage({ children, style = {} }) {
  return (
    <div style={{
      width: "100%", minHeight: "100%", background: M.beige, color: M.ink,
      fontFamily: MT.family, overflowX: "clip", ...style,
    }}>{children}</div>
  );
}

/* ---------- 15. SECTION HEADER (title + see-all) ---------- */
function MSectionHeader({ title, action = "전체 보기 →", size = "h2" }) {
  const t = MT[size];
  return (
    <div style={{
      padding: "16px 48px 12px", display: "flex", justifyContent: "space-between", alignItems: "baseline",
    }}>
      <div style={{ fontSize: t.size, fontWeight: t.weight, letterSpacing: t.ls, color: M.ink, lineHeight: t.line }}>{title}</div>
      {action && <div style={{ fontSize: 13, color: M.terra, fontWeight: 800, cursor: "pointer" }}>{action}</div>}
    </div>
  );
}

/* Export everything to window so all subsequent pages can import. */
Object.assign(window, {
  M, MT, MR, MS, MSP,
  PinHouse, MasilmapLogo,
  MButton, MNav, MChip, MCard,
  MAvatar, MAvatarStack, MIcon, MSearch,
  MTopNav, MFooter, MPage, MSectionHeader,
});
