# CLAUDE.md — masilmap

마실맵(masilmap): 한국 건축 산책 가이드. 지도 위에 건축물·코스·컬렉션을 펼쳐 천천히 걷게 하는 서비스.

## 이 프로젝트의 성격
- React 18 + Babel standalone(브라우저 트랜스파일) 기반 **동작하는 디자인 프로토타입**. 빌드 도구 없음.
- 모듈 번들러 대신 각 파일 끝 `Object.assign(window, {...})`로 컴포넌트를 전역 노출 → 다른 파일에서 전역으로 사용.
- 자세한 구조·토큰·화면 설명은 **HANDOFF.md** 참조.
- 회원·권한·이력·정산 연동 규칙은 **MEMBERSHIP.md** 참조 (회원구조 단일 소스는 "마실그라운드 통합 회원 구조 설계도 v2").

## 작업 시 규칙
- **브랜드 시스템(`src/brand.jsx`)을 단일 소스로** 사용. 색은 `M.*`, 타이포 `MT.*`, 반경 `MR.*`, 그림자 `MS.*`, 아이콘 `<MIcon>`, 버튼 `<MButton>`. 새 색/폰트를 임의로 만들지 말 것.
  - Scholar 팔레트: 주=네이비 `M.terra(#333D51)`, 보조=골드 `M.olive(#D3AC2B)`, 페이지=흰색, 카드=크림 `#F4F3EA`. (변수명 terra/olive는 호환 위해 유지)
- **스크립트 로드 순서 유지**: brand→symbols→tweaks-panel→shared→data→screens(mapmenu-engine→mapmenu, home-spotlight/mosaic/consoles→home)→app. 새 screen 추가 시 `index*.html` 4곳 모두에 `<script>` 추가.
- 새 컴포넌트는 파일 끝 `Object.assign(window, {...})`로 노출.
- **전역 스타일 객체에 `const styles` 금지** — 충돌함. 컴포넌트명 접두 사용(예: `mkXxx`) 또는 인라인.
- 역할 분기는 `window.__masilRole`(user/admin/tour/editor). 새 역할 화면은 `consoles.jsx` + `app.jsx` 라우트 + `index_*.html`.
- 한국어 카피, `word-break: keep-all`, `text-wrap: pretty/balance` 유지.
- 큰 파일은 분할. 1000줄 넘는 단일 파일 지양.

## 회원구조 규칙 (마실그라운드 생태계 연동 — 필수)
마실맵은 마실그라운드·언빌트와 **하나의 회원 정체성**을 공유한다. 목적은 통합 로그인이 아니라, 사람의 이력과 그에 따라붙는 권리(로열티)를 끊김 없이 추적하는 것. 아래 3가지를 지키면 나중에 백엔드를 붙일 때 화면을 다시 짤 필요가 없다. (상세: MEMBERSHIP.md)

- **사람은 user_id로 묶는다 (이름·이메일 아님).** 표시는 이름/handle로 하되 내부 참조·연결은 불변 식별자 `userId`로. 이메일·SNS는 바뀔 수 있는 연락처 속성 — 이메일이 바뀌어도 이력이 끊기면 안 됨. USER·ASSETS·BOOKINGS·curator 등 사람 참조는 모두 `userId`/`ownerRef` 사용.
- **mock 데이터 모양 = 백엔드 스키마 모양.** `src/data.jsx`의 픽스처를 "API 응답 계약"으로 본다. 특히 권리 배분(split)은 문자열이 아니라 구조화 배열로:
  ```js
  beneficiaries: [
    { ownerRef: "u_woo",   role: "설계자", sharePct: 50, consentStatus: "보류" },
    { ownerRef: "org_woo", role: "협력",   sharePct: 30, consentStatus: "대기" },
    { ownerRef: "masilmap", role: "플랫폼", sharePct: 20, consentStatus: "완료" }
  ]
  // 표시용 "설계자 50% · 협력 30% …" 문자열은 이 배열에서 만들어 쓴다.
  // 전원 consentStatus="완료"가 되면 status="공개".
  ```
- **공/사 격리.** 마이페이지(찜·후기·스탬프·예약)는 사적 영역 — 소속·회사 정보를 절대 표시/전송하지 않는다. 한 계정이 admin/tour/editor를 겸해도, 사적 활동은 역할 콘솔에서 보이지 않아야 한다.

추가 원칙:
- 로그인은 SNS(카카오·네이버·구글·애플)+이메일. **본인인증 비강제**(해외 대비), 추가 인증은 권리 발생(정산 등) 시점에만.
- 역할 진입(`__masilRole`의 URL 분리)은 데모용 — 프로덕션에서는 실제 인증·권한(역할+직급)으로 게이트.
- 저장(찜)은 현재 localStorage. 로그인 시 user_id 기준 서버 동기화로 전환(비로그인 → 로그인 시 병합).

## 자주 만지는 곳
- 지도 분류/렌즈: `src/screens/mapmenu-engine.jsx` (`MK_CATS`, `mkCatOf`, `MK_LENSES`).
- 상세 조건부 모듈: `src/screens/mapmenu.jsx` (`MKExtMapsModule`/`MKBookingModule`/`MKExtRefsModule`) — 상세·지도 공용.
- 메인 변형: `home-spotlight.jsx` / `home-mosaic.jsx`, 토글은 `app.jsx`의 Tweaks `homeLayout`.
- 데이터: `src/data.jsx` (픽스처). ← 회원구조 규칙 적용 대상(userId·beneficiaries 구조화).
- 회원·권리 화면: `auth.jsx`(로그인/온보딩) · `mypage.jsx`(사적 영역, 격리) · `upload.jsx`(권리 게이트) · `admin.jsx`/`consoles.jsx`(권리 관리·역할).
