/* ================================================================
   masilmap — 산책 코스 상세 (채널 코스) + 스탬프/방문 인증 (#웹 파리티)
   마실 앱의 MX_COURSES를 웹에서 따라 걷고, 현장 GPS+사진으로 인증.
   doneStops 공유 store에 기록 → 앱·웹·내 마실 배지가 함께 갱신.
   ================================================================ */

/* ---------- 스탬프 인증 모달 (GPS 체크인 + 사진) ---------- */
function StampModal({ course, stop, onClose, onConfirm }) {
  const [phase, setPhase] = React.useState("locating"); // locating → ready → confirmed
  React.useEffect(() => {
    const t = setTimeout(() => setPhase("ready"), 1400);
    return () => clearTimeout(t);
  }, [stop.id]);
  const kind = MX_STOP_KINDS[stop.kind] || { color: M.terra, glyph: "·" };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200, background: "rgba(31,39,56,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(3px)",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 420, background: M.beige, borderRadius: 24, overflow: "hidden", boxShadow: MS.cardLg,
      }}>
        {/* GPS 지도 영역 */}
        <div style={{ height: 200, position: "relative", background: `linear-gradient(135deg, ${kind.color} 0%, ${kind.color}aa 100%)`, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 28px)" }}/>
          {/* 핀 */}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(0,0,0,0.3)", border: `3px solid ${M.olive}` }}>
              <MIcon name="location" size={26} color={kind.color}/>
            </div>
            {phase === "locating" && (
              <div style={{ marginTop: 10, padding: "5px 12px", borderRadius: 999, background: "rgba(0,0,0,0.4)", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                위치 확인 중…
              </div>
            )}
            {phase !== "locating" && (
              <div style={{ marginTop: 10, padding: "5px 12px", borderRadius: 999, background: M.olive, color: M.terraDeep, fontSize: 12, fontWeight: 900 }}>
                ✓ 현장 확인됨 · 12m
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, color: M.ink }}>×</button>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: M.muted }}>STAMP · 방문 인증</div>
          <div style={{ fontSize: 23, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", marginTop: 6 }}>{stop.name}</div>
          <div style={{ fontSize: 13, color: M.muted, fontWeight: 600, marginTop: 4 }}>{course.title} · {stop.kind}</div>

          {/* 사진 인증 */}
          <div style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 16, background: M.cream, border: `1.5px dashed ${M.beigeAlt}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, color: M.muted }}>
              <MIcon name="camera" size={22} color={M.beigeAlt}/>
              <span style={{ fontSize: 9, fontWeight: 700, marginTop: 3 }}>사진</span>
            </div>
            <div style={{ fontSize: 12.5, color: M.muted, fontWeight: 500, lineHeight: 1.5, textWrap: "pretty" }}>
              현장 사진을 더하면 인증이 확정돼요. (선택) 사진은 내 아카이브에만 저장됩니다.
            </div>
          </div>

          <button
            disabled={phase === "locating"}
            onClick={() => { setPhase("confirmed"); setTimeout(onConfirm, 450); }}
            style={{
              width: "100%", marginTop: 22, padding: "15px", borderRadius: 14, border: "none",
              fontSize: 15, fontWeight: 800, fontFamily: "inherit", cursor: phase === "locating" ? "default" : "pointer",
              background: phase === "locating" ? M.beigeAlt : (phase === "confirmed" ? M.olive : M.terra),
              color: phase === "locating" ? M.muted : (phase === "confirmed" ? M.terraDeep : "#fff"),
              transition: "all .2s",
            }}>
            {phase === "locating" ? "위치 확인 중…" : phase === "confirmed" ? "✓ 스탬프 획득!" : "스탬프 찍기"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- 산책 코스 상세 ---------- */
function WalkCourseScreen({ onNavigate, courseId }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const px = pageX(isMobile, isTablet);
  const sh = useMasilShared();
  const c = mxCourse(courseId) || MX_COURSES[0];
  const ch = mxChannel(c.channelId);
  const [stampStop, setStampStop] = React.useState(null);

  const pr = mxCourseProgress(c, sh.done);
  const walking = sh.myCoursesSet.has(c.id);
  const accent = c.cover;

  return (
    <MPage>
      <MasilNav route="course" onNavigate={onNavigate}/>

      {/* 상단 바 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `16px ${px}px`, borderBottom: `1px solid ${M.beigeAlt}` }}>
        <span onClick={() => onNavigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: M.muted }}>
          <MIcon name="chevron" size={12} color={M.muted} style={{ transform: "rotate(180deg)" }}/> 동네 코스
        </span>
        <span onClick={() => onNavigate("channel", ch.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 800, color: M.ink }}>
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: ch.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900 }}>{ch.name[0]}</span>
          {ch.name}{ch.official && " ✓"}
        </span>
      </div>

      {/* HERO */}
      <section style={{ background: accent, color: "#fff", padding: `${isMobile ? 32 : 52}px ${px}px ${isMobile ? 36 : 44}px` }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <span style={{ padding: "4px 11px", borderRadius: 999, background: c.official ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.16)", color: c.official ? accent : "#fff", border: c.official ? "none" : "1px solid rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 800 }}>{c.official ? "공식 코스" : "유저 코스"}</span>
          {c.moods.map((m) => <span key={m} style={{ padding: "4px 11px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700 }}>{(mxMood(m) || {}).label}</span>)}
        </div>
        <h1 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 38 : 64, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.02, margin: 0, textWrap: "balance" }}>{c.title}</h1>
        <p style={{ fontSize: isMobile ? 14.5 : 16.5, lineHeight: 1.7, color: "rgba(255,255,255,0.88)", fontWeight: 500, margin: "16px 0 0", maxWidth: 560, textWrap: "pretty" }}>{c.summary}</p>
        <div style={{ display: "flex", gap: isMobile ? 24 : 40, marginTop: 26, fontFamily: "'JetBrains Mono', monospace" }}>
          {[[c.distance, "거리"], [c.duration, "소요"], [`${c.stops.length}`, "지점"], [c.walked.toLocaleString(), "완보"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", opacity: 0.7, marginTop: 5 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 진행률 바 */}
      <section style={{ padding: `${isMobile ? 24 : 32}px ${px}px 0` }}>
        <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: isMobile ? 18 : 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: M.ink }}>{pr.complete ? "완주했어요 ★" : walking ? "따라 걷는 중" : "아직 시작 전"}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color: pr.complete ? M.oliveDeep : M.muted }}>{pr.done} / {pr.tot} 방문 · {pr.pct}%</span>
          </div>
          <div style={{ height: 12, borderRadius: 999, background: M.beigeAlt, overflow: "hidden" }}>
            <div style={{ width: `${pr.pct}%`, height: "100%", borderRadius: 999, background: pr.complete ? M.olive : accent, transition: "width .35s" }}/>
          </div>
          {!walking && (
            <button onClick={() => sh.followCourse(c.id)} style={{ width: "100%", marginTop: 16, padding: "13px", borderRadius: 12, border: "none", background: M.terra, color: "#fff", fontSize: 14.5, fontWeight: 800, fontFamily: "inherit", cursor: "pointer" }}>
              + 이 코스 따라 걷기
            </button>
          )}
        </div>
      </section>

      {/* 지점 리스트 (스탬프) */}
      <section style={{ padding: `${isMobile ? 28 : 40}px ${px}px ${isMobile ? 48 : 72}px` }}>
        <Hairline label={`경로 · ${c.stops.length} STOPS`} style={{ marginBottom: 22 }}/>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {c.stops.map((s, i) => {
            const key = `${c.id}:${s.id}`;
            const done = sh.done.has(key);
            const kind = MX_STOP_KINDS[s.kind] || { color: M.terra, glyph: "·" };
            const last = i === c.stops.length - 1;
            return (
              <div key={s.id} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 16 }}>
                {/* 타임라인 */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff", background: done ? M.olive : kind.color, border: done ? `2px solid ${M.olive}` : "none" }}>
                    {done ? "✓" : kind.glyph}
                  </div>
                  {!last && <div style={{ width: 2, flex: 1, minHeight: 28, background: done ? M.olive : M.beigeAlt }}/>}
                </div>
                {/* 본문 */}
                <div style={{ paddingBottom: last ? 0 : 22 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 17, fontWeight: 900, color: M.ink, letterSpacing: "-0.01em" }}>{s.name}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: kind.color, marginTop: 2 }}>{s.kind}</div>
                    </div>
                    <button onClick={() => setStampStop(s)} style={{
                      flexShrink: 0, padding: "9px 16px", borderRadius: 999, cursor: "pointer", fontSize: 12.5, fontWeight: 800, fontFamily: "inherit",
                      border: done ? `1.5px solid ${M.olive}` : `1.5px solid ${M.terra}`,
                      background: done ? `${M.olive}1A` : M.terra, color: done ? M.oliveDeep : "#fff", whiteSpace: "nowrap",
                    }}>{done ? "✓ 인증됨" : "스탬프 찍기"}</button>
                  </div>
                  <p style={{ fontSize: 13.5, color: M.muted, lineHeight: 1.6, margin: "8px 0 0", fontWeight: 500, textWrap: "pretty" }}>{s.note}</p>
                  {/* 인문학 카드 (왜 이렇게 지었는가) */}
                  {s.story && (
                    <div style={{ marginTop: 12, padding: "14px 16px", borderRadius: 12, background: M.cream, borderLeft: `3px solid ${M.olive}` }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: M.olive, marginBottom: 6 }}>왜 이렇게 지었나</div>
                      <p style={{ fontSize: 13.5, color: M.ink, lineHeight: 1.65, margin: 0, fontWeight: 500, textWrap: "pretty" }}>{s.story}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {stampStop && (
        <StampModal
          course={c} stop={stampStop}
          onClose={() => setStampStop(null)}
          onConfirm={() => { sh.toggleStop(c.id, stampStop.id); setStampStop(null); }}/>
      )}

      {/* 근처 맛집·커피 */}
      <NearbyEats course={c} isMobile={isMobile} px={px}/>

      <MFooter/>
    </MPage>
  );
}

/* ---------- 코스 주변 맛집·커피 ---------- */
function NearbyEats({ course, isMobile, px }) {
  const eats = mxEatsForCourse(course);
  if (!eats.length) return null;
  return (
    <section style={{ padding: `${isMobile ? 8 : 16}px ${px}px ${isMobile ? 40 : 64}px`, background: M.cream, borderTop: `1px solid ${M.beigeAlt}` }}>
      <div style={{ paddingTop: isMobile ? 28 : 40 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
          <Hairline label={`근처 맛집 · 커피 · ${eats.length}`}/>
        </div>
        <p style={{ fontSize: isMobile ? 13.5 : 14.5, color: M.muted, fontWeight: 500, margin: "10px 0 22px", textWrap: "pretty" }}>
          코스 동선 근처에서 들르기 좋은 곳. 걷다 잠깐 쉬어 가세요.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {eats.map((e) => {
            const k = MX_EAT_KINDS[e.kind] || { color: M.terra, glyph: "·" };
            const by = e.by ? mxChannel(e.by) : null;
            return (
              <div key={e.id} style={{ display: "flex", gap: 14, background: "#fff", borderRadius: MR.cardLg, padding: 16, boxShadow: MS.cardSm, border: `1px solid ${M.beigeAlt}` }}>
                <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 12, background: k.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900 }}>{k.glyph}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: M.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.name}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: M.muted, whiteSpace: "nowrap" }}>{e.price}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: k.color }}>{e.kind}</span>
                    <span style={{ fontSize: 11, color: M.faint }}>·</span>
                    <span style={{ fontSize: 11, color: M.muted, fontWeight: 600 }}>{e.walk}</span>
                  </div>
                  <p style={{ fontSize: 13, color: M.muted, lineHeight: 1.55, margin: "8px 0 0", fontWeight: 500, textWrap: "pretty" }}>{e.note}</p>
                  {by && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: by.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900 }}>{by.name[0]}</span>
                      <span style={{ fontSize: 11.5, color: M.muted, fontWeight: 700 }}>{by.name} 추천</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { WalkCourseScreen, StampModal, NearbyEats });
