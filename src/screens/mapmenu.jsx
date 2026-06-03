/* ================================================================
   masilmap · 지도 메뉴 (Option A · 사이드 도크) — UI
   - MKListCard         : 라이브 리스트 카드 (호버↔핀 하이라이트)
   - 조건부 상세 모듈    : 외부지도 보기·저장 / 용도별 예약 / 포함 코스 / 수록 컬렉션
   - MKDetailPanel      : 위 모듈을 조립한 상세 (도크를 덮음)
   - MapMenuLayout      : 사이드 도크 오케스트레이션 (home.jsx mapPrimary 대체)
   engine(mapmenu-engine.jsx)과 brand/shared/data에 의존.
   ================================================================ */

/* ---------- 리스트 카드 ---------- */
function MKListCard({ b, selected, hovered, onSelect, onHover, isSaved, onToggleSave }) {
  const c = b.catColor;
  const active = selected || hovered;
  return (
    <div
      onClick={() => onSelect(b.id)}
      onMouseEnter={() => onHover && onHover(b.id)}
      onMouseLeave={() => onHover && onHover(null)}
      style={{
        display: "flex", gap: 12, padding: 10, borderRadius: MR.card, cursor: "pointer",
        background: active ? M.cream : "transparent",
        border: `1.5px solid ${selected ? c : active ? `${c}44` : "transparent"}`,
        boxShadow: selected ? MS.card : "none", transition: "all .14s",
      }}>
      <div style={{ width: 78, height: 78, flexShrink: 0, position: "relative" }}>
        <ImgPlaceholder ratio="1/1" tone={b.pinTone === "olive" ? "olive" : "beige"} style={{ borderRadius: 14 }}/>
        <span style={{
          position: "absolute", top: 6, left: 6, width: 22, height: 22, borderRadius: 999,
          background: c, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: MS.float,
        }}><MKGlyph glyph={b.cat.glyph} size={12} color={M.beige} sw={2.2}/></span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", color: M.muted }}>{b.region}</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", lineHeight: 1.2,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</div>
        <div style={{ fontSize: 11.5, color: M.muted, fontWeight: 600, marginTop: 2 }}>{b.architect} · {b.year}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 7 }}>
          {b.ext && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10.5, fontWeight: 800, color: M.olive }}>
              <MIcon name="calendar" size={11} color={M.olive}/>{b.ext.type} 예약
            </span>
          )}
          {b.courses.length > 0 && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10.5, fontWeight: 700, color: M.muted }}>
              <MIcon name="walk" size={11} color={M.muted}/>코스 {b.courses.length}
            </span>
          )}
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onToggleSave && onToggleSave(b.id); }} style={{
        width: 30, height: 30, flexShrink: 0, alignSelf: "flex-start", borderRadius: 999, border: "none", cursor: "pointer",
        background: isSaved ? `${M.terra}14` : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <MIcon name="heart" size={15} color={isSaved ? M.terra : M.muted}/>
      </button>
    </div>
  );
}

/* ---------- 모듈 라벨 ---------- */
function MKModLabel({ children, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: M.muted, textTransform: "uppercase" }}>
        <span style={{ width: 14, height: 1, background: M.beigeAlt }}/>{children}
      </div>
      {action && <span onClick={onAction} style={{ fontSize: 11.5, fontWeight: 800, color: M.terra, cursor: "pointer" }}>{action}</span>}
    </div>
  );
}

/* ---------- 외부 지도 보기·저장 (후발주자 · 항상 노출) ---------- */
function MKExtMapsModule({ b }) {
  const addr = encodeURIComponent(b.address || b.name || "");
  const extMaps = [
    {
      id: "kakao", name: "카카오맵", dot: "#FFCD00", ring: true,
      view: `https://map.kakao.com/link/search/${addr}`,
      save: `https://map.kakao.com/link/search/${addr}`,
    },
    {
      id: "naver", name: "네이버지도", dot: "#03C75A", ring: false,
      view: `https://map.naver.com/v5/search/${addr}`,
      save: `https://map.naver.com/v5/search/${addr}`,
    },
    {
      id: "google", name: "구글맵", dot: "#4285F4", ring: false,
      view: `https://www.google.com/maps/search/${addr}`,
      save: `https://www.google.com/maps/search/${addr}`,
    },
  ];
  return (
    <div>
      <MKModLabel>다른 지도에서 열기</MKModLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {extMaps.map((m) => (
          <div key={m.id} style={{
            border: `1px solid ${M.beigeAlt}`, borderRadius: 14, padding: 9, background: M.beige,
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: m.dot, flexShrink: 0,
                boxShadow: m.ring ? "inset 0 0 0 1px rgba(0,0,0,0.12)" : "none" }}/>
              <span style={{ fontSize: 11, fontWeight: 800, color: M.ink, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{m.name}</span>
            </div>
            <a href={m.view} target="_blank" rel="noreferrer" style={{
              textAlign: "center", textDecoration: "none", fontSize: 11, fontWeight: 800,
              color: M.ink, background: M.cream, padding: "6px 0", borderRadius: 8, display: "block",
            }}>열기 ↗</a>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10.5, color: M.muted, fontWeight: 600, marginTop: 8, lineHeight: 1.5 }}>
        마실맵은 이야기를, 길안내는 익숙한 지도에 맡깁니다.
      </div>
    </div>
  );
}

/* ---------- 용도별 예약 (EXTERNAL_SPACES · 있을 때만) ---------- */
function MKBookingModule({ b, onNavigate }) {
  if (!b.ext) return null;
  const e = b.ext;
  return (
    <div>
      <MKModLabel>{e.type} 예약</MKModLabel>
      <div style={{ background: `${M.olive}14`, border: `1px solid ${M.olive}44`, borderRadius: 16, padding: 14,
        display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>{e.typeIcon}</span>
              <div style={{ fontSize: 15, fontWeight: 900, color: M.ink, letterSpacing: "-0.01em" }}>{e.name}</div>
            </div>
            <div style={{ fontSize: 11.5, color: M.muted, fontWeight: 600, marginTop: 4, lineHeight: 1.5, textWrap: "pretty" }}>{e.summary}</div>
          </div>
          <span style={{ flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
            color: M.muted, border: `1px solid ${M.beigeAlt}`, borderRadius: 6, padding: "3px 6px" }}>via {e.partner}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontSize: 13, color: M.ink }}>
            <span style={{ fontSize: 11, color: M.muted, fontWeight: 700 }}>최저 </span>
            <span style={{ fontSize: 18, fontWeight: 900 }}>{e.minPrice.toLocaleString()}</span>
            <span style={{ fontSize: 12, color: M.muted, fontWeight: 700 }}>원~</span>
          </div>
          <MButton kind="olive" size="md" onClick={() => onNavigate && onNavigate("booking-external", e.id)}
            icon={<MIcon name="calendar" size={14} color={M.cream}/>}>예약하기</MButton>
        </div>
      </div>
    </div>
  );
}

/* ---------- 포함된 마실 코스 (있을 때만) ---------- */
function MKCoursesModule({ b, onNavigate, onPreview, activeCourseId }) {
  if (!b.courses.length) return (
    <div>
      <MKModLabel>이 공간이 포함된 마실 코스</MKModLabel>
      <div style={{
        padding: "16px 14px", borderRadius: 14,
        background: M.beige, border: `1px dashed ${M.beigeAlt}`,
        fontSize: 13, color: M.muted, fontWeight: 600, lineHeight: 1.55, textAlign: "center",
      }}>
        아직 이 공간을 포함한 코스가 없어요.<br/>
        <span onClick={() => onNavigate && onNavigate("course")} style={{
          color: M.terra, fontWeight: 800, cursor: "pointer", textDecoration: "underline",
        }}>코스 제안하기 →</span>
      </div>
    </div>
  );
  return (
    <div>
      <MKModLabel>이 공간이 포함된 마실 코스 · {b.courses.length}</MKModLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {b.courses.map((c) => {
          const on = c.id === activeCourseId;
          return (
            <div key={c.id} style={{
              display: "flex", gap: 11, alignItems: "center", padding: 9, borderRadius: 14,
              border: `1.5px solid ${on ? M.terra : M.beigeAlt}`, background: on ? `${M.terra}0a` : M.beige,
            }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: c.cover, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 800, color: "rgba(244,243,234,0.92)" }}>{c.no}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: M.ink, letterSpacing: "-0.01em",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 2 }}>{c.duration} · {c.buildings.length}곳 · ★ {c.rating}</div>
              </div>
              <button onClick={() => onPreview && onPreview(on ? null : c)} title="지도에서 경로 보기" style={{
                flexShrink: 0, padding: "7px 10px", borderRadius: 999, border: "none", cursor: "pointer",
                background: on ? M.terra : M.cream, color: on ? M.cream : M.terra, fontSize: 11, fontWeight: 800,
                display: "inline-flex", alignItems: "center", gap: 4,
              }}><MIcon name="map" size={12} color={on ? M.cream : M.terra}/>{on ? "경로 끔" : "경로"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- 수록 시리즈 (있을 때만) ---------- */
function MKCollectionsModule({ b, onNavigate }) {
  if (!b.collections.length) return null;
  return (
    <div>
      <MKModLabel>수록된 시리즈 · {b.collections.length}</MKModLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {b.collections.map((c) => (
          <div key={c.id} onClick={() => onNavigate && onNavigate("collection", c.id)} style={{
            display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 12px 6px 7px", borderRadius: 999,
            background: M.beige, cursor: "pointer", border: `1px solid ${M.beigeAlt}`,
          }}>
            <span style={{ width: 18, height: 18, borderRadius: 6, background: c.cover, flexShrink: 0 }}/>
            <span style={{ fontSize: 12, fontWeight: 800, color: M.ink, letterSpacing: "-0.01em" }}>{c.title}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: M.muted }}>{c.no}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 상세 패널 (도크를 덮는 Option A 상세) ---------- */
function MKDetailPanel({ b, isSaved, onToggleSave, onBack, onNavigate, onPreviewCourse, activeCourseId }) {
  const c = b.catColor;
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
      <button onClick={onBack} style={{
        alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
        borderRadius: 999, border: "none", background: M.cream, boxShadow: MS.cardSm, cursor: "pointer",
        fontSize: 12.5, fontWeight: 800, color: M.ink, fontFamily: MT.family, flexShrink: 0,
      }}>
        <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}><MIcon name="arrow" size={14} color={M.ink}/></span>
        목록으로
      </button>

      <div style={{ flex: 1, minHeight: 0, background: M.cream, borderRadius: MR.cardLg, boxShadow: MS.cardLg,
        overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* 헤더 사진 */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <ImgPlaceholder ratio="16/9" tone={b.pinTone === "olive" ? "olive" : "beige"} style={{ borderRadius: 0 }}/>
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px 5px 8px",
              borderRadius: 999, background: c, color: M.cream, fontSize: 11.5, fontWeight: 800, boxShadow: MS.float }}>
              <MKGlyph glyph={b.cat.glyph} size={13} color={M.cream} sw={2}/>{b.cat.label}
            </span>
          </div>
          <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 7 }}>
            <button onClick={() => onToggleSave(b.id)} title="저장" style={{
              width: 34, height: 34, borderRadius: 999, border: "none", cursor: "pointer",
              background: isSaved ? M.terra : "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: MS.float,
            }}><MIcon name="heart" size={16} color={isSaved ? M.cream : M.ink}/></button>
          </div>
        </div>

        {/* 본문 (스크롤) */}
        <div style={{ padding: 18, overflowY: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 5 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: M.muted }}>{b.region}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.025em", color: M.ink, lineHeight: 1.15 }}>{b.name}</div>
            <div style={{ fontSize: 12.5, color: M.muted, fontWeight: 600, marginTop: 4 }}>{b.architect} · {b.year} · {b.type}</div>
            <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 14, color: M.ink, lineHeight: 1.7, fontWeight: 400, margin: "11px 0 0", textWrap: "pretty" }}>{b.intro}</p>
            {/* 메트릭 2칸 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              <div style={{ background: M.beige, border: `1px solid ${M.beigeAlt}`, borderRadius: 10, padding: "9px 12px" }}>
                <div style={{ fontSize: 10, color: M.muted, fontWeight: 700, marginBottom: 2 }}>연면적</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: M.ink }}>{(b.metrics && b.metrics.gfa) || "—"}</div>
              </div>
              <div style={{ background: M.beige, border: `1px solid ${M.beigeAlt}`, borderRadius: 10, padding: "9px 12px" }}>
                <div style={{ fontSize: 10, color: M.muted, fontWeight: 700, marginBottom: 2 }}>관람</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: M.ink }}>{(b.metrics && b.metrics.visit) || "—"}</div>
              </div>
            </div>
          </div>

          <MKExtMapsModule b={b}/>
          <MKBookingModule b={b} onNavigate={onNavigate}/>
          <MKCoursesModule b={b} onNavigate={onNavigate} onPreview={onPreviewCourse} activeCourseId={activeCourseId}/>
          <MKCollectionsModule b={b} onNavigate={onNavigate}/>
          <MKExtRefsModule b={b}/>

          <button onClick={() => onNavigate && onNavigate("detail", b.id)} style={{
            width: "100%", padding: "13px 0", borderRadius: MR.pill, border: `1.5px solid ${M.ink}`,
            background: "transparent", color: M.ink, fontSize: 13.5, fontWeight: 800, cursor: "pointer",
            fontFamily: MT.family, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>공간 전체 이야기 보기 <MIcon name="arrow" size={15} color={M.ink}/></button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MapMenuLayout — 사이드 도크 오케스트레이션 (Option A)
   home.jsx의 mapPrimary 블록을 이 컴포넌트로 대체.
   ================================================================ */
function MapMenuLayout({ onNavigate, searchQuery = "", isMobile = false }) {
  const all = React.useMemo(() => mkBuildings(), []);
  const sh = useMasilShared();
  const txStore = sh.s;
  const [tx, setTx] = React.useState(() => txEmptyState());
  const [cat, setCat] = React.useState("all");
  const [selectedId, setSelectedId] = React.useState(null);
  const [hoveredId, setHovered] = React.useState(null);
  const [view, setView] = React.useState({ ...MK_HOME_VIEW });
  const [searchedView, setSearchedView] = React.useState({ ...MK_HOME_VIEW });
  const [moved, setMoved] = React.useState(false);
  const [activeCourse, setActiveCourse] = React.useState(null);
  const [saved, toggleSave] = useMapSaved();
  const [sheetOpen, setSheetOpen] = React.useState(false); // 모바일 보텀시트

  const q = (searchQuery || "").trim().toLowerCase();

  // 필터 (통합 분류 렌즈·양식·지역·연도·태그 + 유형 + 검색어) — 핀 표시용
  const txState = { ...tx, q };
  const allowed = React.useMemo(
    () => new Set(txFilter(all, txState, txStore).map((b) => b.id)),
    [tx, q, txStore, all]
  );
  const matchFilters = (b) => {
    if (!allowed.has(b.id)) return false;
    if (cat !== "all" && b.cat.id !== cat) return false;
    return true;
  };
  const pinItems = all.filter(matchFilters);

  // 리스트 = searchedView 안 + 필터 (Google "이 지역 다시 검색" 패턴)
  const searchVb = mkViewBox(searchedView);
  const listItems = pinItems.filter((b) => mkInView(b.coord, searchVb, 30));

  const sel = all.find((b) => b.id === selectedId) || null;
  const routeIds = activeCourse ? activeCourse.buildings : (sel ? null : null);

  const onSelectPin = (id) => { setSelectedId(id); if (isMobile) setSheetOpen(true); };
  const reSearch = () => { setSearchedView({ ...view }); setMoved(false); };
  const previewCourse = (c) => {
    setActiveCourse(c);
    if (c) {
      // 코스 범위로 지도 이동
      const pts = c.buildings.map((id) => (window.BUILDINGS.find((x) => x.id === id) || {}).coord).filter(Boolean);
      if (pts.length) {
        const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
        const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
        const nv = { cx, cy, zoom: pts.length > 1 ? 1.7 : 2.3 };
        setView(nv); setSearchedView(nv); setMoved(false);
      }
    }
  };

  /* ----- 도크 내용 ----- */
  const dockHeader = (
    <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 16, boxShadow: MS.card,
      display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
      {/* 검색 + 내 위치 */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, background: M.beige,
          borderRadius: 999, padding: "10px 14px", border: `1px solid ${M.beigeAlt}` }}>
          <MIcon name="search" size={16} color={M.muted}/>
          <input placeholder="공간·지역·건축가 검색"
            defaultValue={searchQuery}
            onChange={(e) => { const s = window.__masilSearch; if (s && s.setQuery) s.setQuery(e.target.value); }}
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", minWidth: 0,
              fontSize: 13, fontWeight: 600, color: M.ink, fontFamily: MT.family }}/>
        </div>
        <button title="내 위치 주변" onClick={() => setView({ cx: 770, cy: 340, zoom: 2.6 })} style={{
          width: 42, height: 42, flexShrink: 0, borderRadius: 999, border: "none", background: M.beige,
          boxShadow: MS.cardSm, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}><MIcon name="location" size={17} color={M.terra}/></button>
      </div>
      {/* 통합 분류: 렌즈 칩 + 상세 필터 펼침 (유형 포함) */}
      <TxFilterBar state={tx} setState={setTx} store={txStore} total={all.length} shown={pinItems.length}
        extraPanel={(
          <div style={{ marginTop: 18 }}>
            <TxGroupLabel>유형 · 무엇을 하나</TxGroupLabel>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <MKCatChip on={cat === "all"} onClick={() => setCat("all")} label="전체"/>
              {MK_CAT_ORDER.map((k) => (
                <MKCatChip key={k} on={cat === k} onClick={() => setCat(k)} cat={MK_CATS[k]} label={MK_CATS[k].label}/>
              ))}
            </div>
          </div>
        )}/>
    </div>
  );

  const dockList = (
    <div style={{ height: "100%", overflowY: "auto", paddingRight: 2 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px 6px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: M.terra }}/>
          <span style={{ fontSize: 14, fontWeight: 900, color: M.ink }}>이 지도 안 <span style={{ color: M.terra }}>{listItems.length}곳</span></span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 800, color: M.terra, cursor: "pointer" }}>↕ 가까운 순</span>
      </div>
      {listItems.length === 0 ? (
        <div style={{ padding: "48px 12px", textAlign: "center", color: M.muted, fontSize: 13, fontWeight: 600 }}>
          이 영역에 표시할 공간이 없습니다.<br/>지도를 옮기거나 필터를 바꿔보세요.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {listItems.map((b) => (
            <MKListCard key={b.id} b={b} selected={b.id === selectedId} hovered={b.id === hoveredId}
              onSelect={onSelectPin} onHover={setHovered} isSaved={saved.includes(b.id)} onToggleSave={toggleSave}/>
          ))}
        </div>
      )}
    </div>
  );

  const detail = sel && (
    <MKDetailPanel b={sel} isSaved={saved.includes(sel.id)} onToggleSave={toggleSave}
      onBack={() => { setSelectedId(null); setActiveCourse(null); }}
      onNavigate={onNavigate} onPreviewCourse={previewCourse} activeCourseId={activeCourse && activeCourse.id}/>
  );

  /* ----- 지도 ----- */
  const mapEl = (
    <MKDataMap items={pinItems} selectedId={selectedId} hoveredId={hoveredId}
      onSelect={onSelectPin} onHover={setHovered}
      view={view} setView={(v) => { setView(v); }} onMoved={() => setMoved(true)}
      routeIds={routeIds} routeColor={activeCourse ? activeCourse.cover : M.olive} showLegend={!isMobile}/>
  );

  // ===== 모바일 =====
  if (isMobile) {
    return (
      <section style={{ position: "relative", height: "calc(100vh - 124px)", minHeight: 480 }}>
        <div style={{ position: "absolute", inset: 0 }}>{mapEl}</div>
        {/* 상단 렌즈 */}
        <div style={{ position: "absolute", top: 12, left: 12, right: 12 }}>
          <TxLensChips state={tx} setState={setTx} store={txStore}/>
        </div>
        {/* 이 지역 다시 검색 */}
        {moved && (
          <div style={{ position: "absolute", top: 58, left: "50%", transform: "translateX(-50%)", zIndex: 20 }}>
            <MKReSearch onClick={reSearch}/>
          </div>
        )}
        {/* 코스 토스트 */}
        {activeCourse && <MKRouteToast course={activeCourse} onClose={() => setActiveCourse(null)} bottom={sel ? "84%" : 210}/>}
        {/* 보텀시트 */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, background: M.beige,
          borderRadius: "22px 22px 0 0", boxShadow: "0 -8px 30px rgba(31,39,56,0.16)",
          height: sel ? "82%" : (sheetOpen ? "66%" : 188), transition: "height .28s ease",
          display: "flex", flexDirection: "column",
        }}>
          <div onClick={() => { if (sel) { setSelectedId(null); } else setSheetOpen((o) => !o); }}
            style={{ padding: "10px 0 8px", display: "flex", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <span style={{ width: 44, height: 5, borderRadius: 999, background: M.beigeAlt }}/>
          </div>
          <div style={{ flex: 1, minHeight: 0, padding: "0 12px 12px" }}>
            {sel ? detail : dockList}
          </div>
        </div>
      </section>
    );
  }

  // ===== 데스크탑 (사이드 도크) =====
  return (
    <section style={{ position: "relative", height: "calc(100vh - 132px)", minHeight: 620,
      padding: "0 24px 24px" }}>
      <div style={{ position: "absolute", inset: "0 24px 24px", borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.cardLg }}>
        {mapEl}
      </div>

      {/* 좌측 도크 */}
      <div style={{ position: "absolute", top: 18, left: 42, bottom: 42, width: 392,
        display: "flex", flexDirection: "column", gap: 12, zIndex: 10 }}>
        {!sel && dockHeader}
        <div style={{ flex: 1, minHeight: 0 }}>
          {sel ? detail : dockList}
        </div>
      </div>

      {/* 이 지역 다시 검색 */}
      {moved && (
        <div style={{ position: "absolute", top: 22, left: "calc(50% + 200px)", transform: "translateX(-50%)", zIndex: 12 }}>
          <MKReSearch onClick={reSearch}/>
        </div>
      )}

      {/* 코스 경로 토스트 */}
      {activeCourse && <MKRouteToast course={activeCourse} onClose={() => setActiveCourse(null)}/>}
    </section>
  );
}

/* ---------- 카테고리 칩 ---------- */
function MKCatChip({ on, onClick, cat, label }) {
  const c = !cat ? M.terra : mkCatColor(cat);
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 5, padding: cat ? "6px 11px 6px 8px" : "6px 12px",
      borderRadius: 999, cursor: "pointer", fontFamily: MT.family,
      background: on ? `${c}1f` : "transparent", color: on ? c : M.muted,
      border: `1px solid ${on ? `${c}55` : M.beigeAlt}`, fontSize: 11.5, fontWeight: 800, whiteSpace: "nowrap",
    }}>
      {cat && <MKGlyph glyph={cat.glyph} size={13} color={on ? c : M.muted} sw={2}/>}
      {label}
    </button>
  );
}

/* ---------- 이 지역 다시 검색 ---------- */
function MKReSearch({ onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 999,
      border: "none", cursor: "pointer", background: M.terra, color: M.cream, fontSize: 13, fontWeight: 800,
      fontFamily: MT.family, boxShadow: MS.cardLg,
    }}>
      <MIcon name="search" size={14} color={M.cream}/>이 지역에서 다시 검색
    </button>
  );
}

/* ---------- 코스 경로 토스트 ---------- */
function MKRouteToast({ course, onClose, bottom = 22 }) {
  return (
    <div style={{ position: "absolute", bottom, left: "50%", transform: "translateX(-50%)", zIndex: 30,
      background: M.ink, color: M.cream, borderRadius: 999, padding: "10px 16px",
      display: "flex", alignItems: "center", gap: 12, boxShadow: MS.cardLg }}>
      <span style={{ display: "inline-flex" }}><MIcon name="walk" size={15} color={M.cream}/></span>
      <span style={{ fontSize: 12.5, fontWeight: 800 }}>코스 경로 · {course.name}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "rgba(244,243,234,0.7)" }}>{course.buildings.length}곳 · {course.duration}</span>
      <button onClick={onClose} style={{ border: "none", background: "transparent", color: M.cream, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
    </div>
  );
}

/* ---------- 더 깊이 · 외부 전문 정보 (마실지도는 핵심만) ---------- */
function MKExtRefsModule({ b }) {
  const refs = mkExternalRefs(b);
  return (
    <div>
      <MKModLabel>더 깊이 · 외부 전문 정보</MKModLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {refs.map((r) => {
          const c = r.tone === "olive" ? M.olive : M.terra;
          return (
            <a key={r.id} href={r.href} target="_blank" rel="noreferrer" style={{
              display: "flex", alignItems: "center", gap: 12, padding: "13px 15px", borderRadius: 14,
              border: `1px solid ${M.beigeAlt}`, background: M.cream, textDecoration: "none",
            }}>
              <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 10, background: `${c}16`,
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MIcon name="book" size={18} color={c}/>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: M.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{r.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 700,
                    letterSpacing: "0.1em", color: c, border: `1px solid ${c}44`, borderRadius: 5, padding: "1px 5px" }}>{r.badge}</span>
                </div>
                <span style={{ fontSize: 11.5, color: M.muted, fontWeight: 600, lineHeight: 1.45, textWrap: "pretty" }}>{r.desc}</span>
              </div>
              <span style={{ flexShrink: 0, color: M.muted, fontSize: 15, fontWeight: 700 }}>↗</span>
            </a>
          );
        })}
      </div>
      <div style={{ fontSize: 10.5, color: M.muted, fontWeight: 600, marginTop: 9, lineHeight: 1.5 }}>
        마실지도는 동네를 걷는 데 필요한 핵심만 담습니다. 도면·연혁 같은 전문 정보는 외부에서 이어보세요.
      </div>
    </div>
  );
}

Object.assign(window, {
  MKListCard, MKModLabel, MKExtMapsModule, MKBookingModule, MKCoursesModule, MKCollectionsModule, MKExtRefsModule,
  MKDetailPanel, MapMenuLayout, MKCatChip, MKReSearch, MKRouteToast,
});
