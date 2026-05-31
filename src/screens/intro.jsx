/* ================================================================
   masilmap — 소개 / 인트로 (route "intro")
   "마실 시작하기"의 첫 도착지. 무엇을 하는 곳인지 · 어떻게 쓰는지 ·
   무엇이 좋은지를 보여주고, 끝에서 온보딩(가입)으로 이어준다.
   ================================================================ */

function IntroScreen({ onNavigate }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const px = pageX(isMobile, isTablet);

  const steps = [
    { icon: "map",  no: "01", title: "상황으로 찾고",  body: "‘아이랑’, ‘비 오는 날’, ‘노을·옥상’… 그날 기분과 상황만 고르면 걷기 좋은 코스를 추천해요." },
    { icon: "walk", no: "02", title: "코스로 걷고", body: "채널이 만든 산책 코스를 따라 천천히. 각 지점에서 현장 스탬프로 방문을 인증합니다." },
    { icon: "sparkle", no: "03", title: "시리즈로 정복",  body: "여러 코스를 주제로 묶은 시리즈를 하나씩 완주하며 도장과 정복 뱃지를 모아요." },
  ];

  const features = [
    { icon: "sparkle",  title: "오늘의 마실 추천",  body: "가입·취향 조사 없이도 좋아요. 그날 상황만 고르면 어디로 갈지 바로 제안해 드려요." },
    { icon: "users", title: "채널 팔로우", body: "인플루언서·이웃이 만든 산책 코스를 팔로우하고, 새 코스 소식을 피드로 받아요." },
    { icon: "bookmark", title: "내 마실에 모아",   body: "따라 걷는 코스의 진행률과 정복 뱃지를 한자리에. 다녀온 곳은 기록으로 남겨요." },
    { icon: "location", title: "전국 526곳",       body: "천 년 된 목조 건축부터 어제 완공된 미술관까지 — 한 지도 위에." },
  ];

  const stats = [["526", "건축물"], ["47", "코스"], ["18", "시리즈"], ["6", "채널"]];

  return (
    <MPage>
      <MasilNav route="intro" onNavigate={onNavigate}/>

      {/* ===== HERO ===== */}
      <section style={{ padding: `${isMobile ? 40 : 72}px ${px}px ${isMobile ? 44 : 80}px` }}>
        <Hairline label="WELCOME · 마실맵 소개" style={{ marginBottom: isMobile ? 22 : 30 }}/>
        <div style={{ maxWidth: 880 }}>
          <h1 style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: isMobile ? 38 : 72, fontWeight: 900,
            letterSpacing: "-0.035em", lineHeight: 1.08,
            color: M.ink, margin: 0, textWrap: "balance",
          }}>
            천천히 걷는<br/>
            <span style={{ color: M.olive }}>한국 건축</span> 산책.
          </h1>
          <p style={{
            fontSize: isMobile ? 16 : 20, lineHeight: 1.7, color: M.muted,
            fontWeight: 500, margin: `${isMobile ? 20 : 26}px 0 0`,
            maxWidth: 600, textWrap: "pretty",
          }}>
            마실맵은 전국의 건축을 지도 위에 펼쳐, 한 곳 한 곳을 천천히 걸어 보게 하는
            건축 산책 가이드입니다. 찾고, 따라 걷고, 모으는 — 그 전부를 한자리에 모았어요.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: isMobile ? 28 : 36 }}>
            <MButton kind="primary" size="lg" onClick={() => onNavigate("onboarding")}
              style={{ background: M.olive, color: M.terraDeep }}
              icon={<MIcon name="sparkle" size={17} color={M.terraDeep}/>}>
              지금 시작하기
            </MButton>
            <MButton kind="outline" size="lg" onClick={() => onNavigate("home", null, { homeLayout: "mapPrimary" })}
              icon={<MIcon name="map" size={17} color={M.ink}/>}>
              먼저 지도 둘러보기
            </MButton>
          </div>
        </div>

        {/* stat strip */}
        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: isMobile ? 18 : 0, marginTop: isMobile ? 36 : 56,
          borderTop: `1px solid ${M.beigeAlt}`, paddingTop: isMobile ? 24 : 32,
        }}>
          {stats.map(([n, l], i) => (
            <div key={l} style={{
              borderLeft: (!isMobile && i > 0) ? `1px solid ${M.beigeAlt}` : "none",
              paddingLeft: (!isMobile && i > 0) ? 32 : 0,
            }}>
              <div style={{ fontSize: isMobile ? 36 : 52, fontWeight: 900, letterSpacing: "-0.04em", color: M.terra, lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: M.muted, marginTop: 8 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ background: M.cream, padding: `${isMobile ? 48 : 88}px ${px}px` }}>
        <MagCap color={M.olive} style={{ marginBottom: 14 }}>HOW IT WORKS · 이렇게 즐겨요</MagCap>
        <h2 style={{
          fontFamily: "'Noto Serif KR', serif",
          fontSize: isMobile ? 28 : 44, fontWeight: 900, letterSpacing: "-0.03em",
          color: M.ink, margin: "0 0 8px", lineHeight: 1.12, textWrap: "balance",
        }}>
          세 걸음이면 충분합니다.
        </h2>
        <p style={{ fontSize: isMobile ? 15 : 17, color: M.muted, fontWeight: 500, margin: "0 0 40px", maxWidth: 460, textWrap: "pretty" }}>
          복잡한 준비 없이, 오늘 당장 가까운 동네부터 걸어 볼 수 있어요.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 16 : 24 }}>
          {steps.map((s) => (
            <div key={s.no} style={{
              background: M.beige, borderRadius: MR.cardLg, padding: isMobile ? 26 : 32,
              boxShadow: MS.card, border: `1px solid ${M.beigeAlt}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16, background: M.terra,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <MIcon name={s.icon} size={24} color={M.cream}/>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 30, fontWeight: 800, color: M.beigeAlt, letterSpacing: "-0.02em" }}>{s.no}</span>
              </div>
              <h3 style={{ fontSize: isMobile ? 20 : 23, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: "0 0 10px" }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: M.muted, fontWeight: 500, margin: 0, textWrap: "pretty" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHY MASILMAP ===== */}
      <section style={{ padding: `${isMobile ? 48 : 88}px ${px}px` }}>
        <MagCap color={M.terra} style={{ marginBottom: 14 }}>WHY MASILMAP · 이런 점이 좋아요</MagCap>
        <h2 style={{
          fontFamily: "'Noto Serif KR', serif",
          fontSize: isMobile ? 28 : 44, fontWeight: 900, letterSpacing: "-0.03em",
          color: M.ink, margin: "0 0 40px", lineHeight: 1.12, textWrap: "balance",
        }}>
          걷기 좋은 건축, 모으기 좋은 코스.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 14 : 20 }}>
          {features.map((f) => (
            <div key={f.title} style={{
              display: "flex", gap: 18, alignItems: "flex-start",
              background: M.cream, borderRadius: MR.card, padding: isMobile ? 22 : 28,
              border: `1px solid ${M.beigeAlt}`,
            }}>
              <div style={{
                flexShrink: 0, width: 46, height: 46, borderRadius: 13,
                background: M.beige, border: `1.5px solid ${M.olive}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <MIcon name={f.icon} size={22} color={M.oliveDeep}/>
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.015em", color: M.ink, margin: "2px 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: M.muted, fontWeight: 500, margin: 0, textWrap: "pretty" }}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CLOSING CTA ===== */}
      <section style={{ background: M.terra, padding: `${isMobile ? 56 : 96}px ${px}px`, textAlign: "center" }}>
        <MagCap color={M.oliveSoft} style={{ marginBottom: 18, justifyContent: "center" }}>START YOUR MASIL</MagCap>
        <h2 style={{
          fontFamily: "'Noto Serif KR', serif",
          fontSize: isMobile ? 30 : 52, fontWeight: 900, letterSpacing: "-0.03em",
          color: M.cream, margin: "0 auto 18px", lineHeight: 1.12, maxWidth: 640, textWrap: "balance",
        }}>
          이번엔 어디로<br/>마실 갈까요?
        </h2>
        <p style={{ fontSize: isMobile ? 15 : 18, color: "rgba(244,243,234,0.78)", fontWeight: 500, margin: "0 auto 32px", maxWidth: 460, lineHeight: 1.65, textWrap: "pretty" }}>
          그날 기분과 상황만 고르면 걷기 좋은 코스를 바로 추천해 드려요. 가입은 1분, 취향 조사는 없어요.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <MButton kind="primary" size="lg" onClick={() => onNavigate("onboarding")}
            style={{ background: M.olive, color: M.terraDeep }}
            icon={<MIcon name="sparkle" size={17} color={M.terraDeep}/>}>
            지금 시작하기
          </MButton>
          <MButton kind="onTerra" size="lg" onClick={() => onNavigate("login")}>
            이미 회원이에요 · 로그인
          </MButton>
        </div>
      </section>

      <MFooter />
    </MPage>
  );
}

Object.assign(window, { IntroScreen });
