# CLAUDE.md — masilmap

마실맵(masilmap): 한국 건축 산책 가이드. 지도 위에 건축물·코스·컬렉션을 펼쳐 천천히 걷게 하는 서비스.

## 이 프로젝트의 성격
- React 18 + Babel standalone(브라우저 트랜스파일) 기반 **동작하는 디자인 프로토타입**. 빌드 도구 없음.
- 모듈 번들러 대신 각 파일 끝 `Object.assign(window, {...})`로 컴포넌트를 전역 노출 → 다른 파일에서 전역으로 사용.
- 자세한 구조·토큰·화면 설명은 **HANDOFF.md** 참조.

## 작업 시 규칙
- **브랜드 시스템(`src/brand.jsx`)을 단일 소스로** 사용. 색은 `M.*`, 타이포 `MT.*`, 반경 `MR.*`, 그림자 `MS.*`, 아이콘 `<MIcon>`, 버튼 `<MButton>`. 새 색/폰트를 임의로 만들지 말 것.
  - Scholar 팔레트: 주=네이비 `M.terra(#333D51)`, 보조=골드 `M.olive(#D3AC2B)`, 페이지=흰색, 카드=크림 `#F4F3EA`. (변수명 terra/olive는 호환 위해 유지)
- **스크립트 로드 순서 유지**: brand→symbols→tweaks-panel→shared→data→screens(mapmenu-engine→mapmenu, home-spotlight/mosaic/consoles→home)→app. 새 screen 추가 시 `index*.html` 4곳 모두에 `<script>` 추가.
- 새 컴포넌트는 파일 끝 `Object.assign(window, {...})`로 노출.
- **전역 스타일 객체에 `const styles` 금지** — 충돌함. 컴포넌트명 접두 사용(예: `mkXxx`) 또는 인라인.
- 역할 분기는 `window.__masilRole`(user/admin/tour/editor). 새 역할 화면은 `consoles.jsx` + `app.jsx` 라우트 + `index_*.html`.
- 한국어 카피, `word-break: keep-all`, `text-wrap: pretty/balance` 유지.
- 큰 파일은 분할. 1000줄 넘는 단일 파일 지양.

## 자주 만지는 곳
- 지도 분류/렌즈: `src/screens/mapmenu-engine.jsx` (`MK_CATS`, `mkCatOf`, `MK_LENSES`).
- 상세 조건부 모듈: `src/screens/mapmenu.jsx` (`MKExtMapsModule`/`MKBookingModule`/`MKExtRefsModule`) — 상세·지도 공용.
- 메인 변형: `home-spotlight.jsx` / `home-mosaic.jsx`, 토글은 `app.jsx`의 Tweaks `homeLayout`.
- 데이터: `src/data.jsx` (픽스처).
