/* ================================================================
   마실맵 모바일 앱 — 화면 A
   동네 홈 · 코스 상세(따라 걷기) · 코스 만들기
   app prop: { t, nav, st, act }  (mobile-app.jsx 참조)
   ================================================================ */

/* mxCourseProgress는 app2/mobile-data.jsx에서 정의·노출됨 (전역 사용) */

/* ---------- 코스 카드 (홈/피드/탐색 공용) ---------- */
function MXCourseCard({ course, app, compact }) {
  const ch = mxChannel(course.channelId);
  const following = app.st.myCourses.has(course.id);
  const pr = mxCourseProgress(course, app.st.doneStops);
  return (
    <div onClick={() => app.nav.go("course", course.id)} style={{
      background: "#fff", borderRadius: MR.cardLg, overflow: "hidden",
      boxShadow: MS.card, cursor: "pointer", border: `1px solid ${M.cream}`,
    }}>
      <div style={{ position: "relative" }}>
        <MXPhoto tone={course.cover} height={compact ? 120 : 150} label={`${course.stops.length}개 지점 · ${course.distance}`}/>
        <div style={{ position: "absolute", top: 12, left: 12 }}><MXBadge official={course.official}/></div>
        {following && (
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <MXRing pct={pr.pct} size={42} label={pr.complete ? "★" : `${pr.done}/${pr.tot}`}/>
          </div>
        )}
      </div>
      <div style={{ padding: 15 }}>
        <h3 style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: "0 0 8px", lineHeight: 1.25, textWrap: "balance" }}>{course.title}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 11 }}>
          {course.moods.slice(0, 2).map((m) => <MXMoodChip key={m} moodId={m} small/>)}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <MXChannelChip ch={ch}/>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: M.muted, fontWeight: 600, whiteSpace: "nowrap" }}>♥ {course.saved}</span>
        </div>
        {following && <div style={{ marginTop: 12 }}><MXBar pct={pr.pct}/></div>}
      </div>
    </div>
  );
}

/* ================================================================
   동네 홈 (콜드스타트 — 이 동네 추천 코스 먼저)
   ================================================================ */
function MXHome({ app }) {
  const { t, st, act, nav } = app;
  const hood = mxHood(st.hood);
  const cur = mxChannel(st.currentChannelId);
  const [mood, setMood] = React.useState(null);
  let courses = mxCoursesByHood(st.hood);
  if (mood) courses = courses.filter((c) => c.moods.includes(mood));

  // 정복 배지 미리보기 (이 동네)
  const hoodBadge = (window.MX_BADGES || []).find((b) => b.id === st.hood);
  const badgeDone = hoodBadge ? hoodBadge.need.filter((id) => { const c = mxCourse(id); return c && mxCourseProgress(c, st.doneStops).complete; }).length : 0;

  return (
    <div>
      {/* 히어로 헤더 */}
      <div style={{ paddingTop: MX.topClear, paddingLeft: MX.pageX, paddingRight: MX.pageX, paddingBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <PinHouse size={22}/>
          <button onClick={() => act.openSheet("channel")} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: M.cream, border: "none", borderRadius: 999, padding: "5px 10px 5px 6px", cursor: "pointer" }}>
            <MXAvatar ch={cur} size={26}/>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: M.ink, whiteSpace: "nowrap" }}>{cur.name}</span>
            <MIcon name="chevron" size={13} color={M.muted} style={{ transform: "rotate(90deg)" }}/>
          </button>
        </div>

        <div style={{ marginTop: 18 }}>
          <button onClick={() => act.openSheet("hood")} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, cursor: "pointer" }}>
            <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 30, fontWeight: 900, letterSpacing: "-0.03em", color: M.ink }}>{hood.name}</span>
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: M.cream, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <MIcon name="chevron" size={14} color={M.ink} style={{ transform: "rotate(90deg)" }}/>
            </span>
          </button>
          <div style={{ fontSize: 14, color: M.muted, fontWeight: 600, marginTop: 4 }}>{hood.sub} · 추천 코스 {mxCoursesByHood(st.hood).length}</div>
        </div>
      </div>

      {/* 기분 태그 가로 스크롤 */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 18px 4px", WebkitOverflowScrolling: "touch" }}>
        {MX_MOODS.map((m) => (
          <MXMoodChip key={m.id} moodId={m.id} active={mood === m.id} onClick={() => setMood(mood === m.id ? null : m.id)}/>
        ))}
      </div>

      <div style={{ padding: "16px 18px 8px" }}>
        {/* 정복 미니 배너 */}
        {t.homeBadge && hoodBadge && (
          <div onClick={() => nav.go("seriesDetail", st.hood)} style={{ display: "flex", alignItems: "center", gap: 14, background: M.terra, color: "#fff", borderRadius: MR.cardLg, padding: "16px 18px", marginBottom: 20, cursor: "pointer" }}>
            <MXRing pct={Math.round(badgeDone / hoodBadge.need.length * 100)} size={48} accent={M.olive} label={`${badgeDone}/${hoodBadge.need.length}`}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", color: M.oliveSoft }}>정복 도전</div>
              <div style={{ fontSize: 16, fontWeight: 900, marginTop: 3 }}>{hoodBadge.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{hood.name} 코스를 모두 완주하면 배지 획득</div>
            </div>
            <MIcon name="chevron" size={16} color="rgba(255,255,255,0.7)"/>
          </div>
        )}

        <MXSection action="지도로" onAction={() => act.toast("지도 보기는 준비 중이에요")}>이 동네 추천 코스</MXSection>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {courses.map((c) => <MXCourseCard key={c.id} course={c} app={app}/>)}
          {courses.length === 0 && (
            <div style={{ padding: 28, textAlign: "center", color: M.muted, fontSize: 13, fontWeight: 600, background: M.cream, borderRadius: MR.card }}>
              이 기분에 맞는 코스가 아직 없어요. 직접 만들어볼까요?
            </div>
          )}
        </div>

        {/* 팔로우 채널 새 코스 미리보기 */}
        <div style={{ marginTop: 28 }}>
          <MXSection action="피드 →" onAction={() => nav.tab("feed")}>팔로우한 채널 소식</MXSection>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MX_FEED.slice(0, 2).map((f) => {
              const ch = mxChannel(f.channelId); const co = mxCourse(f.courseId);
              return (
                <div key={f.id} onClick={() => co && nav.go("course", co.id)} style={{ display: "flex", gap: 12, alignItems: "center", background: "#fff", borderRadius: MR.card, padding: 12, boxShadow: MS.cardSm, cursor: "pointer", border: `1px solid ${M.cream}` }}>
                  <MXAvatar ch={ch} size={40}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: M.ink }}>{ch.name} <span style={{ color: M.muted, fontWeight: 600 }}>· {f.when}</span></div>
                    <div style={{ fontSize: 13, color: M.ink, fontWeight: 700, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{co ? co.title : ""}</div>
                  </div>
                  <MXStopGlyph kind="건축" size={30}/>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   코스 상세 + 따라 걷기
   ================================================================ */
function MXCourseDetail({ app, courseId }) {
  const { st, act, nav } = app;
  const c = mxCourse(courseId);
  const [openStory, setOpenStory] = React.useState(null);
  if (!c) return <div style={{ padding: 40 }}>코스를 찾을 수 없어요.</div>;
  const ch = mxChannel(c.channelId);
  const following = st.myCourses.has(c.id);
  const pr = mxCourseProgress(c, st.doneStops);

  return (
    <div>
      <MXHeader transparent onBack={nav.back} right={
        <button onClick={() => act.toast("저장했어요")} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <MIcon name="bookmark" size={15} color={M.ink}/>
        </button>
      }/>

      {/* 커버 */}
      <div style={{ margin: "-58px 0 0", position: "relative" }}>
        <MXPhoto tone={c.cover} height={250}/>
        <div style={{ position: "absolute", left: MX.pageX, right: MX.pageX, bottom: 16 }}>
          <div style={{ marginBottom: 8 }}><MXBadge official={c.official}/></div>
          <h1 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", margin: 0, lineHeight: 1.12, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>{c.title}</h1>
        </div>
      </div>

      <div style={{ padding: `18px ${MX.pageX}px 28px` }}>
        {/* 채널 + 메타 */}
        <div onClick={() => nav.go("channel", ch.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, borderBottom: `1px solid ${M.cream}`, cursor: "pointer" }}>
          <MXChannelChip ch={ch} sub={`팔로워 ${ch.followers.toLocaleString()}`}/>
          <span style={{ fontSize: 12, fontWeight: 800, whiteSpace: "nowrap", color: app.st.followed.has(ch.id) ? M.muted : M.olive }}
            onClick={(e) => { e.stopPropagation(); act.toggleFollow(ch.id); }}>
            {app.st.followed.has(ch.id) ? "팔로잉" : "+ 팔로우"}
          </span>
        </div>

        <p style={{ fontSize: 14.5, lineHeight: 1.65, color: M.ink, fontWeight: 500, margin: "16px 0 16px", textWrap: "pretty" }}>{c.summary}</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {[["거리", c.distance], ["소요", c.duration], ["지점", `${c.stops.length}곳`]].map(([l, v]) => (
            <div key={l} style={{ flex: 1, minWidth: 90, background: M.cream, borderRadius: MR.card, padding: "12px 14px" }}>
              <div style={{ fontSize: 10.5, color: M.muted, fontWeight: 700 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: M.ink, marginTop: 3 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
          {c.moods.map((m) => <MXMoodChip key={m} moodId={m} small/>)}
        </div>

        {/* 따라 걷기 CTA / 진행 */}
        {!following ? (
          <MXBtn kind="gold" full icon={<MIcon name="walk" size={18} color={M.terraDeep}/>} onClick={() => { act.followCourse(c.id); act.toast("내 지도에 코스를 담았어요"); }}>
            이 코스 따라 걷기
          </MXBtn>
        ) : (
          <div style={{ background: M.terra, color: "#fff", borderRadius: MR.cardLg, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 800, whiteSpace: "nowrap" }}>나의 진행</span>
              <span style={{ fontSize: 13, fontWeight: 900, whiteSpace: "nowrap" }}>{pr.done} / {pr.tot} 방문 {pr.complete && "· 완주 ★"}</span>
            </div>
            <MXBar pct={pr.pct} track="rgba(255,255,255,0.2)" h={10}/>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.78)", marginTop: 10 }}>
              {pr.complete ? "모든 지점을 방문했어요. 멋져요!" : `${pr.tot - pr.done}곳 남았어요. 지점에서 방문 인증을 눌러 스탬프를 모으세요.`}
            </div>
          </div>
        )}

        {/* 지점 리스트 */}
        <div style={{ marginTop: 26 }}>
          <MXSection>코스 경로</MXSection>
          <div style={{ position: "relative" }}>
            {/* 세로 연결선 */}
            <div style={{ position: "absolute", left: 16, top: 18, bottom: 18, width: 2, background: M.cream }}/>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {c.stops.map((s, i) => {
                const done = st.doneStops.has(`${c.id}:${s.id}`);
                const k = MX_STOP_KINDS[s.kind] || MX_STOP_KINDS["건축"];
                return (
                  <div key={s.id} style={{ position: "relative", display: "grid", gridTemplateColumns: "34px 1fr", gap: 14, alignItems: "start" }}>
                    <div style={{ position: "relative", zIndex: 2 }}>
                      <MXStopGlyph kind={s.kind} n={i + 1}/>
                      {done && <span style={{ position: "absolute", top: -5, right: -5, width: 18, height: 18, borderRadius: "50%", background: M.olive, color: "#fff", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>✓</span>}
                    </div>
                    <div style={{ background: "#fff", borderRadius: MR.card, padding: 14, boxShadow: MS.cardSm, border: `1px solid ${done ? M.olive : M.cream}` }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ fontSize: 15.5, fontWeight: 900, color: M.ink }}>{s.name}</div>
                        <span style={{ fontSize: 10.5, fontWeight: 800, whiteSpace: "nowrap", color: k.color }}>{s.kind}</span>
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.6, color: M.muted, fontWeight: 500, margin: "7px 0 0", textWrap: "pretty" }}>{s.note}</p>

                      {s.story && app.t.showStory && (
                        <div style={{ marginTop: 10 }}>
                          <button onClick={() => setOpenStory(openStory === s.id ? null : s.id)} style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", background: M.cream, border: "none", borderRadius: 999, padding: "7px 12px", cursor: "pointer", fontSize: 12, fontWeight: 800, color: M.terra }}>
                            <MIcon name="book" size={13} color={M.terra}/> 왜 이렇게 지었나
                            <MIcon name="chevron" size={11} color={M.muted} style={{ transform: openStory === s.id ? "rotate(90deg)" : "rotate(0)" }}/>
                          </button>
                          {openStory === s.id && (
                            <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 13.5, lineHeight: 1.75, color: M.ink, fontWeight: 400, margin: "10px 2px 0", paddingLeft: 12, borderLeft: `2px solid ${M.olive}`, textWrap: "pretty" }}>{s.story}</p>
                          )}
                        </div>
                      )}

                      {following && (
                        <button onClick={() => done ? act.toggleStop(c.id, s.id) : act.openStamp(c.id, s)} style={{
                          marginTop: 12, width: "100%", padding: "10px", borderRadius: 999, cursor: "pointer",
                          border: done ? "none" : `1.5px solid ${M.terra}`,
                          background: done ? M.cream : M.terra, color: done ? M.muted : "#fff",
                          fontSize: 13, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}>
                          {done ? "✓ 방문 인증 완료" : <><MIcon name="location" size={14} color="#fff"/> 방문 인증</>}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 근처 맛집·커피 */}
        <MXNearbyEats course={c}/>
      </div>
    </div>
  );
}

/* ---------- 근처 맛집·커피 (앱) ---------- */
function MXNearbyEats({ course }) {
  const eats = mxEatsForCourse(course);
  if (!eats.length) return null;
  return (
    <div style={{ marginTop: 28 }}>
      <MXSection>근처 맛집 · 커피</MXSection>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {eats.map((e) => {
          const k = (window.MX_EAT_KINDS || {})[e.kind] || { color: M.terra, glyph: "·" };
          const by = e.by ? mxChannel(e.by) : null;
          return (
            <div key={e.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", borderRadius: MR.card, padding: 13, boxShadow: MS.cardSm, border: `1px solid ${M.cream}` }}>
              <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 11, background: k.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900 }}>{k.glyph}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 800, color: M.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700, color: M.muted, whiteSpace: "nowrap" }}>{e.kind} · {e.price}</span>
                </div>
                <p style={{ fontSize: 12.5, color: M.muted, lineHeight: 1.5, margin: "5px 0 0", fontWeight: 500, textWrap: "pretty" }}>{e.note}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: M.muted }}>📍 {e.walk}</span>
                  {by && <><span style={{ fontSize: 10.5, color: M.faint }}>·</span><span style={{ fontSize: 10.5, fontWeight: 800, color: by.color }}>{by.name} 추천</span></>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function MXCreate({ app }) {
  const { st, act, nav } = app;
  const cur = mxChannel(st.currentChannelId);
  const [view, setView] = React.useState(app.t.createDefault || "map");
  const [title, setTitle] = React.useState("");
  const [stops, setStops] = React.useState([
    { id: "n1", name: "성수연방", kind: "건축", note: "" },
    { id: "n2", name: "대림창고", kind: "카페", note: "" },
  ]);
  const [moods, setMoods] = React.useState(["solo"]);

  // 후보 지점 (전체 코스의 지점 풀에서 중복 제거)
  const pool = React.useMemo(() => {
    const seen = new Set(stops.map((s) => s.name)); const out = [];
    MX_COURSES.forEach((c) => c.stops.forEach((s) => { if (!seen.has(s.name)) { seen.add(s.name); out.push({ name: s.name, kind: s.kind }); } }));
    return out;
  }, [stops]);

  const addStop = (p) => setStops((arr) => [...arr, { id: "n" + Date.now(), name: p.name, kind: p.kind, note: "" }]);
  const removeStop = (id) => setStops((arr) => arr.filter((s) => s.id !== id));
  const moveStop = (i, dir) => setStops((arr) => { const n = [...arr]; const j = i + dir; if (j < 0 || j >= n.length) return arr; [n[i], n[j]] = [n[j], n[i]]; return n; });
  const toggleMood = (id) => setMoods((m) => m.includes(id) ? m.filter((x) => x !== id) : [...m, id]);

  const canPublish = stops.length >= 2 && title.trim().length > 0;

  return (
    <div>
      <MXHeader onBack={nav.back} title="코스 만들기" right={
        <button disabled={!canPublish} onClick={() => { if (canPublish) { act.toast(`'${cur.name}' 채널로 코스를 공개했어요`); nav.tab("home"); } }}
          style={{ border: "none", borderRadius: 999, padding: "8px 16px", whiteSpace: "nowrap", cursor: canPublish ? "pointer" : "default",
            background: canPublish ? M.olive : M.cream, color: canPublish ? M.terraDeep : M.muted, fontSize: 13, fontWeight: 800 }}>공개</button>
      }/>

      <div style={{ padding: `8px ${MX.pageX}px 28px` }}>
        {/* 게시 채널 */}
        <div onClick={() => act.openSheet("channel")} style={{ display: "flex", alignItems: "center", gap: 10, background: M.cream, borderRadius: MR.card, padding: "12px 14px", cursor: "pointer", marginBottom: 16 }}>
          <MXAvatar ch={cur} size={32}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: M.muted, fontWeight: 700 }}>게시할 채널</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: M.ink }}>{cur.name}</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: M.olive, whiteSpace: "nowrap" }}>전환</span>
        </div>

        {/* 제목 */}
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="코스 제목 (예: 비 오는 날 성수 실내)"
          style={{ width: "100%", border: "none", outline: "none", background: "#fff", boxShadow: MS.cardSm, borderRadius: MR.field, padding: "15px 16px", fontSize: 16, fontWeight: 700, color: M.ink, fontFamily: "Pretendard", marginBottom: 16 }}/>

        {/* 뷰 토글 */}
        <div style={{ display: "flex", gap: 4, background: M.cream, borderRadius: 999, padding: 4, marginBottom: 16 }}>
          {[["map", "지도"], ["list", "리스트"]].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: "10px", borderRadius: 999, border: "none", cursor: "pointer",
              background: view === v ? "#fff" : "transparent", color: view === v ? M.ink : M.muted, fontSize: 13.5, fontWeight: 800, boxShadow: view === v ? MS.cardSm : "none" }}>{l}</button>
          ))}
        </div>

        {/* 지도 뷰 */}
        {view === "map" && (
          <div style={{ position: "relative", borderRadius: MR.cardLg, overflow: "hidden", marginBottom: 18, border: `1px solid ${M.cream}` }}>
            <div style={{ height: 260, background: "#E9EBEF", position: "relative",
              backgroundImage: "repeating-linear-gradient(0deg,#dfe3e8 0 1px,transparent 1px 28px),repeating-linear-gradient(90deg,#dfe3e8 0 1px,transparent 1px 28px)" }}>
              {/* faux route path */}
              <svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%">
                <polyline points="60,200 130,140 220,180 300,90" fill="none" stroke={M.olive} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round"/>
              </svg>
              {stops.map((s, i) => {
                const pos = [[60, 200], [130, 140], [220, 180], [300, 90], [180, 60], [90, 90]][i % 6];
                return (
                  <div key={s.id} style={{ position: "absolute", left: pos[0] - 17, top: pos[1] - 17 }}>
                    <MXStopGlyph kind={s.kind} n={i + 1}/>
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: 12, bottom: 12, fontSize: 11, fontWeight: 700, color: M.muted, background: "rgba(255,255,255,0.85)", padding: "5px 10px", borderRadius: 999 }}>탭하면 지점이 순서대로 추가돼요</div>
            </div>
            <button onClick={() => act.openSheet("addStop", { onPick: addStop, pool })} style={{ width: "100%", border: "none", background: "#fff", padding: "14px", cursor: "pointer", fontSize: 14, fontWeight: 800, color: M.terra, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, whiteSpace: "nowrap" }}>
              <MIcon name="plus" size={16} color={M.terra}/> 지도에서 지점 추가
            </button>
          </div>
        )}

        {/* 리스트 (지점 순서/코멘트) */}
        <MXSection>지점 {stops.length}곳</MXSection>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {stops.map((s, i) => (
            <div key={s.id} style={{ display: "grid", gridTemplateColumns: "34px 1fr auto", gap: 12, alignItems: "center", background: "#fff", borderRadius: MR.card, padding: 12, boxShadow: MS.cardSm, border: `1px solid ${M.cream}` }}>
              <MXStopGlyph kind={s.kind} n={i + 1}/>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: M.ink }}>{s.name}</div>
                <input value={s.note} onChange={(e) => setStops((arr) => arr.map((x) => x.id === s.id ? { ...x, note: e.target.value } : x))}
                  placeholder="한 줄 코멘트 추가" style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: 12.5, color: M.muted, fontWeight: 600, marginTop: 3, fontFamily: "Pretendard" }}/>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button onClick={() => moveStop(i, -1)} style={{ border: "none", background: M.cream, borderRadius: 7, width: 26, height: 22, cursor: "pointer", color: M.muted, fontSize: 11 }}>▲</button>
                <button onClick={() => moveStop(i, 1)} style={{ border: "none", background: M.cream, borderRadius: 7, width: 26, height: 22, cursor: "pointer", color: M.muted, fontSize: 11 }}>▼</button>
              </div>
              <button onClick={() => removeStop(s.id)} style={{ gridColumn: "3", border: "none", background: "none", color: M.faint, cursor: "pointer", fontSize: 16, position: "absolute" }}></button>
            </div>
          ))}
        </div>
        <MXBtn kind="soft" full icon={<MIcon name="plus" size={16} color={M.ink}/>} onClick={() => act.openSheet("addStop", { onPick: addStop, pool })}>지점 추가</MXBtn>

        {/* 상황 태그 */}
        <div style={{ marginTop: 22 }}>
          <MXSection>상황·기분 태그</MXSection>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {MX_MOODS.map((m) => <MXMoodChip key={m.id} moodId={m.id} small active={moods.includes(m.id)} onClick={() => toggleMood(m.id)}/>)}
          </div>
        </div>

        <div style={{ marginTop: 24, padding: 14, borderRadius: MR.card, background: "rgba(211,172,43,0.1)", fontSize: 12.5, color: M.oliveDeep, fontWeight: 600, lineHeight: 1.6, textWrap: "pretty" }}>
          개인 경험으로 적어주세요. 방송·브랜드명을 그대로 옮기면 분쟁이 될 수 있어요. (공식 협업 코스만 방송명 노출 가능)
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MXCourseCard, MXHome, MXCourseDetail, MXCreate, MXNearbyEats });
