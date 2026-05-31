/* ================================================================
   마실맵 모바일 앱 — 셸 (라우터 · 상태영속 · 시트/모달 · Tweaks)
   ================================================================ */

const MX_TWEAKS = /*EDITMODE-BEGIN*/{
  "showStory":     true,
  "createDefault": "map",
  "stampPhoto":    true,
  "homeBadge":     true
}/*EDITMODE-END*/;

function MXApp() {
  const [t, setTweak] = useTweaks(MX_TWEAKS);
  const sh = useMasilShared();
  const raw = sh.s;
  const persist = (next) => sh.update(next);

  const st = {
    currentChannelId: raw.currentChannelId,
    hood: raw.hood,
    followed: new Set(raw.followed),
    myCourses: new Set(raw.myCourses),
    doneStops: new Set(raw.doneStops),
    savedPlaces: raw.savedPlaces || [],
  };

  const [stack, setStack] = React.useState([{ name: "home" }]);
  const [sheet, setSheet] = React.useState(null);   // {name, data}
  const [stamp, setStamp] = React.useState(null);   // {courseId, stop}
  const [toast, setToast] = React.useState(null);
  const toastTimer = React.useRef(null);

  const cur = stack[stack.length - 1];
  const TAB = { home: 1, feed: 1, courses: 1, my: 1 };
  const showTab = !!TAB[cur.name] && !sheet;

  const nav = {
    tab: (id) => { setStack([{ name: id }]); window.__mxScroll && window.__mxScroll(); },
    go: (name, param) => { setStack((s) => [...s, { name, param }]); window.__mxScroll && window.__mxScroll(); },
    back: () => setStack((s) => s.length > 1 ? s.slice(0, -1) : s),
  };

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1900);
  };

  const act = {
    toast: showToast,
    openSheet: (name, data) => setSheet({ name, data }),
    closeSheet: () => setSheet(null),
    openStamp: (courseId, stop) => setStamp({ courseId, stop }),
    closeStamp: () => setStamp(null),
    setHood: (h) => persist({ ...raw, hood: h }),
    addSavedPlaces: (names) => { const sp = new Set(raw.savedPlaces || []); names.forEach((n) => sp.add(n)); persist({ ...raw, savedPlaces: [...sp] }); showToast("가볼 곳에 담았어요"); },
    switchChannel: (id) => { persist({ ...raw, currentChannelId: id }); showToast(`'${mxChannel(id).name}' 채널로 전환`); },
    toggleFollow: (id) => {
      const f = new Set(raw.followed); f.has(id) ? f.delete(id) : f.add(id);
      persist({ ...raw, followed: [...f] });
    },
    followCourse: (id) => { const m = new Set(raw.myCourses); m.add(id); persist({ ...raw, myCourses: [...m] }); },
    toggleStop: (courseId, stopId) => {
      const d = new Set(raw.doneStops); const k = `${courseId}:${stopId}`;
      d.has(k) ? d.delete(k) : d.add(k);
      const m = new Set(raw.myCourses); m.add(courseId);
      persist({ ...raw, doneStops: [...d], myCourses: [...m] });
    },
  };

  const app = { t, nav, st, act };

  // 스크롤 상단 리셋
  const scrollRef = React.useRef(null);
  window.__mxScroll = () => { if (scrollRef.current) scrollRef.current.scrollTop = 0; };
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [stack]);

  let screen;
  switch (cur.name) {
    case "feed":    screen = <MXFeed app={app}/>; break;
    case "courses": screen = <MXExplore app={app}/>; break;
    case "my":      screen = <MXMyPage app={app}/>; break;
    case "course":  screen = <MXCourseDetail app={app} courseId={cur.param}/>; break;
    case "channel": screen = <MXChannelManage app={app} channelId={cur.param}/>; break;
    case "series":  screen = <MXSeriesList app={app}/>; break;
    case "seriesDetail": screen = <MXSeriesDetail app={app} seriesId={cur.param}/>; break;
    case "create":  screen = <MXCreate app={app}/>; break;
    default:        screen = <MXHome app={app}/>;
  }

  const sheetTitle = { channel: "채널 전환", hood: "동네 선택", addStop: "지점 추가" }[sheet?.name];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "30px 12px 60px", minHeight: "100vh", boxSizing: "border-box" }}>
      <IOSDevice width={402} height={860}>
        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", background: "#fff", overflow: "hidden",
          fontFamily: "'Pretendard', system-ui, sans-serif", color: M.ink, wordBreak: "keep-all" }}>
          <div ref={scrollRef} style={{ flex: 1, overflow: "auto", WebkitOverflowScrolling: "touch" }}>{screen}</div>
          {showTab && <MXTabBar tab={cur.name} onTab={nav.tab} onCreate={() => nav.go("create")}/>}

          {/* 시트 */}
          <MXSheet open={!!sheet} onClose={act.closeSheet} title={sheetTitle}>
            {sheet?.name === "channel" && <MXChannelSheet app={app}/>}
            {sheet?.name === "hood" && <MXHoodSheet app={app}/>}
            {sheet?.name === "addStop" && <MXAddStopSheet app={app} data={sheet.data}/>}
          </MXSheet>

          {/* 스탬프 모달 */}
          {stamp && <MXStampModal app={app} data={stamp}/>}

          {/* 토스트 */}
          {toast && (
            <div style={{ position: "absolute", left: 20, right: 20, bottom: showTab ? MX.tabH + MX.bottomClear + 14 : MX.bottomClear + 14, zIndex: 95,
              background: M.terraDeep, color: "#fff", borderRadius: 14, padding: "13px 16px", fontSize: 13.5, fontWeight: 700, textAlign: "center",
              boxShadow: "0 8px 26px rgba(0,0,0,0.3)", animation: "mxUp .24s ease" }}>{toast}</div>
          )}
        </div>
      </IOSDevice>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#9aa0ab", fontWeight: 600, letterSpacing: "0.04em", textAlign: "center" }}>
        masilmap rel3 · 채널 · 코스 · 따라 걷기 — 우측 하단 Tweaks로 패턴 전환
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="코스 · 인증" />
        <TweakToggle label="인문학 이야기 카드" value={t.showStory} onChange={(v) => setTweak("showStory", v)} />
        <TweakToggle label="스탬프에 사진 인증 단계" value={t.stampPhoto} onChange={(v) => setTweak("stampPhoto", v)} />
        <TweakRadio label="코스 만들기 기본 화면" value={t.createDefault} options={[{value:"map",label:"지도"},{value:"list",label:"리스트"}]} onChange={(v) => setTweak("createDefault", v)} />
        <TweakSection label="홈" />
        <TweakToggle label="동네 정복 배너" value={t.homeBadge} onChange={(v) => setTweak("homeBadge", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<MXApp />);
