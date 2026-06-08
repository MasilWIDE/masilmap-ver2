/* ================================================================
   masilmap — 통합 분류 UI (지도·리스트 공용)
   TxFilterBar: 렌즈 칩(프리셋) + "상세 필터" 펼침 패널(양식·지역·연도·태그)
   TxTagAdder: 폴크소노미 태그 추가 (방문자) — 상세 페이지용
   ================================================================ */

/* ---------- 렌즈 칩 줄 ---------- */
function TxLensChips({ state, setState, store, dark }) {
  const lenses = txLenses(store);
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
      {lenses.map((L) => {
        const on = state.lens === L.id;
        return (
          <button key={L.id} onClick={() => setState({ ...state, lens: L.id })} style={{
            display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
            padding: "9px 15px", borderRadius: 999, cursor: "pointer",
            fontSize: 13, fontWeight: 800, fontFamily: "inherit", whiteSpace: "nowrap",
            background: on ? M.terra : (dark ? "rgba(255,248,236,0.08)" : "#fff"),
            color: on ? "#fff" : (dark ? M.beigeAlt : M.ink),
            border: `1.5px solid ${on ? M.terra : (dark ? "rgba(255,248,236,0.2)" : M.beigeAlt)}`,
          }}>
            <MIcon name={L.icon} size={13} color={on ? "#fff" : (dark ? M.beigeAlt : M.olive)}/>
            {L.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- 칩 토글 ---------- */
function TxChip({ on, onClick, children, count }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "8px 13px", borderRadius: 999, cursor: "pointer",
      fontSize: 12.5, fontWeight: 700, fontFamily: "inherit", whiteSpace: "nowrap",
      background: on ? M.terra : "#fff", color: on ? "#fff" : M.ink,
      border: `1.5px solid ${on ? M.terra : M.beigeAlt}`,
    }}>
      {children}
      {count != null && <span style={{ fontSize: 11, opacity: 0.65 }}>{count}</span>}
    </button>
  );
}

/* ---------- 상세 필터 패널 (양식·지역·연도·태그) ---------- */
function TxFilterPanel({ state, setState, store }) {
  const toggleSet = (key, val) => {
    const next = new Set(state[key]); next.has(val) ? next.delete(val) : next.add(val);
    setState({ ...state, [key]: next });
  };
  const tags = txAllTags(store).slice(0, 24);
  const provinces = txProvinces();
  const decades = [["2010", 2010, 2100], ["2000", 2000, 2009], ["1990", 1990, 1999], ["~1989", 0, 1989]];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* 양식 */}
      <div>
        <TxGroupLabel>양식</TxGroupLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TX_STYLES.map((s) => (
            <TxChip key={s.key} on={state.styles.has(s.key)} onClick={() => toggleSet("styles", s.key)} count={txStyleCount(s.key, store)}>{s.label}</TxChip>
          ))}
        </div>
      </div>
      {/* 지역 */}
      <div>
        <TxGroupLabel>지역</TxGroupLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {provinces.map((p) => (
            <TxChip key={p} on={state.regions.has(p)} onClick={() => toggleSet("regions", p)}>{p}</TxChip>
          ))}
        </div>
      </div>
      {/* 연대 */}
      <div>
        <TxGroupLabel>완공 연대</TxGroupLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {decades.map(([label, min, max]) => {
            const on = state.yearMin === min && state.yearMax === max;
            return <TxChip key={label} on={on} onClick={() => setState({ ...state, yearMin: on ? 0 : min, yearMax: on ? 0 : max })}>{label}{label !== "~1989" ? "년대" : ""}</TxChip>;
          })}
        </div>
      </div>
      {/* 태그 (폴크소노미) */}
      <div>
        <TxGroupLabel>태그 · 사용자 분류</TxGroupLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tags.map((t) => (
            <TxChip key={t.tag} on={state.tags.has(t.tag)} onClick={() => toggleSet("tags", t.tag)} count={t.count}># {t.tag}</TxChip>
          ))}
        </div>
      </div>
    </div>
  );
}
function TxGroupLabel({ children }) {
  return <div style={{ fontFamily: MT.family, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: M.muted, textTransform: "uppercase", marginBottom: 9 }}>{children}</div>;
}

/* ---------- 전체 필터 바 (칩 + 펼침) ----------
   inline=true: 렌즈 칩 + 상세필터를 한 줄(칩 왼쪽, 상세필터 오른쪽). 리스트용.
   inline=false: 칩 줄 위 / 상세필터 토글 아래. 좁은 도크(지도)용. */
function TxFilterBar({ state, setState, store, dark, total, shown, extraPanel, inline }) {
  const [open, setOpen] = React.useState(false);
  const active = txActiveCount(state);
  const line = dark ? "rgba(255,248,236,0.2)" : M.beigeAlt;
  const toggleBtn = (
    <button onClick={() => setOpen(!open)} style={{
      flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6,
      padding: "8px 14px", borderRadius: 999, cursor: "pointer",
      fontSize: 12.5, fontWeight: 800, fontFamily: "inherit", whiteSpace: "nowrap",
      background: (open || active) ? M.ink : (inline ? (dark ? "rgba(255,248,236,0.08)" : "#fff") : "transparent"),
      color: (open || active) ? "#fff" : (dark ? M.beigeAlt : M.muted),
      border: `1.5px solid ${(open || active) ? M.ink : line}`,
    }}>
      <MIcon name="settings" size={13} color={(open || active) ? "#fff" : (dark ? M.beigeAlt : M.muted)}/>
      상세 필터{active > 0 ? ` ${active}` : ""}
      <MIcon name="chevron" size={11} color={(open || active) ? "#fff" : M.muted} style={{ transform: `rotate(${open ? -90 : 90}deg)` }}/>
    </button>
  );
  const panel = open && (
    <div style={{ marginTop: 12, padding: 18, borderRadius: 18, background: dark ? "rgba(0,0,0,0.25)" : M.cream, border: `1px solid ${dark ? "rgba(255,248,236,0.15)" : M.beigeAlt}` }}>
      <TxFilterPanel state={state} setState={setState} store={store}/>
      {extraPanel}
      {active > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, paddingTop: 14, borderTop: `1px solid ${dark ? "rgba(255,248,236,0.12)" : M.beigeAlt}` }}>
          <span onClick={() => setState({ ...txEmptyState(), lens: state.lens, q: state.q })} style={{ fontSize: 12.5, fontWeight: 800, color: M.terra, cursor: "pointer" }}>상세 필터 초기화 ({active})</span>
        </div>
      )}
    </div>
  );

  if (inline) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}><TxLensChips state={state} setState={setState} store={store} dark={dark}/></div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            {shown != null && <span style={{ fontSize: 12, fontWeight: 700, color: dark ? M.beigeAlt : M.muted, whiteSpace: "nowrap" }}>{shown} / {total}곳</span>}
            {toggleBtn}
          </div>
        </div>
        {panel}
      </div>
    );
  }

  return (
    <div>
      {/* 렌즈 칩 — 전체 폭 */}
      <TxLensChips state={state} setState={setState} store={store} dark={dark}/>
      {/* 상세 필터 토글 줄 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
        {toggleBtn}
        {shown != null && (
          <span style={{ fontSize: 12, fontWeight: 700, color: dark ? M.beigeAlt : M.muted, whiteSpace: "nowrap" }}>{shown} / {total}곳</span>
        )}
      </div>
      {panel}
    </div>
  );
}

/* ---------- 방문자 태그 추가 (폴크소노미) ---------- */
function TxTagAdder({ building, store, onAdd }) {
  const [val, setVal] = React.useState("");
  const [focus, setFocus] = React.useState(false);
  const pool = txAllTags(store).map((t) => t.tag);
  const sugg = val.trim() ? pool.filter((t) => t.includes(val.trim()) && t !== val.trim()).slice(0, 6) : [];
  const mine = txBuildingTagNames(building, store);
  const submit = (t) => { const v = (t || val).trim().replace(/^#/, ""); if (!v) return; onAdd(building.id, v); setVal(""); };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1.5px solid ${focus ? M.terra : M.beigeAlt}`, borderRadius: 999, padding: "9px 15px" }}>
          <span style={{ color: M.muted, fontWeight: 800 }}>#</span>
          <input
            value={val} onChange={(e) => setVal(e.target.value)}
            onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="이 곳을 한마디로 — 야경, 데이트, 노출콘크리트…"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13.5, fontWeight: 600, color: M.ink, fontFamily: "inherit" }}/>
        </div>
        <MButton kind="primary" size="md" onClick={() => submit()}>태그 추가</MButton>
      </div>
      {focus && sugg.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", border: `1px solid ${M.beigeAlt}`, borderRadius: 14, boxShadow: "0 10px 28px rgba(58,46,34,0.14)", padding: 6, zIndex: 30 }}>
          {sugg.map((t) => (
            <div key={t} onMouseDown={() => submit(t)} style={{ padding: "9px 12px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 700, color: M.ink, display: "flex", justifyContent: "space-between" }}
              onMouseEnter={(e) => e.currentTarget.style.background = M.cream} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <span># {t}</span>{mine.includes(t) && <span style={{ fontSize: 11, color: M.olive, fontWeight: 800 }}>이미 있음</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TxLensChips, TxChip, TxFilterPanel, TxFilterBar, TxTagAdder, TxGroupLabel });
