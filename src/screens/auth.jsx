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
  const next = () => setStep((s) => Math.min(s + 1, 2));

  const finish = (go) => {
    auth.login();
    onNavigate(go || "home");
  };

  const toggleInterest = () => {};

  return (
    <AuthShell onBack={back} backLabel={step === 1 ? "← 홈으로" : "← 이전 단계"}>
      <StepIndicator current={step} total={2}/>

      {/* === STEP 1: 가입 === */}
      {step === 1 && (
        <>
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.12, color: M.ink, margin: "0 0 10px" }}>
            마실 명부에 이름을<br/>
            <span style={{ fontWeight: 900, color: M.olive }}>남겨주세요</span>.
          </h1>
          <p style={{ fontSize: 14, color: M.muted, lineHeight: 1.6, fontWeight: 500, marginBottom: 28 }}>
            계정만 만들면 바로 시작이에요. 취향 조사 같은 건 없어요 — 어디로 갈지는 그때그때 골라드릴게요.
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

      {/* === STEP 2: 환영 · 가볍게 시작 === */}
      {step === 2 && (
        <>
          <MagCap color={M.terra} style={{ marginBottom: 8 }}>WELCOME · 가입 완료</MagCap>
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.12, color: M.ink, margin: "0 0 10px" }}>
            마실맵에 오신 걸<br/>
            <span style={{ fontWeight: 900, color: M.olive }}>환영해요</span>{name ? `, ${name}` : ""}.
          </h1>
          <p style={{ fontSize: 14, color: M.muted, lineHeight: 1.6, fontWeight: 500, marginBottom: 24 }}>
            취향은 미리 안 정해도 돼요. 갈 때마다 그날 기분과 상황을 골라 추천받는 게 더 마실맵다워요.
          </p>

          {/* 추천 흐름 미리보기 카드 */}
          <div onClick={() => finish("home")} style={{
            borderRadius: MR.cardLg, overflow: "hidden", boxShadow: MS.cardLg, marginBottom: 22, cursor: "pointer",
            background: M.terra, color: M.cream, padding: 24,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,248,236,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MIcon name="sparkle" size={20} color={M.olive}/>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,248,236,0.8)" }}>FOR YOU</span>
            </div>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              이번엔 어디로<br/>마실 갈까요?
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,248,236,0.82)", fontWeight: 500, margin: "12px 0 0", lineHeight: 1.6 }}>
              “아이랑”, “비 오는 날”, “노을·옥상”, “데이트”… 그날 상황만 고르면 걷기 좋은 코스를 바로 추천해 드려요.
            </p>
            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 7 }}>
              {MX_MOODS.slice(0, 4).map((m) => (
                <span key={m.id} style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid rgba(255,248,236,0.35)", fontSize: 12, fontWeight: 700 }}>{m.label}</span>
              ))}
            </div>
          </div>

          <MButton kind="primary" size="lg" onClick={() => finish("home")} style={{ width: "100%", justifyContent: "center", marginBottom: 10 }}>
            추천받으러 가기 →
          </MButton>
          <div style={{ textAlign: "center" }}>
            <span onClick={() => finish("home")} style={{ fontSize: 12, color: M.muted, fontWeight: 700, cursor: "pointer" }}>
              그냥 둘러볼게요
            </span>
          </div>
        </>
      )}
    </AuthShell>
  );
}

Object.assign(window, { LoginScreen, OnboardingScreen });
