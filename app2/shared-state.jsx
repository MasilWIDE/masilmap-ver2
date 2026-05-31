/* ================================================================
   마실맵 — 웹·앱 공유 상태 (single source, localStorage)
   index.html(웹)과 Masil App.html(앱)이 같은 키를 읽고 써서
   로그인·따라걷기 진행·스탬프·팔로우·현재 채널을 실제로 공유한다.
   ================================================================ */

const MASIL_KEY = "masil_shared_v1";

const MASIL_DEFAULT = {
  loggedIn: false,
  currentChannelId: "me",
  hood: "seongsu",
  followed: ["seochon", "noeul"],        // 팔로우한 채널 id
  myCourses: ["seongsu-roof", "seochon-hanok"], // 따라 걷는 코스
  doneStops: ["seongsu-roof:s1", "seongsu-roof:s2", "seochon-hanok:s1"], // `${courseId}:${stopId}`
  savedBuildings: [],
  savedPlaces: [],                       // 다른 채널 발자취에서 담은 장소명

  /* ── 폴크소노미 태그 / 운영자 분류 관리 ── */
  userTags: {},      // { [buildingId]: { [tag]: votes } } — 방문자가 단 태그 + 표
  tagMerges: {},     // { [alias]: canonical } — 운영자가 합친 태그
  bannedTags: [],    // 운영자가 숨긴 태그
  promotedLenses: [],// [{ id, label, tag }] — 태그를 공식 렌즈로 승격
  awardIds: ["leeum", "ddp", "soeul", "museumsan", "mmcas", "amorepacific"], // 어워드 수동 지정
};

const TAG_PUBLIC_MIN = 2; // 방문자 태그가 공개되는 최소 표수

function masilRead() {
  try {
    const r = localStorage.getItem(MASIL_KEY);
    if (r) return { ...MASIL_DEFAULT, ...JSON.parse(r) };
  } catch (e) {}
  return { ...MASIL_DEFAULT };
}
function masilWrite(next) {
  try {
    localStorage.setItem(MASIL_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("masil-shared-change"));
  } catch (e) {}
}

/* 컴포넌트용 훅 — 변경 시 자동 동기화(같은 탭 + 다른 탭/창) */
function useMasilShared() {
  const [s, setS] = React.useState(masilRead);
  React.useEffect(() => {
    const h = () => setS(masilRead());
    window.addEventListener("masil-shared-change", h);
    window.addEventListener("storage", h);
    return () => { window.removeEventListener("masil-shared-change", h); window.removeEventListener("storage", h); };
  }, []);
  const update = (patch) => { const n = { ...masilRead(), ...patch }; masilWrite(n); setS(n); };
  return {
    s,
    update,
    isLoggedIn: s.loggedIn,
    login:  () => update({ loggedIn: true }),
    logout: () => update({ loggedIn: false }),
    done: new Set(s.doneStops),
    followedSet: new Set(s.followed),
    myCoursesSet: new Set(s.myCourses),
    setChannel: (id) => update({ currentChannelId: id }),
    setHood: (h) => update({ hood: h }),
    toggleFollow: (id) => { const f = new Set(s.followed); f.has(id) ? f.delete(id) : f.add(id); update({ followed: [...f] }); },
    followCourse: (id) => { const m = new Set(s.myCourses); m.add(id); update({ myCourses: [...m] }); },
    addSavedPlaces: (names) => { const sp = new Set(s.savedPlaces || []); names.forEach((n) => sp.add(n)); update({ savedPlaces: [...sp] }); },

    /* ── 태그 / 분류 관리 ── */
    addTag: (buildingId, tag) => {
      const t = (tag || "").trim().replace(/^#/, "");
      if (!t) return;
      const ut = JSON.parse(JSON.stringify(s.userTags || {}));
      ut[buildingId] = ut[buildingId] || {};
      ut[buildingId][t] = (ut[buildingId][t] || 0) + 1;
      update({ userTags: ut });
    },
    mergeTags: (alias, canonical) => {
      const a = (alias || "").trim(), c = (canonical || "").trim();
      if (!a || !c || a === c) return;
      update({ tagMerges: { ...(s.tagMerges || {}), [a]: c } });
    },
    banTag: (tag) => { const set = new Set(s.bannedTags || []); set.add(tag); update({ bannedTags: [...set] }); },
    unbanTag: (tag) => { update({ bannedTags: (s.bannedTags || []).filter((x) => x !== tag) }); },
    promoteLens: (tag, label) => {
      const id = "tag-" + tag;
      if ((s.promotedLenses || []).some((l) => l.id === id)) return;
      update({ promotedLenses: [...(s.promotedLenses || []), { id, label: label || tag, tag }] });
    },
    demoteLens: (id) => { update({ promotedLenses: (s.promotedLenses || []).filter((l) => l.id !== id) }); },
    toggleAward: (buildingId) => {
      const set = new Set(s.awardIds || []);
      set.has(buildingId) ? set.delete(buildingId) : set.add(buildingId);
      update({ awardIds: [...set] });
    },
    toggleStop: (cid, sid) => {
      const d = new Set(s.doneStops); const k = `${cid}:${sid}`;
      d.has(k) ? d.delete(k) : d.add(k);
      const m = new Set(s.myCourses); m.add(cid);
      update({ doneStops: [...d], myCourses: [...m] });
    },
  };
}

Object.assign(window, { MASIL_KEY, MASIL_DEFAULT, TAG_PUBLIC_MIN, masilRead, masilWrite, useMasilShared });
