/* ================================================================
   masilmap · 메인 페이지 — 모자이크 월
   건축 사진을 비대칭 그리드로 꽉 채운 한 장. "526곳의 밀도"를
   첫 화면에서 느끼게. 상단 매스트헤드 + 검색, 아래 모자이크.
   ================================================================ */
function MosaicHome({ onNavigate }) {
  const isMobile = useIsMobile();
  const all = (window.BUILDINGS || []);
  // 비대칭 스팬 패턴 (col span, row span) — 데스크탑 6열 그리드
  const pattern = [
    [3, 2], [3, 2],
    [2, 1], [2, 1], [2, 1],
    [2, 2], [2, 1], [2, 1],
    [2, 1], [4, 1],
    [3, 2], [3, 2],
  ];
  const tiles = all.slice(0, pattern.length);

  return (
    <div style={{ background: M.ink }}>
      {/* 매스트헤드 */}
      <section style={{ background: M.ink, color: M.cream, padding: isMobile ? "32px 20px 28px" : "56px 56px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <span style={{ width: 30, height: 2, background: M.olive }}/>
          <span style={{ fontFamily: MT.family, fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", color: M.olive }}>
            526 PLACES · 47 COURSES · ONE MAP
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", gap: isMobile ? 24 : 56, alignItems: "end" }}>
          <h1 style={{ fontFamily: MT.family, fontSize: isMobile ? 44 : 84, fontWeight: 900,
            letterSpacing: "-0.04em", lineHeight: 0.98, margin: 0, color: "#fff", textWrap: "balance" }}>
            한국 건축,<br/><span style={{ color: M.olive }}>걷는 지도.</span>
          </h1>
          <div>
            <p style={{ fontFamily: MT.family, fontSize: isMobile ? 15 : 18, lineHeight: 1.7,
              color: "rgba(244,243,234,0.82)", margin: "0 0 20px", textWrap: "pretty" }}>
              천 년 된 목조 건축부터 어제 완공된 미술관까지. 526곳을 지도 위에 함께 펼쳐 두었습니다.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => onNavigate("home", null, { homeLayout: "mapPrimary" })} style={{
                padding: "13px 22px", borderRadius: 999, border: "none", cursor: "pointer", background: M.olive, color: M.ink,
                fontSize: 14.5, fontWeight: 800, fontFamily: MT.family, display: "inline-flex", alignItems: "center", gap: 7 }}>
                <MIcon name="map" size={16} color={M.ink}/> 지도 열기
              </button>
              <button onClick={() => onNavigate("buildings")} style={{
                padding: "13px 22px", borderRadius: 999, cursor: "pointer", background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 14.5, fontWeight: 800, fontFamily: MT.family }}>
                공간 탐험
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 모자이크 그리드 */}
      <section style={{ padding: isMobile ? "0 12px 12px" : "0 16px 16px", background: M.ink }}>
        <div style={{ display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(6, 1fr)",
          gridAutoRows: isMobile ? "120px" : "150px", gap: isMobile ? 8 : 10 }}>
          {tiles.map((b, i) => {
            const [cs, rs] = pattern[i] || [2, 1];
            return (
              <div key={b.id} onClick={() => onNavigate("detail", b.id)} style={{
                gridColumn: isMobile ? "span 1" : `span ${cs}`,
                gridRow: isMobile ? "span 1" : `span ${rs}`,
                position: "relative", borderRadius: 14, overflow: "hidden", cursor: "pointer",
                background: palToneStyle(b) }}>
                <div style={{ position: "absolute", inset: 0,
                  background: "repeating-linear-gradient(48deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 22px)" }}/>
                <div style={{ position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(15,18,28,0.78) 0%, rgba(15,18,28,0.05) 55%)" }}/>
                <div style={{ position: "absolute", left: 14, right: 14, bottom: 12 }}>
                  <div style={{ fontFamily: MT.family, fontSize: 9.5, fontWeight: 700,
                    letterSpacing: "0.1em", color: M.olive, marginBottom: 3 }}>{b.region}</div>
                  <div style={{ fontSize: (cs >= 3 ? 20 : 15), fontWeight: 900, color: "#fff", letterSpacing: "-0.02em",
                    lineHeight: 1.15, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>{b.name}</div>
                  {cs >= 3 && (
                    <div style={{ fontSize: 12, color: "rgba(244,243,234,0.8)", fontWeight: 600, marginTop: 4 }}>{b.architect} · {b.year}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", padding: isMobile ? "20px 0 8px" : "28px 0 12px" }}>
          <button onClick={() => onNavigate("buildings")} style={{
            padding: "13px 28px", borderRadius: 999, cursor: "pointer", background: "transparent",
            border: `1.5px solid ${M.olive}`, color: M.olive, fontSize: 14, fontWeight: 800, fontFamily: MT.family,
            display: "inline-flex", alignItems: "center", gap: 7 }}>
            526곳 전체 보기 <MIcon name="arrow" size={16} color={M.olive}/>
          </button>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { MosaicHome });
