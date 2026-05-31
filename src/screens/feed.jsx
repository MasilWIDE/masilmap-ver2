/* ================================================================
   masilmap — 피드 / 팔로우 (#웹 파리티)
   팔로우한 채널의 새 코스 피드. 공유 store(followed)와 연동되어
   마실 앱과 실시간 동기화된다.
   ================================================================ */

function FeedChannelChip({ ch, following, onToggle, onOpen }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 92, flexShrink: 0 }}>
      <div onClick={onOpen} style={{
        width: 64, height: 64, borderRadius: "50%", background: ch.color, color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900,
        cursor: "pointer", position: "relative", boxShadow: MS.cardSm,
        border: following ? `2.5px solid ${M.olive}` : "2.5px solid transparent",
      }}>
        {ch.name[0]}
        {ch.official && (
          <span style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: "50%", background: M.olive, color: M.terraDeep, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, border: "2px solid #fff" }}>✓</span>
        )}
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: M.ink, textAlign: "center", lineHeight: 1.2, wordBreak: "keep-all" }}>{ch.name}</div>
      <button onClick={onToggle} style={{
        padding: "4px 12px", borderRadius: 999, cursor: "pointer", fontSize: 11, fontWeight: 800,
        border: `1.5px solid ${following ? M.beigeAlt : M.terra}`,
        background: following ? "transparent" : M.terra,
        color: following ? M.muted : "#fff", whiteSpace: "nowrap",
      }}>{following ? "팔로잉" : "팔로우"}</button>
    </div>
  );
}

function FeedScreen({ onNavigate }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const px = pageX(isMobile, isTablet);
  const sh = useMasilShared();
  const followed = sh.followedSet;

  const allCh = MX_CHANNELS.filter((c) => !c.mine);
  const followingChannels = allCh.filter((c) => followed.has(c.id));
  const discover = allCh.filter((c) => !followed.has(c.id));

  // 피드 = 팔로우한 채널의 활동만
  const feed = MX_FEED.filter((f) => followed.has(f.channelId));

  return (
    <MPage>
      <MasilNav route="feed" onNavigate={onNavigate}/>

      {/* 헤더 */}
      <section style={{ padding: `${isMobile ? 28 : 48}px ${px}px ${isMobile ? 16 : 24}px` }}>
        <Hairline label="MASILMAP · FEED" style={{ marginBottom: isMobile ? 16 : 28 }}/>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", gap: isMobile ? 14 : 56, alignItems: "end" }}>
          <div>
            <MagCap color={M.olive} style={{ marginBottom: 14 }}>팔로우한 채널의 새 코스</MagCap>
            <h1 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 34 : 64, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.04, margin: 0, color: M.ink, textWrap: "balance" }}>
              내가 따르는<br/><span style={{ color: M.olive }}>채널의 소식</span>
            </h1>
          </div>
          <p style={{ fontSize: isMobile ? 14 : 16, lineHeight: 1.7, color: M.muted, fontWeight: 500, margin: 0, textWrap: "pretty" }}>
            인플루언서·이웃이 만든 산책 코스를 팔로우하면, 새 코스가 올라올 때마다 여기에 모입니다. 팔로우는 마실 앱과 실시간으로 공유돼요.
          </p>
        </div>
      </section>

      {/* 팔로잉 채널 스트립 */}
      <section style={{ padding: `${isMobile ? 8 : 16}px ${px}px ${isMobile ? 8 : 16}px` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: M.ink }}>팔로잉 · {followingChannels.length}</span>
        </div>
        {followingChannels.length === 0 ? (
          <div style={{ padding: "24px 16px", borderRadius: MR.card, background: M.cream, border: `1px dashed ${M.beigeAlt}`, fontSize: 13, color: M.muted, fontWeight: 600, textAlign: "center" }}>
            아직 팔로우한 채널이 없어요. 아래에서 채널을 팔로우해 보세요.
          </div>
        ) : (
          <div style={{ display: "flex", gap: isMobile ? 14 : 22, overflowX: "auto", paddingBottom: 8 }}>
            {followingChannels.map((ch) => (
              <FeedChannelChip key={ch.id} ch={ch} following={true}
                onToggle={() => sh.toggleFollow(ch.id)}
                onOpen={() => onNavigate("channel", ch.id)}/>
            ))}
          </div>
        )}
      </section>

      {/* 피드 본문 */}
      <section style={{ padding: `${isMobile ? 20 : 32}px ${px}px ${isMobile ? 36 : 56}px` }}>
        <Hairline label={`NEW COURSES · ${feed.length}`} style={{ marginBottom: 22 }}/>
        {feed.length === 0 ? (
          <div style={{ padding: "48px 16px", textAlign: "center", color: M.muted }}>
            <MIcon name="walk" size={40} color={M.beigeAlt}/>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 14, color: M.ink }}>아직 새 소식이 없어요</div>
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>채널을 팔로우하면 새 코스가 여기 쌓입니다.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {feed.map((f) => {
              const ch = mxChannel(f.channelId);
              const c = mxCourse(f.courseId);
              if (!c) return null;
              const pr = mxCourseProgress(c, sh.done);
              const walking = sh.myCoursesSet.has(c.id);
              return (
                <div key={f.id} style={{
                  display: "grid", gridTemplateColumns: isMobile ? "1fr" : "200px 1fr",
                  gap: isMobile ? 0 : 22, background: M.cream, borderRadius: MR.cardLg,
                  overflow: "hidden", boxShadow: MS.card, border: `1px solid ${M.beigeAlt}`,
                }}>
                  {/* 코스 커버 */}
                  <div style={{ height: isMobile ? 160 : "100%", minHeight: isMobile ? 0 : 150, background: c.cover, position: "relative" }}>
                    <span style={{ position: "absolute", top: 12, left: 12, padding: "4px 9px", borderRadius: 999, background: c.official ? M.terra : "rgba(255,255,255,0.92)", color: c.official ? "#fff" : M.muted, fontSize: 10.5, fontWeight: 800 }}>{c.official ? "공식" : "유저 코스"}</span>
                    {walking && <span style={{ position: "absolute", bottom: 12, left: 12, padding: "4px 10px", borderRadius: 999, background: M.olive, color: M.terraDeep, fontSize: 11, fontWeight: 900 }}>{pr.complete ? "완주 ★" : `${pr.done}/${pr.tot} 방문`}</span>}
                  </div>
                  {/* 본문 */}
                  <div style={{ padding: isMobile ? 18 : "20px 22px 20px 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {/* 채널 헤더 */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span onClick={() => onNavigate("channel", ch.id)} style={{ cursor: "pointer", width: 30, height: 30, borderRadius: "50%", background: ch.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>{ch.name[0]}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span onClick={() => onNavigate("channel", ch.id)} style={{ cursor: "pointer", fontSize: 13.5, fontWeight: 900, color: M.ink }}>{ch.name}</span>
                          {ch.official && <MIcon name="sparkle" size={11} color={M.olive}/>}
                          <span style={{ fontSize: 12.5, color: M.muted, fontWeight: 600 }}>· {f.verb}</span>
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: M.faint, fontWeight: 600, marginTop: 1 }}>{f.when}</div>
                      </div>
                    </div>
                    <div onClick={() => onNavigate("walkcourse", c.id)} style={{ cursor: "pointer", fontSize: isMobile ? 20 : 24, fontWeight: 900, color: M.ink, letterSpacing: "-0.025em", lineHeight: 1.2, textWrap: "balance" }}>{c.title}</div>
                    <p style={{ fontSize: 13.5, color: M.muted, lineHeight: 1.6, margin: "8px 0 0", fontWeight: 500, textWrap: "pretty" }}>{c.summary}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 600, color: M.muted }}>
                      <span>{c.distance}</span><span style={{ color: M.faint }}>·</span>
                      <span>{c.duration}</span><span style={{ color: M.faint }}>·</span>
                      <span>지점 {c.stops.length}곳</span>
                      <span onClick={() => onNavigate("walkcourse", c.id)} style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 800, color: M.terra, cursor: "pointer", fontFamily: "Pretendard, sans-serif" }}>{walking ? "이어 걷기 →" : "따라 걷기 →"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 탐색 — 팔로우할 채널 */}
      <section style={{ padding: `${isMobile ? 32 : 48}px ${px}px ${isMobile ? 48 : 72}px`, background: M.cream, borderTop: `1px solid ${M.beigeAlt}` }}>
        <Hairline label="DISCOVER · 새 채널 팔로우" style={{ marginBottom: 22 }}/>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {discover.map((ch) => (
            <div key={ch.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: M.beige, borderRadius: MR.cardLg, padding: 18, border: `1px solid ${M.beigeAlt}` }}>
              <span onClick={() => onNavigate("channel", ch.id)} style={{ cursor: "pointer", width: 48, height: 48, borderRadius: "50%", background: ch.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, flexShrink: 0 }}>{ch.name[0]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 900, color: M.ink }}>{ch.name}</span>
                  {ch.official && <MIcon name="sparkle" size={12} color={M.olive}/>}
                </div>
                <div style={{ fontSize: 11.5, color: M.muted, fontWeight: 600, marginTop: 1 }}>{ch.cat} · 팔로워 {ch.followers.toLocaleString()} · 코스 {ch.courses}</div>
                <p style={{ fontSize: 12.5, color: M.ink, lineHeight: 1.5, margin: "8px 0 12px", fontWeight: 500, textWrap: "pretty" }}>{ch.bio}</p>
                <button onClick={() => sh.toggleFollow(ch.id)} style={{
                  padding: "7px 16px", borderRadius: 999, cursor: "pointer", fontSize: 12.5, fontWeight: 800,
                  border: `1.5px solid ${M.terra}`, background: M.terra, color: "#fff",
                }}>+ 팔로우</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <MFooter/>
    </MPage>
  );
}

Object.assign(window, { FeedScreen, FeedChannelChip, ChannelScreen });

/* ================================================================
   채널 프로필 (활동 브랜드 · 공개) — 실명·소속 비노출
   ================================================================ */
function ChannelScreen({ onNavigate, channelId }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const px = pageX(isMobile, isTablet);
  const sh = useMasilShared();
  const ch = mxChannel(channelId);
  const following = sh.followedSet.has(ch.id);
  const isMine = ch.mine;
  const fp = mxFootprint(ch.id, sh.done);
  const courses = MX_COURSES.filter((c) => c.channelId === ch.id);

  return (
    <MPage>
      <MasilNav route="feed" onNavigate={onNavigate}/>

      {/* 채널 헤더 */}
      <section style={{ background: ch.color, color: "#fff", padding: `${isMobile ? 32 : 56}px ${px}px ${isMobile ? 36 : 48}px` }}>
        <span onClick={() => onNavigate("feed")} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 22 }}>
          <MIcon name="chevron" size={12} color="rgba(255,255,255,0.8)" style={{ transform: "rotate(180deg)" }}/> 피드로
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 18 : 28, flexWrap: "wrap" }}>
          <div style={{ width: isMobile ? 76 : 96, height: isMobile ? 76 : 96, borderRadius: "50%", background: "rgba(255,255,255,0.16)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 34 : 44, fontWeight: 900, flexShrink: 0 }}>{ch.name[0]}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 32 : 48, fontWeight: 900, letterSpacing: "-0.03em", margin: 0, lineHeight: 1 }}>{ch.name}</h1>
              {ch.official && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 999, background: M.olive, color: M.terraDeep, fontSize: 11, fontWeight: 900 }}>✓ 공식</span>}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, opacity: 0.82, marginTop: 6 }}>{ch.handle} · {ch.cat}</div>
            <p style={{ fontSize: isMobile ? 14 : 15.5, lineHeight: 1.6, opacity: 0.92, fontWeight: 500, margin: "12px 0 0", maxWidth: 460, textWrap: "pretty" }}>{ch.bio}</p>
          </div>
          {!isMine && (
            <button onClick={() => sh.toggleFollow(ch.id)} style={{
              padding: "11px 24px", borderRadius: 999, cursor: "pointer", fontSize: 14, fontWeight: 800,
              border: `1.5px solid ${following ? "rgba(255,255,255,0.5)" : "#fff"}`,
              background: following ? "transparent" : "#fff", color: following ? "#fff" : ch.color, whiteSpace: "nowrap",
            }}>{following ? "팔로잉 ✓" : "+ 팔로우"}</button>
          )}
        </div>
        {/* 통계 — 발자취 랭킹 */}
        <div style={{ display: "flex", gap: isMobile ? 24 : 40, marginTop: 28, fontFamily: "'JetBrains Mono', monospace" }}>
          {[[ch.followers.toLocaleString(), "팔로워"], [String(fp.walkedCourses), "완주 코스"], [String(fp.conqueredSeries), "정복 시리즈"], [String(fp.count), "다녀온 곳"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", opacity: 0.7, marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, opacity: 0.7, fontWeight: 500, marginTop: 20 }}>
          팔로워에게는 채널만 보입니다. 운영자의 실명·소속은 공개되지 않아요.
        </div>
      </section>

      {/* 발자취 — 다녀온 곳 지도 + 장소 */}
      <ChannelFootprint ch={ch} fp={fp} isMine={isMine} sh={sh} isMobile={isMobile} px={px} onNavigate={onNavigate}/>

      {/* 채널의 코스 */}
      <section style={{ padding: `${isMobile ? 32 : 48}px ${px}px ${isMobile ? 48 : 72}px` }}>
        <Hairline label={`COURSES · ${courses.length}`} style={{ marginBottom: 22 }}/>
        {courses.length === 0 ? (
          <div style={{ padding: "40px 16px", textAlign: "center", color: M.muted, fontSize: 14, fontWeight: 600 }}>아직 공개된 코스가 없어요.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 18 }}>
            {courses.map((c) => {
              const pr = mxCourseProgress(c, sh.done);
              const walking = sh.myCoursesSet.has(c.id);
              return (
                <div key={c.id} onClick={() => onNavigate("walkcourse", c.id)} style={{ cursor: "pointer", background: M.cream, borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.card, border: `1px solid ${M.beigeAlt}`, display: "block" }}>
                  <div style={{ height: 150, background: c.cover, position: "relative" }}>
                    <span style={{ position: "absolute", top: 12, left: 12, padding: "4px 9px", borderRadius: 999, background: c.official ? M.terra : "rgba(255,255,255,0.92)", color: c.official ? "#fff" : M.muted, fontSize: 10.5, fontWeight: 800 }}>{c.official ? "공식" : "유저 코스"}</span>
                    {walking && <span style={{ position: "absolute", bottom: 12, right: 12, padding: "4px 10px", borderRadius: 999, background: M.olive, color: M.terraDeep, fontSize: 11, fontWeight: 900 }}>{pr.complete ? "완주 ★" : `${pr.done}/${pr.tot}`}</span>}
                  </div>
                  <div style={{ padding: 18 }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", lineHeight: 1.25 }}>{c.title}</div>
                    <p style={{ fontSize: 12.5, color: M.muted, lineHeight: 1.55, margin: "8px 0 12px", fontWeight: 500, textWrap: "pretty" }}>{c.summary}</p>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: M.muted, fontWeight: 600 }}>{c.distance} · {c.duration} · 지점 {c.stops.length}곳</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <MFooter/>
    </MPage>
  );
}

Object.assign(window, { ChannelScreen });

/* ================================================================
   발자취 — 채널이 다녀온 곳 (지도 + 장소). 지도 기반 SNS의 자랑 면.
   ================================================================ */
const FP_HOOD_POS = { seongsu: { x: 0.72, y: 0.42 }, seochon: { x: 0.28, y: 0.55 }, jongno: { x: 0.5, y: 0.34 } };
const FP_KIND_COLOR = { 건축: "#333D51", 카페: "#D3AC2B", 공원: "#1F8A5B", 상점: "#9C7E1A", 전망: "#5A6B7A" };

function ChannelFootprint({ ch, fp, isMine, sh, isMobile, px, onNavigate }) {
  if (!fp.count) return null;
  const saved = new Set(sh.s.savedPlaces || []);
  const allSaved = fp.places.every((p) => saved.has(p.name));

  // 추상 지도용 핀 좌표 (동네 중심 + 결정적 지터)
  const pins = fp.places.map((p, i) => {
    const base = FP_HOOD_POS[p.hood] || { x: 0.5, y: 0.5 };
    const ang = (i * 47) % 360 * (Math.PI / 180);
    const rad = 0.06 + ((i * 13) % 7) / 70;
    return { ...p, x: Math.max(0.08, Math.min(0.92, base.x + Math.cos(ang) * rad)), y: Math.max(0.12, Math.min(0.88, base.y + Math.sin(ang) * rad * 1.4)) };
  });

  return (
    <section style={{ padding: `${isMobile ? 32 : 44}px ${px}px 0` }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
        <div>
          <MagCap color={ch.color} style={{ marginBottom: 6 }}>FOOTPRINT · 다녀온 곳</MagCap>
          <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 24 : 32, fontWeight: 900, letterSpacing: "-0.025em", color: M.ink, margin: 0 }}>
            {ch.name}의 발자취
          </h2>
        </div>
        {!isMine && (
          <button onClick={() => sh.addSavedPlaces(fp.places.map((p) => p.name))} disabled={allSaved} style={{
            padding: "10px 18px", borderRadius: 999, cursor: allSaved ? "default" : "pointer", fontSize: 13, fontWeight: 800, fontFamily: "inherit",
            border: `1.5px solid ${allSaved ? M.beigeAlt : M.terra}`,
            background: allSaved ? "transparent" : M.terra, color: allSaved ? M.muted : "#fff", whiteSpace: "nowrap",
          }}>{allSaved ? "✓ 가볼 곳에 담음" : "+ 나도 가볼 곳에 담기"}</button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 1fr", gap: isMobile ? 18 : 28, alignItems: "start" }}>
        {/* 추상 지도 */}
        <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: MR.cardLg, overflow: "hidden", background: "linear-gradient(160deg, #EEEAD9 0%, #E4DFCB 100%)", border: `1px solid ${M.beigeAlt}` }}>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(51,61,81,0.05) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, rgba(51,61,81,0.05) 0 1px, transparent 1px 32px)" }}/>
          {/* 한강 느낌의 곡선 */}
          <div style={{ position: "absolute", left: "-5%", right: "-5%", top: "62%", height: 22, background: "rgba(90,107,122,0.18)", transform: "rotate(-6deg)" }}/>
          {pins.map((p, i) => {
            const col = FP_KIND_COLOR[p.kind] || M.terra;
            return (
              <div key={i} title={p.name} style={{ position: "absolute", left: `${p.x * 100}%`, top: `${p.y * 100}%`, transform: "translate(-50%,-100%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50% 50% 50% 0", background: col, transform: "rotate(-45deg)", border: "2px solid #fff", boxShadow: "0 2px 5px rgba(0,0,0,0.25)" }}/>
              </div>
            );
          })}
          {/* 동네 라벨 */}
          {Object.entries(fp.byHood).map(([hid, arr]) => {
            const pos = FP_HOOD_POS[hid] || { x: 0.5, y: 0.5 };
            const h = mxHood(hid) || { name: hid };
            return (
              <div key={hid} style={{ position: "absolute", left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, transform: "translate(-50%, 14px)", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: M.ink, background: "rgba(255,255,255,0.75)", padding: "2px 7px", borderRadius: 999, whiteSpace: "nowrap" }}>{h.name} {arr.length}</div>
            );
          })}
          <div style={{ position: "absolute", left: 12, bottom: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: M.muted }}>{fp.count} PLACES · {fp.hoods} AREAS</div>
        </div>

        {/* 장소 그리드 (동네별) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {Object.entries(fp.byHood).map(([hid, arr]) => {
            const h = mxHood(hid) || { name: hid };
            return (
              <div key={hid}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: M.ink, marginBottom: 8 }}>📍 {h.name} <span style={{ color: M.muted, fontWeight: 600 }}>· {arr.length}곳</span></div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {arr.map((p, i) => {
                    const col = FP_KIND_COLOR[p.kind] || M.terra;
                    const isSaved = saved.has(p.name);
                    return (
                      <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, background: M.cream, border: `1px solid ${isSaved ? M.olive : M.beigeAlt}`, fontSize: 12.5, fontWeight: 700, color: M.ink }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: col }}/>
                        {p.name}
                        {isSaved && <span style={{ color: M.oliveDeep, fontWeight: 900 }}>✓</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {!isMine && (
            <div style={{ fontSize: 12, color: M.muted, fontWeight: 500, lineHeight: 1.5, marginTop: 4, textWrap: "pretty" }}>
              {ch.name}님이 다녀온 곳이에요. ‘가볼 곳에 담기’를 누르면 내 지도에 모이고, 새 코스를 올리면 피드로 받아볼 수 있어요.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ChannelFootprint });
