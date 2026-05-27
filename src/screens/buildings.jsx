/* ================================================================
   masilmap — 건축물 인덱스 (BuildingsIndexScreen)
   상단 EDITOR'S PICKS 3개 고정 + 하단 masilground 톤 3-col 그리드
   ================================================================ */

/* ---------- Featured 카드 (Editor's Picks용) ---------- */
function FeaturedCard({ b, onClick, variant = "large" }) {
  const accent = b.pinTone === "olive" ? M.olive : M.terra;
  const sizes = {
    large:  { aspect: "16/10", titleSize: 32, padding: 28 },
    medium: { aspect: "16/9",  titleSize: 22, padding: 22 },
  }[variant];

  return (
    <div onClick={onClick} style={{
      position: "relative", height: "100%",
      borderRadius: MR.cardLg, overflow: "hidden",
      boxShadow: MS.card, cursor: "pointer",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ position: "relative", aspectRatio: sizes.aspect, overflow: "hidden" }}>
        <ImgPlaceholder
          ratio={sizes.aspect}
          tone={b.pinTone === "olive" ? "olive" : "beige"}
          caption={`${b.name} · 큐레이터 노트`}
          style={{ borderRadius: 0, height: "100%" }}
        />
        <div style={{
          position: "absolute", top: 14, left: 14, display: "flex", gap: 6,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
            color: M.cream, background: `${M.ink}cc`,
            padding: "5px 10px", borderRadius: 6,
          }}>EDITOR'S PICK</span>
        </div>
      </div>

      <div style={{
        padding: sizes.padding,
        background: M.cream, flex: 1,
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <Serial color={accent}>#{b.no}</Serial>
          <MagCap>{b.region} · {b.style}</MagCap>
        </div>
        <div style={{
          fontSize: sizes.titleSize, fontWeight: 900,
          letterSpacing: "-0.025em", lineHeight: 1.15, color: M.ink,
        }}>{b.name}</div>
        <div style={{ fontSize: 12, color: M.muted, fontWeight: 600 }}>
          {b.architect} · {b.year} · {b.type}
        </div>
        {variant === "large" && (
          <p style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: 15, lineHeight: 1.7, color: M.ink,
            margin: "8px 0 0", fontWeight: 400,
            display: "-webkit-box", WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3, overflow: "hidden",
          }}>{b.intro}</p>
        )}
      </div>
    </div>
  );
}

/* ---------- masilground 톤 그리드 카드 ---------- */
function GridCard({ b, onClick }) {
  const accent = b.pinTone === "olive" ? M.olive : M.terra;
  return (
    <div onClick={onClick} style={{ cursor: "pointer" }}>
      <ImgPlaceholder
        ratio="4/3"
        tone={b.pinTone === "olive" ? "olive" : "beige"}
        caption={`${b.name} 외관`}
        style={{ borderRadius: MR.card, marginBottom: 14 }}
      />
      <div style={{ padding: "0 2px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <Serial size={11} color={accent}>#{b.no}</Serial>
          <MagCap style={{ fontSize: 10 }}>{b.region}</MagCap>
        </div>
        <div style={{
          fontSize: 18, fontWeight: 800, letterSpacing: "-0.015em",
          color: M.ink, lineHeight: 1.25, marginBottom: 4,
        }}>
          {b.name} <span style={{ color: M.muted, fontWeight: 500 }}>/ {b.architect}</span>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: M.muted,
        }}>
          {b.style} · {b.year}
        </div>
      </div>
    </div>
  );
}

/* ---------- 인덱스 화면 ---------- */
function BuildingsIndexScreen({ onNavigate }) {
  const [activeType, setActiveType] = React.useState("all");
  const [activeRegion, setActiveRegion] = React.useState("all");

  // 상단 Editor's Picks 3개 — 컬렉션의 다양성을 보여주도록 typeKey가 다른 것들 우선
  const picks = (() => {
    const used = new Set();
    const pickIds = ["kongkan", "buseoksa", "bonte"]; // 모더니즘 / 한옥 / 콘크리트 미술관
    const found = pickIds.map((id) => BUILDINGS.find((b) => b.id === id)).filter(Boolean);
    return found.length === 3 ? found : BUILDINGS.slice(0, 3);
  })();

  const filtered = BUILDINGS.filter((b) => {
    if (activeType !== "all" && b.typeKey !== activeType) return false;
    return true;
  });

  return (
    <MPage>
      <MasilNav route="buildings" onNavigate={onNavigate}/>

      {/* HERO 헤더 */}
      <section style={{ padding: "40px 56px 24px" }}>
        <Hairline label="ALL BUILDINGS · 526 PLACES" style={{ marginBottom: 24 }}/>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "end" }}>
          <h1 style={{
            fontSize: 64, fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.02, color: M.ink, margin: 0,
            textWrap: "balance",
          }}>
            한국에 지어진<br/>
            <span style={{ color: M.terra, fontFamily: "'Noto Serif KR', serif", fontStyle: "italic", fontWeight: 700 }}>모든 건축</span>의 인덱스.
          </h1>
          <p style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: 17, lineHeight: 1.75,
            color: M.ink, fontWeight: 400, margin: 0,
            maxWidth: 460,
            textWrap: "pretty",
          }}>
            천 년 된 목조 건축부터 어제 완공된 미술관까지 — 526곳을 카테고리·지역·시대로 펼쳐 두었습니다.
            매월 에디터가 새 픽을 고릅니다.
          </p>
        </div>
      </section>

      {/* EDITOR'S PICKS — ArchDaily 톤 */}
      <section style={{ padding: "32px 56px 56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <div>
            <MagCap color={M.terra} style={{ marginBottom: 6 }}>EDITOR'S PICKS · 2026 SPRING</MagCap>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em", margin: 0, color: M.ink }}>
              이번 호의 세 건축
            </h2>
          </div>
          <span style={{ fontSize: 13, color: M.terra, fontWeight: 800, cursor: "pointer" }}
            onClick={() => onNavigate("collection")}>
            큐레이션 컬렉션 전체 보기 →
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 20,
        }}>
          {/* Large featured (left) */}
          <FeaturedCard b={picks[0]} onClick={() => onNavigate("detail", picks[0].id)} variant="large"/>

          {/* Two stacked medium (right) */}
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 20 }}>
            <FeaturedCard b={picks[1]} onClick={() => onNavigate("detail", picks[1].id)} variant="medium"/>
            <FeaturedCard b={picks[2]} onClick={() => onNavigate("detail", picks[2].id)} variant="medium"/>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ padding: "0 56px" }}>
        <Hairline label={`ALL · ${filtered.length} / ${BUILDINGS.length} PLACES`} />
      </div>

      {/* TYPE / REGION 필터 */}
      <section style={{ padding: "24px 0 8px" }}>
        <div style={{ display: "flex", gap: 24, alignItems: "center", padding: "0 56px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <MagCap style={{ marginRight: 6 }}>TYPE</MagCap>
            {TYPES.map((t) => {
              const on = t.id === activeType;
              return (
                <span key={t.id} onClick={() => setActiveType(t.id)} style={{
                  padding: "8px 14px", borderRadius: 999,
                  fontSize: 12, fontWeight: 700,
                  background: on ? M.ink : "transparent",
                  color: on ? M.cream : M.ink,
                  border: on ? "none" : `1px solid ${M.beigeAlt}`,
                  cursor: "pointer", whiteSpace: "nowrap",
                  transition: "all .15s",
                }}>
                  {t.name}
                  <span style={{ marginLeft: 6, opacity: 0.5, fontSize: 11 }}>{t.count}</span>
                </span>
              );
            })}
          </div>
          <div style={{ width: 1, height: 28, background: M.beigeAlt }}/>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <MagCap style={{ marginRight: 6 }}>REGION</MagCap>
            {[{id:"all", name:"전국"}, ...REGIONS].map((r) => {
              const on = r.id === activeRegion;
              return (
                <span key={r.id} onClick={() => setActiveRegion(r.id)} style={{
                  padding: "8px 14px", borderRadius: 999,
                  fontSize: 12, fontWeight: 700,
                  background: on ? `${M.terra}1f` : "transparent",
                  color: on ? M.terra : M.ink,
                  border: on ? `1px solid ${M.terra}40` : `1px solid ${M.beigeAlt}`,
                  cursor: "pointer", whiteSpace: "nowrap",
                }}>{r.name}</span>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3-COL 그리드 (masilground 톤) */}
      <section style={{ padding: "32px 56px 64px" }}>
        {filtered.length === 0 ? (
          <div style={{
            padding: "80px 0", textAlign: "center",
            color: M.muted, fontWeight: 600,
          }}>
            선택한 필터에 해당하는 건축물이 없습니다.
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "44px 32px",
          }}>
            {filtered.map((b) => (
              <GridCard key={b.id} b={b} onClick={() => onNavigate("detail", b.id)} />
            ))}
          </div>
        )}

        {/* 페이지네이션 (마실그라운드 톤) */}
        {filtered.length > 0 && (
          <div style={{
            marginTop: 64, padding: "20px 0",
            borderTop: `1px solid ${M.beigeAlt}`,
            display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
            fontSize: 13, fontWeight: 700, color: M.ink,
          }}>
            <span style={{ padding: "6px 10px", color: M.muted, cursor: "not-allowed" }}>← PREV</span>
            <span style={{ padding: "6px 12px", borderRadius: 6, background: M.terra, color: M.cream }}>1</span>
            <span style={{ padding: "6px 12px", cursor: "pointer" }}>2</span>
            <span style={{ padding: "6px 12px", cursor: "pointer" }}>3</span>
            <span style={{ padding: "6px 12px", cursor: "pointer" }}>4</span>
            <span style={{ padding: "6px 4px", color: M.muted }}>…</span>
            <span style={{ padding: "6px 12px", cursor: "pointer" }}>59</span>
            <span style={{ padding: "6px 10px", color: M.ink, cursor: "pointer" }}>NEXT →</span>
          </div>
        )}
      </section>

      <MFooter />
    </MPage>
  );
}

Object.assign(window, { BuildingsIndexScreen, FeaturedCard, GridCard });
