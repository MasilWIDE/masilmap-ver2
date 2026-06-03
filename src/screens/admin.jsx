/* ================================================================
   masilmap — 관리자 대시보드
   (#9)  콘텐츠 관리
   (#10) 예약·매출 통계
   (#11) 권리 태그·동의 관리 (핵심)
   ================================================================ */

const ADMIN_NAV = [
  { id: "admin-content", label: "콘텐츠 관리",   icon: "home",    count: 526 },
  { id: "admin-stats",   label: "예약·매출",      icon: "calendar", count: null },
  { id: "admin-rights",  label: "권리 관리",      icon: "bookmark", count: 47 },
  { id: "admin-taxonomy", label: "분류·태그 관리", icon: "sparkle", count: null },
  { id: "admin-users",   label: "사용자",         icon: "users",   count: 2480, disabled: true },
];

function AdminShell({ active, onNavigate, children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: M.beige, fontFamily: "Pretendard, Nunito, sans-serif", color: M.ink }}>
      {/* 사이드바 */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: M.beige, padding: "20px 16px",
        borderRight: `1px solid ${M.beigeAlt}`,
        position: "sticky", top: 0, height: "100vh",
        display: "flex", flexDirection: "column",
      }}>
        <div onClick={() => onNavigate("home")} style={{ cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
          <MasilmapLogo size={22}/>
        </div>
        <div style={{ padding: "6px 10px", marginBottom: 14, background: M.beigeAlt, borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 999, background: M.ink, color: M.cream, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11 }}>A</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: M.ink, letterSpacing: "-0.005em" }}>운영자 모드</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, color: M.muted, letterSpacing: "0.05em" }}>masil-admin</div>
          </div>
        </div>
        <MagCap style={{ marginBottom: 8, padding: "0 4px" }}>SECTIONS</MagCap>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {ADMIN_NAV.map((n) => {
            const on = n.id === active;
            return (
              <div
                key={n.id}
                onClick={() => !n.disabled && onNavigate(n.id)}
                style={{
                  padding: "10px 12px", borderRadius: 10,
                  background: on ? M.terra : "transparent",
                  color: on ? M.cream : n.disabled ? M.faint : M.ink,
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                  cursor: n.disabled ? "default" : "pointer",
                  fontSize: 13, fontWeight: 700,
                  whiteSpace: "nowrap",
                }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
                  <MIcon name={n.icon} size={15} color={on ? M.cream : n.disabled ? M.faint : M.ink}/>
                  {n.label}
                </span>
                {n.count != null && (
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: on ? "rgba(255,248,236,0.7)" : M.muted }}>{n.count}</span>
                )}
              </div>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", padding: "12px 10px", borderRadius: 10, background: M.beigeAlt }}>
          <MagCap style={{ marginBottom: 4 }}>ENV</MagCap>
          <div style={{ fontSize: 11, fontWeight: 700, color: M.ink }}>production · ko-KR</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: M.muted, marginTop: 2 }}>v2.4.1 · build #3201</div>
        </div>
      </aside>

      {/* 본문 */}
      <main style={{ flex: 1, minWidth: 0, overflowX: "auto" }}>
        {children}
      </main>
    </div>
  );
}

function AdminTopBar({ title, subtitle, action }) {
  return (
    <div style={{
      padding: "20px 32px",
      background: M.beige,
      borderBottom: `1px solid ${M.beigeAlt}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      position: "sticky", top: 0, zIndex: 10,
    }}>
      <div>
        <MagCap color={M.terra}>ADMIN / {subtitle}</MagCap>
        <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: "4px 0 0" }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}

/* ================================================================
   #9  콘텐츠 관리
   ================================================================ */
function AdminContentScreen({ onNavigate }) {
  const [tab, setTab] = React.useState("buildings");
  const [search, setSearch] = React.useState("");

  return (
    <AdminShell active="admin-content" onNavigate={onNavigate}>
      <AdminTopBar
        subtitle="CONTENT MANAGEMENT"
        title="콘텐츠 관리"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <MButton kind="secondary" size="md" icon={<MIcon name="filter" size={14} color={M.ink}/>}>내보내기</MButton>
            <MButton kind="primary" size="md" icon={<MIcon name="plus" size={14} color={M.cream}/>} onClick={() => onNavigate("upload-deep")}>새 건물 등록</MButton>
          </div>
        }/>

      {/* 탭 */}
      <div style={{ padding: "0 32px", borderBottom: `1px solid ${M.beigeAlt}`, background: M.beige, display: "flex", gap: 4 }}>
        {[
          { id: "buildings", label: "공간",    count: BUILDINGS.length },
          { id: "courses",   label: "코스",    count: COURSES.length },
          { id: "collections", label: "시리즈", count: SERIES.length },
        ].map((t) => {
          const on = tab === t.id;
          return (
            <div key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "14px 18px 16px",
              fontSize: 13, fontWeight: 800,
              color: on ? M.terra : M.muted,
              borderBottom: on ? `3px solid ${M.terra}` : "3px solid transparent",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: -1,
              whiteSpace: "nowrap",
            }}>
              <span>{t.label}</span>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: on ? M.terra : M.faint, fontWeight: 600 }}>{t.count}</span>
            </div>
          );
        })}
      </div>

      {/* 필터 바 */}
      <div style={{ padding: "16px 32px", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", borderBottom: `1px solid ${M.beigeAlt}`, background: M.beige }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: M.cream, padding: "10px 14px", borderRadius: 12, minWidth: 280, border: `1px solid ${M.beigeAlt}` }}>
          <MIcon name="search" size={14} color={M.muted}/>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="건물명·설계자·지역 검색" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: M.ink, fontWeight: 600, fontFamily: "inherit", minWidth: 0 }}/>
        </div>
        <AdminFilter label="용도" value="전체"/>
        <AdminFilter label="지역" value="전체"/>
        <AdminFilter label="상태" value="공개"/>
        <AdminFilter label="등록일" value="최근 30일"/>
        <span style={{ marginLeft: "auto", fontSize: 12, color: M.muted, fontWeight: 700 }}>{BUILDINGS.length}건 · 정렬 ↕ 등록일 ↓</span>
      </div>

      {/* 테이블 */}
      <div style={{ padding: 32 }}>
        <div style={{ background: M.cream, borderRadius: 18, overflow: "hidden", boxShadow: MS.cardSm, border: `1px solid ${M.beigeAlt}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1.6fr 0.8fr 0.8fr 0.8fr 0.8fr 120px", padding: "12px 20px", background: M.beigeAlt, fontSize: 11, fontWeight: 800, color: M.muted, letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: `1px solid ${M.beigeAlt}` }}>
            <span></span>
            <span>건물명 · 설계자</span>
            <span>용도</span>
            <span>지역</span>
            <span>등록일</span>
            <span>상태</span>
            <span style={{ textAlign: "right" }}>액션</span>
          </div>
          {BUILDINGS.map((b, i) => (
            <div key={b.id} style={{
              display: "grid", gridTemplateColumns: "60px 1.6fr 0.8fr 0.8fr 0.8fr 0.8fr 120px",
              padding: "14px 20px", borderBottom: i === BUILDINGS.length - 1 ? "none" : `1px solid ${M.beigeAlt}`,
              alignItems: "center", fontSize: 13,
            }}>
              <div style={{ width: 44, height: 44 }}>
                <ImgPlaceholder ratio="1/1" tone={b.pinTone === "olive" ? "olive" : "beige"} style={{ borderRadius: 8 }}/>
              </div>
              <div>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: M.ink, letterSpacing: "-0.01em" }}>{b.name}</span>
                </div>
                <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 2 }}>{b.architect} · {b.year}</div>
              </div>
              <span style={{ fontWeight: 600, color: M.ink }}>{b.type}</span>
              <span style={{ fontWeight: 600, color: M.ink }}>{b.region}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: M.muted, fontWeight: 600 }}>2026.0{(i%9)+1}.{(10+i).toString().padStart(2,"0")}</span>
              <span>
                <StatusBadge status={i % 8 === 0 ? "대기" : i % 7 === 0 ? "비공개" : "공개"}/>
              </span>
              <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                <IconBtn icon="edit"/>
                <IconBtn icon="share"/>
                <IconBtn icon="settings"/>
              </div>
            </div>
          ))}
          <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: M.cream }}>
            <span style={{ fontSize: 12, color: M.muted, fontWeight: 700 }}>1 ~ {BUILDINGS.length} / {BUILDINGS.length}건 표시</span>
            <div style={{ display: "flex", gap: 4 }}>
              {["‹", "1", "2", "3", "…", "23", "›"].map((p, i) => (
                <div key={i} style={{ minWidth: 28, height: 28, padding: "0 8px", borderRadius: 8, background: p === "1" ? M.terra : "transparent", color: p === "1" ? M.cream : M.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, cursor: "pointer", border: p !== "1" ? `1px solid ${M.beigeAlt}` : "none" }}>{p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function AdminFilter({ label, value }) {
  return (
    <div style={{ padding: "9px 14px", borderRadius: 12, background: M.cream, border: `1px solid ${M.beigeAlt}`, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" }}>
      <span style={{ color: M.muted, fontWeight: 700 }}>{label}</span>
      <span style={{ color: M.ink, fontWeight: 800 }}>{value}</span>
      <MIcon name="chevron" size={10} color={M.muted} style={{ transform: "rotate(90deg)" }}/>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    "공개":   { bg: `${M.olive}1f`,    fg: M.oliveDeep, dot: M.olive },
    "대기":   { bg: `${M.terra}1f`,    fg: M.terraDeep, dot: M.terra },
    "보류":   { bg: "rgba(31,34,48,0.10)", fg: "#1F2230", dot: "#1F2230" },
    "비공개": { bg: "rgba(58,46,34,0.08)", fg: M.muted,   dot: M.muted   },
    "완료":   { bg: `${M.olive}1f`,    fg: M.oliveDeep, dot: M.olive },
  };
  const c = colors[status] || colors["대기"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 999,
      background: c.bg, color: c.fg,
      fontSize: 11, fontWeight: 800,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: c.dot }}/>
      {status}
    </span>
  );
}

function IconBtn({ icon }) {
  return (
    <div style={{ width: 28, height: 28, borderRadius: 8, background: M.beige, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
      <MIcon name={icon} size={13} color={M.ink}/>
    </div>
  );
}

/* ================================================================
   #10  예약·매출 통계
   ================================================================ */
function AdminStatsScreen({ onNavigate }) {
  // KPI cards
  const kpis = [
    { label: "총 예약",         value: "1,284",      delta: "+12%",  color: M.terra },
    { label: "총 매출",         value: "₩ 48.2M",    delta: "+18%",  color: M.olive },
    { label: "이번 달",         value: "₩ 8.4M",     delta: "+7%",   color: M.terra },
    { label: "평균 객단가",      value: "₩ 37,600",   delta: "−2%",   color: M.muted },
  ];

  // monthly revenue (last 12 mo)
  const revenue = [3.2, 4.1, 3.8, 4.5, 5.2, 6.1, 5.8, 6.5, 7.2, 6.8, 7.5, 8.4];
  const maxRev = Math.max(...revenue);
  const months = ["7","8","9","10","11","12","1","2","3","4","5","6"];

  // course bookings
  const byCourse = [
    { name: "북촌 골목",       count: 412, color: M.terra },
    { name: "콘크리트와 빛",   count: 298, color: M.olive },
    { name: "부석사 가을",     count: 234, color: M.terraDeep },
    { name: "DDP 야간",         count: 189, color: "#1F2230" },
    { name: "보안 1942",        count: 151, color: M.oliveDeep },
  ];
  const maxC = Math.max(...byCourse.map((x) => x.count));

  return (
    <AdminShell active="admin-stats" onNavigate={onNavigate}>
      <AdminTopBar
        subtitle="STATS · BOOKINGS · REVENUE"
        title="예약·매출 통계"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <AdminFilter label="기간" value="최근 12개월"/>
            <AdminFilter label="비교" value="전년 동기"/>
            <MButton kind="primary" size="md">CSV 내보내기</MButton>
          </div>
        }/>

      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
        {/* KPI */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ background: M.cream, borderRadius: 18, padding: 20, boxShadow: MS.cardSm, border: `1px solid ${M.beigeAlt}` }}>
              <MagCap>{k.label}</MagCap>
              <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.025em", color: M.ink, marginTop: 8 }}>{k.value}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: k.delta.startsWith("−") ? M.muted : k.color }}>{k.delta}</span>
                <span style={{ fontSize: 11, color: M.muted, fontWeight: 600 }}>전월 대비</span>
              </div>
            </div>
          ))}
        </div>

        {/* 매출 추이 차트 */}
        <div style={{ background: M.cream, borderRadius: 18, padding: 24, boxShadow: MS.cardSm, border: `1px solid ${M.beigeAlt}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
            <div>
              <MagCap>REVENUE · 월별 매출 추이</MagCap>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: M.ink, letterSpacing: "-0.015em", margin: "4px 0 0" }}>지난 12개월 매출</h3>
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 11, fontWeight: 700, color: M.muted }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: M.terra }}/> 매출 (단위: M₩)</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 2, background: M.olive, borderRadius: 999 }}/> 추세선</span>
            </div>
          </div>
          {/* bar chart */}
          <div style={{ position: "relative", height: 220, display: "flex", alignItems: "flex-end", gap: 14, paddingBottom: 28, borderBottom: `1px solid ${M.beigeAlt}` }}>
            {/* y-axis lines */}
            <div style={{ position: "absolute", inset: "0 0 28px 0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              {[10, 7.5, 5, 2.5, 0].map((v, i) => (
                <div key={i} style={{ height: 1, background: i === 4 ? "transparent" : "rgba(58,46,34,0.06)", position: "relative" }}>
                  <span style={{ position: "absolute", right: "calc(100% + 8px)", top: -7, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: M.muted, fontWeight: 600 }}>{v}M</span>
                </div>
              ))}
            </div>
            {revenue.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative", zIndex: 1 }}>
                <div style={{
                  width: "100%", height: `${(v / 10) * 100}%`, minHeight: 8,
                  background: `linear-gradient(to top, ${M.terra}, ${M.terraSoft})`,
                  borderRadius: "8px 8px 0 0",
                  position: "relative",
                }}>
                  {i === revenue.length - 1 && (
                    <span style={{ position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", fontSize: 11, fontWeight: 800, color: M.terra, whiteSpace: "nowrap" }}>{v}M ★</span>
                  )}
                </div>
              </div>
            ))}
            {/* trend overlay */}
            <svg viewBox="0 0 1000 220" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width="100%" height="100%">
              <path d={revenue.map((v, i) => `${i === 0 ? "M" : "L"} ${(i + 0.5) * (1000 / revenue.length)} ${(1 - v / 10) * 192}`).join(" ")}
                fill="none" stroke={M.olive} strokeWidth="2.5" strokeDasharray="6 6" opacity="0.7"/>
            </svg>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            {months.map((m) => (
              <div key={m} style={{ flex: 1, textAlign: "center", fontSize: 11, color: M.muted, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{m}월</div>
            ))}
          </div>
        </div>

        {/* 코스별 예약 + 예약 현황 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24 }}>
          {/* 코스별 예약 수 (가로 바) */}
          <div style={{ background: M.cream, borderRadius: 18, padding: 24, boxShadow: MS.cardSm, border: `1px solid ${M.beigeAlt}` }}>
            <MagCap>BY COURSE · 코스별 예약 수</MagCap>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: M.ink, letterSpacing: "-0.015em", margin: "4px 0 20px" }}>인기 코스 Top 5</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {byCourse.map((c, i) => (
                <div key={c.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, fontWeight: 700 }}>
                    <span style={{ color: M.ink }}><Serial color={c.color} size={11}>0{i+1}</Serial> &nbsp; {c.name}</span>
                    <span style={{ color: M.muted, fontFamily: "'JetBrains Mono', monospace" }}>{c.count}건</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 999, background: M.beige, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(c.count / maxC) * 100}%`, background: c.color, borderRadius: 999 }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 예약 현황 (mini) */}
          <div style={{ background: M.cream, borderRadius: 18, padding: 24, boxShadow: MS.cardSm, border: `1px solid ${M.beigeAlt}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <MagCap>RECENT · 최근 예약 현황</MagCap>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: M.ink, letterSpacing: "-0.015em", margin: "4px 0 0" }}>예약 상태</h3>
              </div>
              <MagCap color={M.terra}>전체 보기 →</MagCap>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1.6fr 1fr 0.8fr 0.8fr auto", gap: 12, padding: "16px 0 8px", fontSize: 10, fontWeight: 800, color: M.muted, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: `1px solid ${M.beigeAlt}` }}>
              <span style={{ width: 80 }}>예약번호</span>
              <span>코스 · 예약자</span>
              <span>날짜</span>
              <span>인원</span>
              <span>금액</span>
              <span style={{ width: 60, textAlign: "right" }}>상태</span>
            </div>
            {[
              { id: "B2026-0418", course: "북촌 골목", name: "민서", date: "06.27", people: 2, amount: 64000, status: "예정" },
              { id: "B2026-0417", course: "부석사 가을", name: "지은", date: "10.22", people: 1, amount: 78000, status: "예정" },
              { id: "B2026-0416", course: "콘크리트와 빛", name: "도현", date: "07.20", people: 4, amount: 1120000, status: "결제대기" },
              { id: "B2026-0415", course: "DDP 야간", name: "수아", date: "06.20", people: 3, amount: 0, status: "완료" },
              { id: "B2026-0414", course: "북촌 골목", name: "민준", date: "06.18", people: 2, amount: 64000, status: "취소" },
            ].map((r, i) => (
              <div key={r.id} style={{ display: "grid", gridTemplateColumns: "auto 1.6fr 1fr 0.8fr 0.8fr auto", gap: 12, padding: "12px 0", fontSize: 12, borderBottom: i === 4 ? "none" : `1px solid ${M.beigeAlt}`, alignItems: "center" }}>
                <span style={{ width: 80, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: M.muted }}>{r.id}</span>
                <div>
                  <div style={{ fontWeight: 800, color: M.ink }}>{r.course}</div>
                  <div style={{ fontSize: 10, color: M.muted, fontWeight: 600 }}>{r.name}</div>
                </div>
                <span style={{ fontWeight: 700, color: M.ink }}>{r.date}</span>
                <span style={{ fontWeight: 700, color: M.ink }}>{r.people}명</span>
                <span style={{ fontWeight: 800, color: M.ink, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{r.amount > 0 ? `₩${(r.amount/1000).toFixed(0)}k` : "—"}</span>
                <span style={{ width: 60, textAlign: "right" }}>
                  <StatusBadge status={r.status === "취소" ? "비공개" : r.status === "결제대기" ? "대기" : r.status === "완료" ? "완료" : "공개"}/>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

/* ================================================================
   #11  권리 태그·동의 관리 (핵심)
   ================================================================ */
function AdminRightsScreen({ onNavigate }) {
  const [filter, setFilter] = React.useState("all");
  const [expanded, setExpanded] = React.useState("A-3202");

  const filtered = filter === "all" ? ASSETS : ASSETS.filter((a) => a.consent === ({ "ok":"완료","wait":"대기","hold":"보류" }[filter]));

  const counts = {
    all: ASSETS.length,
    ok:  ASSETS.filter((a) => a.consent === "완료").length,
    wait:ASSETS.filter((a) => a.consent === "대기").length,
    hold:ASSETS.filter((a) => a.consent === "보류").length,
  };

  return (
    <AdminShell active="admin-rights" onNavigate={onNavigate}>
      <AdminTopBar
        subtitle="RIGHTS · CONSENT MANAGEMENT"
        title="권리 태그·동의 관리"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <MButton kind="secondary" size="md">동의 요청 일괄 발송</MButton>
            <MButton kind="primary" size="md">감사로그 보기</MButton>
          </div>
        }/>

      {/* 안내 배너 */}
      <div style={{ margin: "24px 32px 0", padding: "16px 20px", borderRadius: 14, background: `${M.terra}0d`, border: `1px solid ${M.terra}30`, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 999, background: M.terra, color: M.cream, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>⚠</div>
        <div style={{ flex: 1, fontSize: 13, lineHeight: 1.6, color: M.ink, fontWeight: 600, textWrap: "pretty" }}>
          이 화면은 마실맵 자료의 <b>권리 정보와 동의 상태를 기록·관리</b>합니다. 마실그라운드의 거래·판매 UI가 아닙니다.
          공동 권리자 동의 전인 “보류” 자료는 노출이 자동 차단됩니다.
        </div>
      </div>

      {/* 상태 요약 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, padding: "20px 32px 0" }}>
        {[
          { id: "all",  label: "전체",         color: M.ink,        count: counts.all,  desc: "등록된 모든 자료" },
          { id: "ok",   label: "동의 완료",     color: M.olive,      count: counts.ok,   desc: "노출·활용 가능" },
          { id: "wait", label: "동의 대기",     color: M.terra,      count: counts.wait, desc: "요청 메일 발송 후 응답 대기" },
          { id: "hold", label: "보류",         color: "#1F2230",    count: counts.hold, desc: "공동 권리자 미동의 · 노출 차단" },
        ].map((s) => {
          const on = filter === s.id;
          return (
            <div key={s.id} onClick={() => setFilter(s.id)} style={{
              padding: 18, borderRadius: 16,
              background: M.cream,
              border: on ? `2px solid ${s.color}` : `1px solid ${M.beigeAlt}`,
              cursor: "pointer",
              boxShadow: on ? MS.card : MS.cardSm,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <MagCap color={s.color}>{s.label}</MagCap>
                <span style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.count}</span>
              </div>
              <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 8, textWrap: "pretty" }}>{s.desc}</div>
            </div>
          );
        })}
      </div>

      {/* 검색·필터 */}
      <div style={{ padding: "20px 32px 0", display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: M.cream, padding: "10px 14px", borderRadius: 12, minWidth: 280, border: `1px solid ${M.beigeAlt}` }}>
          <MIcon name="search" size={14} color={M.muted}/>
          <input placeholder="자료 ID · 자료명 · 저작권자" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: M.ink, fontWeight: 600, fontFamily: "inherit", minWidth: 0 }}/>
        </div>
        <AdminFilter label="자료 유형" value="전체"/>
        <AdminFilter label="업로더" value="전체"/>
        <span style={{ marginLeft: "auto", fontSize: 12, color: M.muted, fontWeight: 700 }}>{filtered.length}건 표시</span>
      </div>

      {/* 테이블 */}
      <div style={{ padding: "20px 32px 32px" }}>
        <div style={{ background: M.cream, borderRadius: 18, overflow: "hidden", boxShadow: MS.cardSm, border: `1px solid ${M.beigeAlt}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "100px 60px 2fr 1fr 1.4fr 1.2fr 1.2fr auto", padding: "12px 20px", background: M.beigeAlt, fontSize: 11, fontWeight: 800, color: M.muted, letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: `1px solid ${M.beigeAlt}` }}>
            <span>자료 ID</span>
            <span></span>
            <span>자료명</span>
            <span>유형</span>
            <span>저작권자</span>
            <span>수익 배분</span>
            <span>동의 상태</span>
            <span></span>
          </div>
          {filtered.map((a, i) => {
            const isOpen = expanded === a.id;
            return (
              <React.Fragment key={a.id}>
                <div style={{
                  display: "grid", gridTemplateColumns: "100px 60px 2fr 1fr 1.4fr 1.2fr 1.2fr auto",
                  padding: "14px 20px",
                  borderBottom: isOpen ? "none" : `1px solid ${M.beigeAlt}`,
                  alignItems: "center", fontSize: 13,
                  background: isOpen ? `${M.terra}0d` : "transparent",
                  cursor: "pointer",
                }} onClick={() => setExpanded(isOpen ? null : a.id)}>
                  <Serial color={a.consent === "보류" ? "#1F2230" : a.consent === "대기" ? M.terra : M.olive} size={12}>{a.id}</Serial>
                  <div style={{ width: 40, height: 40 }}>
                    <ImgPlaceholder ratio="1/1" tone={a.type === "도면" ? "beige" : a.type === "3D" ? "deep" : a.type === "다이어그램" ? "olive" : "cream"} style={{ borderRadius: 6 }}/>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: M.ink, fontFamily: "'JetBrains Mono', monospace" }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 2 }}>업로더 · {a.uploader}</div>
                  </div>
                  <span>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: M.beige, color: M.ink, border: `1px solid ${M.beigeAlt}` }}>{a.type}</span>
                  </span>
                  <span style={{ fontWeight: 700, color: M.ink }}>{a.owner}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: M.muted, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>{a.split}</span>
                  <span><StatusBadge status={a.consent}/></span>
                  <MIcon name="chevron" size={14} color={M.muted} style={{ transform: isOpen ? "rotate(90deg)" : "none" }}/>
                </div>

                {/* 펼친 행 */}
                {isOpen && (
                  <div style={{
                    padding: "16px 20px 24px",
                    background: `${M.terra}05`,
                    borderBottom: `1px solid ${M.beigeAlt}`,
                  }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 32, paddingLeft: 100 }}>
                      <div>
                        <MagCap color={M.terra} style={{ marginBottom: 12 }}>공동 권리자별 지분 · 동의 상태</MagCap>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {[
                            { name: a.owner.split("·")[0] || a.owner, share: a.split.includes("60") ? 60 : a.split.includes("50") ? 50 : a.split.includes("70") ? 70 : a.split.includes("80") ? 80 : 100, consent: "완료", joined: true },
                            ...(a.consent !== "완료" ? [{ name: "공동 권리자 B", share: 30, consent: a.consent === "보류" ? "미동의" : "대기", joined: a.consent === "대기" }] : []),
                            ...(a.consent === "보류" && a.split.includes("30") ? [{ name: "공동 권리자 C", share: 20, consent: "미가입", joined: false }] : []),
                          ].map((p, i) => (
                            <div key={i} style={{ padding: "12px 14px", borderRadius: 12, background: M.cream, border: `1px solid ${M.beigeAlt}`, display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 14, alignItems: "center" }}>
                              <MAvatar initial={p.name[0]} color={p.consent === "완료" ? M.olive : p.consent === "대기" ? M.terra : "#8A7A65"} size={32}/>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 800, color: M.ink }}>{p.name}</div>
                                <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 2 }}>
                                  {p.joined ? "마실맵 가입자" : "비가입 · 메일로 초대 발송됨"}
                                </div>
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 800, color: M.ink, fontFamily: "'JetBrains Mono', monospace" }}>{p.share}%</div>
                              <StatusBadge status={p.consent === "완료" ? "완료" : p.consent === "대기" ? "대기" : "보류"}/>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <MagCap style={{ marginBottom: 12 }}>액션</MagCap>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <MButton kind="primary" size="md" style={{ justifyContent: "center", width: "100%" }}>동의 요청 재발송</MButton>
                          <MButton kind="secondary" size="md" style={{ justifyContent: "center", width: "100%" }}>수익 배분 비율 수정</MButton>
                          <MButton kind="outline" size="md" style={{ justifyContent: "center", width: "100%" }}>감사 로그 보기</MButton>
                          <MButton kind="ghost" size="sm" style={{ justifyContent: "center", width: "100%", color: M.terraDeep }}>자료 일시 비공개 처리</MButton>
                        </div>
                        <div style={{ marginTop: 16, padding: 12, background: M.cream, borderRadius: 12, border: `1px solid ${M.beigeAlt}` }}>
                          <MagCap style={{ marginBottom: 6 }}>변경 이력</MagCap>
                          <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, lineHeight: 1.7 }}>
                            · 2026.04.12 동의 요청 발송 (운영자)<br/>
                            · 2026.04.08 권리자 등록 (업로더)<br/>
                            · 2026.04.08 자료 업로드 (업로더)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}

Object.assign(window, { AdminContentScreen, AdminStatsScreen, AdminRightsScreen, AdminTaxonomyScreen });

/* ================================================================
   #12  분류·태그 관리 (운영자) — 폴크소노미 정리 + 렌즈 승격 + 어워드
   ================================================================ */
function AdminTaxonomyScreen({ onNavigate }) {
  const sh = useMasilShared();
  const tags = txAllTags(sh.s);
  const lenses = txLenses(sh.s);
  const promoted = sh.s.promotedLenses || [];
  const banned = new Set(sh.s.bannedTags || []);
  const awardIds = new Set(sh.s.awardIds || []);

  const [mergeFrom, setMergeFrom] = React.useState("");
  const [mergeTo, setMergeTo] = React.useState("");

  return (
    <AdminShell active="admin-taxonomy" onNavigate={onNavigate}>
      <AdminTopBar
        subtitle="TAXONOMY · TAGS · LENSES"
        title="분류·태그 관리"
        action={<span style={{ fontSize: 12.5, color: M.muted, fontWeight: 700 }}>방문자 태그는 {window.TAG_PUBLIC_MIN || 2}표 이상이면 공개돼요</span>}/>

      <div style={{ padding: 32, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
        {/* 좌: 태그 목록 + 병합/금지/승격 */}
        <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: M.ink, margin: 0 }}>태그 <span style={{ color: M.muted }}>· {tags.length}</span></h3>
            <span style={{ fontSize: 12, color: M.muted, fontWeight: 700 }}>건물 수 기준 정렬</span>
          </div>

          {/* 병합 도구 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, background: M.beige, borderRadius: 14, marginBottom: 16, flexWrap: "wrap" }}>
            <select value={mergeFrom} onChange={(e) => setMergeFrom(e.target.value)} style={adminSelStyle}>
              <option value="">합칠 태그</option>
              {tags.map((t) => <option key={t.tag} value={t.tag}>#{t.tag} ({t.count})</option>)}
            </select>
            <MIcon name="chevron" size={14} color={M.muted}/>
            <select value={mergeTo} onChange={(e) => setMergeTo(e.target.value)} style={adminSelStyle}>
              <option value="">남길 태그</option>
              {tags.map((t) => <option key={t.tag} value={t.tag}>#{t.tag} ({t.count})</option>)}
            </select>
            <MButton kind="primary" size="sm" onClick={() => { if (mergeFrom && mergeTo) { sh.mergeTags(mergeFrom, mergeTo); setMergeFrom(""); setMergeTo(""); } }}>병합</MButton>
          </div>

          {/* 태그 리스트 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 460, overflowY: "auto" }}>
            {tags.map((t) => {
              const isLens = promoted.some((l) => l.tag === t.tag);
              return (
                <div key={t.tag} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#fff", borderRadius: 12, border: `1px solid ${M.beigeAlt}` }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: M.ink, whiteSpace: "nowrap" }}># {t.tag}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: M.muted, fontWeight: 700, whiteSpace: "nowrap" }}>{t.count}곳</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    <AdminMiniBtn active={isLens} onClick={() => isLens ? sh.demoteLens("tag-" + t.tag) : sh.promoteLens(t.tag, t.tag)}>
                      {isLens ? "✓ 렌즈" : "렌즈 승격"}
                    </AdminMiniBtn>
                    <AdminMiniBtn onClick={() => sh.banTag(t.tag)}>숨김</AdminMiniBtn>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 숨긴 태그 */}
          {banned.size > 0 && (
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${M.beigeAlt}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: M.muted, marginBottom: 8 }}>숨긴 태그 · {banned.size}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[...banned].map((t) => (
                  <span key={t} onClick={() => sh.unbanTag(t)} style={{ cursor: "pointer", fontSize: 12, fontWeight: 700, color: M.muted, padding: "5px 10px", borderRadius: 999, background: M.beige, textDecoration: "line-through" }}># {t} ↩</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 우: 렌즈 + 어워드 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 22 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: M.ink, margin: "0 0 4px" }}>공개 렌즈</h3>
            <p style={{ fontSize: 12.5, color: M.muted, fontWeight: 600, margin: "0 0 14px", lineHeight: 1.5 }}>지도·리스트 맨 위에 뜨는 프리셋. 태그를 승격하면 여기 추가돼요.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {lenses.map((L) => {
                const isPromoted = promoted.some((p) => p.id === L.id);
                return (
                  <div key={L.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#fff", borderRadius: 12, border: `1px solid ${M.beigeAlt}` }}>
                    <MIcon name={L.icon} size={14} color={M.olive}/>
                    <span style={{ fontSize: 14, fontWeight: 800, color: M.ink, whiteSpace: "nowrap" }}>{L.label}</span>
                    {!isPromoted && <span style={{ fontSize: 10.5, fontWeight: 700, color: M.faint, fontFamily: "'JetBrains Mono', monospace" }}>기본</span>}
                    {isPromoted && <span onClick={() => sh.demoteLens(L.id)} style={{ marginLeft: "auto", fontSize: 12, fontWeight: 800, color: M.terra, cursor: "pointer" }}>제거</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 22 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: M.ink, margin: "0 0 4px" }}>어워드 지정</h3>
            <p style={{ fontSize: 12.5, color: M.muted, fontWeight: 600, margin: "0 0 14px", lineHeight: 1.5 }}>“어워드” 렌즈에 노출할 건물을 직접 지정해요.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 300, overflowY: "auto" }}>
              {(window.BUILDINGS || []).map((b) => {
                const on = awardIds.has(b.id);
                return (
                  <label key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, cursor: "pointer", background: on ? `${M.olive}14` : "transparent" }}>
                    <input type="checkbox" checked={on} onChange={() => sh.toggleAward(b.id)} style={{ accentColor: M.olive, width: 16, height: 16 }}/>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: M.ink }}>{b.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: M.muted, fontWeight: 600 }}>{b.region}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
const adminSelStyle = { padding: "8px 12px", borderRadius: 10, border: `1px solid ${M.beigeAlt}`, background: "#fff", fontSize: 12.5, fontWeight: 700, color: M.ink, fontFamily: "inherit", cursor: "pointer" };
function AdminMiniBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 11px", borderRadius: 999, cursor: "pointer", fontSize: 11.5, fontWeight: 800, fontFamily: "inherit",
      background: active ? M.olive : "#fff", color: active ? M.terraDeep : M.ink,
      border: `1.5px solid ${active ? M.olive : M.beigeAlt}`, whiteSpace: "nowrap",
    }}>{children}</button>
  );
}

Object.assign(window, { AdminTaxonomyScreen });
