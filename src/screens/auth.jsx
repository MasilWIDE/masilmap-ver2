/* ================================================================
   masilmap — Auth flows
   ▸ LoginScreen        : 돌아온 사용자 · 이메일/비번 + 소셜
   ▸ OnboardingScreen   : 처음 오는 사용자 · 4단계 가입 + 취향 + 첫 큐레이션
   ================================================================ */

/* ---------- 공용 셸 (auth-전용 미니 헤더) ---------- */
function AuthShell({ children, onBack, backLabel = "← 홈으로" }) {
  return (
    <MPage>
      <header style={{
        padding: "22px 56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${M.beigeAlt}`,
        background: M.beige,
      }}>
        <div onClick={() => onBack && onBack()} style={{ cursor: "pointer" }}>
          <MasilmapLogo size={26} />
        </div>
        <span onClick={() => onBack && onBack()} style={{
          fontSize: 13, fontWeight: 700, color: M.ink, cursor: "pointer",
        }}>{backLabel}</span>
      </header>
      <main style={{
        maxWidth: 520, margin: "0 auto",
        padding: "56px 24px 96px",
      }}>{children}</main>
    </MPage>
  );
}

/* ---------- 폼 필드 ---------- */
function Field({ label, type = "text", placeholder, value, onChange, hint, style = {} }) {
  return (
    <div style={{ marginBottom: 18, ...style }}>
      {label && (
        <label style={{
          display: "block", fontSize: 12, fontWeight: 800, color: M.ink,
          marginBottom: 8, letterSpacing: "-0.005em",
        }}>{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{
          width: "100%", padding: "14px 18px",
          border: `1px solid ${M.beigeAlt}`, borderRadius: MR.field,
          background: M.cream, color: M.ink,
          fontSize: 14, fontWeight: 600,
          fontFamily: "Pretendard, Nunito, sans-serif",
          outline: "none",
        }}
      />
      {hint && (
        <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 6 }}>{hint}</div>
      )}
    </div>
  );
}

/* ---------- 소셜 버튼 (카카오/네이버/구글) ---------- */
function SocialButton({ brand, onClick }) {
  const cfg = {
    kakao:  { bg: "#FEE500", color: "#191600", label: "카카오로 시작하기",  initial: "K", initialColor: "#191600" },
    naver:  { bg: "#03C75A", color: "#FFFFFF", label: "네이버로 시작하기",  initial: "N", initialColor: "#FFFFFF" },
    google: { bg: "#FFFFFF", color: M.ink,     label: "Google 로 시작하기", initial: "G", initialColor: "#4285F4", border: `1px solid ${M.beigeAlt}` },
  }[brand];
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        background: cfg.bg, color: cfg.color, border: cfg.border || "none",
        borderRadius: MR.field, padding: 0, marginBottom: 10,
        fontSize: 14, fontWeight: 800, cursor: "pointer",
        fontFamily: "Pretendard, Nunito, sans-serif",
        overflow: "hidden",
      }}>
      <span style={{
        width: 48, height: 48, display: "inline-flex",
        alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.08)", color: cfg.initialColor,
        fontWeight: 900, fontSize: 16,
      }}>{cfg.initial}</span>
      <span style={{ flex: 1, textAlign: "center", padding: "14px 0" }}>{cfg.label}</span>
    </button>
  );
}

/* ---------- 스텝 인디케이터 ---------- */
function StepIndicator({ current, total }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <MagCap color={M.terra}>STEP {String(current).padStart(2, "0")} · {String(total).padStart(2, "0")}</MagCap>
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 999,
            background: i < current ? M.terra : M.beigeAlt,
            transition: "background .2s",
          }}/>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   LoginScreen — 다시 만나는 사람
   ================================================================ */
function LoginScreen({ onNavigate }) {
  const auth = window.__masilAuth || { login: () => {} };
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");

  const submit = () => {
    auth.login();
    onNavigate("home");
  };

  return (
    <AuthShell onBack={() => onNavigate("home")}>
      <MagCap color={M.terra}>WELCOME BACK · 로그인</MagCap>
      <h1 style={{
        fontSize: 40, fontWeight: 900, letterSpacing: "-0.025em",
        lineHeight: 1.1, color: M.ink, margin: "12px 0 12px",
      }}>
        다시 만나서<br/>
        <span style={{ fontWeight: 900, color: M.olive }}>반가워요</span>.
      </h1>
      <p style={{ fontSize: 14, color: M.muted, lineHeight: 1.6, fontWeight: 500, marginBottom: 32 }}>
        이메일로 들어오시거나, 소셜로 빠르게 시작해보세요.
      </p>

      <Field label="이메일" placeholder="name@example.com" value={email} onChange={setEmail}/>
      <Field label="비밀번호" type="password" placeholder="••••••••" value={pw} onChange={setPw}/>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, fontSize: 12 }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: M.ink, fontWeight: 700, cursor: "pointer" }}>
          <input type="checkbox" style={{ accentColor: M.terra }}/> 로그인 상태 유지
        </label>
        <a style={{ color: M.terra, fontWeight: 700, cursor: "pointer" }}>비밀번호 찾기</a>
      </div>

      <MButton kind="primary" size="lg" onClick={submit} style={{ width: "100%", justifyContent: "center", marginBottom: 24 }}>
        로그인
      </MButton>

      <Hairline label="또는" style={{ marginBottom: 20 }}/>

      <SocialButton brand="kakao"  onClick={submit}/>
      <SocialButton brand="naver"  onClick={submit}/>
      <SocialButton brand="google" onClick={submit}/>

      <div style={{
        marginTop: 32, padding: "18px 0 0",
        borderTop: `1px solid ${M.beigeAlt}`,
        fontSize: 13, color: M.muted, fontWeight: 600, textAlign: "center",
      }}>
        처음 오셨나요?{" "}
        <span onClick={() => onNavigate("onboarding")} style={{ color: M.terra, fontWeight: 800, cursor: "pointer" }}>
          마실 시작하기 →
        </span>
      </div>
    </AuthShell>
  );
}

/* ================================================================
   OnboardingScreen — 처음 오는 사람 · 4단계
   ================================================================ */
function OnboardingScreen({ onNavigate }) {
  const auth = window.__masilAuth || { login: () => {} };
  const [step, setStep] = React.useState(1);
  const [name, setName]         = React.useState("");
  const [email, setEmail]       = React.useState("");
  const [pw, setPw]             = React.useState("");
  const [pw2, setPw2]           = React.useState("");
  const [agree, setAgree]       = React.useState(false);
  const [region, setRegion]     = React.useState(null);
  const [interests, setInterests] = React.useState([]);

  const back = () => (step > 1 ? setStep(step - 1) : onNavigate("home"));
  const next = () => setStep((s) => Math.min(s + 1, 4));

  const finish = () => {
    auth.login();
    onNavigate("home");
  };

  const toggleInterest = (id) => {
    setInterests((arr) => arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  };

  /* ── 추천 컬렉션 (관심사 기반) ── */
  const recommended = (() => {
    if (interests.includes("modern"))  return COLLECTIONS.find((c) => c.id === "brick");
    if (interests.includes("hanok"))   return COLLECTIONS.find((c) => c.id === "hanok");
    if (interests.includes("museum"))  return COLLECTIONS.find((c) => c.id === "concrete");
    return COLLECTIONS[0];
  })();

  return (
    <AuthShell onBack={back} backLabel={step === 1 ? "← 홈으로" : "← 이전 단계"}>
      <StepIndicator current={step} total={4}/>

      {/* === STEP 1: 가입 === */}
      {step === 1 && (
        <>
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.12, color: M.ink, margin: "0 0 10px" }}>
            잡지에 이름을<br/>
            <span style={{ fontWeight: 900, color: M.olive }}>남겨주세요</span>.
          </h1>
          <p style={{ fontSize: 14, color: M.muted, lineHeight: 1.6, fontWeight: 500, marginBottom: 28 }}>
            먼저 계정을 만들어요. 다음 단계에서 마실 취향을 함께 정해볼게요.
          </p>

          <Field label="이름" placeholder="홍길동" value={name} onChange={setName}/>
          <Field label="이메일" placeholder="name@example.com" value={email} onChange={setEmail}/>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="비밀번호" type="password" placeholder="8자 이상" value={pw} onChange={setPw}/>
            <Field label="비밀번호 확인" type="password" placeholder="다시 입력" value={pw2} onChange={setPw2}/>
          </div>

          <label style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 12, color: M.ink, fontWeight: 600,
            cursor: "pointer", marginBottom: 24,
          }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ accentColor: M.terra }}/>
            <span><a style={{ color: M.terra, fontWeight: 800 }}>이용약관</a> 및 <a style={{ color: M.terra, fontWeight: 800 }}>개인정보처리방침</a>에 동의합니다</span>
          </label>

          <MButton kind="primary" size="lg" onClick={next} style={{ width: "100%", justifyContent: "center", marginBottom: 20 }}>
            다음 →
          </MButton>

          <Hairline label="또는" style={{ marginBottom: 16 }}/>
          <SocialButton brand="kakao"  onClick={next}/>
          <SocialButton brand="naver"  onClick={next}/>
          <SocialButton brand="google" onClick={next}/>

          <div style={{ marginTop: 28, fontSize: 13, color: M.muted, fontWeight: 600, textAlign: "center" }}>
            이미 회원이신가요?{" "}
            <span onClick={() => onNavigate("login")} style={{ color: M.terra, fontWeight: 800, cursor: "pointer" }}>
              로그인 →
            </span>
          </div>
        </>
      )}

      {/* === STEP 2: 지역 선택 === */}
      {step === 2 && (
        <>
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.12, color: M.ink, margin: "0 0 10px" }}>
            어느 동네부터<br/>
            <span style={{ fontWeight: 900, color: M.olive }}>마실</span> 다녀올까요?
          </h1>
          <p style={{ fontSize: 14, color: M.muted, lineHeight: 1.6, fontWeight: 500, marginBottom: 28 }}>
            지금 가장 가까운 동네 한 곳만 골라주세요. 나중에 더 추가할 수 있어요.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
            {REGIONS.map((r) => {
              const on = r.id === region;
              return (
                <div key={r.id} onClick={() => setRegion(r.id)} style={{
                  padding: "18px 18px", borderRadius: MR.card,
                  background: on ? M.terra : M.cream,
                  color: on ? M.cream : M.ink,
                  border: `1.5px solid ${on ? M.terra : "transparent"}`,
                  cursor: "pointer",
                  transition: "all .15s",
                }}>
                  <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.015em" }}>{r.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, opacity: on ? 0.85 : 0.55, marginTop: 4 }}>
                    {r.count}곳의 건축물
                  </div>
                </div>
              );
            })}
          </div>

          <MButton kind="primary" size="lg" onClick={next} style={{
            width: "100%", justifyContent: "center",
            opacity: region ? 1 : 0.5, pointerEvents: region ? "auto" : "none",
          }}>
            다음 → ({region ? REGIONS.find((r) => r.id === region).name : "지역 선택"})
          </MButton>
        </>
      )}

      {/* === STEP 3: 관심 건축 선택 === */}
      {step === 3 && (
        <>
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.12, color: M.ink, margin: "0 0 10px" }}>
            어떤 건축이<br/>
            가장 <span style={{ fontWeight: 900, color: M.olive }}>끌리세요?</span>
          </h1>
          <p style={{ fontSize: 14, color: M.muted, lineHeight: 1.6, fontWeight: 500, marginBottom: 24 }}>
            여러 개 골라도 좋아요. 고른 취향에 맞춰 첫 큐레이션을 보내드릴게요.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            {TYPES.filter((t) => t.id !== "all").map((t) => {
              const on = interests.includes(t.id);
              return (
                <span key={t.id} onClick={() => toggleInterest(t.id)} style={{
                  padding: "12px 18px", borderRadius: 999,
                  fontSize: 14, fontWeight: 700,
                  background: on ? M.terra : M.cream,
                  color: on ? M.cream : M.ink,
                  border: `1.5px solid ${on ? M.terra : M.beigeAlt}`,
                  cursor: "pointer",
                  transition: "all .15s",
                  whiteSpace: "nowrap",
                }}>
                  {t.name}
                  <span style={{ marginLeft: 8, opacity: 0.6, fontSize: 12 }}>{t.count}</span>
                </span>
              );
            })}
          </div>

          <MButton kind="primary" size="lg" onClick={next} style={{
            width: "100%", justifyContent: "center",
            opacity: interests.length > 0 ? 1 : 0.5,
            pointerEvents: interests.length > 0 ? "auto" : "none",
          }}>
            다음 → ({interests.length > 0 ? `${interests.length}개 선택` : "1개 이상 선택"})
          </MButton>
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <span onClick={next} style={{ fontSize: 12, color: M.muted, fontWeight: 700, cursor: "pointer" }}>
              건너뛰기
            </span>
          </div>
        </>
      )}

      {/* === STEP 4: 첫 큐레이션 선물 === */}
      {step === 4 && (
        <>
          <MagCap color={M.terra} style={{ marginBottom: 8 }}>READY · 첫 큐레이션</MagCap>
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.12, color: M.ink, margin: "0 0 10px" }}>
            마실맵에 오신 걸<br/>
            <span style={{ fontWeight: 900, color: M.olive }}>환영해요</span>{name ? `, ${name}` : ""}.
          </h1>
          <p style={{ fontSize: 14, color: M.muted, lineHeight: 1.6, fontWeight: 500, marginBottom: 28 }}>
            취향에 맞는 첫 번째 컬렉션을 골라뒀어요. 지금 바로 펼쳐볼까요?
          </p>

          {recommended && (
            <div style={{
              borderRadius: MR.cardLg, overflow: "hidden",
              boxShadow: MS.cardLg, marginBottom: 28,
            }}>
              <div style={{
                height: 180, background: recommended.cover, position: "relative",
                display: "flex", alignItems: "flex-end", padding: 22,
              }}>
                <span style={{
                  position: "absolute", top: 14, left: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
                  color: M.cream, background: "rgba(255,248,236,0.15)",
                  padding: "5px 9px", borderRadius: 6,
                  border: `1px solid rgba(255,248,236,0.3)`,
                }}>{recommended.no} · {recommended.tag}</span>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", color: M.cream, lineHeight: 1.1 }}>{recommended.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,248,236,0.8)", marginTop: 4, fontWeight: 600 }}>{recommended.subtitle}</div>
                </div>
              </div>
              <div style={{ padding: 20, background: M.cream }}>
                <p style={{ fontSize: 13, color: M.ink, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  {recommended.blurb}
                </p>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 11, color: M.muted, fontWeight: 700 }}>
                  <span>EDITOR · {recommended.editor}</span>
                  <span>{recommended.count}곳 · {recommended.readTime}분</span>
                </div>
              </div>
            </div>
          )}

          <MButton kind="primary" size="lg" onClick={finish} style={{ width: "100%", justifyContent: "center", marginBottom: 10 }}>
            마실 시작하기 →
          </MButton>
          <div style={{ textAlign: "center" }}>
            <span onClick={finish} style={{ fontSize: 12, color: M.muted, fontWeight: 700, cursor: "pointer" }}>
              나중에 둘러볼게요
            </span>
          </div>
        </>
      )}
    </AuthShell>
  );
}

Object.assign(window, { LoginScreen, OnboardingScreen });
