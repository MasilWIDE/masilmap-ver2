/* ================================================================
   마실맵 모바일 앱 (rel3) — 데이터 픽스처
   계정(실명) ≠ 채널(활동 브랜드). 코스 = 지점 묶음. 동네 우선.
   기존 data.jsx(BUILDINGS/COURSES/SERIES)는 그대로 두고,
   모바일 앱 전용 픽스처를 별도로 정의한다.
   ================================================================ */

/* ---------- 계정 (실명 · 비공개) ---------- */
const MX_ACCOUNT = {
  realName: "김명규",
  email: "mk.kim@***.com",
  org: "○○건축사사무소", // 절대 노출 안 됨
  channels: ["me", "matcafe"], // 이 계정이 보유한 채널
};

/* ---------- 채널 (활동 브랜드 · 공개) ---------- */
const MX_CHANNELS = [
  { id: "me",       name: "성수산책자",   handle: "@seongsu.walk", cat: "산책",       color: "#333D51", followers: 412,  courses: 4, completed: 18, official: false, mine: true,  bio: "성수동을 천천히 걷는 사람. 골목과 옥상을 좋아해요." },
  { id: "matcafe",  name: "맛카페",       handle: "@matcafe",      cat: "카페·산책",  color: "#D3AC2B", followers: 3240, courses: 9, completed: 31, official: false, mine: true,  bio: "걷다 들르기 좋은 카페만. 동네별로 모아요." },
  { id: "seochon",  name: "서촌건축산책", handle: "@seochon.walk", cat: "건축",       color: "#5A6B7A", followers: 5120, courses: 12,completed: 64, official: true,  mine: false, bio: "서촌의 한옥과 현대건축 사이를 안내합니다." },
  { id: "concrete", name: "콘크리트키드", handle: "@concrete.kid", cat: "건축",       color: "#6B6B6B", followers: 2410, courses: 7, completed: 22, official: false, mine: false, bio: "노출 콘크리트만 찾아다니는 계정." },
  { id: "noeul",    name: "노을수집가",   handle: "@noeul.collect",cat: "산책·뷰",    color: "#9C7E1A", followers: 1870, courses: 5, completed: 14, official: false, mine: false, bio: "해질 무렵에만 움직입니다. 옥상·강변·언덕." },
  { id: "withkid",  name: "아이랑마실",   handle: "@withkid",      cat: "가족",       color: "#7A8497", followers: 980,  courses: 6, completed: 9,  official: true,  mine: false, bio: "유모차로도 OK. 화장실·쉼터까지 확인했어요." },
];

/* ---------- 동네 (콜드스타트: 서울 한 권역 밀집) ---------- */
const MX_HOODS = [
  { id: "seongsu", name: "성수",   sub: "공장과 카페 사이", count: 14 },
  { id: "seochon", name: "서촌",   sub: "한옥과 골목",       count: 11 },
  { id: "jongno",  name: "종로·북촌", sub: "옛 도심의 결",   count: 9 },
];

/* ---------- 상황·기분 태그 ---------- */
const MX_MOODS = [
  { id: "kid",     label: "아이랑 걷기 좋은",  icon: "users" },
  { id: "rain",    label: "비 오는 날 실내",   icon: "home" },
  { id: "noeul",   label: "노을·옥상",         icon: "sparkle" },
  { id: "date",    label: "데이트",            icon: "heart" },
  { id: "solo",    label: "혼자 사색",         icon: "walk" },
  { id: "short",   label: "1시간 이내",        icon: "clock" },
  { id: "weekend", label: "주말 나들이",        icon: "calendar" },
  { id: "arch",    label: "건축 탐방",         icon: "map" },
];

/* 지점 타입 → 표시 */
const MX_STOP_KINDS = {
  건축: { color: "#333D51", glyph: "건" },
  카페: { color: "#D3AC2B", glyph: "카" },
  공원: { color: "#1F8A5B", glyph: "공" },
  상점: { color: "#9C7E1A", glyph: "상" },
  전망: { color: "#5A6B7A", glyph: "뷰" },
};

/* ---------- 코스 (지점 묶음) ----------
   stops: 순서대로. story는 '왜 이렇게 지었는가' 인문학 카드(건축 지점). */
const MX_COURSES = [
  {
    id: "seongsu-roof",
    title: "성수 옥상, 노을까지",
    channelId: "noeul", official: false, hood: "seongsu",
    cover: "#9C7E1A", moods: ["noeul", "date", "weekend"],
    distance: "3.1km", duration: "2시간 10분",
    summary: "붉은 벽돌 공장지대를 지나 옥상 카페에서 해가 지는 걸 봅니다.",
    saved: 312, walked: 1840,
    stops: [
      { id: "s1", name: "성수연방", kind: "건축", note: "옛 화학공장을 고친 복합문화공간. 가운데 중정으로 빛이 떨어져요.", story: "1970년대 제약공장의 콘크리트 골조를 헐지 않고 그대로 남겼습니다. '비우고 다시 쓴다'는 재생건축의 교과서 같은 곳." },
      { id: "s2", name: "대림창고", kind: "카페", note: "정미소·창고를 개조한 큰 카페. 천장이 높아요." },
      { id: "s3", name: "수제화거리", kind: "상점", note: "수십 년 된 구두 공방들. 골목 간판이 그대로." },
      { id: "s4", name: "성수동 옥상 전망", kind: "전망", note: "해질 무렵 한강과 공장 굴뚝이 같이 보이는 자리." },
    ],
  },
  {
    id: "seongsu-kid",
    title: "아이랑 성수, 천천히",
    channelId: "withkid", official: true, hood: "seongsu",
    cover: "#7A8497", moods: ["kid", "short", "weekend"],
    distance: "1.4km", duration: "55분",
    summary: "유모차로도 편한 평지. 화장실과 쉼터를 미리 확인해 뒀어요.",
    saved: 204, walked: 982,
    stops: [
      { id: "s1", name: "서울숲 北문", kind: "공원", note: "넓은 잔디. 유모차 대여 가능, 화장실 가까움." },
      { id: "s2", name: "언더스탠드에비뉴", kind: "상점", note: "컨테이너 상점가. 실내 쉼터 많음." },
      { id: "s3", name: "성수 그림책방", kind: "상점", note: "작은 그림책 서점. 아이가 앉아 볼 자리." },
    ],
  },
  {
    id: "seochon-hanok",
    title: "서촌 한옥과 골목",
    channelId: "seochon", official: true, hood: "seochon",
    cover: "#5A6B7A", moods: ["solo", "date", "arch", "weekend"],
    distance: "2.3km", duration: "1시간 40분",
    summary: "경복궁 서쪽, 한옥과 작은 갤러리 사이를 잇는 길.",
    saved: 521, walked: 2410,
    stops: [
      { id: "s1", name: "보안1942", kind: "건축", note: "옛 여관을 보존한 복합문화공간.", story: "1942년 지은 여관 '보안여관'을 헐지 않고, 옆에 신관을 새로 붙였습니다. 옛것과 새것을 나란히 둔 보기 드문 사례." },
      { id: "s2", name: "통인시장", kind: "상점", note: "엽전 도시락으로 유명한 골목 시장." },
      { id: "s3", name: "대오서점", kind: "상점", note: "서울에서 가장 오래된 헌책방 중 하나." },
      { id: "s4", name: "수성동 계곡", kind: "공원", note: "겸재 정선이 그린 바로 그 계곡. 도심 속 바위." },
    ],
  },
  {
    id: "seochon-rain",
    title: "비 오는 날 서촌 실내",
    channelId: "seochon", official: true, hood: "seochon",
    cover: "#4A5570", moods: ["rain", "solo", "short", "arch"],
    distance: "1.8km", duration: "1시간 20분",
    summary: "비가 와도 좋아요. 처마와 실내를 잇는 코스.",
    saved: 188, walked: 640,
    stops: [
      { id: "s1", name: "한옥 갤러리", kind: "건축", note: "처마 아래로 비 떨어지는 소리를 듣는 마당.", story: "한옥의 깊은 처마는 비를 피하면서도 바깥과 이어지게 합니다. 안과 밖의 경계를 흐리는 한국 건축의 지혜." },
      { id: "s2", name: "골목 다실", kind: "카페", note: "비 오는 날 창가 자리가 좋은 작은 다실." },
      { id: "s3", name: "서촌 책방", kind: "상점", note: "비 소리 들으며 머물기 좋은 독립서점." },
    ],
  },
  {
    id: "jongno-concrete",
    title: "북촌 콘크리트 산책",
    channelId: "concrete", official: false, hood: "jongno",
    cover: "#6B6B6B", moods: ["solo", "date", "arch", "rain"],
    distance: "2.7km", duration: "1시간 50분",
    summary: "한옥 사이에 끼어든 노출 콘크리트 건축을 찾아 걷습니다.",
    saved: 274, walked: 1120,
    stops: [
      { id: "s1", name: "공간 사옥", kind: "건축", note: "김수근의 검은 벽돌 사옥.", story: "1971년 김수근은 작은 검은 벽돌을 한 장씩 쌓아, 사람 몸의 크기에 맞춘 공간을 만들었습니다. '가장 가난한 재료로 만든 시'." },
      { id: "s2", name: "현대미술관 마당", kind: "건축", note: "옛 기무사 터에 흩어진 낮은 매스들.", story: "8개의 작은 건물로 나눠, 종친부 한옥과 키를 맞췄습니다. 큰 미술관을 일부러 작게 쪼갠 결정." },
      { id: "s3", name: "북촌 언덕 카페", kind: "카페", note: "콘크리트 노출 벽이 멋진 3층 카페." },
    ],
  },
  {
    id: "seongsu-cafe",
    title: "맛카페가 고른 성수 5곳",
    channelId: "matcafe", official: false, hood: "seongsu",
    cover: "#D3AC2B", moods: ["date", "solo", "noeul", "short", "weekend"],
    distance: "2.0km", duration: "1시간 30분",
    summary: "걷다 들르기 좋은 카페만 골랐어요. 줄 짧은 순서로.",
    saved: 902, walked: 3120,
    stops: [
      { id: "s1", name: "정미소 카페", kind: "카페", note: "옛 정미소 골조를 살린 로스터리." },
      { id: "s2", name: "골목 끝 베이커리", kind: "카페", note: "오전에만 나오는 캄파뉴." },
      { id: "s3", name: "성수 책카페", kind: "카페", note: "책 보며 오래 앉기 좋음." },
      { id: "s4", name: "옥상 티룸", kind: "전망", note: "노을 시간 예약 권장." },
    ],
  },
];

/* ---------- 피드 (팔로우한 채널의 새 코스) ----------
   실제로는 followed에 따라 필터. 여기선 시간순 더미 + 코스 연결. */
const MX_FEED = [
  { id: "f1", channelId: "seochon", courseId: "seochon-rain",    when: "2시간 전", verb: "새 코스를 올렸어요" },
  { id: "f2", channelId: "noeul",   courseId: "seongsu-roof",    when: "어제",     verb: "코스를 업데이트했어요" },
  { id: "f3", channelId: "matcafe", courseId: "seongsu-cafe",    when: "2일 전",   verb: "새 코스를 올렸어요" },
  { id: "f4", channelId: "concrete",courseId: "jongno-concrete", when: "3일 전",   verb: "코스를 공개했어요" },
];

/* ---------- 헬퍼 ---------- */
function mxChannel(id) { return MX_CHANNELS.find((c) => c.id === id) || MX_CHANNELS[0]; }
function mxCourse(id)  { return MX_COURSES.find((c) => c.id === id); }
function mxHood(id)    { return MX_HOODS.find((h) => h.id === id) || MX_HOODS[0]; }
function mxMood(id)    { return MX_MOODS.find((m) => m.id === id); }
function mxCoursesByHood(hid) { return MX_COURSES.filter((c) => c.hood === hid); }
/* 코스 진행률 (done = doneStops Set) */
function mxCourseProgress(course, doneStops) {
  const tot = course.stops.length;
  const done = course.stops.filter((s) => doneStops.has(`${course.id}:${s.id}`)).length;
  return { done, tot, pct: Math.round((done / (tot || 1)) * 100), complete: tot > 0 && done === tot };
}

/* ---------- 시리즈 (산책 코스 묶음 → 정복 배지) ----------
   웹·앱 공통 단일 모델. 완주 판정은 공유 스탬프(doneStops)로.
   각 시리즈는 배지를 겸한다 (시리즈 = 배지). 호환을 위해
   name/color/need(=courses) 별칭도 함께 들고 있다.            */
const MX_SERIES = [
  {
    id: "seongsu", no: "S·01", kind: "지역 종주", cover: "#D3AC2B",
    title: "성수 한 바퀴", subtitle: "공장과 카페 사이",
    intro: "붉은 벽돌 공장지대를 옥상·카페·골목으로 잇는 성수동 코스를 모두 걸어 정복합니다.",
    badge: "성수 정복자", courses: ["seongsu-roof", "seongsu-kid", "seongsu-cafe"],
  },
  {
    id: "seochon", no: "S·02", kind: "지역 종주", cover: "#5A6B7A",
    title: "서촌 골목", subtitle: "한옥과 처마 사이",
    intro: "경복궁 서쪽, 한옥과 갤러리·다실을 잇는 서촌의 두 코스를 정복합니다.",
    badge: "서촌 순례자", courses: ["seochon-hanok", "seochon-rain"],
  },
  {
    id: "concrete", no: "S·03", kind: "테마 · 재료", cover: "#6B6B6B",
    title: "노출 콘크리트", subtitle: "거친 표면의 미학",
    intro: "성수와 북촌에 흩어진 노출 콘크리트 건축을 코스로 묶어 정복합니다.",
    badge: "콘크리트 키드", courses: ["jongno-concrete", "seongsu-roof"],
  },
  {
    id: "jongno", no: "S·04", kind: "지역 종주", cover: "#333D51",
    title: "북촌·종로", subtitle: "옛 도심의 결",
    intro: "한옥 사이에 끼어든 현대 건축을 잇는 북촌·종로 코스를 정복합니다.",
    badge: "북촌 탐험가", courses: ["jongno-concrete"],
  },
];
// 호환 별칭 (기존 배지 UI가 name/color/need/desc를 읽음)
MX_SERIES.forEach((s) => { s.name = s.badge; s.color = s.cover; s.need = s.courses; s.desc = s.intro; });
const MX_BADGES = MX_SERIES;

function mxSeries(id) { return MX_SERIES.find((s) => s.id === id) || MX_SERIES[0]; }
/* 시리즈 진행: 멤버 산책 코스의 완주(모든 스탬프) 개수로 정복 판정 */
function mxSeriesProgress(series, doneStops) {
  const courses = (series.courses || []).map(mxCourse).filter(Boolean);
  const per = courses.map((c) => ({ course: c, pr: mxCourseProgress(c, doneStops) }));
  const done = per.filter((x) => x.pr.complete).length;
  const total = courses.length || 1;
  return { per, courses, done, total, pct: Math.round((done / total) * 100), complete: done === courses.length && courses.length > 0 };
}
function mxBadgeProgress(badge, doneStops) {
  const sp = mxSeriesProgress(badge, doneStops);
  return { done: sp.done, tot: sp.total, got: sp.complete };
}
/* 이 산책 코스가 속한 시리즈들 */
function mxSeriesForCourse(courseId) { return MX_SERIES.filter((s) => (s.courses || []).includes(courseId)); }

Object.assign(window, {
  MX_ACCOUNT, MX_CHANNELS, MX_HOODS, MX_MOODS, MX_STOP_KINDS, MX_COURSES, MX_FEED, MX_BADGES, MX_SERIES,
  mxChannel, mxCourse, mxHood, mxMood, mxCoursesByHood, mxCourseProgress, mxBadgeProgress,
  mxSeries, mxSeriesProgress, mxSeriesForCourse,
});

/* ===== 웹 기존 'SERIES' API를 단일 모델(MX_SERIES)로 일원화 =====
   data.jsx가 정의한 건축 기반 SERIES를 덮어써, 웹의 시리즈 화면·홈·
   콘솔이 모두 공유 산책-코스 시리즈를 가리키게 한다. */
window.SERIES = MX_SERIES;
window.seriesCourses = (s) => (s.courses || []).map((id) => mxCourse(id)).filter(Boolean);
window.seriesBuildingCount = (s) => {
  const names = new Set();
  (window.seriesCourses(s) || []).forEach((c) => (c.stops || []).forEach((st) => { if (st.kind === "건축") names.add(st.name); }));
  return names.size;
};
window.seriesForBuilding = (bid) => {
  const b = (window.BUILDINGS || []).find((x) => x.id === bid);
  if (!b) return [];
  return MX_SERIES.filter((s) => (window.seriesCourses(s) || []).some((c) => (c.stops || []).some((st) => st.name === b.name)));
};

/* ---------- 코스 주변 맛집·커피 추천 ----------
   동네(hood) 기준. by = 추천한 채널 id (선택). kind: 커피/맛집/베이커리/디저트 */
const MX_EATS = [
  // 성수
  { id: "e1", hood: "seongsu", name: "센터커피 성수", kind: "커피", note: "넓은 로스터리. 창가 자리에서 골목이 보여요.", walk: "코스 1번 지점서 3분", by: "matcafe", price: "₩₩" },
  { id: "e2", hood: "seongsu", name: "성수동 손칼국수", kind: "맛집", note: "점심 줄서는 노포. 걷고 나서 든든하게.", walk: "대림창고 옆 2분", by: null, price: "₩" },
  { id: "e3", hood: "seongsu", name: "어니언 성수", kind: "베이커리", note: "정비소를 고친 베이커리 카페. 팡도르 인기.", walk: "코스 종점서 5분", by: "matcafe", price: "₩₩" },
  // 서촌
  { id: "e4", hood: "seochon", name: "서촌 한옥 다실", kind: "커피", note: "한옥 마당이 보이는 조용한 찻집.", walk: "보안1942 옆 1분", by: "seochon", price: "₩₩" },
  { id: "e5", hood: "seochon", name: "통인 기름떡볶이", kind: "맛집", note: "통인시장 명물. 엽전 도시락과 함께.", walk: "통인시장 안", by: null, price: "₩" },
  { id: "e6", hood: "seochon", name: "서촌 골목 베이커리", kind: "베이커리", note: "오전에만 나오는 캄파뉴.", walk: "대오서점서 3분", by: "seochon", price: "₩₩" },
  // 종로·북촌
  { id: "e7", hood: "jongno", name: "북촌 언덕 카페", kind: "커피", note: "노출 콘크리트 3층. 옥상서 한옥 지붕이 보여요.", walk: "코스 3번 지점", by: "concrete", price: "₩₩" },
  { id: "e8", hood: "jongno", name: "삼청동 수제비", kind: "맛집", note: "비 오는 날 특히 좋은 따뜻한 한 그릇.", walk: "현대미술관서 4분", by: null, price: "₩" },
  { id: "e9", hood: "jongno", name: "한 디저트 살롱", kind: "디저트", note: "약과 티라미수로 유명한 작은 살롱.", walk: "북촌 언덕 옆 2분", by: null, price: "₩₩" },
];
const MX_EAT_KINDS = {
  커피:     { color: "#9C7E1A", glyph: "커" },
  맛집:     { color: "#D26A4E", glyph: "밥" },
  베이커리: { color: "#D3AC2B", glyph: "빵" },
  디저트:   { color: "#7A8497", glyph: "디" },
};
function mxEatsByHood(hid) { return MX_EATS.filter((e) => e.hood === hid); }
function mxEatsForCourse(course) { return course ? mxEatsByHood(course.hood) : []; }

Object.assign(window, { MX_EATS, MX_EAT_KINDS, mxEatsByHood, mxEatsForCourse });

/* ---------- 발자취 (채널이 다녀온 곳) ----------
   타인 채널은 픽스처. 내 채널(mine)은 공유 스탬프(doneStops)에서 파생.
   해외 확장 대비: 좌표는 hood 기준 상대 위치(x,y 0~1)로 추상화. */
const MX_FOOTPRINTS = {
  matcafe:  [
    { name: "센터커피 성수", hood: "seongsu", kind: "카페" }, { name: "어니언 성수", hood: "seongsu", kind: "카페" },
    { name: "성수 책방카페", hood: "seongsu", kind: "카페" }, { name: "대림창고", hood: "seongsu", kind: "카페" },
    { name: "북촌 언덕 카페", hood: "jongno", kind: "카페" }, { name: "옥상 티룸", hood: "seongsu", kind: "전망" },
    { name: "삼청동 골목", hood: "jongno", kind: "상점" },
  ],
  seochon:  [
    { name: "보안1942", hood: "seochon", kind: "건축" }, { name: "통인시장", hood: "seochon", kind: "상점" },
    { name: "대오서점", hood: "seochon", kind: "상점" }, { name: "수성동 계곡", hood: "seochon", kind: "공원" },
    { name: "한옥 갤러리", hood: "seochon", kind: "건축" }, { name: "공간 사옥", hood: "jongno", kind: "건축" },
    { name: "서촌 한옥 다실", hood: "seochon", kind: "카페" }, { name: "윤동주 문학관", hood: "seochon", kind: "건축" },
  ],
  concrete: [
    { name: "공간 사옥", hood: "jongno", kind: "건축" }, { name: "현대미술관 마당", hood: "jongno", kind: "건축" },
    { name: "북촌 언덕 카페", hood: "jongno", kind: "카페" }, { name: "성수연방", hood: "seongsu", kind: "건축" },
    { name: "아라리오 뮤지엄", hood: "jongno", kind: "건축" },
  ],
  noeul:    [
    { name: "성수 옥상 전망", hood: "seongsu", kind: "전망" }, { name: "옥상 티룸", hood: "seongsu", kind: "전망" },
    { name: "대림창고", hood: "seongsu", kind: "카페" }, { name: "성수연방", hood: "seongsu", kind: "건축" },
    { name: "한강 노을 데크", hood: "seongsu", kind: "전망" },
  ],
  withkid:  [
    { name: "서울숲 北문", hood: "seongsu", kind: "공원" }, { name: "언더스탠드에비뉴", hood: "seongsu", kind: "상점" },
    { name: "성수 그림책방", hood: "seongsu", kind: "상점" }, { name: "서울숲 놀이마당", hood: "seongsu", kind: "공원" },
  ],
};
/* 채널 발자취 + 랭킹 통계. 내 채널은 doneStops에서 다녀온 지점 도출 */
function mxFootprint(channelId, doneStops) {
  const ch = mxChannel(channelId) || {};
  let places = MX_FOOTPRINTS[channelId] || [];
  let walkedCourses, conqueredSeries, badges;
  if (ch.mine && doneStops) {
    // 내가 스탬프 찍은 지점 = 발자취
    const seen = [];
    MX_COURSES.forEach((c) => (c.stops || []).forEach((st) => {
      if (doneStops.has(`${c.id}:${st.id}`)) seen.push({ name: st.name, hood: c.hood, kind: st.kind });
    }));
    if (seen.length) places = seen;
    walkedCourses   = MX_COURSES.filter((c) => mxCourseProgress(c, doneStops).complete).length;
    conqueredSeries = (window.MX_SERIES || []).filter((s) => mxSeriesProgress(s, doneStops).complete).length;
    badges          = conqueredSeries;
  } else {
    walkedCourses   = ch.completed || 0;
    conqueredSeries = MX_FP_CONQUERED[channelId] || 0;
    badges          = conqueredSeries;
  }
  // 동네별 묶기
  const byHood = {};
  places.forEach((p) => { (byHood[p.hood] = byHood[p.hood] || []).push(p); });
  return { places, byHood, count: places.length, walkedCourses, conqueredSeries, badges, hoods: Object.keys(byHood).length };
}
const MX_FP_CONQUERED = { matcafe: 1, seochon: 2, concrete: 1, noeul: 1, withkid: 0 };

Object.assign(window, { MX_FOOTPRINTS, mxFootprint });
