/* ================================================================
   masilmap — App Router + Tweaks
   화면 간 라우팅, 레이아웃 변형 토글, 모든 화면 네비게이션
   ================================================================ */

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "homeLayout":       "spotlight",
  "detailLayout":     "sidebar",
  "collectionLayout": "magazine"
}/*EDITMODE-END*/;

function App() {
  const role = window.__masilRole || "user";
  const roleHome = { admin: "console-admin", tour: "console-tour", editor: "console-editor" }[role] || "home";
  const [route, setRoute] = React.useState({ name: roleHome, id: null });
  const [t, setTweak] = useTweaks(DEFAULT_TWEAKS);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const navigate = (name, id = null, opts = {}) => {
    if (opts.homeLayout)       setTweak("homeLayout", opts.homeLayout);
    if (opts.detailLayout)     setTweak("detailLayout", opts.detailLayout);
    if (opts.collectionLayout) setTweak("collectionLayout", opts.collectionLayout);
    setRoute({ name, id });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // expose tweaks + auth + search so MasilNav (shared, no props) can read state
  window.__masilT = t;
  window.__masilAuth = {
    isLoggedIn,
    login:  () => setIsLoggedIn(true),
    logout: () => {
      setIsLoggedIn(false);
      // mypage 접근중이면 홈으로 보냄
      setRoute((r) => (r.name === "mypage" ? { name: "home", id: null } : r));
    },
  };
  window.__masilSearch = { query: searchQuery, setQuery: setSearchQuery };

  // route → screen
  let screen;
  switch (route.name) {
    case "home":
      screen = <HomeScreen route="home" onNavigate={navigate} t={t} searchQuery={searchQuery}/>; break;
    case "buildings":
      screen = <BuildingsIndexScreen onNavigate={navigate} searchQuery={searchQuery}/>; break;
    case "detail":
      screen = <DetailScreen route="detail" onNavigate={navigate} buildingId={route.id || "kongkan"} t={t}/>; break;
    case "collection":
      screen = route.id
        ? <CollectionScreen route="collection" onNavigate={navigate} collectionId={route.id} t={t}/>
        : <CollectionIndex onNavigate={navigate} t={t}/>;
      break;
    case "course":
      screen = route.id
        ? <CourseScreen onNavigate={navigate} courseId={route.id}/>
        : <CourseIndex onNavigate={navigate}/>;
      break;
    case "booking-docent":
      screen = <BookingDocentScreen onNavigate={navigate} courseId={route.id || "bukchon"}/>; break;
    case "booking-payment":
      screen = <BookingPaymentScreen onNavigate={navigate} courseId={route.id || "bukchon"}/>; break;
    case "booking-external":
      screen = <BookingExternalScreen onNavigate={navigate} spaceId={route.id || "boanstay"}/>; break;
    case "mypage":
      screen = <MyPageScreen onNavigate={navigate}/>; break;
    case "upload-quick":
      screen = <UploadQuickScreen onNavigate={navigate}/>; break;
    case "upload-deep":
      screen = <UploadDeepScreen onNavigate={navigate}/>; break;
    case "admin-content":
      screen = <AdminContentScreen onNavigate={navigate}/>; break;
    case "admin-stats":
      screen = <AdminStatsScreen onNavigate={navigate}/>; break;
    case "admin-rights":
      screen = <AdminRightsScreen onNavigate={navigate}/>; break;
    case "login":
      screen = <LoginScreen onNavigate={navigate}/>; break;
    case "onboarding":
      screen = <OnboardingScreen onNavigate={navigate}/>; break;
    case "console-admin":
      screen = <AdminOverview onNavigate={navigate}/>; break;
    case "console-tour":
      screen = <TourConsole onNavigate={navigate}/>; break;
    case "console-editor":
      screen = <EditorConsole onNavigate={navigate}/>; break;
    default:
      screen = <HomeScreen route="home" onNavigate={navigate} t={t}/>;
  }

  const label = (() => {
    if (route.name === "home")             return "01 홈 / 지도";
    if (route.name === "buildings")        return "02 건축물 인덱스";
    if (route.name === "detail")           return `02 건축물 상세 · ${route.id || "kongkan"}`;
    if (route.name === "collection" && route.id) return `04 컬렉션 · ${route.id}`;
    if (route.name === "collection")       return "04 컬렉션 인덱스";
    if (route.name === "course" && route.id) return `03 코스 · ${route.id}`;
    if (route.name === "course")           return "03 코스 인덱스";
    if (route.name === "booking-docent")   return "05 예약 ① 도슨트";
    if (route.name === "booking-payment")  return "06 예약 ② 결제";
    if (route.name === "booking-external") return "07 예약 ③ 외부 연결";
    if (route.name === "mypage")           return "08 마이페이지";
    if (route.name === "upload-quick")     return "09 업로드 빠른등록";
    if (route.name === "upload-deep")      return "10 업로드 큐레이션";
    if (route.name === "admin-content")    return "11 관리자 콘텐츠";
    if (route.name === "admin-stats")      return "12 관리자 통계";
    if (route.name === "admin-rights")     return "13 관리자 권리";
    if (route.name === "login")            return "14 로그인";
    if (route.name === "onboarding")       return "15 마실 시작하기 (온보딩)";
    if (route.name === "console-admin")    return "역할 · 관리자 콘솔";
    if (route.name === "console-tour")     return "역할 · 코스 운영자 콘솔";
    if (route.name === "console-editor")   return "역할 · 에디터 콘솔";
    return route.name;
  })();

  return (
    <>
      <div data-screen-label={label}>{screen}</div>

      <TweaksPanel title="Tweaks · 화면 & 변형">
        <TweakSection label="유저 흐름">
          <NavRow active={route.name === "home"}            onClick={() => navigate("home")}>홈 · 지도</NavRow>
          <NavRow active={route.name === "buildings"}       onClick={() => navigate("buildings")}>건축물 인덱스</NavRow>
          <NavRow active={route.name === "detail"}          onClick={() => navigate("detail", "kongkan")}>건축물 상세</NavRow>
          <NavRow active={route.name === "course" && !route.id} onClick={() => navigate("course")}>코스 인덱스</NavRow>
          <NavRow active={route.name === "course" && !!route.id} onClick={() => navigate("course", "bukchon")}>코스 상세</NavRow>
          <NavRow active={route.name === "collection"}      onClick={() => navigate("collection", "brick")}>매거진 컬렉션</NavRow>
        </TweakSection>

        <TweakSection label="예약 플로우">
          <NavRow active={route.name === "booking-docent"}   onClick={() => navigate("booking-docent", "bukchon")}>① 도슨트 예약</NavRow>
          <NavRow active={route.name === "booking-payment"}  onClick={() => navigate("booking-payment", "bukchon")}>② 결제 · 토스</NavRow>
          <NavRow active={route.name === "booking-external"} onClick={() => navigate("booking-external", "boanstay")}>③ 외부 공간 연결</NavRow>
          <NavRow active={route.name === "mypage"}           onClick={() => navigate("mypage")}>마이페이지 (My Map)</NavRow>
        </TweakSection>

        <TweakSection label="인증 · 가입">
          <NavRow active={route.name === "login"}       onClick={() => navigate("login")}>로그인</NavRow>
          <NavRow active={route.name === "onboarding"}  onClick={() => navigate("onboarding")}>마실 시작하기 (4단계 온보딩)</NavRow>
        </TweakSection>

        <TweakSection label="등록 · 업로드">
          <NavRow active={route.name === "upload-quick"} onClick={() => navigate("upload-quick")}>빠른 등록 (얇은 핀)</NavRow>
          <NavRow active={route.name === "upload-deep"}  onClick={() => navigate("upload-deep")}>깊은 큐레이션 · 권리 게이트</NavRow>
        </TweakSection>

        <TweakSection label="관리자 (백오피스)">
          <NavRow active={route.name === "admin-content"} onClick={() => navigate("admin-content")}>콘텐츠 관리</NavRow>
          <NavRow active={route.name === "admin-stats"}   onClick={() => navigate("admin-stats")}>예약·매출 통계</NavRow>
          <NavRow active={route.name === "admin-rights"}  onClick={() => navigate("admin-rights")}>권리 태그·동의 관리</NavRow>
        </TweakSection>

        <TweakSection label="홈 · 메인 페이지">
          <TweakRadio
            value={t.homeLayout}
            onChange={(v) => { setTweak("homeLayout", v); if (route.name !== "home") navigate("home"); }}
            options={[
              { value: "spotlight",  label: "스포트라이트" },
              { value: "mosaic",     label: "모자이크" },
              { value: "mapPrimary", label: "지도" },
              { value: "cover",      label: "표지" },
              { value: "editorial",  label: "잡지" },
              { value: "split",      label: "Split" },
            ]}/>
          <Hint>
            {t.homeLayout === "spotlight"  && "★ 시네마틱 풀화면 히어로. 이번 주 한 곳을 영화 포스터처럼 크게. 가장 임팩트."}
            {t.homeLayout === "mosaic"     && "★ 건축 사진 모자이크 월. 첫 화면에서 526곳의 밀도를 한눈에."}
            {t.homeLayout === "mapPrimary" && "지도가 풀스크린, 사이드 도크로 탐색하는 지도 우선형."}
            {t.homeLayout === "cover"      && "매거진 표지 + 검색 + 이번 주 픽. 잡지 한 호를 펼치는 느낌."}
            {t.homeLayout === "editorial"  && "큰 헤로 + 카드 그리드 + 작은 지도. 매거진 톤."}
            {t.homeLayout === "split"      && "지도 좌 + 리스트 우. 가장 균형잡힌 기본형."}
          </Hint>
        </TweakSection>

        <TweakSection label="컬렉션 · 정보 위계">
          <TweakRadio
            value={t.collectionLayout}
            onChange={(v) => { setTweak("collectionLayout", v); if (route.name !== "collection" || !route.id) navigate("collection", "brick"); }}
            options={[
              { value: "magazine", label: "스프레드" },
              { value: "index",    label: "인덱스" },
              { value: "bento",    label: "벤또" },
            ]}/>
          <Hint>
            {t.collectionLayout === "magazine" && "큰 표지 + 에디터 노트 + 큰 빌딩 슬라이드."}
            {t.collectionLayout === "index"    && "잡지 차례처럼 좌측 TOC + 우측 본문."}
            {t.collectionLayout === "bento"    && "비대칭 그리드 카드. 한눈에 훑는 컬렉션."}
          </Hint>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

function NavRow({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "9px 12px", borderRadius: 10,
      border: `1px solid ${active ? M.terra : "rgba(58,46,34,0.12)"}`,
      background: active ? M.terra : "transparent",
      color: active ? M.cream : M.ink,
      fontSize: 12, fontWeight: 700,
      cursor: "pointer", textAlign: "left",
      width: "100%", marginBottom: 4,
      fontFamily: "Pretendard, Nunito, sans-serif",
      display: "block",
    }}>{children}</button>
  );
}

function Hint({ children }) {
  return (
    <p style={{
      fontSize: 11, color: M.muted, fontWeight: 500,
      lineHeight: 1.55, margin: "8px 2px 0",
      fontFamily: "Pretendard, Nunito, sans-serif",
      textWrap: "pretty",
    }}>{children}</p>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
