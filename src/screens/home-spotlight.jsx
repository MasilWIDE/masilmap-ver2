/* ================================================================
   masilmap · 메인 페이지 — 임팩트 변형 2종
   - SpotlightHome : 시네마틱 풀블리드 히어로 (이번 주 한 곳을 크게)
   - MosaicHome    : 건축 사진 모자이크 월 (한눈에 526곳의 밀도)
   기존 brand/shared/data 컴포넌트만 사용. BUILDINGS의 palette/데이터 재사용.
   ================================================================ */

/* 결정적 픽 (요일 기반 회전 없이 고정 — 이번 주의 건축) */
function mkFeatured(n = 6) {
  const ids = ["leeum", "ddp", "jongmyo", "museumsan", "soeul", "bonte", "amorepacific", "seonyudo"];
  const list = ids.map((id) => (window.BUILDINGS || []).find((b) => b.id === id)).filter(Boolean);
  return list.slice(0, n);
}
function palToneStyle(b) {
  const pal = b.palette || "#333D51";
  return `linear-gradient(135deg, ${pal} 0%, ${pal}cc 55%, ${pal}88 100%)`;
}

/* ---------------------------------------------------------------
   SPOTLIGHT — 시네마틱 히어로
   큰 풀블리드 이미지 + 어둠 그라데이션 + 큰 세리프 헤드라인 +
   하단 가로 픽 레일. "잡지 표지를 영화 포스터처럼".
--------------------------------------------------------------- */
function SpotlightHome({ onNavigate }) {
  const picks = mkFeatured(6);
  const [idx, setIdx] = React.useState(0);
  const hero = picks[idx] || picks[0];
  const isMobile = useIsMobile();

  return (
    <div style={{ background: M.ink, color: M.cream }}>
      {/* HERO */}
      <section style={{ position: "relative", height: isMobile ? "78vh" : "84vh", minHeight: isMobile ? 480 : 620, overflow: "hidden" }}>
        {/* 배경 이미지 (palette 기반) */}
        <div style={{ position: "absolute", inset: 0, background: palToneStyle(hero), transition: "background .5s" }}/>
        <div style={{ position: "absolute", inset: 0,
          background: `repeating-linear-gradient(48deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 26px)` }}/>
        {/* 어둠 그라데이션 */}
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(15,18,28,0.55) 0%, rgba(15,18,28,0.15) 35%, rgba(15,18,28,0.35) 62%, rgba(15,18,28,0.94) 100%)" }}/>

        {/* 상단 메타 */}
        <div style={{ position: "absolute", top: isMobile ? 20 : 34, left: isMobile ? 20 : 56, right: isMobile ? 20 : 56,
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: M.olive }}>
            마실맵 · ISSUE 07 · 2026 SPRING
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(244,243,234,0.7)" }}>
            {String(idx + 1).padStart(2, "0")} / {String(picks.length).padStart(2, "0")}
          </span>
        </div>

        {/* 본문 카피 */}
        <div style={{ position: "absolute", left: isMobile ? 20 : 56, right: isMobile ? 20 : 56, bottom: isMobile ? 132 : 168, maxWidth: 980 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ width: 30, height: 2, background: M.olive }}/>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: M.olive }}>이번 주의 건축 · #{hero.no}</span>
          </div>
          <h1 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 44 : 96, fontWeight: 900,
            letterSpacing: "-0.035em", lineHeight: 0.98, margin: 0, color: "#fff", textWrap: "balance",
            textShadow: "0 4px 40px rgba(0,0,0,0.4)" }}>
            {hero.name}
          </h1>
          <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 16 : 21, fontStyle: "italic",
            color: "rgba(244,243,234,0.85)", margin: "16px 0 0", maxWidth: 640, lineHeight: 1.6, textWrap: "pretty" }}>
            {hero.intro}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28, alignItems: "center" }}>
            <button onClick={() => onNavigate("detail", hero.id)} style={{
              padding: "14px 26px", borderRadius: 999, border: "none", cursor: "pointer",
              background: M.olive, color: M.ink, fontSize: 15, fontWeight: 800, fontFamily: MT.family,
              display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 10px 30px rgba(211,172,43,0.35)" }}>
              이 건축 보러 가기 <MIcon name="arrow" size={17} color={M.ink}/>
            </button>
            <button onClick={() => onNavigate("home", null, { homeLayout: "mapPrimary" })} style={{
              padding: "14px 24px", borderRadius: 999, cursor: "pointer",
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff",
              fontSize: 15, fontWeight: 800, fontFamily: MT.family, backdropFilter: "blur(6px)",
              display: "inline-flex", alignItems: "center", gap: 8 }}>
              <MIcon name="map" size={17} color="#fff"/> 지도에서 둘러보기
            </button>
          </div>
        </div>

        {/* 하단 픽 레일 */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: isMobile ? "0 20px 20px" : "0 56px 24px" }}>
          <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
            {picks.map((p, i) => (
              <button key={p.id} onClick={() => setIdx(i)} style={{
                flexShrink: 0, width: i === idx ? 132 : 96, height: 64, borderRadius: 12, cursor: "pointer", position: "relative",
                border: i === idx ? `2px solid ${M.olive}` : "2px solid rgba(255,255,255,0.25)",
                background: palToneStyle(p), overflow: "hidden", transition: "width .25s", padding: 0 }}>
                <span style={{ position: "absolute", left: 8, bottom: 6, fontSize: 10, fontWeight: 800, color: "#fff",
                  textShadow: "0 1px 4px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 스탯 밴드 */}
      <section style={{ background: M.ink, borderTop: "1px solid rgba(255,255,255,0.1)", padding: isMobile ? "28px 20px" : "40px 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 20 : 0 }}>
          {[["526", "PLACES · 건축물"], ["47", "COURSES · 코스"], ["18", "COLLECTIONS · 컬렉션"], ["12", "EDITORS · 에디터"]].map(([n, l], i) => (
            <div key={i} style={{ borderLeft: (!isMobile && i > 0) ? "1px solid rgba(255,255,255,0.12)" : "none", paddingLeft: (!isMobile && i > 0) ? 32 : 0 }}>
              <div style={{ fontSize: isMobile ? 40 : 56, fontWeight: 900, letterSpacing: "-0.04em", color: M.olive, lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(244,243,234,0.6)", marginTop: 8 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <SpotlightCollections onNavigate={onNavigate} isMobile={isMobile}/>
    </div>
  );
}

/* 컬렉션 띠 (다크 톤) */
function SpotlightCollections({ onNavigate, isMobile }) {
  const cols = (window.COLLECTIONS || []).slice(0, 3);
  return (
    <section style={{ background: M.cream, color: M.ink, padding: isMobile ? "40px 20px" : "64px 56px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
        <h2 style={{ fontSize: isMobile ? 26 : 38, fontWeight: 900, letterSpacing: "-0.03em", margin: 0, color: M.ink }}>이번 호 컬렉션</h2>
        <span onClick={() => onNavigate("collection")} style={{ fontSize: 13, fontWeight: 800, color: M.terra, cursor: "pointer" }}>전체 보기 →</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
        {cols.map((c) => (
          <div key={c.id} onClick={() => onNavigate("collection", c.id)} style={{ cursor: "pointer" }}>
            <div style={{ aspectRatio: "4/3", borderRadius: MR.cardLg, background: c.cover, position: "relative", overflow: "hidden", boxShadow: MS.card }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,18,28,0.6), transparent 55%)" }}/>
              <div style={{ position: "absolute", left: 16, bottom: 14, right: 16 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.8)" }}>{c.no}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginTop: 3 }}>{c.title}</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: M.muted, fontWeight: 500, lineHeight: 1.55, marginTop: 12, textWrap: "pretty" }}>{c.blurb}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { mkFeatured, palToneStyle, SpotlightHome, SpotlightCollections });
