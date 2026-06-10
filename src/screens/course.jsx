/* ================================================================
   masilmap — 마실 코스 상세 (#2)
   상단 코스 헤더 + 요약 바 + 경로 지도 + 정류장 카드 리스트
   ================================================================ */

/* 코스 인덱스 (전체 코스 그리드 — 사이드 화면) */
function CourseIndex({ onNavigate }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const px = pageX(isMobile, isTablet);
  return (
    <MPage>
      <MasilNav route="course" onNavigate={onNavigate}/>
      <section style={{ padding: `${isMobile ? 24 : 48}px ${px}px ${isMobile ? 20 : 32}px` }}>
        <Hairline label={`MASILMAP / COURSES · ${COURSES.length} KEPT WALKS`} style={{ marginBottom: isMobile ? 18 : 32 }}/>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr",
          gap: isMobile ? 16 : 56,
          alignItems: "end",
        }}>
          <h1 style={{ fontSize: isMobile ? 36 : 72, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.05, color: M.ink, margin: 0, textWrap: "balance" }}>
            오늘 걷기 좋은{isMobile ? " " : <br/>}
            <span style={{ color: M.olive, fontWeight: 900 }}>코스</span> {COURSES.length}가지
          </h1>
          <p style={{ fontFamily: MT.family, fontSize: isMobile ? 14 : 17, lineHeight: 1.7, color: M.ink, margin: 0, textWrap: "pretty" }}>
            마실 코스는 동네 큐레이터와 건축사학자가 직접 걸어보고 묶은 워킹 가이드입니다. 도슨트가 있는 코스는 예약, 셀프 코스는 무료로 따라 걸으실 수 있어요.
          </p>
        </div>
      </section>
      <section style={{
        padding: `0 ${px}px 64px`,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: 20,
      }}>
        {COURSES.map((c) => (
          <div key={c.id} onClick={() => onNavigate("course", c.id)} style={{
            background: M.cream, borderRadius: MR.cardLg, overflow: "hidden",
            cursor: "pointer", boxShadow: MS.card,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}>
            <div style={{
              width: isMobile ? "100%" : 220,
              flexShrink: 0,
              background: c.cover, padding: 20, color: M.cream,
              display: "flex", flexDirection: isMobile ? "row" : "column",
              alignItems: isMobile ? "center" : "stretch",
              justifyContent: "space-between",
            }}>
              <MagCap color="rgba(255,248,236,0.7)">{c.type === "도슨트" ? "DOCENT" : "SELF"}</MagCap>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.9 }}>{c.curator.name} 큐레이션</div>
                <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.025em", marginTop: 4 }}>{c.buildings.length}곳</div>
              </div>
            </div>
            <div style={{ padding: 20, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <MagCap>{c.type === "도슨트" ? "DOCENT" : "SELF"} · ★ {c.rating}</MagCap>
                <MagCap color={c.type === "도슨트" ? M.terra : M.olive}>
                  {c.type === "도슨트" ? "도슨트 신청" : "FREE"}
                </MagCap>
              </div>
              <div style={{ fontSize: 21, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, lineHeight: 1.2 }}>{c.name}</div>
              <p style={{ fontSize: 13, color: M.ink, lineHeight: 1.6, margin: "8px 0 12px", fontWeight: 500, textWrap: "pretty" }}>{c.blurb}</p>
              <div style={{ fontFamily: MT.family, fontSize: 10, color: M.muted, fontWeight: 600, letterSpacing: "0.05em", display: "flex", gap: 10 }}>
                <span>{c.distance}</span><span>·</span><span>{c.duration}</span><span>·</span><span>{c.difficulty}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
      <MFooter/>
    </MPage>
  );
}

/* 코스 경로 지도 (Leaflet + CARTO Positron + 번호 마커 + 점선 폴리라인) */
function CourseRouteMap({ stops, height = 380 }) {
  const ref = React.useRef(null);
  const mapRef = React.useRef(null);
  /* stops 변동에 안전하게 — id 시퀀스로 키 의존 */
  const stopsKey = stops.map((s) => s && s.id).join("|");

  React.useEffect(() => {
    if (!window.L || !ref.current || mapRef.current) return;
    const pts = stops.filter((s) => s && s.latlng).map((s) => s.latlng);
    if (pts.length === 0) return;
    const map = window.L.map(ref.current, {
      center: pts[0], zoom: 14,
      minZoom: 10, maxZoom: 18,
      zoomControl: false, attributionControl: false,
      scrollWheelZoom: false,
    });
    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd", maxZoom: 19,
      attribution: "&copy; OpenStreetMap &copy; CARTO",
    }).addTo(map);
    window.L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

    /* 점선 경로 */
    if (pts.length >= 2) {
      window.L.polyline(pts, {
        color: M.terra, weight: 3.5, opacity: 0.95,
        dashArray: "4 10", lineCap: "round", lineJoin: "round",
      }).addTo(map);
    }

    /* 번호 마커 (START·번호·END) */
    stops.forEach((s, i) => {
      if (!s || !s.latlng) return;
      const isFirst = i === 0;
      const isLast  = i === stops.length - 1;
      const ringColor = isFirst ? M.olive : isLast ? M.ink : M.terra;
      const label = isFirst ? "S" : isLast ? "E" : String(i + 1);
      const icon = window.L.divIcon({
        className: "mk-pin",
        iconSize: [36, 36], iconAnchor: [18, 18],
        html:
          `<div style="width:36px;height:36px;border-radius:50%;background:` + M.cream + `;` +
            `border:2.5px solid ` + ringColor + `;display:flex;align-items:center;justify-content:center;` +
            `font-family:` + MT.family + `;font-size:14px;font-weight:900;color:` + ringColor + `;` +
            `box-shadow:0 4px 12px rgba(31,39,56,0.18);">` + label + `</div>`,
      });
      window.L.marker(s.latlng, { icon }).bindTooltip(s.name, { direction: "top", offset: [0, -18] }).addTo(map);
    });

    /* 모든 정류장 보이도록 fitBounds (10% 패딩) */
    if (pts.length >= 2) {
      map.fitBounds(window.L.latLngBounds(pts), { padding: [40, 40], maxZoom: 15 });
    }

    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 60);
    return () => { map.remove(); mapRef.current = null; };
  }, [stopsKey]);

  return (
    <div style={{ position: "relative", width: "100%", height, background: M.cream, borderRadius: MR.cardLg, overflow: "hidden" }}>
      <div ref={ref} style={{ position: "absolute", inset: 0 }}/>
      {/* HUD */}
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 500, background: "rgba(255,255,255,0.94)", padding: "8px 14px", borderRadius: 12, boxShadow: MS.cardSm, display: "flex", alignItems: "center", gap: 10, pointerEvents: "none" }}>
        <MIcon name="walk" size={14} color={M.terra}/>
        <MagCap>코스 경로</MagCap>
      </div>
    </div>
  );
}

/* 정류장 카드 */
function StopCard({ stop, idx, total, onClick, nextDist }) {
  return (
    <div style={{ display: "flex", gap: 16, padding: "20px 0", borderTop: idx === 0 ? `1px solid ${M.beigeAlt}` : "none", borderBottom: `1px solid ${M.beigeAlt}`, cursor: "pointer" }} onClick={onClick}>
      <div style={{ width: 48, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: 999, background: M.terra, color: M.cream, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18 }}>
          {idx + 1}
        </div>
        {idx < total - 1 && (
          <div style={{ width: 2, flex: 1, background: M.beigeAlt, marginTop: 8 }}/>
        )}
      </div>
      <div style={{ width: 140, flexShrink: 0 }}>
        <ImgPlaceholder ratio="4/3" tone={stop.pinTone === "olive" ? "olive" : "beige"} style={{ borderRadius: 14 }}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <MagCap>{stop.type}</MagCap>
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink }}>{stop.name}</div>
        <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 4 }}>{stop.architect} · {stop.year} · {stop.region}</div>
        <p style={{ fontSize: 13, color: M.ink, lineHeight: 1.6, margin: "8px 0 0", fontWeight: 500, textWrap: "pretty" }}>{stop.intro}</p>
        <div style={{ display: "flex", gap: 14, marginTop: 10, fontFamily: MT.family, fontSize: 10, fontWeight: 600, color: M.muted }}>
          <span>머무는 시간 · {idx === 0 ? "60분" : idx === total - 1 ? "70분" : "40분"}</span>
          {idx < total - 1 && <><span>·</span><span>다음까지 · {nextDist}</span></>}
        </div>
      </div>
      <MIcon name="chevron" size={20} color={M.muted}/>
    </div>
  );
}

function CourseScreen({ onNavigate, courseId }) {
  const c = COURSES.find((x) => x.id === courseId) || COURSES[0];
  const stops = c.buildings.map((id) => BUILDINGS.find((b) => b.id === id)).filter(Boolean);
  const distGuess = ["1.4km", "0.9km", "1.6km", "0.7km"];

  return (
    <MPage>
      <MasilNav route="course" onNavigate={onNavigate}/>

      {/* 코스 헤더 */}
      <section style={{ padding: "32px 56px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 20 }}>
          <span onClick={() => onNavigate("course")} style={{ cursor: "pointer" }}>마실 코스</span>
          <MIcon name="chevron" size={12} color={M.muted}/>
          <span style={{ color: M.ink }}>{c.name}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 56, alignItems: "end" }}>
          <div>
            <Serial color={M.terra} size={14}>{c.type === "도슨트" ? "도슨트 코스" : "셀프 코스"}</Serial>
            <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.02, margin: "14px 0 0", color: M.ink, textWrap: "balance" }}>
              {c.name}
            </h1>
            <p style={{ fontFamily: MT.family, fontSize: 19, lineHeight: 1.65, color: M.muted, marginTop: 20, marginBottom: 0, fontWeight: 400, maxWidth: 680, textWrap: "pretty" }}>{c.blurb}</p>
          </div>
          <div>
            {/* curator */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <MAvatar initial={c.curator.initial} color={c.curator.color} size={48}/>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: M.ink }}>{c.curator.name}</div>
                  {c.curator.verified && (
                    <span style={{ fontSize: 9, fontWeight: 800, color: M.cream, background: M.olive, padding: "2px 6px", borderRadius: 999 }}>인증</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 2 }}>{c.curator.role}</div>
              </div>
            </div>
            {/* rating */}
            <div style={{ display: "flex", gap: 32, paddingTop: 14, borderTop: `1px solid ${M.beigeAlt}` }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>★ {c.rating}</div>
                <MagCap style={{ marginTop: 4 }}>{c.reviews}개 리뷰</MagCap>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>{c.visited.toLocaleString()}</div>
                <MagCap style={{ marginTop: 4 }}>다녀온 이웃</MagCap>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>♡ {c.saved}</div>
                <MagCap style={{ marginTop: 4 }}>저장</MagCap>
              </div>
            </div>
          </div>
        </div>

        {/* 요약 바 */}
        <div style={{ marginTop: 32, padding: "20px 24px", background: M.cream, borderRadius: MR.card, boxShadow: MS.cardSm, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24, alignItems: "center" }}>
          {[
            { l: "공간", v: `${stops.length}곳`, i: "location" },
            { l: "총 거리", v: c.distance, i: "walk" },
            { l: "예상 시간", v: c.duration, i: "clock" },
            { l: "고도차", v: c.elevation, i: "arrow" },
            { l: "난이도", v: c.difficulty, i: "sparkle" },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, borderLeft: i === 0 ? "none" : `1px solid ${M.beigeAlt}`, paddingLeft: i === 0 ? 0 : 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: `${M.terra}1f`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MIcon name={m.i} size={16} color={M.terra}/>
              </div>
              <div>
                <MagCap>{m.l}</MagCap>
                <div style={{ fontSize: 16, fontWeight: 900, color: M.ink, marginTop: 2, letterSpacing: "-0.01em" }}>{m.v}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 지도 */}
      <section style={{ padding: "16px 56px 32px" }}>
        <Hairline label="ROUTE · 점선 경로" style={{ marginBottom: 16 }}/>
        <CourseRouteMap stops={stops}/>
        <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 11, color: M.muted, fontWeight: 600 }}>
          <span>CARTO Positron · 외부 길안내는 네이버·카카오·구글 지도</span>
          <span>↑ 실 좌표 기반</span>
        </div>
      </section>

      {/* 정류장 리스트 */}
      <section style={{ padding: "16px 56px 48px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 56 }}>
        <div>
          <Hairline label={`${stops.length} STOPS · 순서대로`} style={{ marginBottom: 8 }}/>
          {stops.map((s, i) => (
            <StopCard key={s.id} stop={s} idx={i} total={stops.length} nextDist={distGuess[i]} onClick={() => onNavigate("detail", s.id)}/>
          ))}
        </div>
        <aside style={{ position: "sticky", top: 110, alignSelf: "flex-start" }}>
          <div style={{ padding: 24, background: M.cream, borderRadius: MR.cardLg, boxShadow: MS.card }}>
            <MagCap color={M.terra}>{c.type === "도슨트" ? "DOCENT COURSE" : "SELF COURSE"}</MagCap>
            <div style={{ marginTop: 8, fontSize: 36, fontWeight: 900, letterSpacing: "-0.025em", color: c.type === "도슨트" ? M.terra : M.olive }}>
              {c.type === "도슨트" ? "무료 신청" : "무료"}
            </div>
            <div style={{ fontSize: 12, color: M.muted, fontWeight: 600 }}>{c.type === "도슨트" ? "도슨트 코스 · 신청 후 확정" : "셀프 코스 · 자유롭게 걷기"}</div>
            <Hairline style={{ margin: "16px 0" }}/>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: M.muted, fontWeight: 700 }}>집합</span>
                <span style={{ color: M.ink, fontWeight: 700 }}>{c.meetingPoint}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: M.muted, fontWeight: 700 }}>일정</span>
                <span style={{ color: M.ink, fontWeight: 700, textAlign: "right" }}>{c.schedule.join(" · ")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: M.muted, fontWeight: 700 }}>도슨트</span>
                <span style={{ color: M.ink, fontWeight: 700 }}>{c.hasDocent ? "있음 (한국어)" : "없음"}</span>
              </div>
            </div>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {c.type === "도슨트"
                ? <MButton kind="primary" size="lg" onClick={() => onNavigate("booking-docent", c.id)}>도슨트 신청하기 →</MButton>
                : <MButton kind="primary" size="lg">코스 시작하기 →</MButton>}
              <MButton kind="secondary" size="md" icon={<MIcon name="bookmark" size={14} color={M.ink}/>}>저장</MButton>
            </div>
          </div>

          {/* 외부 공간 추천 */}
          {EXTERNAL_SPACES.filter((s) => stops.find((b) => b.id === s.building)).slice(0, 2).map((s) => (
            <div key={s.id} onClick={() => onNavigate("booking-external", s.id)} style={{ marginTop: 16, padding: 16, background: M.beigeAlt, borderRadius: MR.card, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <MagCap>{s.typeIcon} {s.type.toUpperCase()}</MagCap>
                <MagCap color={M.terra}>외부 예약 →</MagCap>
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: M.ink, letterSpacing: "-0.015em" }}>{s.name}</div>
              <div style={{ fontSize: 12, color: M.muted, marginTop: 4, fontWeight: 500, textWrap: "pretty" }}>{s.summary}</div>
            </div>
          ))}
        </aside>
      </section>

      <MFooter/>
    </MPage>
  );
}

Object.assign(window, { CourseScreen, CourseIndex });
