# MasilMAP — 핸드오프 (2026-05-30 / rel1)

> 마실맵(masilmap) · 한국 건축 산책 가이드. 지도 위에 건축물 526곳 · 코스 47개 · 컬렉션을
> 펼쳐 두고, 천천히 걷게 만드는 서비스. 이 번들은 **동작하는 HTML 프로토타입**입니다.

---

## 0. 이 번들의 성격

- 파일은 **React 18 + Babel standalone(브라우저 트랜스파일)** 로 만든 **동작하는 디자인 프로토타입**입니다.
  빌드 도구 없이 `index.html`을 브라우저에서 바로 열면 실행됩니다(인터넷 연결 시 — React/Babel/폰트 CDN 사용).
- **프로덕션 코드가 아니라 디자인·인터랙션 레퍼런스**입니다. 실제 제품에 올릴 때는
  대상 코드베이스(Next.js/React, Vue, 네이티브 등)의 **기존 패턴·디자인시스템으로 재구현**하세요.
  환경이 아직 없다면 Next.js + TypeScript + 실제 지도 SDK(네이버/카카오) 조합을 권장합니다.
- **충실도: 하이파이(hifi)** — 색·타이포·간격·인터랙션이 최종에 가깝습니다. 픽셀을 그대로 재현하되,
  지도/사진/예약 같은 부분은 실제 SDK·API로 교체하세요.

## 1. 실행 방법

```
# 정적 서버로 띄우기 (CDN 의존성 때문에 file:// 보다 권장)
npx serve .        # 또는: python3 -m http.server
# 브라우저에서 각 진입점 열기
```

진입점 4개 (역할별):

| 파일 | 역할 | 첫 화면 |
|---|---|---|
| `index.html` | 일반 사용자 | 스포트라이트 메인 → 지도/건축물/코스/컬렉션 |
| `index_manage.html` | 관리자 | 운영 대시보드 (콘텐츠·예약매출·권리) |
| `index_tour.html` | 코스 운영자 | 코스 운영 (내 코스·예약·매출·코스 만들기) |
| `index_editor.html` | 에디터 | 컬렉션·매거진 (컬렉션·초안·발행) |

각 HTML은 `<body>` 최상단에서 `window.__masilRole = "user|admin|tour|editor"` 한 줄만 다르고,
나머지 스크립트 로드는 동일합니다. `src/app.jsx`가 이 값을 읽어 시작 라우트를 정합니다.

## 2. 아키텍처

```
index*.html              ← 진입점 (역할 플래그 + 스크립트 로드 순서)
src/
  brand.jsx              ← 잠금된 브랜드 시스템: 색(M)·타이포(MT)·반경(MR)·그림자(MS)·MIcon·MButton·로고
  symbols.jsx            ← 건축 심볼 SVG
  tweaks-panel.jsx       ← 디자인 검토용 Tweaks 패널 + useTweaks 훅(런타임 변형 토글)
  shared.jsx             ← MasilNav(역할/상태 인지 네비)·MagCap·Hairline·ImgPlaceholder·Serial 등 공용
  data.jsx               ← 픽스처: BUILDINGS·COURSES·COLLECTIONS·EXTERNAL_SPACES·USER·BOOKINGS·ASSETS
  app.jsx                ← 라우터 + Tweaks 패널 + 역할(__masilRole) 분기. 전역 진입(App)
  screens/
    home.jsx             ← 홈(메인) — 레이아웃 변형: spotlight/mosaic/mapPrimary/cover/editorial/split
    home-spotlight.jsx   ← ★ 메인 변형 A: 시네마틱 풀블리드 히어로
    home-mosaic.jsx      ← ★ 메인 변형 B: 건축 사진 모자이크 월
    mapmenu-engine.jsx   ← 지도 메뉴 엔진: 탈색 데이터맵(팬·줌·드래그)·카테고리 핀·클러스터·코스 경로선·렌즈·딥링크 헬퍼
    mapmenu.jsx          ← 지도 메뉴 UI: 사이드 도크 + 라이브 리스트 + 조건부 상세 모듈
    buildings.jsx        ← 건축물 인덱스(그리드 + 필터)
    detail.jsx           ← 건축물 상세 — 레이아웃: hero/sidebar/longform (현재 sidebar 고정)
    collection.jsx       ← 컬렉션 (magazine/index/bento 변형)
    course.jsx           ← 코스 상세 + 인덱스
    booking.jsx          ← 예약 3종: 도슨트 / 결제 / 외부 공간 연결
    mypage.jsx           ← 마이페이지 (프로필 + 예약·저장·팔로우)
    upload.jsx           ← 등록: 빠른등록 / 깊은 큐레이션(권리 게이트)
    admin.jsx            ← 관리자: 콘텐츠관리 / 예약·매출 통계 / 권리 관리 (AdminShell)
    consoles.jsx         ← ★ 역할별 콘솔: AdminOverview / TourConsole / EditorConsole + 공용 ConsoleShell
    auth.jsx             ← 로그인 / 온보딩
```

**스크립트 로드 순서가 중요합니다**(전역 객체 의존): brand → symbols → tweaks-panel → shared → data →
screens(특히 `mapmenu-engine` → `mapmenu`, `home-spotlight`·`home-mosaic`·`consoles` → `home`/`app`) → app.
각 파일 끝에서 `Object.assign(window, {...})`로 컴포넌트를 전역 노출합니다(모듈 번들러 없이 공유).

## 3. 디자인 토큰 (src/brand.jsx의 `M` / `MT` / `MR` / `MS`)

**색 — "Scholar" 팔레트** (변수명은 호환을 위해 terra=primary, olive=secondary 유지)
| 토큰 | 값 | 용도 |
|---|---|---|
| `M.beige` | `#FFFFFF` | 페이지 배경(흰색) |
| `M.beigeAlt` | `#CBD0D8` | 보조면·구분선(블루그레이) |
| `M.cream` | `#F4F3EA` | 카드 표면(웜 크림) |
| `M.terra` | `#333D51` | **주 브랜드(네이비)** — CTA·헤드라인·활성 |
| `M.terraSoft` | `#7A8497` | 소프트 네이비 |
| `M.terraDeep` | `#1F2738` | 딥 네이비(눌림) |
| `M.olive` | `#D3AC2B` | **보조 브랜드(골드)** — 액센트·태그 |
| `M.oliveSoft` | `#E8D080` | 라이트 골드 |
| `M.oliveDeep` | `#9C7E1A` | 딥 골드 |
| `M.ink` | `#1F2738` | 본문 텍스트(딥 네이비) |
| `M.muted` | `#6B7484` | 보조 텍스트·캡션 |
| `M.faint` | `rgba(31,39,56,0.45)` | 흐린 텍스트 |

**타이포 (MT)**
- 본문/헤딩: `'Nunito'`(+한글은 `Pretendard` — index.html에서 로드) — `MT.family`
- 워드마크: `'Quicksand'` — `MT.familyMark`
- 세리프(에디토리얼 본문·큰 인용): `'Noto Serif KR'`
- 모노(라벨·좌표·메타): `'JetBrains Mono'`
- word-break: keep-all, text-wrap: pretty/balance 사용

**반경(MR) / 그림자(MS)**: `MR.inner/card/cardLg/pill`, `MS.cardSm/card/cardLg/float` — brand.jsx 참조.
**아이콘**: `<MIcon name=… size=… color=…/>` — home/map/walk/calendar/heart/bookmark/location/arrow/chevron/plus/search/sparkle/clock/book/external 등(brand.jsx의 switch).

## 4. 핵심 화면 상세

### 4.1 지도 메뉴 (Option A · 사이드 도크) — `mapmenu.jsx` + `mapmenu-engine.jsx`
세 레퍼런스(구글 호텔 리스트·동기화, FastFive 지역 그룹, MapsArch 몰입 탐색기)를 마실 톤으로 융합.
- **탈색 데이터맵**: 회·베이지 톤 추상 한반도 SVG. 팬(드래그)·줌(+/−)·클러스터. 사진/핀이 도드라지게 채도 ↓.
  좌표계는 `BUILDINGS[].coord`(1200×1040 가상공간). **실제 지도 SDK로 교체 시 이 좌표/렌더만 바꾸면 됨.**
- **카테고리 핀(사용자 정의 분류)**: 양식(한옥/미술관)이 아니라 "거기서 뭘 하나"로 분류 —
  둘러보기/예약관람/머무는 곳/맛보는 곳/손으로. `MK_CATS`·`mkCatOf()`에서 `EXTERNAL_SPACES.type` + `metrics.visit`로 자동 도출. 운영자가 늘리고 줄이는 전제(`분류 추가` 어포던스).
- **큐레이션 렌즈**(`MK_LENSES`): 전체·트렌딩·어워드·한옥·야경·머무는 곳·신규.
- **라이브 리스트 + "이 지역에서 다시 검색"**: 지도 이동 시 리스트 갱신(구글 패턴). 리스트↔핀 호버 하이라이트.
- **클러스터**: 화면상 근접 핀을 숫자 버블로 묶고, 클릭 시 줌인하며 분리.
- **코스 경로선**: 상세의 코스 `경로` 토글 → 지도에 점선 경로 + 토스트.

### 4.2 건축물 상세 (사이드 레이아웃 고정) — `detail.jsx` (layout="sidebar")
좌측 목차(페이지번호 없음) + 우측 도큐먼트 본문. 섹션:
01 개요 · 02 이야기 · 03 갤러리 · 04 방문정보 · **05 지도 저장·예약** · **06 코스·컬렉션** · 07 방문후기 · **08 더 깊이 보기** · 09 비슷한 건축.
지도 메뉴와 **공통 모듈**을 공유(`MKExtMapsModule`·`MKBookingModule`·`MKExtRefsModule`):
- **외부 지도 보기·저장(후발주자 전략)**: 네이버·카카오·구글 — `보기↗` + `저장`. 항상 노출. (`mkExtMaps()`가 `name+region`으로 검색 딥링크 생성. 실제 좌표 연동 시 교체)
- **용도별 예약(조건부)**: `EXTERNAL_SPACES`에 매칭될 때만. 숙박/식음/체험. 예약 → `booking-external` 라우트.
- **포함 코스 / 수록 컬렉션(조건부)**: `COURSES`/`COLLECTIONS`의 `buildings[]` 역참조.
- **08 더 깊이 보기**: 전문 정보는 외부로 — 마실그라운드 / 건축사사무소 / 문헌·위키 (`mkExternalRefs()`).
  "마실지도는 핵심만, 전문 정보는 외부에서" 원칙. (마실그라운드는 임시로 masilwide.com 검색 연결 — 실제 URL로 교체)

### 4.3 메인(홈) — 레이아웃 변형 (Tweaks "홈 · 메인 페이지")
- **spotlight**(기본): 풀블리드 시네마틱 히어로(에디터 픽 한 곳 크게) + 썸네일 레일 + 지도 밴드 + 컬렉션 띠. 다크 톤.
- **mosaic**: 건축 사진 비대칭 모자이크 월 + 골드 매스트헤드.
- mapPrimary(=지도 메뉴) / cover / editorial / split (기존).

### 4.4 역할별 콘솔 — `consoles.jsx`
공용 `ConsoleShell`(좌측 역할 네비 + 배지 + VIEW AS 전환). 각 콘솔은 KPI + 섹션 + 기존 화면 딥링크:
- **AdminOverview**: 건축물·예약·권리대기·사용자 KPI + 빠른작업 + 권리 동의 대기 큐(`ASSETS`).
- **TourConsole**: 운영 코스·예약·매출 KPI + 내 코스(`COURSES`) + 다가오는 예약(`BOOKINGS` status=예정).
- **EditorConsole**: 발행 컬렉션·초안·조회수 KPI + 내 컬렉션(`COLLECTIONS`) + 매거진 초안.

## 5. 상태 / 라우팅

- **라우터**(`app.jsx`): `route = {name, id}` + `navigate(name, id, opts)`. opts로 레이아웃 토글 전달.
  역할(`__masilRole`)에 따라 시작 라우트: user→home, admin→console-admin, tour→console-tour, editor→console-editor.
- **Tweaks**(`tweaks-panel.jsx`의 `useTweaks`): `homeLayout`/`detailLayout`/`collectionLayout` 등 런타임 변형.
  값은 디자인 검토용. 프로덕션에서는 단일 레이아웃으로 확정(현재 상세=sidebar 고정).
- **전역 브리지**: `window.__masilT`(tweaks), `window.__masilAuth`(로그인), `window.__masilSearch`(검색), `window.__masilRole`(역할).
- **저장**: 지도 저장은 `localStorage` 키 `masilmap.map.saved`.

## 6. 데이터 모델 (`src/data.jsx`)

- `BUILDINGS[]`: id·no·name·nameEn·architect·year·region·address·type·typeKey·useKey·style·palette·intro·longRead·**coord[x,y]**·metrics{rooms,floors,gfa,visit}·tags·pinTone·visited·saved
- `COURSES[]`: id·no·name·blurb·curator{name,role,color,verified}·rating·reviews·visited·saved·distance·duration·elevation·difficulty·**buildings[]**·type·cover
- `COLLECTIONS[]`: id·no·title·subtitle·editor·editorRole·issue·cover·blurb·count·readTime·**buildings[]**·tag
- `EXTERNAL_SPACES[]`: id·building·type(숙박/식음/체험)·name·partner·minPrice·summary·typeIcon — **예약 모듈의 소스**
- `USER`, `BOOKINGS[]`(courseId·date·time·people·price·status), `ASSETS[]`(권리: building·name·type·owner·consent·split)

## 7. 프로덕션 전환 체크리스트

- [ ] 추상 데이터맵 → **실제 지도 SDK**(네이버/카카오 Maps JS). `MKDataMap` 좌표/렌더 교체, 핀/클러스터/경로를 SDK 오버레이로.
- [ ] 외부 지도 딥링크(`mkExtMaps`) → 실제 좌표/장소 ID 기반 URL.
- [ ] 예약(`booking-*`) → 실제 파트너 API(마이리얼트립/캐치테이블/프립 등) 연동.
- [ ] 외부 전문정보(`mkExternalRefs`) → 마실그라운드/건축사사무소 **실제 URL**.
- [ ] 역할 진입(`__masilRole`) → **실제 인증·권한**으로 게이트. 현재는 데모용 URL 분리.
- [ ] 이미지 플레이스홀더(`ImgPlaceholder`) → 실제 사진/CDN.
- [ ] Babel standalone 제거 → 빌드 파이프라인(JSX 사전 컴파일), CDN 의존성 번들.
- [ ] 픽스처(`data.jsx`) → 실제 DB/CMS.

## 8. 파일 목록 (이 번들)

- 진입점: `index.html`, `index_manage.html`, `index_tour.html`, `index_editor.html`
- 소스: `src/*.jsx`, `src/screens/*.jsx` (위 2장 참조)
- 문서: `HANDOFF.md`(이 파일), `CLAUDE.md`(Claude Code용 프로젝트 지침)
