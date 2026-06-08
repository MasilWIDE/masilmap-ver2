/* ================================================================
   masilmap — 시리즈 (산책 코스를 묶어 정복하는 상위 단위)
   단일 모델 MX_SERIES 기반. 정복·도장·배지는 모두 공유 스탬프
   (doneStops)로 계산 → 웹·앱이 동일하게 동기화된다.
   route 이름은 호환 위해 "collection" 유지.
   ================================================================ */

/* ---------- 진행률 바 ---------- */
function ProgressBar({ pct, accent, height = 12 }) {
  return (
    <div style={{ width: "100%", height, borderRadius: 999, background: M.beigeAlt, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: accent, transition: "width .35s ease" }}/>
    </div>
  );
}

/* ---------- 정복 뱃지 카드 ---------- */
function ConquerBadge({ badge, conquered, accent, isMobile }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: isMobile ? 16 : 22,
      background: conquered ? accent : M.cream,
      border: `1.5px solid ${conquered ? accent : M.beigeAlt}`,
      color: conquered ? M.cream : M.muted,
      borderRadius: MR.cardLg, padding: isMobile ? "18px 20px" : "22px 28px",
    }}>
      <div style={{
        flexShrink: 0, width: isMobile ? 54 : 64, height: isMobile ? 54 : 64, borderRadius: "50%",
        background: conquered ? "rgba(255,248,236,0.15)" : M.beige,
        border: `2px solid ${conquered ? "rgba(255,248,236,0.5)" : M.beigeAlt}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <MIcon name="sparkle" size={isMobile ? 26 : 30} color={conquered ? M.cream : M.beigeAlt}/>
      </div>
      <div>
        <div style={{ fontFamily: MT.family, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", opacity: conquered ? 0.85 : 1 }}>
          {conquered ? "BADGE UNLOCKED · 정복 완료" : "REWARD · 전체 정복 시 획득"}
        </div>
        <div style={{ fontSize: isMobile ? 19 : 23, fontWeight: 900, letterSpacing: "-0.02em", marginTop: 4, color: conquered ? M.cream : M.ink }}>
          {badge}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   시리즈 상세 (정복 화면)
   ================================================================ */
function CollectionScreen({ route, onNavigate, collectionId, t }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const px = pageX(isMobile, isTablet);
  const sh = useMasilShared();
  const done = sh.done;

  if (!collectionId) return <CollectionIndex onNavigate={onNavigate} t={t}/>;

  const c = mxSeries(collectionId);
  const sp = mxSeriesProgress(c, done);
  const accent = c.cover;
  const conquered = sp.complete;

  return (
    <MPage>
      <MasilNav route="collection" onNavigate={onNavigate}/>

      {/* 상단 바 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `16px ${px}px`, borderBottom: `1px solid ${M.beigeAlt}` }}>
        <span onClick={() => onNavigate("collection")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: M.muted }}>
          <MIcon name="chevron" size={12} color={M.muted} style={{ transform: "rotate(180deg)" }}/>
          <span>전체 컬렉션</span>
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <MButton kind="secondary" size="sm" icon={<MIcon name="bookmark" size={12} color={M.ink}/>}>저장</MButton>
          <MButton kind="secondary" size="sm" icon={<MIcon name="share" size={12} color={M.ink}/>}>공유</MButton>
        </div>
      </div>

      {/* HERO — 표지 + 정복 현황 */}
      <section style={{ background: accent, color: M.cream, padding: `${isMobile ? 36 : 64}px ${px}px ${isMobile ? 40 : 56}px` }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr", gap: isMobile ? 32 : 64, alignItems: "end" }}>
          {/* 좌: 타이틀 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{ fontFamily: MT.family, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,248,236,0.75)" }}>SERIES · {c.no}</span>
              <span style={{ padding: "4px 11px", borderRadius: 999, border: "1px solid rgba(255,248,236,0.4)", fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{c.kind}</span>
            </div>
            <h1 style={{ fontFamily: MT.family, fontSize: isMobile ? 44 : 84, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.98, margin: 0, textWrap: "balance" }}>{c.title}</h1>
            <div style={{ fontFamily: MT.family, fontSize: isMobile ? 18 : 24, fontWeight: 400, marginTop: 16, opacity: 0.9 }}>{c.subtitle}</div>
            <p style={{ fontSize: isMobile ? 14.5 : 16, lineHeight: 1.7, color: "rgba(255,248,236,0.82)", fontWeight: 500, margin: "18px 0 0", maxWidth: 480, textWrap: "pretty" }}>{c.intro}</p>
            <div style={{ display: "flex", gap: isMobile ? 24 : 36, marginTop: 28, fontFamily: MT.family }}>
              {[[`${sp.total}`, "산책 코스"], [`${seriesBuildingCount(c)}`, "공간"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: isMobile ? 30 : 38, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", opacity: 0.7, marginTop: 6 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 우: 정복 현황 패널 */}
          <div style={{ background: "rgba(255,248,236,0.1)", border: "1px solid rgba(255,248,236,0.25)", borderRadius: MR.cardLg, padding: isMobile ? 22 : 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <span style={{ fontFamily: MT.family, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", opacity: 0.8 }}>나의 정복 현황</span>
              <span style={{ fontSize: 13, fontWeight: 800 }}>{sp.done} / {sp.total} 코스</span>
            </div>
            <div style={{ height: 12, borderRadius: 999, background: "rgba(255,248,236,0.2)", overflow: "hidden" }}>
              <div style={{ width: `${sp.pct}%`, height: "100%", borderRadius: 999, background: M.olive, transition: "width .35s ease" }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.8 }}>{sp.pct}% 완료</span>
              {conquered
                ? <span style={{ fontSize: 12, fontWeight: 900, color: M.olive }}>정복 완료 ★</span>
                : <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.7 }}>{sp.total - sp.done}개 코스 남음</span>}
            </div>
            {/* 도장 줄 — 코스별 완주 시 골드 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22, paddingTop: 22, borderTop: "1px solid rgba(255,248,236,0.2)" }}>
              {sp.per.map(({ course, pr }) => (
                <div key={course.id} title={course.title} style={{
                  width: 46, height: 46, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: pr.complete ? M.olive : "transparent",
                  border: pr.complete ? `2px solid ${M.olive}` : "2px dashed rgba(255,248,236,0.4)",
                  color: pr.complete ? M.cream : "rgba(255,248,236,0.7)",
                  fontSize: 11, fontWeight: 900,
                }}>
                  {pr.complete
                    ? <span style={{ fontSize: 20, lineHeight: 1 }}>✓</span>
                    : <span style={{ whiteSpace: "nowrap" }}>{pr.done}/{pr.tot}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 정복 뱃지 */}
      <section style={{ padding: `${isMobile ? 28 : 40}px ${px}px 0` }}>
        <ConquerBadge badge={c.badge} conquered={conquered} accent={accent} isMobile={isMobile}/>
      </section>

      {/* 코스 목록 — 정복 대상 (산책 코스) */}
      <section style={{ padding: `${isMobile ? 32 : 44}px ${px}px ${isMobile ? 48 : 72}px` }}>
        <Hairline label={`정복 코스 · ${sp.total} COURSES`} style={{ marginBottom: 24 }}/>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 16 }}>
          {sp.per.map(({ course: cc, pr }) => {
            const ch = mxChannel(cc.channelId);
            const started = pr.done > 0;
            return (
              <div key={cc.id} onClick={() => onNavigate("walkcourse", cc.id)} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "108px 1fr auto",
                gap: isMobile ? 14 : 22, alignItems: "center", cursor: "pointer",
                background: pr.complete ? `${accent}0D` : M.cream,
                border: `1.5px solid ${pr.complete ? accent : "transparent"}`,
                borderRadius: MR.cardLg, padding: isMobile ? 16 : 18,
                boxShadow: MS.cardSm,
              }}>
                {/* 커버 + 완주 표시 */}
                <div style={{ position: "relative", height: isMobile ? 120 : 92, borderRadius: MR.card, background: cc.cover, display: "flex", alignItems: "flex-end", padding: 12 }}>
                  <span style={{ fontFamily: MT.family, fontSize: 11, fontWeight: 800, color: "rgba(255,248,236,0.9)" }}>{cc.official ? "공식" : "유저 코스"}</span>
                  {pr.complete && (
                    <span style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: "50%", background: M.olive, color: M.cream, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, boxShadow: MS.cardSm }}>✓</span>
                  )}
                </div>

                {/* 본문 */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: isMobile ? 18 : 21, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, lineHeight: 1.25, textWrap: "balance" }}>{cc.title}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px", marginTop: 8, fontFamily: MT.family, fontSize: 11, fontWeight: 600, color: M.muted }}>
                    {[cc.distance, cc.duration, `지점 ${cc.stops.length}곳`, ch.name].map((m, k) => (
                      <span key={k} style={{ whiteSpace: "nowrap" }}>{k > 0 && <span style={{ color: M.faint, marginRight: 10 }}>·</span>}{m}</span>
                    ))}
                  </div>
                  {/* 코스별 스탬프 진행 */}
                  <div style={{ marginTop: 12, maxWidth: 320 }}>
                    <ProgressBar pct={pr.pct} accent={pr.complete ? M.olive : accent} height={8}/>
                    <div style={{ marginTop: 6, fontSize: 11.5, fontWeight: 700, color: pr.complete ? M.oliveDeep : M.muted }}>
                      {pr.complete ? "완주 · 스탬프 전체 획득 ★" : `${pr.done} / ${pr.tot} 지점 스탬프`}
                    </div>
                  </div>
                </div>

                {/* 액션 */}
                <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: 8, alignItems: isMobile ? "center" : "stretch", justifyContent: "flex-end" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "11px 18px", borderRadius: MR.pill, whiteSpace: "nowrap",
                    fontFamily: MT.family, fontSize: 13, fontWeight: 800,
                    background: pr.complete ? `${accent}1A` : M.terra, color: pr.complete ? M.terraDeep : M.cream,
                    border: pr.complete ? `1.5px solid ${accent}` : "none",
                  }}>
                    {pr.complete ? "✓ 완주함" : started ? "이어 걷기 →" : "따라 걷기 →"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <SeriesFooter c={c} onNavigate={onNavigate} done={done}/>
      <MFooter/>
    </MPage>
  );
}

/* ---------- 시리즈 푸터 (다른 시리즈) ---------- */
function SeriesFooter({ c, onNavigate, done }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const px = pageX(isMobile, isTablet);
  const others = MX_SERIES.filter((x) => x.id !== c.id).slice(0, 3);
  return (
    <section style={{ padding: `${isMobile ? 40 : 56}px ${px}px`, background: M.cream }}>
      <Hairline label="다른 컬렉션 · MORE" style={{ marginBottom: 24 }}/>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
        {others.map((o) => {
          const osp = mxSeriesProgress(o, done);
          return (
            <div key={o.id} onClick={() => onNavigate("collection", o.id)} style={{ background: M.beige, borderRadius: MR.cardLg, overflow: "hidden", cursor: "pointer", boxShadow: MS.cardSm, border: `1px solid ${M.beigeAlt}` }}>
              <div style={{ height: 130, background: o.cover, padding: 18, color: M.cream, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span style={{ fontFamily: MT.family, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", opacity: 0.8 }}>{o.no} · {o.kind}</span>
                <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.05 }}>{o.title}</div>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <ProgressBar pct={osp.pct} accent={M.olive} height={8}/>
                <div style={{ marginTop: 8, fontSize: 11.5, color: M.muted, fontWeight: 700 }}>{osp.done} / {osp.total} 코스 정복</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ================================================================
   시리즈 인덱스 (전체 목록)
   ================================================================ */
function CollectionIndex({ onNavigate, t }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const px = pageX(isMobile, isTablet);
  const sh = useMasilShared();
  const done = sh.done;

  const totalConquered = MX_SERIES.filter((s) => mxSeriesProgress(s, done).complete).length;

  return (
    <MPage>
      <MasilNav route="collection" onNavigate={onNavigate}/>

      <section style={{ padding: `${isMobile ? 24 : 48}px ${px}px ${isMobile ? 20 : 32}px` }}>
        <Hairline label="MASILMAP · 컬렉션" style={{ marginBottom: isMobile ? 18 : 32 }}/>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", gap: isMobile ? 16 : 56, alignItems: "end" }}>
          <div>
            <MagCap color={M.olive} style={{ marginBottom: 16 }}>SERIES · 산책 코스를 모아 정복</MagCap>
            <h1 style={{ fontFamily: MT.family, fontSize: isMobile ? 36 : 80, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.04, margin: 0, color: M.ink, textWrap: "balance" }}>
              흩어진 코스를{isMobile ? " " : <br/>}
              <span style={{ color: M.olive }}>한 시리즈로</span> 정복
            </h1>
          </div>
          <div>
            <p style={{ fontSize: isMobile ? 14.5 : 17, lineHeight: 1.7, color: M.muted, fontWeight: 500, margin: 0, textWrap: "pretty" }}>
              채널이 만든 산책 코스를 주제·지역으로 묶은 것이 시리즈입니다. 각 코스를 현장 스탬프로 완주하면 시리즈가 채워지고, 모두 정복하면 배지를 얻어요. 진행은 마실 앱과 실시간으로 공유됩니다.
            </p>
            <MetaRow items={[
              { label: "시리즈", value: `${MX_SERIES.length}개` },
              { label: "정복 완료", value: `${totalConquered}개` },
            ]} style={{ marginTop: 16 }}/>
          </div>
        </div>
      </section>

      {/* 시리즈 카드 그리드 */}
      <section style={{ padding: `${isMobile ? 12 : 24}px ${px}px ${isMobile ? 48 : 72}px` }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)", gap: 20 }}>
          {MX_SERIES.map((s) => {
            const sp = mxSeriesProgress(s, done);
            return (
              <div key={s.id} onClick={() => onNavigate("collection", s.id)} style={{
                background: M.cream, borderRadius: MR.cardLg, overflow: "hidden",
                boxShadow: MS.card, cursor: "pointer", border: `1px solid ${M.beigeAlt}`,
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ height: isMobile ? 200 : 240, background: s.cover, color: M.cream, padding: 22, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: MT.family, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", opacity: 0.85, whiteSpace: "nowrap" }}>{s.no}</span>
                    <span style={{ padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(255,248,236,0.4)", fontSize: 10.5, fontWeight: 800, whiteSpace: "nowrap" }}>{s.kind}</span>
                  </div>
                  {sp.complete && (
                    <span style={{ position: "absolute", top: 56, right: 22, display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 999, background: M.olive, color: M.terraDeep, fontSize: 11, fontWeight: 900 }}>★ 정복</span>
                  )}
                  <div>
                    <div style={{ fontFamily: MT.family, fontSize: isMobile ? 32 : 38, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.02 }}>{s.title}</div>
                    <div style={{ fontFamily: MT.family, fontSize: 15, marginTop: 6, opacity: 0.85 }}>{s.subtitle}</div>
                  </div>
                </div>
                <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                  <p style={{ fontSize: 13.5, color: M.ink, lineHeight: 1.6, margin: 0, fontWeight: 500, textWrap: "pretty" }}>{s.intro}</p>
                  <div style={{ marginTop: "auto", paddingTop: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: sp.complete ? M.olive : M.muted, whiteSpace: "nowrap" }}>{sp.done} / {sp.total} 코스 정복</span>
                      <span style={{ fontFamily: MT.family, fontSize: 11, fontWeight: 700, color: M.muted }}>{sp.pct}%</span>
                    </div>
                    <ProgressBar pct={sp.pct} accent={sp.complete ? M.olive : s.cover} height={8}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <MFooter/>
    </MPage>
  );
}

Object.assign(window, { CollectionScreen, CollectionIndex, ProgressBar, ConquerBadge });
