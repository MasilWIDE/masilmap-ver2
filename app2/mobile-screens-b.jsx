/* ================================================================
   마실맵 모바일 앱 — 화면 B
   피드 · 마이페이지 · 채널 관리 · 시트 본문 · 스탬프 인증 모달
   ================================================================ */

/* ================================================================
   피드 (팔로우한 채널의 새 코스)
   ================================================================ */
function MXFeed({ app }) {
  const { st, act, nav } = app;
  const [tab, setTab] = React.useState("following");
  const items = tab === "following"
    ? MX_FEED.filter((f) => st.followed.has(f.channelId))
    : MX_FEED;

  return (
    <div>
      <div style={{ paddingTop: MX.topClear, paddingLeft: MX.pageX, paddingRight: MX.pageX, paddingBottom: 6 }}>
        <h1 style={{ fontFamily: MT.family, fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", color: M.ink, margin: 0 }}>피드</h1>
        <div style={{ display: "flex", gap: 4, background: M.cream, borderRadius: 999, padding: 4, marginTop: 14 }}>
          {[["following", "팔로잉"], ["discover", "발견"]].map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} style={{ flex: 1, padding: "9px", borderRadius: 999, border: "none", cursor: "pointer",
              background: tab === v ? "#fff" : "transparent", color: tab === v ? M.ink : M.muted, fontSize: 13.5, fontWeight: 800, boxShadow: tab === v ? MS.cardSm : "none" }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: `16px ${MX.pageX}px 24px`, display: "flex", flexDirection: "column", gap: 18 }}>
        {items.length === 0 && (
          <div style={{ padding: 32, textAlign: "center", background: M.cream, borderRadius: MR.cardLg }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: M.ink }}>아직 팔로우한 채널이 없어요</div>
            <div style={{ fontSize: 13, color: M.muted, fontWeight: 600, margin: "6px 0 16px" }}>'발견'에서 마음에 드는 채널을 팔로우해 보세요.</div>
            <MXBtn kind="primary" onClick={() => setTab("discover")}>채널 발견하기</MXBtn>
          </div>
        )}
        {items.map((f) => {
          const ch = mxChannel(f.channelId); const co = mxCourse(f.courseId);
          const fol = st.followed.has(ch.id);
          return (
            <div key={f.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div onClick={() => nav.go("channel", ch.id)} style={{ cursor: "pointer" }}><MXAvatar ch={ch} size={42}/></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: M.ink }}>{ch.name}</span>
                    {ch.official && <MIcon name="sparkle" size={12} color={M.olive}/>}
                  </div>
                  <div style={{ fontSize: 11.5, color: M.muted, fontWeight: 600 }}>{f.verb} · {f.when}</div>
                </div>
                <button onClick={() => act.toggleFollow(ch.id)} style={{ border: fol ? `1.5px solid ${M.beigeAlt}` : "none", background: fol ? "transparent" : M.terra,
                  color: fol ? M.muted : "#fff", borderRadius: 999, padding: "8px 14px", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}>
                  {fol ? "팔로잉" : "팔로우"}
                </button>
              </div>
              {co && <MXCourseCard course={co} app={app}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================
   탐색 (전체 코스/채널) — 간단 탐색 탭
   ================================================================ */
function MXExplore({ app }) {
  const { nav } = app;
  return (
    <div>
      <div style={{ paddingTop: MX.topClear, paddingLeft: MX.pageX, paddingRight: MX.pageX, paddingBottom: 6 }}>
        <h1 style={{ fontFamily: MT.family, fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", color: M.ink, margin: 0 }}>탐색</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: M.cream, borderRadius: MR.field, padding: "13px 16px", marginTop: 14 }}>
          <MIcon name="search" size={17} color={M.muted}/>
          <span style={{ fontSize: 14, color: M.muted, fontWeight: 600 }}>동네·채널·코스 검색</span>
        </div>
      </div>
      <div style={{ padding: `16px ${MX.pageX}px 24px` }}>
        <MXSection>인기 채널</MXSection>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, marginBottom: 8 }}>
          {MX_CHANNELS.filter((c) => !c.mine).map((ch) => (
            <div key={ch.id} onClick={() => nav.go("channel", ch.id)} style={{ width: 130, flexShrink: 0, background: "#fff", borderRadius: MR.card, padding: 16, boxShadow: MS.cardSm, border: `1px solid ${M.cream}`, textAlign: "center", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "center" }}><MXAvatar ch={ch} size={48}/></div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: M.ink, marginTop: 9, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                {ch.name}{ch.official && <MIcon name="sparkle" size={11} color={M.olive}/>}
              </div>
              <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 2 }}>팔로워 {ch.followers.toLocaleString()}</div>
            </div>
          ))}
        </div>
        <MXSection>모든 코스</MXSection>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {MX_COURSES.map((c) => <MXCourseCard key={c.id} course={c} app={app}/>)}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   마이페이지 (아카이브 · 정복 배지 · 채널 전환) — 실명·소속 미표시
   ================================================================ */
function MXMyPage({ app }) {
  const { st, act, nav } = app;
  const cur = mxChannel(st.currentChannelId);
  const completed = MX_COURSES.filter((c) => mxCourseProgress(c, st.doneStops).complete);
  const inProgress = MX_COURSES.filter((c) => st.myCourses.has(c.id) && !mxCourseProgress(c, st.doneStops).complete);
  const seenBuildings = new Set(); MX_COURSES.forEach((c) => { if (st.myCourses.has(c.id)) c.stops.forEach((s) => { if (s.kind === "건축") seenBuildings.add(s.name); }); });

  return (
    <div>
      {/* 채널 헤더 */}
      <div style={{ paddingTop: MX.topClear, paddingLeft: MX.pageX, paddingRight: MX.pageX, paddingBottom: 18, background: M.cream }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <MXAvatar ch={cur} size={62}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cur.name}</span>
              {cur.official && <MIcon name="sparkle" size={14} color={M.olive}/>}
            </div>
            <div style={{ fontSize: 12.5, color: M.muted, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cur.handle} · {cur.cat}</div>
          </div>
          <button onClick={() => act.openSheet("channel")} style={{ flexShrink: 0, border: "none", background: "#fff", borderRadius: 999, padding: "9px 13px", cursor: "pointer", fontSize: 12.5, fontWeight: 800, color: M.ink, display: "inline-flex", alignItems: "center", gap: 5, boxShadow: MS.cardSm }}>
            <MIcon name="users" size={14} color={M.ink}/> 전환
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {[["팔로워", cur.followers.toLocaleString()], ["만든 코스", cur.courses], ["완주", completed.length]].map(([l, v]) => (
            <div key={l} style={{ flex: 1, background: "#fff", borderRadius: MR.card, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 19, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>{v}</div>
              <div style={{ fontSize: 11, color: M.muted, fontWeight: 700, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={() => nav.go("channel", cur.id)} style={{ width: "100%", marginTop: 10, border: `1.5px solid ${M.beigeAlt}`, background: "transparent", borderRadius: 999, padding: "11px", cursor: "pointer", fontSize: 13.5, fontWeight: 800, color: M.ink }}>내 채널 관리 →</button>
      </div>

      <div style={{ padding: `20px ${MX.pageX}px 28px` }}>
        {/* 정복 배지 */}
        <MXSection action="시리즈 →" onAction={() => nav.go("series")}>정복 배지</MXSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 26 }}>
          {MX_BADGES.map((b) => {
            const done = b.need.filter((id) => { const c = mxCourse(id); return c && mxCourseProgress(c, st.doneStops).complete; }).length;
            const got = done === b.need.length;
            return (
              <div key={b.id} onClick={() => nav.go("seriesDetail", b.id)} style={{ cursor: "pointer", background: got ? b.color : "#fff", color: got ? "#fff" : M.ink, borderRadius: MR.cardLg, padding: 16, border: `1px solid ${got ? b.color : M.cream}`, boxShadow: MS.cardSm }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: got ? "rgba(255,255,255,0.18)" : M.cream, display: "flex", alignItems: "center", justifyContent: "center", border: got ? "2px solid rgba(255,255,255,0.5)" : "none" }}>
                    <MIcon name="sparkle" size={20} color={got ? "#fff" : M.beigeAlt}/>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, opacity: got ? 0.9 : 1, color: got ? "#fff" : M.muted }}>{done}/{b.need.length}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 900, marginTop: 12, letterSpacing: "-0.01em" }}>{b.name}</div>
                <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 4, opacity: got ? 0.85 : 1, color: got ? "rgba(255,255,255,0.85)" : M.muted, lineHeight: 1.4 }}>{b.desc}</div>
                {!got && <div style={{ marginTop: 10 }}><MXBar pct={Math.round(done / b.need.length * 100)} h={6}/></div>}
              </div>
            );
          })}
        </div>

        {/* 진행 중 */}
        {inProgress.length > 0 && (
          <>
            <MXSection>걷는 중인 코스</MXSection>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
              {inProgress.map((c) => {
                const pr = mxCourseProgress(c, st.doneStops);
                return (
                  <div key={c.id} onClick={() => nav.go("course", c.id)} style={{ display: "flex", gap: 12, alignItems: "center", background: "#fff", borderRadius: MR.card, padding: 12, boxShadow: MS.cardSm, border: `1px solid ${M.cream}`, cursor: "pointer" }}>
                    <MXRing pct={pr.pct} size={46} label={`${pr.done}/${pr.tot}`}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: M.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 2 }}>{mxChannel(c.channelId).name}</div>
                    </div>
                    <MIcon name="chevron" size={15} color={M.beigeAlt}/>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* 아카이브 */}
        <MXSection>나의 아카이브</MXSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: M.terra, color: "#fff", borderRadius: MR.cardLg, padding: 16, minHeight: 110, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <MIcon name="map" size={22} color={M.oliveSoft}/>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em" }}>{seenBuildings.size}</div>
              <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.8 }}>내가 본 건축</div>
            </div>
          </div>
          <div style={{ background: M.olive, color: M.terraDeep, borderRadius: MR.cardLg, padding: 16, minHeight: 110, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <MIcon name="walk" size={22} color={M.terraDeep}/>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em" }}>{completed.length}</div>
              <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.85 }}>완주한 코스</div>
            </div>
          </div>
        </div>

        {/* 가볼 곳 — 팔로우 채널 발자취에서 담은 장소 */}
        {(st.savedPlaces || []).length > 0 && (
          <>
            <MXSection>가볼 곳</MXSection>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {(st.savedPlaces || []).map((name, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 999, background: "#fff", border: `1px solid ${M.cream}`, fontSize: 12, fontWeight: 700, color: M.ink }}>
                  <MIcon name="bookmark" size={11} color={M.olive}/>{name}
                </span>
              ))}
            </div>
          </>
        )}

        {/* 계정 (실명 비공개) */}
        <div style={{ marginTop: 26, background: M.cream, borderRadius: MR.cardLg, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <MIcon name="settings" size={15} color={M.muted}/>
            <span style={{ fontSize: 13, fontWeight: 800, color: M.ink }}>내 계정</span>
          </div>
          <div style={{ fontSize: 12.5, color: M.muted, fontWeight: 600, lineHeight: 1.6, textWrap: "pretty" }}>
            이 계정은 채널 <b style={{ color: M.ink }}>{MX_ACCOUNT.channels.length}개</b>를 운영 중이에요. 실명·소속은 <b style={{ color: M.ink }}>본인에게만</b> 보이고, 팔로워에게는 채널만 노출됩니다. 정산은 실명 계정에 귀속돼요.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   채널 관리 / 통계
   ================================================================ */
function MXChannelManage({ app, channelId }) {
  const { st, act, nav } = app;
  const ch = mxChannel(channelId);
  const fol = st.followed.has(ch.id);
  const fp = mxFootprint(ch.id, st.doneStops);
  const courses = MX_COURSES.filter((c) => c.channelId === ch.id);

  return (
    <div>
      <MXHeader transparent onBack={nav.back}/>
      <div style={{ margin: "-58px 0 0", position: "relative" }}>
        <MXPhoto tone={ch.color} height={170}/>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -34, display: "flex", justifyContent: "center" }}>
          <MXAvatar ch={ch} size={84} ring/>
        </div>
      </div>

      <div style={{ padding: `46px ${MX.pageX}px 28px`, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", wordBreak: "keep-all" }}>{ch.name}</span>
          {ch.official && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 800, color: M.olive, whiteSpace: "nowrap" }}><MIcon name="sparkle" size={12} color={M.olive}/>공식</span>}
        </div>
        <div style={{ fontSize: 12.5, color: M.muted, fontWeight: 600, marginTop: 3 }}>{ch.handle} · {ch.cat}</div>
        <p style={{ fontSize: 13.5, color: M.ink, fontWeight: 500, lineHeight: 1.6, margin: "12px auto 0", maxWidth: 300, textWrap: "pretty" }}>{ch.bio}</p>

        <div style={{ display: "flex", gap: 8, margin: "18px 0" }}>
          {[["팔로워", ch.followers.toLocaleString()], ["완주 코스", fp.walkedCourses], ["정복 시리즈", fp.conqueredSeries], ["다녀온 곳", fp.count]].map(([l, v]) => (
            <div key={l} style={{ flex: 1, background: M.cream, borderRadius: MR.card, padding: "12px 6px" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: M.ink }}>{v}</div>
              <div style={{ fontSize: 10.5, color: M.muted, fontWeight: 700, marginTop: 2, whiteSpace: "nowrap" }}>{l}</div>
            </div>
          ))}
        </div>

        {ch.mine ? (
          <div style={{ display: "flex", gap: 8 }}>
            <MXBtn kind="primary" full onClick={() => act.toast("프로필 편집 (준비 중)")} icon={<MIcon name="edit" size={15} color="#fff"/>}>프로필 편집</MXBtn>
            <MXBtn kind="soft" onClick={() => nav.tab("create")} icon={<MIcon name="plus" size={16} color={M.ink}/>}>코스</MXBtn>
          </div>
        ) : (
          <MXBtn kind={fol ? "outline" : "primary"} full onClick={() => act.toggleFollow(ch.id)}>{fol ? "✓ 팔로잉" : "+ 팔로우"}</MXBtn>
        )}
      </div>

      <div style={{ padding: `0 ${MX.pageX}px 28px`, textAlign: "left" }}>
        {/* 발자취 */}
        <MXFootprint ch={ch} fp={fp} app={app}/>

        <MXSection>{ch.name}의 코스</MXSection>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {courses.map((c) => <MXCourseCard key={c.id} course={c} app={app} compact/>)}
          {courses.length === 0 && <div style={{ padding: 24, textAlign: "center", color: M.muted, fontSize: 13, fontWeight: 600, background: M.cream, borderRadius: MR.card }}>아직 공개한 코스가 없어요.</div>}
        </div>

        {ch.mine && (
          <div style={{ marginTop: 18, background: M.cream, borderRadius: MR.card, padding: 14, fontSize: 12, color: M.muted, fontWeight: 600, lineHeight: 1.6, textWrap: "pretty" }}>
            이 채널 화면에는 실명·소속이 표시되지 않아요. 코스 수익은 실명 계정으로 정산됩니다.
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- 발자취 (앱) — 다녀온 곳 미니맵 + 장소 ---------- */
const MXFP_HOOD_POS = { seongsu: { x: 0.72, y: 0.42 }, seochon: { x: 0.28, y: 0.55 }, jongno: { x: 0.5, y: 0.34 } };
const MXFP_KIND_COLOR = { 건축: "#333D51", 카페: "#D3AC2B", 공원: "#1F8A5B", 상점: "#9C7E1A", 전망: "#5A6B7A" };
function MXFootprint({ ch, fp, app }) {
  const { st, act } = app;
  if (!fp.count) return null;
  const saved = new Set(st.savedPlaces || []);
  const allSaved = fp.places.every((p) => saved.has(p.name));
  const pins = fp.places.map((p, i) => {
    const base = MXFP_HOOD_POS[p.hood] || { x: 0.5, y: 0.5 };
    const ang = (i * 47) % 360 * (Math.PI / 180);
    const rad = 0.07 + ((i * 13) % 7) / 70;
    return { ...p, x: Math.max(0.08, Math.min(0.92, base.x + Math.cos(ang) * rad)), y: Math.max(0.12, Math.min(0.86, base.y + Math.sin(ang) * rad * 1.4)) };
  });
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <MXSection style={{ margin: 0 }}>다녀온 곳 · 발자취</MXSection>
        {!ch.mine && (
          <button onClick={() => act.addSavedPlaces(fp.places.map((p) => p.name))} disabled={allSaved} style={{
            padding: "7px 13px", borderRadius: 999, border: `1.5px solid ${allSaved ? M.beigeAlt : M.terra}`,
            background: allSaved ? "transparent" : M.terra, color: allSaved ? M.muted : "#fff",
            fontSize: 11.5, fontWeight: 800, fontFamily: "inherit", cursor: allSaved ? "default" : "pointer", whiteSpace: "nowrap",
          }}>{allSaved ? "✓ 담음" : "+ 가볼 곳 담기"}</button>
        )}
      </div>
      {/* 미니맵 */}
      <div style={{ position: "relative", aspectRatio: "3/2", borderRadius: MR.card, overflow: "hidden", background: "linear-gradient(160deg, #EEEAD9 0%, #E4DFCB 100%)", border: `1px solid ${M.cream}` }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(51,61,81,0.05) 0 1px, transparent 1px 26px), repeating-linear-gradient(90deg, rgba(51,61,81,0.05) 0 1px, transparent 1px 26px)" }}/>
        <div style={{ position: "absolute", left: "-5%", right: "-5%", top: "60%", height: 18, background: "rgba(90,107,122,0.18)", transform: "rotate(-6deg)" }}/>
        {pins.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: `${p.x * 100}%`, top: `${p.y * 100}%`, transform: "translate(-50%,-100%)", width: 13, height: 13, borderRadius: "50% 50% 50% 0", background: MXFP_KIND_COLOR[p.kind] || M.terra, rotate: "-45deg", border: "2px solid #fff", boxShadow: "0 2px 4px rgba(0,0,0,0.22)" }}/>
        ))}
        {Object.entries(fp.byHood).map(([hid, arr]) => {
          const pos = MXFP_HOOD_POS[hid] || { x: 0.5, y: 0.5 }; const h = mxHood(hid) || { name: hid };
          return <div key={hid} style={{ position: "absolute", left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, transform: "translate(-50%, 12px)", fontFamily: MT.family, fontSize: 9, fontWeight: 700, color: M.ink, background: "rgba(255,255,255,0.75)", padding: "2px 6px", borderRadius: 999, whiteSpace: "nowrap" }}>{h.name} {arr.length}</div>;
        })}
        <div style={{ position: "absolute", left: 10, bottom: 8, fontFamily: MT.family, fontSize: 9, fontWeight: 700, color: M.muted }}>{fp.count} PLACES · {fp.hoods} AREAS</div>
      </div>
      {/* 장소 칩 (동네별) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
        {Object.entries(fp.byHood).map(([hid, arr]) => {
          const h = mxHood(hid) || { name: hid };
          return (
            <div key={hid}>
              <div style={{ fontSize: 12, fontWeight: 800, color: M.ink, marginBottom: 7 }}>📍 {h.name} <span style={{ color: M.muted, fontWeight: 600 }}>· {arr.length}곳</span></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {arr.map((p, i) => {
                  const isSaved = saved.has(p.name);
                  return (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 999, background: M.cream, border: `1px solid ${isSaved ? M.olive : M.cream}`, fontSize: 11.5, fontWeight: 700, color: M.ink }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: MXFP_KIND_COLOR[p.kind] || M.terra }}/>
                      {p.name}{isSaved && <span style={{ color: M.oliveDeep, fontWeight: 900 }}>✓</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================
   시트 본문들
   ================================================================ */
function MXChannelSheet({ app }) {
  const { st, act } = app;
  const mine = MX_CHANNELS.filter((c) => MX_ACCOUNT.channels.includes(c.id));
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {mine.map((ch) => {
          const on = ch.id === st.currentChannelId;
          return (
            <button key={ch.id} onClick={() => { act.switchChannel(ch.id); act.closeSheet(); }} style={{
              display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: MR.card, cursor: "pointer",
              background: on ? "rgba(211,172,43,0.12)" : M.cream, border: `1.5px solid ${on ? M.olive : "transparent"}`, textAlign: "left", width: "100%" }}>
              <MXAvatar ch={ch} size={44}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: M.ink, whiteSpace: "nowrap" }}>{ch.name}</span>
                  {ch.official && <MIcon name="sparkle" size={11} color={M.olive}/>}
                </div>
                <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ch.handle} · 코스 {ch.courses}</div>
              </div>
              {on
                ? <span style={{ width: 24, height: 24, borderRadius: "50%", background: M.olive, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>✓</span>
                : <span style={{ fontSize: 12, fontWeight: 800, color: M.olive }}>전환</span>}
            </button>
          );
        })}
        <button onClick={() => { act.toast("새 채널 만들기 (준비 중)"); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: MR.card, cursor: "pointer", background: "transparent", border: `1.5px dashed ${M.beigeAlt}`, width: "100%" }}>
          <span style={{ width: 44, height: 44, borderRadius: "50%", background: M.cream, display: "flex", alignItems: "center", justifyContent: "center" }}><MIcon name="plus" size={20} color={M.muted}/></span>
          <span style={{ fontSize: 14.5, fontWeight: 800, color: M.ink }}>새 채널 만들기</span>
        </button>
      </div>
      <div style={{ marginTop: 16, padding: 13, background: M.cream, borderRadius: MR.card, display: "flex", gap: 9 }}>
        <MIcon name="user" size={15} color={M.muted}/>
        <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, lineHeight: 1.55, textWrap: "pretty" }}>
          한 계정으로 여러 채널을 운영해요. 팔로워에게는 <b style={{ color: M.ink }}>채널만</b> 보이고 실명은 비공개입니다.
        </div>
      </div>
    </div>
  );
}

function MXHoodSheet({ app }) {
  const { st, act } = app;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {MX_HOODS.map((h) => {
        const on = h.id === st.hood;
        return (
          <button key={h.id} onClick={() => { act.setHood(h.id); act.closeSheet(); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: MR.card, cursor: "pointer",
            background: on ? "rgba(51,61,81,0.07)" : M.cream, border: `1.5px solid ${on ? M.terra : "transparent"}`, textAlign: "left", width: "100%" }}>
            <MIcon name="location" size={20} color={on ? M.terra : M.muted}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: M.ink }}>{h.name}</div>
              <div style={{ fontSize: 12, color: M.muted, fontWeight: 600 }}>{h.sub} · 코스 {mxCoursesByHood(h.id).length}</div>
            </div>
            {on && <span style={{ fontSize: 12, fontWeight: 800, color: M.terra }}>보는 중</span>}
          </button>
        );
      })}
      <div style={{ marginTop: 6, fontSize: 12, color: M.faint, fontWeight: 600, textAlign: "center" }}>지금은 서울 세 권역에 집중하고 있어요</div>
    </div>
  );
}

function MXAddStopSheet({ app, data }) {
  const [q, setQ] = React.useState("");
  const pool = (data.pool || []).filter((p) => p.name.includes(q));
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: M.cream, borderRadius: MR.field, padding: "12px 14px", marginBottom: 14 }}>
        <MIcon name="search" size={16} color={M.muted}/>
        <input value={q} onChange={(e) => setQ(e.target.value)} autoFocus placeholder="장소 검색 (건축·카페·공원)" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, fontWeight: 600, color: M.ink, fontFamily: MT.family }}/>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {pool.map((p, i) => (
          <button key={i} onClick={() => { data.onPick(p); app.act.toast(`'${p.name}' 추가됨`); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: 11, borderRadius: MR.card, cursor: "pointer", background: M.cream, border: "none", width: "100%", textAlign: "left" }}>
            <MXStopGlyph kind={p.kind} size={36}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: M.ink }}>{p.name}</div>
              <div style={{ fontSize: 11.5, color: M.muted, fontWeight: 600 }}>{p.kind}</div>
            </div>
            <MIcon name="plus" size={17} color={M.olive}/>
          </button>
        ))}
        {pool.length === 0 && <div style={{ padding: 20, textAlign: "center", color: M.muted, fontSize: 13, fontWeight: 600 }}>검색 결과가 없어요</div>}
      </div>
    </div>
  );
}

/* ================================================================
   스탬프 인증 모달 (GPS 체크인 + 사진) — 현장 느낌 크게
   ================================================================ */
function MXStampModal({ app, data }) {
  const { act } = app;
  const [phase, setPhase] = React.useState("gps"); // gps → photo → done
  const [photo, setPhoto] = React.useState(false);
  if (!data) return null;
  const stop = data.stop;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 90, display: "flex", flexDirection: "column" }}>
      <div onClick={act.closeStamp} style={{ position: "absolute", inset: 0, background: "rgba(15,18,28,0.55)", animation: "mxFade .2s" }}/>
      <div style={{ position: "relative", marginTop: "auto", background: "#fff", borderRadius: "28px 28px 0 0", padding: "10px 0 0", animation: "mxUp .28s cubic-bezier(.2,.8,.2,1)" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 6 }}><div style={{ width: 38, height: 4, borderRadius: 999, background: M.beigeAlt }}/></div>

        {phase === "done" ? (
          <div style={{ padding: `12px ${MX.pageX}px ${MX.bottomClear + 24}px`, textAlign: "center" }}>
            <div style={{ width: 92, height: 92, borderRadius: "50%", background: M.olive, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "8px auto 0", fontSize: 46, fontWeight: 900, boxShadow: "0 10px 30px rgba(211,172,43,0.5)", animation: "mxPop .4s cubic-bezier(.2,1.4,.4,1)" }}>✓</div>
            <h2 style={{ fontFamily: MT.family, fontSize: 24, fontWeight: 900, color: M.ink, margin: "18px 0 4px" }}>스탬프 획득!</h2>
            <div style={{ fontSize: 14, color: M.muted, fontWeight: 600 }}>{stop.name} 방문을 인증했어요</div>
            <div style={{ marginTop: 24 }}>
              <MXBtn kind="primary" full onClick={() => { act.toggleStop(data.courseId, stop.id); act.closeStamp(); }}>코스로 돌아가기</MXBtn>
            </div>
          </div>
        ) : (
          <div style={{ padding: `8px ${MX.pageX}px ${MX.bottomClear + 20}px` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <MXStopGlyph kind={stop.kind} size={46}/>
              <div>
                <div style={{ fontSize: 12, color: M.muted, fontWeight: 700 }}>방문 인증</div>
                <div style={{ fontSize: 19, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>{stop.name}</div>
              </div>
            </div>

            {/* GPS 체크인 */}
            <div style={{ position: "relative", borderRadius: MR.cardLg, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ height: 180, background: "#E9EBEF", position: "relative",
                backgroundImage: "repeating-linear-gradient(0deg,#dfe3e8 0 1px,transparent 1px 26px),repeating-linear-gradient(90deg,#dfe3e8 0 1px,transparent 1px 26px)" }}>
                {/* 현재 위치 */}
                <div style={{ position: "absolute", left: "50%", top: "52%", transform: "translate(-50%,-50%)" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#2A6FDB", border: "3px solid #fff", boxShadow: "0 0 0 6px rgba(42,111,219,0.25)" }}/>
                </div>
                {/* 목적지 핀 */}
                <div style={{ position: "absolute", left: "62%", top: "34%" }}><MXStopGlyph kind={stop.kind} size={34}/></div>
                <div style={{ position: "absolute", left: 12, top: 12, fontSize: 11, fontWeight: 800, color: phase === "gps" ? "#2A6FDB" : M.olive, background: "rgba(255,255,255,0.92)", padding: "6px 11px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: phase === "gps" ? "#2A6FDB" : M.olive }}/>
                  {phase === "gps" ? "현재 위치 확인 중 · 12m" : "체크인 완료 ✓"}
                </div>
              </div>
            </div>

            {phase === "gps" && (
              <MXBtn kind="primary" full icon={<MIcon name="location" size={18} color="#fff"/>} onClick={() => setPhase(app.t.stampPhoto ? "photo" : "done")}>여기 도착했어요 · 체크인</MXBtn>
            )}

            {phase === "photo" && (
              <>
                <div onClick={() => setPhoto(true)} style={{ borderRadius: MR.cardLg, border: `2px dashed ${photo ? M.olive : M.beigeAlt}`, background: photo ? "rgba(211,172,43,0.08)" : M.cream, padding: photo ? 0 : 28, textAlign: "center", cursor: "pointer", marginBottom: 14, overflow: "hidden" }}>
                  {photo
                    ? <MXPhoto tone={stop.kind === "건축" ? "#333D51" : M.olive} height={150} label={`${stop.name} · 인증 사진`}/>
                    : <div><MIcon name="camera" size={30} color={M.muted}/><div style={{ fontSize: 13.5, fontWeight: 800, color: M.ink, marginTop: 8 }}>현장 사진 찍기</div><div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 2 }}>방문을 증명할 사진 한 장</div></div>}
                </div>
                <MXBtn kind="gold" full onClick={() => setPhase("done")} icon={<MIcon name="sparkle" size={17} color={M.terraDeep}/>}>스탬프 받기</MXBtn>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { MXFeed, MXExplore, MXMyPage, MXChannelManage, MXFootprint, MXChannelSheet, MXHoodSheet, MXAddStopSheet, MXStampModal, MXSeriesList, MXSeriesDetail });

/* ================================================================
   시리즈 (산책 코스 묶음 정복) — 웹 collection 과 동일 모델
   ================================================================ */
function MXSeriesList({ app }) {
  const { st, nav } = app;
  const conquered = MX_SERIES.filter((s) => mxSeriesProgress(s, st.doneStops).complete).length;
  return (
    <div>
      <div style={{ paddingTop: MX.topClear, paddingLeft: MX.pageX, paddingRight: MX.pageX, paddingBottom: 6 }}>
        <h1 style={{ fontFamily: MT.family, fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", color: M.ink, margin: 0 }}>시리즈 정복</h1>
        <div style={{ fontSize: 13, color: M.muted, fontWeight: 600, marginTop: 4 }}>산책 코스를 모아 완주 · 정복 {conquered}/{MX_SERIES.length}</div>
      </div>
      <div style={{ padding: `16px ${MX.pageX}px 24px`, display: "flex", flexDirection: "column", gap: 14 }}>
        {MX_SERIES.map((s) => {
          const sp = mxSeriesProgress(s, st.doneStops);
          return (
            <div key={s.id} onClick={() => nav.go("seriesDetail", s.id)} style={{ background: "#fff", borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.card, border: `1px solid ${M.cream}`, cursor: "pointer" }}>
              <div style={{ height: 120, background: s.cover, color: "#fff", padding: 16, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: MT.family, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", opacity: 0.85 }}>{s.no} · {s.kind}</span>
                  {sp.complete && <span style={{ padding: "3px 9px", borderRadius: 999, background: M.olive, color: M.terraDeep, fontSize: 10.5, fontWeight: 900 }}>★ 정복</span>}
                </div>
                <div style={{ fontFamily: MT.family, fontSize: 24, fontWeight: 900, letterSpacing: "-0.025em" }}>{s.title}</div>
              </div>
              <div style={{ padding: 15 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: sp.complete ? M.olive : M.muted, whiteSpace: "nowrap" }}>{sp.done} / {sp.total} 코스 정복</span>
                  <span style={{ fontFamily: MT.family, fontSize: 11, fontWeight: 700, color: M.muted, whiteSpace: "nowrap" }}>{sp.pct}%</span>
                </div>
                <MXBar pct={sp.pct} h={8}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MXSeriesDetail({ app, seriesId }) {
  const { st, nav } = app;
  const s = mxSeries(seriesId);
  const sp = mxSeriesProgress(s, st.doneStops);

  return (
    <div>
      <MXHeader transparent onBack={nav.back}/>
      <div style={{ margin: "-58px 0 0", position: "relative" }}>
        <MXPhoto tone={s.cover} height={210}/>
        <div style={{ position: "absolute", left: MX.pageX, right: MX.pageX, bottom: 16, color: "#fff" }}>
          <div style={{ fontFamily: MT.family, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", opacity: 0.85 }}>SERIES · {s.no} · {s.kind}</div>
          <h1 style={{ fontFamily: MT.family, fontSize: 30, fontWeight: 900, letterSpacing: "-0.03em", margin: "4px 0 0", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>{s.title}</h1>
        </div>
      </div>

      <div style={{ padding: `18px ${MX.pageX}px 28px` }}>
        <p style={{ fontSize: 14.5, lineHeight: 1.65, color: M.ink, fontWeight: 500, margin: 0, textWrap: "pretty" }}>{s.intro}</p>

        {/* 정복 현황 */}
        <div style={{ background: s.cover, color: "#fff", borderRadius: MR.cardLg, padding: 18, margin: "18px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 800 }}>나의 정복 현황</span>
            <span style={{ fontSize: 13, fontWeight: 900 }}>{sp.done} / {sp.total} 코스</span>
          </div>
          <MXBar pct={sp.pct} track="rgba(255,255,255,0.2)" h={10}/>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 12, fontWeight: 700 }}>
            <span style={{ opacity: 0.85 }}>{sp.pct}% 완료</span>
            {sp.complete ? <span style={{ color: M.oliveSoft }}>정복 완료 ★</span> : <span style={{ opacity: 0.75 }}>{sp.total - sp.done}개 코스 남음</span>}
          </div>
        </div>

        {/* 정복 배지 */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: sp.complete ? s.cover : M.cream, color: sp.complete ? "#fff" : M.muted, border: `1.5px solid ${sp.complete ? s.cover : M.beigeAlt}`, borderRadius: MR.cardLg, padding: 16, marginBottom: 22 }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", flexShrink: 0, background: sp.complete ? "rgba(255,255,255,0.18)" : M.beige, border: `2px solid ${sp.complete ? "rgba(255,255,255,0.5)" : M.beigeAlt}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MIcon name="sparkle" size={24} color={sp.complete ? "#fff" : M.beigeAlt}/>
          </div>
          <div>
            <div style={{ fontFamily: MT.family, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>{sp.complete ? "BADGE UNLOCKED" : "전체 정복 시 획득"}</div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em", marginTop: 3, color: sp.complete ? "#fff" : M.ink }}>{s.badge}</div>
          </div>
        </div>

        {/* 멤버 코스 */}
        <MXSection>정복 코스 {sp.total}</MXSection>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sp.per.map(({ course: c, pr }) => {
            const ch = mxChannel(c.channelId);
            return (
              <div key={c.id} onClick={() => nav.go("course", c.id)} style={{ display: "flex", gap: 12, alignItems: "center", background: "#fff", borderRadius: MR.card, padding: 12, boxShadow: MS.cardSm, border: `1px solid ${pr.complete ? M.olive : M.cream}`, cursor: "pointer" }}>
                <MXRing pct={pr.pct} size={48} label={pr.complete ? "★" : `${pr.done}/${pr.tot}`}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: M.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 2 }}>{ch.name} · {pr.complete ? "완주 ★" : `${pr.done}/${pr.tot} 지점`}</div>
                </div>
                <MIcon name="chevron" size={15} color={M.beigeAlt}/>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
