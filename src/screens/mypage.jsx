/* ================================================================
   masilmap — 마이페이지 / My Map (#6)
   프로필 + 탭(예약 / 저장한 건물 / 저장한 코스 / 팔로우)
   ================================================================ */

function MyPageScreen({ onNavigate }) {
  const [tab, setTab] = React.useState("bookings");
  const savedB = BUILDINGS.slice(0, 6);
  const savedC = COURSES.slice(0, 3);

  // 마실 앱과 공유되는 상태 (채널 · 따라걷기 진행 · 정복 배지)
  const sh = useMasilShared();
  const done = sh.done;
  const curCh = mxChannel(sh.s.currentChannelId);
  const myChannels = MX_ACCOUNT.channels.map(mxChannel);
  const walking = MX_COURSES.filter((c) => sh.myCoursesSet.has(c.id));

  return (
    <MPage>
      <MasilNav route="mypage" onNavigate={onNavigate}/>

      {/* === 마실 앱 연동: 채널 · 정복 배지 · 따라 걷기 === */}
      <section style={{ padding: "40px 56px 8px" }}>
        <Hairline label="MY MASIL · 마실 앱과 연동" style={{ marginBottom: 24 }}/>

        {/* 현재 채널 + 계정 채널 전환 */}
        <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 24, marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: curCh.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, flexShrink: 0 }}>{curCh.name[0]}</div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>{curCh.name}</span>
                {curCh.official && <MIcon name="sparkle" size={14} color={M.olive}/>}
              </div>
              <div style={{ fontSize: 13, color: M.muted, fontWeight: 600, marginTop: 2 }}>{curCh.handle} · {curCh.cat} · 팔로워 {curCh.followers.toLocaleString()}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {myChannels.map((ch) => {
                const on = ch.id === curCh.id;
                return (
                  <button key={ch.id} onClick={() => sh.setChannel(ch.id)} style={{
                    display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 999, cursor: "pointer",
                    background: on ? M.terra : "#fff", color: on ? "#fff" : M.ink, border: `1.5px solid ${on ? M.terra : M.beigeAlt}`, fontSize: 13, fontWeight: 800 }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: ch.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>{ch.name[0]}</span>
                    {ch.name}{on && " ✓"}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 14, lineHeight: 1.6, textWrap: "pretty" }}>
            한 계정으로 여러 채널을 운영해요. 팔로워에게는 <b style={{ color: M.ink }}>채널만</b> 보이고 실명·소속은 비공개입니다. 채널·진행 상태는 마실 앱과 실시간으로 공유돼요.
          </div>
        </div>

        {/* 정복 배지 */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: 0 }}>정복 배지</h2>
          <a href="Masil App.html" style={{ fontSize: 12.5, fontWeight: 800, color: M.olive, textDecoration: "none" }}>마실 앱에서 걷기 →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {MX_BADGES.map((b) => {
            const bp = mxBadgeProgress(b, done);
            return (
              <div key={b.id} style={{ background: bp.got ? b.color : M.cream, color: bp.got ? "#fff" : M.ink, borderRadius: MR.cardLg, padding: 18, border: `1px solid ${bp.got ? b.color : M.beigeAlt}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: bp.got ? "rgba(255,255,255,0.18)" : M.beige, display: "flex", alignItems: "center", justifyContent: "center", border: bp.got ? "2px solid rgba(255,255,255,0.5)" : "none" }}>
                    <MIcon name="sparkle" size={20} color={bp.got ? "#fff" : M.beigeAlt}/>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, opacity: bp.got ? 0.9 : 1, color: bp.got ? "#fff" : M.muted }}>{bp.done}/{bp.tot}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 900, marginTop: 12, letterSpacing: "-0.01em" }}>{b.name}</div>
                <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 4, opacity: bp.got ? 0.85 : 1, color: bp.got ? "rgba(255,255,255,0.85)" : M.muted, lineHeight: 1.4 }}>{b.desc}</div>
                {!bp.got && (
                  <div style={{ marginTop: 10, height: 6, borderRadius: 999, background: "#E7E3D2", overflow: "hidden" }}>
                    <div style={{ width: `${Math.round(bp.done / bp.tot * 100)}%`, height: "100%", background: M.olive, borderRadius: 999 }}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 걷는 중인 코스 (따라 걷기 진행) */}
        {walking.length > 0 && (
          <>
            <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: "0 0 16px" }}>걷는 중인 코스</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 8 }}>
              {walking.map((c) => {
                const pr = mxCourseProgress(c, done);
                const ch = mxChannel(c.channelId);
                return (
                  <div key={c.id} onClick={() => onNavigate("walkcourse", c.id)} style={{ cursor: "pointer", display: "flex", gap: 16, alignItems: "center", background: "#fff", borderRadius: MR.cardLg, padding: 16, boxShadow: MS.cardSm, border: `1px solid ${M.cream}` }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: c.cover, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 18, fontWeight: 900 }}>{pr.complete ? "★" : `${pr.done}/${pr.tot}`}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.8, marginTop: 2 }}>방문</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 17, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, margin: "2px 0 10px" }}>{ch.name} · {c.distance} · {c.duration}</div>
                      <div style={{ height: 8, borderRadius: 999, background: "#E7E3D2", overflow: "hidden" }}>
                        <div style={{ width: `${pr.pct}%`, height: "100%", background: pr.complete ? M.olive : c.cover, borderRadius: 999 }}/>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* 가볼 곳 — 팔로우한 채널 발자취에서 담은 장소 */}
        {(sh.s.savedPlaces || []).length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: "0 0 6px" }}>가볼 곳</h2>
            <p style={{ fontSize: 13, color: M.muted, fontWeight: 500, margin: "0 0 14px" }}>팔로우한 채널이 다녀온 곳에서 담아둔 장소예요.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(sh.s.savedPlaces || []).map((name, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999, background: "#fff", border: `1px solid ${M.beigeAlt}`, fontSize: 13, fontWeight: 700, color: M.ink }}>
                  <MIcon name="bookmark" size={12} color={M.olive}/>{name}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
      <section style={{ padding: "40px 56px 24px" }}>
        <Hairline label={`MY MAP · 가입 ${USER.joined}`} style={{ marginBottom: 32 }}/>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 32, alignItems: "center" }}>
          <div style={{
            width: 120, height: 120, borderRadius: 999,
            background: USER.color, color: M.cream,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 52, fontWeight: 900,
            border: `4px solid ${M.cream}`, boxShadow: MS.card,
          }}>{USER.initial}</div>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
              <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.03em", margin: 0, color: M.ink }}>{USER.name}</h1>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: M.muted, fontWeight: 600 }}>{USER.handle}</span>
            </div>
            <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 17, color: M.ink, margin: "0 0 16px", fontWeight: 400 }}>
              “{USER.bio}”
            </p>
            <div style={{ display: "flex", gap: 28 }}>
              {[
                { l: "다녀온 코스", v: USER.visitedCount },
                { l: "저장한 건물", v: USER.savedBuildings },
                { l: "저장한 코스", v: USER.savedCourses },
                { l: "팔로잉",     v: USER.following },
                { l: "팔로워",     v: USER.followers },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>{m.v}</div>
                  <MagCap style={{ marginTop: 4 }}>{m.l}</MagCap>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <MButton kind="primary" size="md" icon={<MIcon name="edit" size={14} color={M.cream}/>}>프로필 수정</MButton>
            <MButton kind="secondary" size="md" icon={<MIcon name="settings" size={14} color={M.ink}/>}>설정</MButton>
          </div>
        </div>
      </section>

      {/* 탭 */}
      <section style={{ padding: "0 56px", borderBottom: `1px solid ${M.beigeAlt}`, marginTop: 12 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { id: "bookings", label: "예약 내역", count: BOOKINGS.length },
            { id: "buildings", label: "저장한 건물", count: USER.savedBuildings },
            { id: "courses", label: "저장한 코스", count: USER.savedCourses },
            { id: "follow", label: "팔로우", count: USER.following + USER.followers },
          ].map((t) => {
            const on = tab === t.id;
            return (
              <div key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "16px 20px 18px",
                fontSize: 14, fontWeight: 800,
                color: on ? M.terra : M.muted,
                borderBottom: on ? `3px solid ${M.terra}` : "3px solid transparent",
                marginBottom: -1,
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>{t.label}</span>
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: on ? M.terra : M.faint, fontWeight: 600 }}>{t.count}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 탭 내용 */}
      <section style={{ padding: "32px 56px 64px" }}>
        {tab === "bookings" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <Hairline label="RESERVATIONS · 예약 내역" style={{ flex: 1, marginRight: 20 }}/>
              <div style={{ display: "flex", gap: 6 }}>
                {["전체", "예정", "완료", "취소"].map((f, i) => (
                  <span key={f} style={{
                    padding: "6px 12px", borderRadius: 999,
                    fontSize: 11, fontWeight: 800,
                    background: i === 0 ? M.ink : "transparent",
                    color: i === 0 ? M.cream : M.muted,
                    border: i === 0 ? "none" : `1px solid ${M.beigeAlt}`,
                    cursor: "pointer",
                  }}>{f}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {BOOKINGS.map((bk) => {
                const c = COURSES.find((x) => x.id === bk.courseId);
                if (!c) return null;
                const isUpcoming = bk.status === "예정";
                return (
                  <div key={bk.id} style={{
                    background: M.cream, borderRadius: MR.cardLg, padding: 20, boxShadow: MS.cardSm,
                    display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 20, alignItems: "center",
                  }}>
                    <div style={{ width: 90, height: 90, background: c.cover, borderRadius: 16, padding: 12, color: M.cream, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <MagCap color="rgba(255,248,236,0.7)" style={{ fontSize: 9 }}>{c.type === "도슨트" ? "DOCENT" : "SELF"}</MagCap>
                      <div style={{ fontSize: 18, fontWeight: 900 }}>{c.buildings.length}곳</div>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{
                          fontSize: 11, fontWeight: 800,
                          padding: "4px 10px", borderRadius: 999,
                          background: isUpcoming ? M.terra : M.olive, color: M.cream,
                        }}>{bk.status}</span>
                        <Serial>{bk.id}</Serial>
                      </div>
                      <div style={{ fontSize: 19, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>{c.name}</div>
                      <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: M.muted, fontWeight: 700 }}>
                        <span>📅 {bk.date}</span>
                        <span>· {bk.time}</span>
                        <span>· {bk.people}명</span>
                        <span>· {bk.price > 0 ? `₩ ${bk.price.toLocaleString()}` : "무료"}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                      {isUpcoming
                        ? <span style={{ fontSize: 28, fontWeight: 900, color: M.terra, letterSpacing: "-0.02em" }}>D-{((bk.id || "").split("").reduce((a, ch) => a + ch.charCodeAt(0), 0) % 30) + 1}</span>
                        : <MagCap color={M.olive}>완료</MagCap>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {isUpcoming ? (
                        <>
                          <MButton kind="primary" size="sm">상세 보기</MButton>
                          <MButton kind="ghost" size="sm" style={{ color: M.muted, fontSize: 11 }}>취소</MButton>
                        </>
                      ) : (
                        <MButton kind="secondary" size="sm">리뷰 쓰기 ✦</MButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "buildings" && (
          <div>
            <Hairline label={`SAVED · 저장한 건물 ${USER.savedBuildings}곳`} style={{ marginBottom: 24 }}/>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {savedB.map((b) => (
                <div key={b.id} onClick={() => onNavigate("detail", b.id)} style={{
                  background: M.cream, borderRadius: MR.card, padding: 14, cursor: "pointer", boxShadow: MS.cardSm,
                }}>
                  <ImgPlaceholder ratio="4/3" tone={b.pinTone === "olive" ? "olive" : "beige"} caption={b.name}/>
                  <div style={{ padding: "14px 4px 4px" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 2 }}>{b.architect} · {b.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "courses" && (
          <div>
            <Hairline label={`SAVED · 저장한 코스 ${USER.savedCourses}개`} style={{ marginBottom: 24 }}/>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {savedC.map((c) => (
                <div key={c.id} onClick={() => onNavigate("course", c.id)} style={{
                  background: M.cream, borderRadius: MR.cardLg, overflow: "hidden", cursor: "pointer", boxShadow: MS.cardSm,
                  display: "flex",
                }}>
                  <div style={{ width: 140, background: c.cover, padding: 16, color: M.cream, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <MagCap color="rgba(255,248,236,0.7)">{c.type === "도슨트" ? "DOCENT" : "SELF"}</MagCap>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>{c.buildings.length}곳</div>
                  </div>
                  <div style={{ padding: 16, flex: 1 }}>
                    <MagCap>★ {c.rating} · {c.distance}</MagCap>
                    <div style={{ fontSize: 18, fontWeight: 900, color: M.ink, marginTop: 4, letterSpacing: "-0.02em" }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 6 }}>{c.curator.name} 큐레이션 · {c.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "follow" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <Hairline label={`팔로잉 · ${USER.following}`} style={{ marginBottom: 20 }}/>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {COURSES.map((c) => c.curator).slice(0, 4).map((cu, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: M.cream, borderRadius: MR.card }}>
                    <MAvatar initial={cu.initial} color={cu.color} size={44}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: M.ink }}>{cu.name}</div>
                      <div style={{ fontSize: 12, color: M.muted, fontWeight: 600 }}>{cu.role}</div>
                    </div>
                    <MButton kind="secondary" size="sm">팔로잉</MButton>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Hairline label={`팔로워 · ${USER.followers}`} style={{ marginBottom: 20 }}/>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["지은", "도현", "수아", "민준"].map((n, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: M.cream, borderRadius: MR.card }}>
                    <MAvatar initial={n[0]} color={[M.terra, M.olive, M.terraDeep, M.oliveDeep][i]} size={44}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: M.ink }}>{n}</div>
                      <div style={{ fontSize: 12, color: M.muted, fontWeight: 600 }}>다녀온 코스 {12 + i}개</div>
                    </div>
                    <MButton kind="primary" size="sm">맞팔로우</MButton>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <MFooter/>
    </MPage>
  );
}

Object.assign(window, { MyPageScreen });
