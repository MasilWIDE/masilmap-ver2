/* ================================================================
   masilmap — 마실 코스 상세 (#2)
   상단 코스 헤더 + 요약 바 + 경로 지도 + 정류장 카드 리스트
   ================================================================ */

/* 코스 인덱스 (전체 코스 그리드 — 사이드 화면) */
function CourseIndex({ onNavigate }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const px = pageX(isMobile, isTablet);
  return (
    <MPage>
      <MasilNav route="course" onNavigate={onNavigate}/>
      <section style={{ padding: `${isMobile ? 24 : 48}px ${px}px ${isMobile ? 20 : 32}px` }}>
        <Hairline label={`MASILMAP / COURSES · ${COURSES.length} KEPT WALKS`} style={{ marginBottom: isMobile ? 18 : 32 }}/>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr",
          gap: isMobile ? 16 : 56,
          alignItems: "end",
        }}>
          <h1 style={{ fontSize: isMobile ? 36 : 72, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.05, color: M.ink, margin: 0, textWrap: "balance" }}>
            오늘 걷기 좋은{isMobile ? " " : <br/>}
            <span style={{ color: M.olive, fontWeight: 900 }}>코스</span> {COURSES.length}가지
          </h1>
          <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 14 : 17, lineHeight: 1.7, color: M.ink, margin: 0, textWrap: "pretty" }}>
            마실 코스는 동네 큐레이터와 건축사학자가 직접 걸어보고 묶은 워킹 가이드입니다. 도슨트가 있는 코스는 예약, 셀프 코스는 무료로 따라 걸으실 수 있어요.
          </p>
        </div>
      </section>
      <section style={{
        padding: `0 ${px}px 64px`,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: 20,
      }}>
        {COURSES.map((c) => (
          <div key={c.id} onClick={() => onNavigate("course", c.id)} style={{
            background: M.cream, borderRadius: MR.cardLg, overflow: "hidden",
            cursor: "pointer", boxShadow: MS.card,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}>
            <div style={{
              width: isMobile ? "100%" : 220,
              flexShrink: 0,
              background: c.cover, padding: 20, color: M.cream,
              display: "flex", flexDirection: isMobile ? "row" : "column",
              alignItems: isMobile ? "center" : "stretch",
              justifyContent: "space-between",
            }}>
              <MagCap color="rgba(255,248,236,0.7)">{c.type === "도슨트" ? "DOCENT" : "SELF"}</MagCap>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.9 }}>{c.curator.name} 큐레이션</div>
                <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.025em", marginTop: 4 }}>{c.buildings.length}곳</div>
              </div>
            </div>
            <div style={{ padding: 20, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <MagCap>{c.type === "도슨트" ? "DOCENT" : "SELF"} · ★ {c.rating}</MagCap>
                {c.price > 0
                  ? <MagCap color={M.terra}>₩ {c.price.toLocaleString()}</MagCap>
                  : <MagCap color={M.olive}>FREE</MagCap>}
              </div>
              <div style={{ fontSize: 21, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, lineHeight: 1.2 }}>{c.name}</div>
              <p style={{ fontSize: 13, color: M.ink, lineHeight: 1.6, margin: "8px 0 12px", fontWeight: 500, textWrap: "pretty" }}>{c.blurb}</p>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: M.muted, fontWeight: 600, letterSpacing: "0.05em", display: "flex", gap: 10 }}>
                <span>{c.distance}</span><span>·</span><span>{c.duration}</span><span>·</span><span>{c.difficulty}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
      <MFooter/>
    </MPage>
  );
}

/* 점선 경로 지도 */
function CourseRouteMap({ stops, height = 380 }) {
  // distribute stops along a curvy path
  const pts = stops.map((s, i) => {
    const t = (i + 0.5) / stops.length;
    const x = 80 + t * 700 + Math.sin(t * 3.2) * 40;
    const y = 200 + Math.sin(t * 4) * 90 + (i % 2 === 0 ? -10 : 10);
    return { x, y, s, i };
  });
  const pathD = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  return (
    <div style={{ position: "relative", width: "100%", height, background: M.cream, borderRadius: MR.cardLg, overflow: "hidden" }}>
      <svg viewBox="0 0 900 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <defs>
          <pattern id="cgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(58,46,34,0.06)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cgrid)" />
        {/* roads */}
        <path d="M -20 120 C 240 140 520 80 920 110" fill="none" stroke="#D4C29E" strokeWidth="22" strokeLinecap="round" />
        <path d="M -20 280 C 220 300 600 250 920 290" fill="none" stroke="#D4C29E" strokeWidth="18" strokeLinecap="round" />
        <path d="M 220 -20 C 230 180 280 320 240 420" fill="none" stroke="#D4C29E" strokeWidth="14" strokeLinecap="round" />
        <path d="M 620 -20 C 610 160 650 320 640 420" fill="none" stroke="#D4C29E" strokeWidth="14" strokeLinecap="round" />
        {/* dotted route */}
        <path d={pathD} fill="none" stroke={M.terra} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="2 10"/>
        {/* numbered pins */}
        {pts.map((p) => (
          <g key={p.i} transform={`translate(${p.x}, ${p.y})`}>
            <circle r="22" fill={M.cream} stroke={M.terra} strokeWidth="2.5"/>
            <text textAnchor="middle" dy="6" fontFamily="Pretendard, Nunito, sans-serif" fontSize="16" fontWeight="900" fill={M.terra}>
              {p.i + 1}
            </text>
            <text x="0" y="-30" textAnchor="middle" fontFamily="Pretendard, Nunito, sans-serif" fontSize="12" fontWeight="800" fill={M.ink}
              style={{ paintOrder: "stroke", stroke: M.cream, strokeWidth: 4, strokeLinejoin: "round" }}>
              {p.s.name}
            </text>
          </g>
        ))}
        {/* start/end caps */}
        <g transform={`translate(${pts[0].x - 38}, ${pts[0].y})`}>
          <rect x="-24" y="-10" width="48" height="20" rx="10" fill={M.olive}/>
          <text textAnchor="middle" dy="4" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fill={M.cream}>START</text>
        </g>
        <g transform={`translate(${pts[pts.length-1].x + 38}, ${pts[pts.length-1].y})`}>
          <rect x="-22" y="-10" width="44" height="20" rx="10" fill={M.ink}/>
          <text textAnchor="middle" dy="4" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fill={M.cream}>END</text>
        </g>
      </svg>
      {/* HUD */}
      <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,248,236,0.95)", padding: "8px 14px", borderRadius: 12, boxShadow: MS.cardSm, display: "flex", alignItems: "center", gap: 10 }}>
        <MIcon name="walk" size={14} color={M.terra}/>
        <MagCap>코스 경로 · 점선</MagCap>
      </div>
    </div>
  );
}

/* 정류장 카드 */
function StopCard({ stop, idx, total, onClick, nextDist }) {
  return (
    <div style={{ display: "flex", gap: 16, padding: "20px 0", borderTop: idx === 0 ? `1px solid ${M.beigeAlt}` : "none", borderBottom: `1px solid ${M.beigeAlt}`, cursor: "pointer" }} onClick={onClick}>
      <div style={{ width: 48, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: 999, background: M.terra, color: M.cream, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18 }}>
          {idx + 1}
        </div>
        {idx < total - 1 && (
          <div style={{ width: 2, flex: 1, background: M.beigeAlt, marginTop: 8 }}/>
        )}
      </div>
      <div style={{ width: 140, flexShrink: 0 }}>
        <ImgPlaceholder ratio="4/3" tone={stop.pinTone === "olive" ? "olive" : "beige"} style={{ borderRadius: 14 }}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <MagCap>{stop.type}</MagCap>
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink }}>{stop.name}</div>
        <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 4 }}>{stop.architect} · {stop.year} · {stop.region}</div>
        <p style={{ fontSize: 13, color: M.ink, lineHeight: 1.6, margin: "8px 0 0", fontWeight: 500, textWrap: "pretty" }}>{stop.intro}</p>
        <div style={{ display: "flex", gap: 14, marginTop: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: M.muted }}>
          <span>머무는 시간 · {idx === 0 ? "60분" : idx === total - 1 ? "70분" : "40분"}</span>
          {idx < total - 1 && <><span>·</span><span>다음까지 · {nextDist}</span></>}
        </div>
      </div>
      <MIcon name="chevron" size={20} color={M.muted}/>
    </div>
  );
}

function CourseScreen({ onNavigate, courseId }) {
  const c = COURSES.find((x) => x.id === courseId) || COURSES[0];
  const stops = c.buildings.map((id) => BUILDINGS.find((b) => b.id === id)).filter(Boolean);
  const distGuess = ["1.4km", "0.9km", "1.6km", "0.7km"];

  return (
    <MPage>
      <MasilNav route="course" onNavigate={onNavigate}/>

      {/* 코스 헤더 */}
      <section style={{ padding: "32px 56px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 20 }}>
          <span onClick={() => onNavigate("course")} style={{ cursor: "pointer" }}>마실 코스</span>
          <MIcon name="chevron" size={12} color={M.muted}/>
          <span style={{ color: M.ink }}>{c.name}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 56, alignItems: "end" }}>
          <div>
            <Serial color={M.terra} size={14}>{c.type === "도슨트" ? "도슨트 코스" : "셀프 코스"}</Serial>
            <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.02, margin: "14px 0 0", color: M.ink, textWrap: "balance" }}>
              {c.name}
            </h1>
            <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 19, lineHeight: 1.65, color: M.muted, marginTop: 20, marginBottom: 0, fontWeight: 400, maxWidth: 680, textWrap: "pretty" }}>{c.blurb}</p>
          </div>
          <div>
            {/* curator */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <MAvatar initial={c.curator.initial} color={c.curator.color} size={48}/>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: M.ink }}>{c.curator.name}</div>
                  {c.curator.verified && (
                    <span style={{ fontSize: 9, fontWeight: 800, color: M.cream, background: M.olive, padding: "2px 6px", borderRadius: 999 }}>인증</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 2 }}>{c.curator.role}</div>
              </div>
            </div>
            {/* rating */}
            <div style={{ display: "flex", gap: 32, paddingTop: 14, borderTop: `1px solid ${M.beigeAlt}` }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>★ {c.rating}</div>
                <MagCap style={{ marginTop: 4 }}>{c.reviews}개 리뷰</MagCap>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>{c.visited.toLocaleString()}</div>
                <MagCap style={{ marginTop: 4 }}>다녀온 이웃</MagCap>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>♡ {c.saved}</div>
                <MagCap style={{ marginTop: 4 }}>저장</MagCap>
              </div>
            </div>
          </div>
        </div>

        {/* 요약 바 */}
        <div style={{ marginTop: 32, padding: "20px 24px", background: M.cream, borderRadius: MR.card, boxShadow: MS.cardSm, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24, alignItems: "center" }}>
          {[
            { l: "건축물", v: `${stops.length}곳`, i: "location" },
            { l: "총 거리", v: c.distance, i: "walk" },
            { l: "예상 시간", v: c.duration, i: "clock" },
            { l: "고도차", v: c.elevation, i: "arrow" },
            { l: "난이도", v: c.difficulty, i: "sparkle" },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, borderLeft: i === 0 ? "none" : `1px solid ${M.beigeAlt}`, paddingLeft: i === 0 ? 0 : 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: `${M.terra}1f`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MIcon name={m.i} size={16} color={M.terra}/>
              </div>
              <div>
                <MagCap>{m.l}</MagCap>
                <div style={{ fontSize: 16, fontWeight: 900, color: M.ink, marginTop: 2, letterSpacing: "-0.01em" }}>{m.v}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 지도 */}
      <section style={{ padding: "16px 56px 32px" }}>
        <Hairline label="ROUTE · 점선 경로" style={{ marginBottom: 16 }}/>
        <CourseRouteMap stops={stops}/>
        <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 11, color: M.muted, fontWeight: 600 }}>
          <span>지도는 실제 네이버·카카오 지도 SDK 연동 예정</span>
          <span>↑ 일러스트 목업</span>
        </div>
      </section>

      {/* 정류장 리스트 */}
      <section style={{ padding: "16px 56px 48px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 56 }}>
        <div>
          <Hairline label={`${stops.length} STOPS · 순서대로`} style={{ marginBottom: 8 }}/>
          {stops.map((s, i) => (
            <StopCard key={s.id} stop={s} idx={i} total={stops.length} nextDist={distGuess[i]} onClick={() => onNavigate("detail", s.id)}/>
          ))}
        </div>
        <aside style={{ position: "sticky", top: 110, alignSelf: "flex-start" }}>
          <div style={{ padding: 24, background: M.cream, borderRadius: MR.cardLg, boxShadow: MS.card }}>
            <MagCap color={M.terra}>{c.type === "도슨트" ? "DOCENT COURSE" : "SELF COURSE"}</MagCap>
            <div style={{ marginTop: 8, fontSize: 36, fontWeight: 900, letterSpacing: "-0.025em", color: M.ink }}>
              {c.price > 0 ? `₩ ${c.price.toLocaleString()}` : "무료"}
            </div>
            <div style={{ fontSize: 12, color: M.muted, fontWeight: 600 }}>{c.price > 0 ? "1인 기준" : "큐레이션 가이드만 따라가기"}</div>
            <Hairline style={{ margin: "16px 0" }}/>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: M.muted, fontWeight: 700 }}>집합</span>
                <span style={{ color: M.ink, fontWeight: 700 }}>{c.meetingPoint}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: M.muted, fontWeight: 700 }}>일정</span>
                <span style={{ color: M.ink, fontWeight: 700, textAlign: "right" }}>{c.schedule.join(" · ")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: M.muted, fontWeight: 700 }}>도슨트</span>
                <span style={{ color: M.ink, fontWeight: 700 }}>{c.hasDocent ? "있음 (한국어)" : "없음"}</span>
              </div>
            </div>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {c.price > 0
                ? <MButton kind="primary" size="lg" onClick={() => onNavigate("booking-docent", c.id)}>예약하기 →</MButton>
                : <MButton kind="primary" size="lg">코스 시작하기 →</MButton>}
              <MButton kind="secondary" size="md" icon={<MIcon name="bookmark" size={14} color={M.ink}/>}>저장</MButton>
            </div>
          </div>

          {/* 외부 공간 추천 */}
          {EXTERNAL_SPACES.filter((s) => stops.find((b) => b.id === s.building)).slice(0, 2).map((s) => (
            <div key={s.id} onClick={() => onNavigate("booking-external", s.id)} style={{ marginTop: 16, padding: 16, background: M.beigeAlt, borderRadius: MR.card, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <MagCap>{s.typeIcon} {s.type.toUpperCase()}</MagCap>
                <MagCap color={M.terra}>외부 예약 →</MagCap>
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: M.ink, letterSpacing: "-0.015em" }}>{s.name}</div>
              <div style={{ fontSize: 12, color: M.muted, marginTop: 4, fontWeight: 500, textWrap: "pretty" }}>{s.summary}</div>
            </div>
          ))}
        </aside>
      </section>

      <MFooter/>
    </MPage>
  );
}

Object.assign(window, { CourseScreen, CourseIndex });
