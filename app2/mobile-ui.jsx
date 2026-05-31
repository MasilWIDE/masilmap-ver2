/* ================================================================
   마실맵 모바일 앱 — UI 프리미티브 (Scholar 톤 계승)
   M / MT / MR / MS / MIcon 은 brand.jsx 전역. 여기선 mx* 로만 추가.
   ================================================================ */

const MX = {
  pageX: 18,
  topClear: 50,   // 상태바/다이내믹아일랜드 여백
  tabH: 64,       // 하단 탭바 높이(홈인디케이터 위)
  bottomClear: 30,
};

/* ---------- 사진/커버 플레이스홀더 ---------- */
function MXPhoto({ tone = "#333D51", label, height, ratio, radius = 0, style = {} }) {
  return (
    <div style={{
      width: "100%", height, aspectRatio: height ? undefined : (ratio || "4/3"),
      background: `linear-gradient(135deg, ${tone} 0%, ${tone}cc 60%, ${tone}99 100%)`,
      borderRadius: radius, position: "relative", overflow: "hidden",
      display: "flex", alignItems: "flex-end", ...style,
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.14,
        backgroundImage: "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 11px)" }}/>
      {label && (
        <span style={{ position: "relative", margin: 10, fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
          color: "rgba(255,255,255,0.92)", background: "rgba(0,0,0,0.18)", padding: "3px 8px",
          borderRadius: 8, backdropFilter: "blur(2px)" }}>{label}</span>
      )}
    </div>
  );
}

/* ---------- 채널 아바타 ---------- */
function MXAvatar({ ch, size = 36, ring = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: ch.color, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 900, fontSize: size * 0.42, letterSpacing: "-0.02em",
      border: ring ? "2px solid #fff" : "none",
      boxShadow: ring ? "0 0 0 1.5px " + ch.color : "none",
    }}>{ch.name[0]}</div>
  );
}

/* ---------- 공식/UGC 배지 ---------- */
function MXBadge({ official }) {
  return official ? (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 8px", whiteSpace: "nowrap",
      borderRadius: 999, background: M.terra, color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.02em" }}>
      <MIcon name="sparkle" size={10} color={M.olive}/> 공식
    </span>
  ) : (
    <span style={{ padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap", background: "rgba(31,39,56,0.06)",
      color: M.muted, fontSize: 10, fontWeight: 800 }}>유저 코스</span>
  );
}

/* ---------- 채널 한 줄 칩 ---------- */
function MXChannelChip({ ch, onClick, sub }) {
  return (
    <div onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: onClick ? "pointer" : "default", minWidth: 0 }}>
      <MXAvatar ch={ch} size={26}/>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 12.5, fontWeight: 800, color: M.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ch.name}</span>
          {ch.official && <MIcon name="sparkle" size={11} color={M.olive}/>}
        </div>
        {sub && <div style={{ fontSize: 10.5, color: M.muted, fontWeight: 600 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ---------- 기분/상황 태그 ---------- */
function MXMoodChip({ moodId, active, onClick, small }) {
  const m = mxMood(moodId); if (!m) return null;
  return (
    <span onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: small ? "6px 11px" : "9px 14px", borderRadius: 999,
      fontSize: small ? 12 : 13, fontWeight: 700, cursor: onClick ? "pointer" : "default",
      background: active ? M.terra : M.cream,
      color: active ? "#fff" : M.ink,
      border: `1.5px solid ${active ? M.terra : "transparent"}`,
      whiteSpace: "nowrap",
    }}>
      <MIcon name={m.icon} size={small ? 12 : 13} color={active ? M.olive : M.muted}/>
      {m.label}
    </span>
  );
}

/* ---------- 진행률 바 / 링 ---------- */
function MXBar({ pct, accent = M.olive, h = 8, track = "#E7E3D2" }) {
  return (
    <div style={{ width: "100%", height: h, borderRadius: 999, background: track, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: accent, transition: "width .35s ease" }}/>
    </div>
  );
}
function MXRing({ pct, size = 46, stroke = 5, accent = M.olive, label }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E7E3D2" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={accent} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - pct/100)} strokeLinecap="round" style={{ transition: "stroke-dashoffset .4s ease" }}/>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.26, fontWeight: 900, color: M.ink }}>{label != null ? label : `${pct}%`}</div>
    </div>
  );
}

/* ---------- 버튼 ---------- */
function MXBtn({ children, onClick, kind = "primary", full, icon, style = {} }) {
  const kinds = {
    primary: { background: M.terra, color: "#fff", border: "none" },
    gold:    { background: M.olive, color: M.terraDeep, border: "none" },
    outline: { background: "transparent", color: M.ink, border: `1.5px solid ${M.ink}` },
    soft:    { background: M.cream, color: M.ink, border: "none" },
  }[kind];
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
      padding: "13px 18px", borderRadius: 999, cursor: "pointer",
      fontFamily: "Pretendard, sans-serif", fontSize: 15, fontWeight: 800,
      width: full ? "100%" : undefined, ...kinds, ...style,
    }}>{icon}{children}</button>
  );
}

/* ---------- 섹션 타이틀 ---------- */
function MXSection({ children, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "0 0 12px" }}>
      <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: 0 }}>{children}</h2>
      {action && <span onClick={onAction} style={{ fontSize: 12.5, fontWeight: 800, color: M.olive, cursor: "pointer", whiteSpace: "nowrap" }}>{action}</span>}
    </div>
  );
}

/* ---------- 헤더 (sticky) ---------- */
function MXHeader({ title, onBack, right, transparent }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 30,
      paddingTop: MX.topClear, paddingBottom: 10,
      paddingLeft: MX.pageX, paddingRight: MX.pageX,
      display: "flex", alignItems: "center", gap: 10,
      background: transparent ? "transparent" : "rgba(255,255,255,0.86)",
      backdropFilter: transparent ? "none" : "blur(10px)",
      borderBottom: transparent ? "none" : `1px solid ${M.cream}`,
    }}>
      {onBack && (
        <button onClick={onBack} style={{ width: 34, height: 34, borderRadius: "50%", border: "none",
          background: transparent ? "rgba(255,255,255,0.85)" : M.cream, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <MIcon name="chevron" size={16} color={M.ink} style={{ transform: "rotate(180deg)" }}/>
        </button>
      )}
      <div style={{ flex: 1, fontSize: 17, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
      {right}
    </div>
  );
}

/* ---------- 하단 탭바 (가운데 만들기 FAB) ---------- */
function MXTabBar({ tab, onTab, onCreate }) {
  const items = [
    { id: "home", label: "동네", icon: "location" },
    { id: "feed", label: "피드", icon: "bell" },
    { id: "create", label: "", icon: "plus" },
    { id: "courses", label: "탐색", icon: "search" },
    { id: "my", label: "마이", icon: "user" },
  ];
  return (
    <div style={{
      flexShrink: 0, height: MX.tabH + MX.bottomClear, paddingBottom: MX.bottomClear,
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
      borderTop: `1px solid ${M.cream}`,
      display: "flex", alignItems: "center", justifyContent: "space-around",
    }}>
      {items.map((it) => {
        if (it.id === "create") {
          return (
            <button key="create" onClick={onCreate} style={{ width: 52, height: 52, borderRadius: "50%", border: "none",
              background: M.olive, marginTop: -18, cursor: "pointer", boxShadow: "0 6px 16px rgba(211,172,43,0.45)",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MIcon name="plus" size={24} color={M.terraDeep}/>
            </button>
          );
        }
        const on = tab === it.id;
        return (
          <button key={it.id} onClick={() => onTab(it.id)} style={{ background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3, width: 56, padding: 0 }}>
            <MIcon name={it.icon} size={22} color={on ? M.terra : M.muted}/>
            <span style={{ fontSize: 10, fontWeight: on ? 800 : 600, color: on ? M.terra : M.muted, whiteSpace: "nowrap" }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- 바텀 시트 ---------- */
function MXSheet({ open, onClose, title, children, maxH = "82%" }) {
  if (!open) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(15,18,28,0.42)", animation: "mxFade .2s ease" }}/>
      <div style={{ position: "relative", background: "#fff", borderRadius: "24px 24px 0 0", maxHeight: maxH,
        display: "flex", flexDirection: "column", boxShadow: "0 -10px 40px rgba(0,0,0,0.2)", animation: "mxUp .26s cubic-bezier(.2,.8,.2,1)" }}>
        <div style={{ padding: "10px 0 4px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 38, height: 4, borderRadius: 999, background: M.beigeAlt }}/>
        </div>
        {title && (
          <div style={{ padding: "6px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${M.cream}` }}>
            <span style={{ fontSize: 17, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{title}</span>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: M.cream, cursor: "pointer", fontSize: 16, color: M.muted, lineHeight: 1 }}>×</button>
          </div>
        )}
        <div style={{ overflow: "auto", padding: "16px 20px 28px" }}>{children}</div>
      </div>
    </div>
  );
}

/* ---------- 지점 타입 칩(작은 원형 글리프) ---------- */
function MXStopGlyph({ kind, size = 34, n }) {
  const k = MX_STOP_KINDS[kind] || MX_STOP_KINDS["건축"];
  return (
    <div style={{ width: size, height: size, borderRadius: 11, background: k.color, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: size * 0.4, flexShrink: 0 }}>
      {n != null ? n : k.glyph}
    </div>
  );
}

Object.assign(window, {
  MX, MXPhoto, MXAvatar, MXBadge, MXChannelChip, MXMoodChip, MXBar, MXRing,
  MXBtn, MXSection, MXHeader, MXTabBar, MXSheet, MXStopGlyph,
});
