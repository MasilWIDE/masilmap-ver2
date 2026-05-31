/* ================================================================
   masilmap · 메인 페이지 — 임팩트 변형 2종
   - SpotlightHome : 시네마틱 풀블리드 히어로 (에디터 픽 한 곳을 크게)
   - MosaicHome    : 건축 사진 모자이크 월 (한눈에 526곳의 밀도)
   기존 brand/shared/data 컴포넌트만 사용. BUILDINGS의 palette/데이터 재사용.
   ================================================================ */

/* 결정적 픽 (고정 — 에디터가 고른 스포트라이트) */
function mkFeatured(n = 6) {
  const ids = ["leeum", "ddp", "jongmyo", "museumsan", "soeul", "bonte", "amorepacific", "seonyudo"];
  const list = ids.map((id) => (window.BUILDINGS || []).find((b) => b.id === id)).filter(Boolean);
  return list.slice(0, n);
}
function palToneStyle(b) {
  const pal = b.palette || "#333D51";
  return `linear-gradient(135deg, ${pal} 0%, ${pal}cc 55%, ${pal}88 100%)`;
}

/* ---------------------------------------------------------------
   SPOTLIGHT — 시네마틱 히어로
   큰 풀블리드 이미지 + 어둠 그라데이션 + 큰 세리프 헤드라인 +
   하단 가로 픽 레일. "잡지 표지를 영화 포스터처럼".
--------------------------------------------------------------- */
function SpotlightHome({ onNavigate }) {
  const picks = mkFeatured(6);
  const [idx, setIdx] = React.useState(0);
  const hero = picks[idx] || picks[0];
  const isMobile = useIsMobile();

  return (
    <div style={{ background: M.ink, color: M.cream }}>
      {/* HERO */}
      <section style={{ position: "relative", height: isMobile ? "78vh" : "84vh", minHeight: isMobile ? 480 : 620, overflow: "hidden" }}>
        {/* 배경 이미지 (palette 기반) */}
        <div style={{ position: "absolute", inset: 0, background: palToneStyle(hero), transition: "background .5s" }}/>
        <div style={{ position: "absolute", inset: 0,
          background: `repeating-linear-gradient(48deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 26px)` }}/>
        {/* 어둠 그라데이션 */}
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(15,18,28,0.55) 0%, rgba(15,18,28,0.15) 35%, rgba(15,18,28,0.35) 62%, rgba(15,18,28,0.94) 100%)" }}/>

        {/* 상단 메타 */}
        <div style={{ position: "absolute", top: isMobile ? 20 : 34, left: isMobile ? 20 : 56, right: isMobile ? 20 : 56,
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: M.olive }}>
            마실맵 · 한국 건축 산책 가이드
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(244,243,234,0.7)" }}>
            {String(idx + 1).padStart(2, "0")} / {String(picks.length).padStart(2, "0")}
          </span>
        </div>

        {/* 본문 카피 */}
        <div style={{ position: "absolute", left: isMobile ? 20 : 56, right: isMobile ? 20 : 56, bottom: isMobile ? 132 : 168, maxWidth: 980 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ width: 30, height: 2, background: M.olive }}/>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: M.olive }}>에디터 스포트라이트 · #{hero.no}</span>
          </div>
          <h1 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 44 : 96, fontWeight: 900,
            letterSpacing: "-0.035em", lineHeight: 0.98, margin: 0, color: "#fff", textWrap: "balance",
            textShadow: "0 4px 40px rgba(0,0,0,0.4)" }}>
            {hero.name}
          </h1>
          <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 16 : 21,
            color: "rgba(244,243,234,0.85)", margin: "16px 0 0", maxWidth: 640, lineHeight: 1.6, textWrap: "pretty" }}>
            {hero.intro}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28, alignItems: "center" }}>
            <button onClick={() => onNavigate("detail", hero.id)} style={{
              padding: "14px 26px", borderRadius: 999, border: "none", cursor: "pointer",
              background: M.olive, color: M.ink, fontSize: 15, fontWeight: 800, fontFamily: MT.family,
              display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 10px 30px rgba(211,172,43,0.35)" }}>
              이 건축 보러 가기 <MIcon name="arrow" size={17} color={M.ink}/>
            </button>
            <button onClick={() => onNavigate("home", null, { homeLayout: "mapPrimary" })} style={{
              padding: "14px 24px", borderRadius: 999, cursor: "pointer",
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff",
              fontSize: 15, fontWeight: 800, fontFamily: MT.family, backdropFilter: "blur(6px)",
              display: "inline-flex", alignItems: "center", gap: 8 }}>
              <MIcon name="map" size={17} color="#fff"/> 지도에서 둘러보기
            </button>
          </div>
        </div>

        {/* 하단 픽 레일 */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: isMobile ? "0 20px 20px" : "0 56px 24px" }}>
          <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
            {picks.map((p, i) => (
              <button key={p.id} onClick={() => setIdx(i)} style={{
                flexShrink: 0, width: i === idx ? 132 : 96, height: 64, borderRadius: 12, cursor: "pointer", position: "relative",
                border: i === idx ? `2px solid ${M.olive}` : "2px solid rgba(255,255,255,0.25)",
                background: palToneStyle(p), overflow: "hidden", transition: "width .25s", padding: 0 }}>
                <span style={{ position: "absolute", left: 8, bottom: 6, fontSize: 10, fontWeight: 800, color: "#fff",
                  textShadow: "0 1px 4px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 이번엔 어디로 마실 갈까요? — 상황 기반 추천 (가입 없이도) */}
      <MasilRecommender onNavigate={onNavigate} isMobile={isMobile}/>

      {/* 이어 걷기 — 로그인 시 개인화 스트립 */}
      <SpotlightResume onNavigate={onNavigate} isMobile={isMobile}/>

      {/* 지도 밴드 — 마실맵의 핵심: 지도 위에 펼쳐진 건축 */}
      <SpotlightMapBand onNavigate={onNavigate} isMobile={isMobile}/>

      {/* 동네 추천 코스 (콜드스타트) — 마실 앱과 연동된 코스/채널 */}
      <SpotlightNeighborhood onNavigate={onNavigate} isMobile={isMobile}/>

      <SpotlightCollections onNavigate={onNavigate} isMobile={isMobile}/>
    </div>
  );
}

/* ───────────────────────────────────────────────
   이번엔 어디로 마실 갈까요? — 상황/기분 기반 추천
   가입·로그인 없이도 작동. 그날 상황만 고르면 코스를 추천.
─────────────────────────────────────────────── */
function MasilRecommender({ onNavigate, isMobile }) {
  const [mood, setMood] = React.useState(null);
  const sh = useMasilShared();
  const matches = mood
    ? MX_COURSES.filter((c) => (c.moods || []).includes(mood))
    : [];
  const moodLabel = mood ? (mxMood(mood) || {}).label : "";

  const surprise = () => {
    const pool = MX_COURSES;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    // 그 코스가 가진 mood 중 하나를 선택 상태로
    const m = (pick.moods || [])[0] || (MX_MOODS[0] || {}).id;
    setMood(m);
  };

  return (
    <section style={{ background: M.beige, color: M.ink, padding: isMobile ? "40px 20px" : "72px 56px", borderTop: `1px solid ${M.cream}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <MIcon name="sparkle" size={18} color={M.olive}/>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: M.olive }}>FOR YOU · 오늘의 마실</span>
        </div>
        <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 30 : 52, fontWeight: 900, letterSpacing: "-0.035em", margin: 0, color: M.ink, lineHeight: 1.05, textWrap: "balance" }}>
          이번엔 어디로 <span style={{ color: M.olive }}>마실</span> 갈까요?
        </h2>
        <p style={{ fontSize: isMobile ? 14.5 : 17, color: M.muted, fontWeight: 500, margin: "12px 0 0", maxWidth: 560, textWrap: "pretty" }}>
          취향을 미리 정할 필요 없어요. 그날 기분과 상황만 고르면, 걷기 좋은 코스를 바로 추천해 드려요.
        </p>

        {/* 상황 칩 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 26 }}>
          {MX_MOODS.map((m) => {
            const on = m.id === mood;
            return (
              <button key={m.id} onClick={() => setMood(on ? null : m.id)} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: isMobile ? "11px 16px" : "13px 20px", borderRadius: 999, cursor: "pointer",
                fontSize: isMobile ? 14 : 15, fontWeight: 800, fontFamily: "inherit",
                background: on ? M.terra : M.cream,
                color: on ? "#fff" : M.ink,
                border: `1.5px solid ${on ? M.terra : M.beigeAlt}`,
                transition: "all .15s",
              }}>
                <MIcon name={m.icon} size={16} color={on ? "#fff" : M.olive}/>
                {m.label}
              </button>
            );
          })}
          <button onClick={surprise} style={{
            padding: isMobile ? "11px 16px" : "13px 20px", borderRadius: 999, cursor: "pointer",
            fontSize: isMobile ? 14 : 15, fontWeight: 800, fontFamily: "inherit",
            background: "transparent", color: M.terra, border: `1.5px dashed ${M.terra}`,
          }}>🎲 아무거나 골라줘</button>
        </div>

        {/* 결과 */}
        {mood && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: isMobile ? 17 : 20, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>“{moodLabel}” 마실, 이런 코스 어때요?</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: M.muted }}>{matches.length}곳</span>
            </div>
            {matches.length === 0 ? (
              <div style={{ padding: "28px 16px", borderRadius: MR.cardLg, background: M.cream, border: `1px dashed ${M.beigeAlt}`, fontSize: 14, color: M.muted, fontWeight: 600, textAlign: "center" }}>
                이 상황에 맞는 코스를 준비 중이에요. 다른 상황도 골라보세요.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 18 }}>
                {matches.slice(0, 3).map((c) => {
                  const ch = mxChannel(c.channelId);
                  return (
                    <div key={c.id} onClick={() => onNavigate("walkcourse", c.id)} style={{ cursor: "pointer", background: M.cream, borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.card, border: `1px solid ${M.beigeAlt}` }}>
                      <div style={{ height: 150, background: c.cover, position: "relative", display: "flex", alignItems: "flex-end", padding: 16 }}>
                        <span style={{ position: "absolute", top: 12, left: 12, padding: "4px 9px", borderRadius: 999, background: c.official ? M.terra : "rgba(255,255,255,0.92)", color: c.official ? "#fff" : M.muted, fontSize: 10, fontWeight: 800 }}>{c.official ? "공식" : "유저 코스"}</span>
                        <span style={{ color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700 }}>{c.distance} · {c.duration}</span>
                      </div>
                      <div style={{ padding: 18 }}>
                        <div style={{ fontSize: 19, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", lineHeight: 1.25 }}>{c.title}</div>
                        <p style={{ fontSize: 13, color: M.muted, lineHeight: 1.55, margin: "8px 0 12px", fontWeight: 500, textWrap: "pretty" }}>{c.summary}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, borderTop: `1px solid ${M.beigeAlt}` }}>
                          <span style={{ width: 24, height: 24, borderRadius: "50%", background: ch.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>{ch.name[0]}</span>
                          <span style={{ fontSize: 12.5, fontWeight: 800, color: M.ink }}>{ch.name}</span>
                          <span style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 800, color: M.terra }}>코스 보기 →</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* 이어 걷기 — 로그인 시에만. 걷던 코스 + 추천 다음 코스 + 정복 임박 배지 */
function SpotlightResume({ onNavigate, isMobile }) {
  const auth = window.__masilAuth || { isLoggedIn: false };
  const sh = useMasilShared();
  if (!auth.isLoggedIn) return null;

  const curCh = mxChannel(sh.s.currentChannelId);
  // 진행 중(완주 안 한) 코스 중 가장 많이 진행한 것
  const inProgress = MX_COURSES
    .filter((c) => sh.myCoursesSet.has(c.id))
    .map((c) => ({ c, pr: mxCourseProgress(c, sh.done) }))
    .filter((x) => !x.pr.complete && x.pr.done > 0)
    .sort((a, b) => b.pr.pct - a.pr.pct);
  const resume = inProgress[0];
  // 정복 임박 배지(1개만 남음)
  const nearBadge = MX_BADGES
    .map((b) => ({ b, bp: mxBadgeProgress(b, sh.done) }))
    .filter((x) => !x.bp.got && x.bp.tot - x.bp.done === 1)[0];

  return (
    <section style={{ background: M.terraDeep, color: M.cream, padding: isMobile ? "28px 20px" : "40px 56px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", background: curCh.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff" }}>{curCh.name[0]}</span>
        <span style={{ fontSize: isMobile ? 16 : 19, fontWeight: 800, letterSpacing: "-0.01em" }}>{curCh.name}님, 이어서 걸어요</span>
        <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: M.olive }}>FOR YOU</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : (resume && nearBadge ? "1.4fr 1fr" : "1fr"), gap: 16 }}>
        {/* 이어 걷던 코스 */}
        {resume ? (
          <div onClick={() => onNavigate("walkcourse", resume.c.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: isMobile ? 14 : 20, background: "rgba(255,248,236,0.08)", border: "1px solid rgba(255,248,236,0.18)", borderRadius: MR.cardLg, padding: isMobile ? 16 : 20 }}>
            <div style={{ width: isMobile ? 60 : 76, height: isMobile ? 60 : 76, borderRadius: 16, background: resume.c.cover, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff" }}>
              <span style={{ fontSize: isMobile ? 17 : 21, fontWeight: 900, whiteSpace: "nowrap", lineHeight: 1 }}>{resume.pr.done}/{resume.pr.tot}</span>
              <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.85, marginTop: 3 }}>방문</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: M.olive, letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace" }}>이어 걷기 · {resume.pr.pct}%</div>
              <div style={{ fontSize: isMobile ? 19 : 23, fontWeight: 900, letterSpacing: "-0.02em", color: "#fff", marginTop: 4, lineHeight: 1.2 }}>{resume.c.title}</div>
              <div style={{ marginTop: 12, height: 8, borderRadius: 999, background: "rgba(255,248,236,0.2)", overflow: "hidden" }}>
                <div style={{ width: `${resume.pr.pct}%`, height: "100%", borderRadius: 999, background: M.olive }}/>
              </div>
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: M.olive, flexShrink: 0 }}>→</span>
          </div>
        ) : (
          <div onClick={() => onNavigate("home", null, { homeLayout: "mapPrimary" })} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 16, background: "rgba(255,248,236,0.08)", border: "1px solid rgba(255,248,236,0.18)", borderRadius: MR.cardLg, padding: isMobile ? 16 : 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: M.olive, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MIcon name="walk" size={26} color={M.terraDeep}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: isMobile ? 18 : 21, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>첫 코스를 시작해 보세요</div>
              <div style={{ fontSize: 13.5, color: "rgba(244,243,234,0.75)", fontWeight: 500, marginTop: 4 }}>마실 앱에서 동네 코스를 따라 걸으면 여기서 이어집니다.</div>
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: M.olive }}>→</span>
          </div>
        )}

        {/* 정복 임박 배지 */}
        {nearBadge && (
          <div onClick={() => onNavigate("mypage")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 16, background: "rgba(255,248,236,0.08)", border: `1px solid ${M.olive}55`, borderRadius: MR.cardLg, padding: isMobile ? 16 : 20 }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(211,172,43,0.18)", border: `2px solid ${M.olive}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MIcon name="sparkle" size={24} color={M.olive}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: M.olive, letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace" }}>정복 임박 · 1코스 남음</div>
              <div style={{ fontSize: isMobile ? 17 : 19, fontWeight: 900, color: "#fff", marginTop: 4, letterSpacing: "-0.02em" }}>{nearBadge.b.name}</div>
              <div style={{ fontSize: 12.5, color: "rgba(244,243,234,0.7)", fontWeight: 500, marginTop: 2 }}>{nearBadge.b.desc}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* 동네 추천 코스 밴드 — 채널이 만든 산책 코스 (마실 앱 데이터) */
function SpotlightNeighborhood({ onNavigate, isMobile }) {
  const sh = useMasilShared();
  const hood = mxHood(sh.s.hood);
  const courses = mxCoursesByHood(sh.s.hood).slice(0, 3);
  return (
    <section style={{ background: M.beige, color: M.ink, padding: isMobile ? "40px 20px" : "72px 56px", borderTop: `1px solid ${M.cream}` }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <MIcon name="location" size={18} color={M.olive}/>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: M.olive }}>THIS WEEK · 이 동네</span>
          </div>
          <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 28 : 44, fontWeight: 900, letterSpacing: "-0.03em", margin: 0, color: M.ink }}>
            {hood.name}, 오늘 걷기 좋아요
          </h2>
          <div style={{ fontSize: isMobile ? 14 : 16, color: M.muted, fontWeight: 500, marginTop: 8 }}>{hood.sub} · 채널이 만든 산책 코스 {mxCoursesByHood(sh.s.hood).length}</div>
        </div>
        <a href="Masil App.html" style={{ fontSize: 13, fontWeight: 800, color: M.terra, textDecoration: "none", whiteSpace: "nowrap" }}>마실 앱에서 더 보기 →</a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
        {courses.map((c) => {
          const ch = mxChannel(c.channelId);
          const pr = mxCourseProgress(c, sh.done);
          const following = sh.myCoursesSet.has(c.id);
          return (
            <div key={c.id} onClick={() => onNavigate("walkcourse", c.id)} style={{ cursor: "pointer", background: M.cream, borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.card, border: `1px solid ${M.beigeAlt}`, display: "block" }}>
              <div style={{ height: 150, background: c.cover, position: "relative", display: "flex", alignItems: "flex-end", padding: 16 }}>
                <span style={{ position: "absolute", top: 12, left: 12, padding: "4px 9px", borderRadius: 999, background: c.official ? M.terra : "rgba(255,255,255,0.9)", color: c.official ? "#fff" : M.muted, fontSize: 10, fontWeight: 800, whiteSpace: "nowrap" }}>{c.official ? "공식" : "유저 코스"}</span>
                {following && <span style={{ position: "absolute", top: 12, right: 12, padding: "4px 9px", borderRadius: 999, background: M.olive, color: M.terraDeep, fontSize: 10, fontWeight: 900 }}>{pr.complete ? "완주 ★" : `${pr.done}/${pr.tot}`}</span>}
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", lineHeight: 1.25 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: M.muted, fontWeight: 600, margin: "8px 0 0" }}>{c.distance} · {c.duration} · 지점 {c.stops.length}곳</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${M.beigeAlt}` }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: ch.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>{ch.name[0]}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: M.ink }}>{ch.name}</span>
                  {ch.official && <MIcon name="sparkle" size={11} color={M.olive}/>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* 지도 밴드 — 마실맵의 핵심 정체성: 지도 위에 펼쳐진 건축 (라이트 톤) */
function SpotlightMapBand({ onNavigate, isMobile }) {
  const Map = window.MasilMap;
  const toMap = () => onNavigate("home", null, { homeLayout: "mapPrimary" });
  const stats = [["526", "건축물"], ["47", "코스"], ["18", "컬렉션"]];
  return (
    <section style={{ background: M.beige, color: M.ink, padding: isMobile ? "44px 20px" : "80px 56px", borderTop: `1px solid ${M.beigeAlt}` }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.9fr 1.1fr", gap: isMobile ? 28 : 56, alignItems: "center" }}>
        {/* 좌: 카피 + 스탯 + CTA */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ width: 30, height: 2, background: M.olive }}/>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: M.olive }}>EXPLORE THE MAP · 지도</span>
          </div>
          <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 30 : 52, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.08, margin: 0, color: M.ink, textWrap: "balance" }}>
            지도 위에 펼쳐진<br/>한국의 모든 건축
          </h2>
          <p style={{ fontSize: isMobile ? 15 : 17, color: M.muted, fontWeight: 500, lineHeight: 1.7, margin: "20px 0 0", maxWidth: 440, textWrap: "pretty" }}>
            천 년 된 목조 건축부터 어제 완공된 미술관까지 — 전국 526곳을 지도 한 장에 펼쳐 두었습니다. 가까운 동네부터 천천히 걸어보세요.
          </p>
          <div style={{ display: "flex", gap: isMobile ? 24 : 40, margin: "28px 0 30px" }}>
            {stats.map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: isMobile ? 32 : 44, fontWeight: 900, letterSpacing: "-0.04em", color: M.terra, lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", color: M.muted, marginTop: 7 }}>{l}</div>
              </div>
            ))}
          </div>
          <MButton kind="primary" size="lg" onClick={toMap} icon={<MIcon name="map" size={17} color={M.cream}/>}>
            지도에서 둘러보기 →
          </MButton>
        </div>
        {/* 우: 지도 미리보기 (클릭 → 지도 우선 화면) */}
        <div onClick={toMap} style={{ position: "relative", height: isMobile ? 320 : 460, borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.cardLg, border: `1px solid ${M.beigeAlt}`, cursor: "pointer" }}>
          {Map ? <Map buildings={window.BUILDINGS || []} selectedId={null} onSelect={toMap} compact/> : null}
        </div>
      </div>
    </section>
  );
}

/* 시리즈 정복 띠 */
function SpotlightCollections({ onNavigate, isMobile }) {
  const cols = (window.SERIES || []).slice(0, 3);
  const sc = window.seriesCourses || (() => []);
  return (
    <section style={{ background: M.cream, color: M.ink, padding: isMobile ? "40px 20px" : "64px 56px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
        <h2 style={{ fontSize: isMobile ? 26 : 38, fontWeight: 900, letterSpacing: "-0.03em", margin: 0, color: M.ink }}>시리즈 정복</h2>
        <span onClick={() => onNavigate("collection")} style={{ fontSize: 13, fontWeight: 800, color: M.terra, cursor: "pointer" }}>전체 보기 →</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
        {cols.map((c) => (
          <div key={c.id} onClick={() => onNavigate("collection", c.id)} style={{ cursor: "pointer" }}>
            <div style={{ aspectRatio: "4/3", borderRadius: MR.cardLg, background: c.cover, position: "relative", overflow: "hidden", boxShadow: MS.card }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,18,28,0.6), transparent 55%)" }}/>
              <div style={{ position: "absolute", top: 14, right: 14, padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.4)", fontSize: 10.5, fontWeight: 800, color: "#fff" }}>{c.kind}</div>
              <div style={{ position: "absolute", left: 16, bottom: 14, right: 16 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.8)" }}>{c.no} · {sc(c).length} 코스</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginTop: 3 }}>{c.title}</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: M.muted, fontWeight: 500, lineHeight: 1.55, marginTop: 12, textWrap: "pretty" }}>{c.intro}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { mkFeatured, palToneStyle, SpotlightHome, MasilRecommender, SpotlightResume, SpotlightMapBand, SpotlightNeighborhood, SpotlightCollections });
