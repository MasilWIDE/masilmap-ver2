/* ================================================================
   masilmap · 역할별 콘솔 (운영자 진입 페이지)
   - ConsoleShell  : 좌측 역할 네비 + 상단바 (AdminShell 톤 일반화)
   - AdminOverview : 관리자 대시보드 (index_manage)
   - TourConsole   : 코스 운영자 — 코스/예약/매출 (index_tour)
   - EditorConsole : 컬렉션·매거진 에디터 (index_editor)
   기존 admin/upload/collection/course/booking 화면으로 딥링크.
   ================================================================ */

/* 역할별 네비 정의 */
const CONSOLE_NAV = {
  admin: {
    badge: { letter: "A", label: "관리자 모드", sub: "masil-admin" },
    home: "console-admin",
    items: [
      { id: "console-admin", label: "대시보드",   icon: "home" },
      { id: "admin-content", label: "콘텐츠 관리", icon: "edit", count: 526 },
      { id: "admin-stats",   label: "예약·매출",   icon: "calendar" },
      { id: "admin-rights",  label: "권리 관리",   icon: "bookmark", count: 47 },
    ],
  },
  tour: {
    badge: { letter: "T", label: "코스 운영자", sub: "masil-tour" },
    home: "console-tour",
    items: [
      { id: "console-tour", label: "대시보드",     icon: "home" },
      { id: "course",       label: "내 코스",       icon: "walk", count: 6 },
      { id: "admin-stats",  label: "예약·매출",     icon: "calendar" },
      { id: "upload-deep",  label: "새 코스 만들기", icon: "plus" },
    ],
  },
  editor: {
    badge: { letter: "E", label: "에디터", sub: "masil-editor" },
    home: "console-editor",
    items: [
      { id: "console-editor", label: "대시보드",     icon: "home" },
      { id: "collection",     label: "컬렉션",       icon: "bookmark", count: 6 },
      { id: "upload-deep",    label: "새 글·컬렉션",  icon: "edit" },
      { id: "upload-quick",   label: "공간 등록",      icon: "plus" },
    ],
  },
};

function ConsoleShell({ role, active, onNavigate, children }) {
  const cfg = CONSOLE_NAV[role] || CONSOLE_NAV.admin;
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: M.beige, fontFamily: MT.family, color: M.ink }}>
      <aside style={{
        width: 240, flexShrink: 0, background: M.beige, padding: "20px 16px",
        borderRight: `1px solid ${M.beigeAlt}`, position: "sticky", top: 0, height: "100vh",
        display: "flex", flexDirection: "column",
      }}>
        <div onClick={() => onNavigate(cfg.home)} style={{ cursor: "pointer", marginBottom: 22, display: "flex", alignItems: "center", gap: 8 }}>
          <MasilmapLogo size={22}/>
        </div>
        <div style={{ padding: "8px 10px", marginBottom: 16, background: M.ink, borderRadius: 10, display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 24, height: 24, borderRadius: 999, background: M.olive, color: M.ink, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12 }}>{cfg.badge.letter}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: M.cream, letterSpacing: "-0.005em" }}>{cfg.badge.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, color: "rgba(244,243,234,0.6)", letterSpacing: "0.05em" }}>{cfg.badge.sub}</div>
          </div>
        </div>
        <MagCap style={{ marginBottom: 8, padding: "0 4px" }}>SECTIONS</MagCap>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {cfg.items.map((n) => {
            const on = n.id === active;
            return (
              <div key={n.id} onClick={() => onNavigate(n.id)} style={{
                padding: "10px 12px", borderRadius: 10,
                background: on ? M.terra : "transparent", color: on ? M.cream : M.ink,
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                cursor: "pointer", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MIcon name={n.icon} size={15} color={on ? M.cream : M.ink}/>{n.label}
                </span>
                {n.count != null && (
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: on ? "rgba(244,243,234,0.7)" : M.muted }}>{n.count}</span>
                )}
              </div>
            );
          })}
        </nav>
        {/* 다른 역할로 전환 (데모) */}
        <div style={{ marginTop: "auto" }}>
          <MagCap style={{ marginBottom: 6, padding: "0 4px" }}>VIEW AS</MagCap>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <ConsoleSwitch label="일반 사용자 앱" onClick={() => onNavigate("home")}/>
            {role !== "admin"  && <ConsoleSwitch label="관리자 콘솔"   onClick={() => onNavigate("console-admin")}/>}
            {role !== "tour"   && <ConsoleSwitch label="코스 운영자"   onClick={() => onNavigate("console-tour")}/>}
            {role !== "editor" && <ConsoleSwitch label="에디터"        onClick={() => onNavigate("console-editor")}/>}
          </div>
        </div>
      </aside>
      <main style={{ flex: 1, minWidth: 0, overflowX: "auto" }}>{children}</main>
    </div>
  );
}

function ConsoleSwitch({ label, onClick }) {
  return (
    <div onClick={onClick} style={{
      padding: "7px 10px", borderRadius: 8, cursor: "pointer", fontSize: 11.5, fontWeight: 700,
      color: M.muted, border: `1px solid ${M.beigeAlt}`, display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {label}<span style={{ color: M.olive }}>→</span>
    </div>
  );
}

function ConsoleTopBar({ role, subtitle, title, action }) {
  return (
    <div style={{
      padding: "20px 32px", background: M.beige, borderBottom: `1px solid ${M.beigeAlt}`,
      display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10, gap: 16, flexWrap: "wrap",
    }}>
      <div>
        <MagCap color={M.terra}>{(role || "").toUpperCase()} / {subtitle}</MagCap>
        <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: "4px 0 0" }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}

/* KPI 카드 행 */
function ConsoleKPIs({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 16 }}>
      {items.map((k, i) => (
        <div key={i} style={{ background: M.cream, borderRadius: MR.cardLg, padding: 18, boxShadow: MS.cardSm }}>
          <MagCap style={{ marginBottom: 10 }}>{k.label}</MagCap>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.03em", color: M.ink, lineHeight: 1 }}>{k.value}</span>
            {k.delta && <span style={{ fontSize: 12, fontWeight: 800, color: k.delta.startsWith("−") ? M.muted : M.olive }}>{k.delta}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionHead({ children, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
      <Hairline label={children} style={{ flex: 1, marginRight: 16 }}/>
      {action && <span onClick={onAction} style={{ fontSize: 12.5, fontWeight: 800, color: M.terra, cursor: "pointer", whiteSpace: "nowrap" }}>{action}</span>}
    </div>
  );
}

/* ================================================================
   관리자 대시보드
   ================================================================ */
function AdminOverview({ onNavigate }) {
  const pending = (window.ASSETS || []).filter((a) => a.consent === "대기");
  return (
    <ConsoleShell role="admin" active="console-admin" onNavigate={onNavigate}>
      <ConsoleTopBar role="admin" subtitle="OVERVIEW" title="운영 대시보드"
        action={<MButton kind="primary" size="md" onClick={() => onNavigate("admin-content")}>콘텐츠 관리 →</MButton>}/>
      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28 }}>
        <ConsoleKPIs items={[
          { label: "총 공간",   value: "526", delta: "+8" },
          { label: "총 예약",   value: "1,284", delta: "+12%" },
          { label: "권리 대기", value: String(pending.length || 3), delta: null },
          { label: "사용자",    value: "2,480", delta: "+5%" },
        ]}/>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
          {/* 빠른 작업 */}
          <div>
            <SectionHead>QUICK ACTIONS · 빠른 작업</SectionHead>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { t: "콘텐츠 관리", d: "공간·코스·컬렉션 등록과 편집", to: "admin-content", icon: "edit" },
                { t: "예약·매출 통계", d: "코스별 예약과 매출 흐름", to: "admin-stats", icon: "calendar" },
                { t: "권리 관리", d: "사진·도면 저작권 동의 게이트", to: "admin-rights", icon: "bookmark" },
                { t: "지도에서 보기", d: "사용자가 보는 지도 메뉴", to: "home", icon: "map" },
              ].map((q) => (
                <div key={q.to} onClick={() => onNavigate(q.to)} style={{
                  background: M.cream, borderRadius: MR.card, padding: 16, cursor: "pointer", boxShadow: MS.cardSm,
                  display: "flex", flexDirection: "column", gap: 8, minHeight: 110,
                }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: `${M.terra}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MIcon name={q.icon} size={18} color={M.terra}/>
                  </span>
                  <div style={{ fontSize: 14.5, fontWeight: 900, color: M.ink, letterSpacing: "-0.01em" }}>{q.t}</div>
                  <div style={{ fontSize: 11.5, color: M.muted, fontWeight: 600, lineHeight: 1.45, textWrap: "pretty" }}>{q.d}</div>
                </div>
              ))}
            </div>
          </div>
          {/* 권리 대기 큐 */}
          <div>
            <SectionHead action="전체 →" onAction={() => onNavigate("admin-rights")}>RIGHTS QUEUE · 동의 대기</SectionHead>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(window.ASSETS || []).slice(0, 5).map((a) => (
                <div key={a.id} onClick={() => onNavigate("admin-rights")} style={{
                  background: M.cream, borderRadius: MR.card, padding: "11px 13px", boxShadow: MS.cardSm, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: a.consent === "완료" ? M.olive : a.consent === "대기" ? M.terra : M.muted, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: M.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</div>
                    <div style={{ fontSize: 10.5, color: M.muted, fontWeight: 600 }}>{a.type} · {a.owner}</div>
                  </div>
                  <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 800, color: a.consent === "완료" ? M.olive : M.terra }}>{a.consent}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ConsoleShell>
  );
}

/* ================================================================
   코스 운영자 콘솔
   ================================================================ */
function TourConsole({ onNavigate }) {
  const courses = (window.COURSES || []);
  const myCourses = courses.slice(0, 6);
  const upcoming = (window.BOOKINGS || []).filter((b) => b.status === "예정");
  return (
    <ConsoleShell role="tour" active="console-tour" onNavigate={onNavigate}>
      <ConsoleTopBar role="tour" subtitle="OPERATIONS" title="코스 운영"
        action={<MButton kind="primary" size="md" onClick={() => onNavigate("upload-deep")} icon={<MIcon name="plus" size={14} color={M.cream}/>}>새 코스 만들기</MButton>}/>
      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28 }}>
        <ConsoleKPIs items={[
          { label: "운영 중 코스", value: "6", delta: "+1" },
          { label: "이번 달 예약", value: "84", delta: "+12%" },
          { label: "예약 대기",   value: String(upcoming.length || 2), delta: null },
          { label: "이번 달 매출", value: "₩ 3.1M", delta: "+9%" },
        ]}/>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
          {/* 내 코스 */}
          <div>
            <SectionHead action="전체 코스 →" onAction={() => onNavigate("course")}>MY COURSES · 내 코스</SectionHead>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {myCourses.map((c) => (
                <div key={c.id} style={{
                  background: M.cream, borderRadius: MR.cardLg, padding: 12, boxShadow: MS.cardSm,
                  display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 14, alignItems: "center",
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: c.cover, color: M.cream,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 700, opacity: 0.8 }}>{c.type === "도슨트" ? "DOCENT" : "SELF"}</span>
                    <span style={{ fontSize: 16, fontWeight: 900 }}>{c.buildings.length}곳</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: M.ink, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: M.muted, fontWeight: 600, marginTop: 3 }}>★ {c.rating} · 예약 {c.visited} · {c.duration}</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6, fontSize: 10.5, fontWeight: 800, color: M.olive, background: `${M.olive}1a`, padding: "2px 8px", borderRadius: 999 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: M.olive }}/>운영 중
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <MButton kind="secondary" size="sm" onClick={() => onNavigate("course", c.id)}>미리보기</MButton>
                    <MButton kind="ghost" size="sm" onClick={() => onNavigate("upload-deep")} style={{ color: M.muted, fontSize: 11 }}>편집</MButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 다가오는 예약 */}
          <div>
            <SectionHead action="예약·매출 →" onAction={() => onNavigate("admin-stats")}>UPCOMING · 다가오는 예약</SectionHead>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {upcoming.length === 0 && (
                <div style={{ padding: "28px 14px", textAlign: "center", color: M.muted, fontSize: 12.5, fontWeight: 600, background: M.cream, borderRadius: MR.card }}>예정된 예약이 없습니다.</div>
              )}
              {upcoming.map((bk) => {
                const c = courses.find((x) => x.id === bk.courseId);
                return (
                  <div key={bk.id} style={{ background: M.cream, borderRadius: MR.card, padding: 14, boxShadow: MS.cardSm }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 999, background: M.terra, color: M.cream }}>{bk.status}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: M.muted, fontWeight: 600 }}>{bk.id}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: M.ink, letterSpacing: "-0.01em" }}>{c ? c.name : bk.courseId}</div>
                    <div style={{ fontSize: 11.5, color: M.muted, fontWeight: 700, marginTop: 5 }}>{bk.date} · {bk.time} · {bk.people}명</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: M.olive, marginTop: 6 }}>{bk.price > 0 ? `₩ ${bk.price.toLocaleString()}` : "무료"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ConsoleShell>
  );
}

/* ================================================================
   에디터 콘솔
   ================================================================ */
function EditorConsole({ onNavigate }) {
  const collections = (window.SERIES || []);
  const sc = window.seriesCourses || (() => []);
  const drafts = [
    { title: "안도 타다오 · 부산 코스 추가 검토", status: "편성중", courses: 2, updated: "2일 전" },
    { title: "한옥, 천 년의 결 · 경주 코스 후보", status: "검토", courses: 3, updated: "5일 전" },
    { title: "다시 쓰는 건축 · 인천 코스 편성", status: "편성중", courses: 1, updated: "1주 전" },
  ];
  return (
    <ConsoleShell role="editor" active="console-editor" onNavigate={onNavigate}>
      <ConsoleTopBar role="editor" subtitle="CURATION" title="시리즈 · 큐레이션"
        action={<MButton kind="primary" size="md" onClick={() => onNavigate("upload-deep")} icon={<MIcon name="edit" size={14} color={M.cream}/>}>새 시리즈</MButton>}/>
      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28 }}>
        <ConsoleKPIs items={[
          { label: "발행 시리즈", value: String(collections.length || 5), delta: "+1" },
          { label: "편성 대기",   value: "3", delta: null },
          { label: "누적 정복자", value: "1.2K", delta: "+18%" },
          { label: "총 조회수",   value: "12.4K", delta: "+22%" },
        ]}/>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
          {/* 내 시리즈 */}
          <div>
            <SectionHead action="전체 →" onAction={() => onNavigate("collection")}>MY SERIES · 내 시리즈</SectionHead>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {collections.slice(0, 4).map((c) => (
                <div key={c.id} onClick={() => onNavigate("collection", c.id)} style={{ cursor: "pointer", background: M.cream, borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.cardSm }}>
                  <div style={{ aspectRatio: "16/9", background: c.cover, position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,18,28,0.55), transparent 60%)" }}/>
                    <div style={{ position: "absolute", left: 12, bottom: 10, right: 12 }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{c.no} · {c.kind}</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginTop: 2 }}>{c.title}</div>
                    </div>
                  </div>
                  <div style={{ padding: "10px 13px 13px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11.5, color: M.muted, fontWeight: 700 }}>{c.kind} · {sc(c).length}코스</span>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: M.terra }}>편집 →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 코스 편성 대기 */}
          <div>
            <SectionHead action="새 시리즈 →" onAction={() => onNavigate("upload-deep")}>QUEUE · 코스 편성 대기</SectionHead>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {drafts.map((d, i) => (
                <div key={i} onClick={() => onNavigate("upload-deep")} style={{ background: M.cream, borderRadius: MR.card, padding: 14, boxShadow: MS.cardSm, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 800, padding: "3px 9px", borderRadius: 999,
                      background: d.status === "검토" ? `${M.olive}22` : `${M.terra}14`, color: d.status === "검토" ? M.oliveDeep : M.terra }}>{d.status}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: M.muted, fontWeight: 600 }}>{d.courses} 코스</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: M.ink, letterSpacing: "-0.01em", lineHeight: 1.3, textWrap: "pretty" }}>{d.title}</div>
                  <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 6 }}>수정 {d.updated}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ConsoleShell>
  );
}

Object.assign(window, { CONSOLE_NAV, ConsoleShell, ConsoleTopBar, ConsoleKPIs, AdminOverview, TourConsole, EditorConsole });
