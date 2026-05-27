/* ================================================================
   masilmap — 건축물 인덱스 (BuildingsIndexScreen)
   상단 EDITOR'S PICKS 3개 고정 + 하단 masilground 톤 3-col 그리드
   ================================================================ */

/* ---------- Featured 카드 (Editor's Picks용) ---------- */
function FeaturedCard({ b, onClick, variant = "compact" }) {
  const accent = b.pinTone === "olive" ? M.olive : M.terra;
  const sizes = {
    large:   { aspect: "16/10", titleSize: 32, padding: 28, showIntro: true },
    medium:  { aspect: "16/9",  titleSize: 22, padding: 22, showIntro: false },
    compact: { aspect: "4/3",   titleSize: 20, padding: 18, showIntro: false },
  }[variant];

  return (
    <div onClick={onClick} style={{
      position: "relative", height: "100%",
      borderRadius: MR.card, overflow: "hidden",
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
          position: "absolute", top: 12, left: 12, display: "flex", gap: 6,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
            color: M.cream, background: `${M.ink}cc`,
            padding: "4px 9px", borderRadius: 6,
          }}>EDITOR'S PICK</span>
        </div>
      </div>

      <div style={{
        padding: sizes.padding,
        background: M.cream, flex: 1,
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <Serial color={accent}>#{b.no}</Serial>
          <MagCap style={{ fontSize: 10 }}>{b.region} · {b.style}</MagCap>
        </div>
        <div style={{
          fontSize: sizes.titleSize, fontWeight: 900,
          letterSpacing: "-0.02em", lineHeight: 1.2, color: M.ink,
        }}>{b.name}</div>
        <div style={{ fontSize: 11, color: M.muted, fontWeight: 600 }}>
          {b.architect} · {b.year}
        </div>
        {sizes.showIntro && (
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
const ITEMS_PER_PAGE = 20;

function BuildingsIndexScreen({ onNavigate }) {
  const [activeType, setActiveType]     = React.useState("all");
  const [activeRegion, setActiveRegion] = React.useState("all");
  const [page, setPage]                 = React.useState(1);

  // 필터 변경 시 페이지 리셋
  const changeType   = (t) => { setActiveType(t);   setPage(1); };
  const changeRegion = (r) => { setActiveRegion(r); setPage(1); };

  // 상단 Editor's Picks 3개 — typeKey 다양성 (모더니즘 / 한옥 / 콘크리트 미술관)
  const picks = (() => {
    const pickIds = ["kongkan", "buseoksa", "bonte"];
    const found = pickIds.map((id) => BUILDINGS.find((b) => b.id === id)).filter(Boolean);
    return found.length === 3 ? found : BUILDINGS.slice(0, 3);
  })();

  const filtered = BUILDINGS.filter((b) => {
    if (activeType !== "all" && b.typeKey !== activeType) return false;
    return true;
  });

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const showPicks  = safePage === 1;

  return (
    <MPage>
      <MasilNav route="buildings" onNavigate={onNavigate}/>

      {/* HERO 헤더 — 컴팩트 */}
      <section style={{ padding: "24px 56px 12px" }}>
        <Hairline label="ALL BUILDINGS · 526 PLACES" style={{ marginBottom: 16 }}/>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <h1 style={{
            fontSize: 44, fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.05, color: M.ink, margin: 0,
            textWrap: "balance",
          }}>
            한국에 지어진{" "}
            <span style={{ color: M.terra, fontFamily: "'Noto Serif KR', serif", fontStyle: "italic", fontWeight: 700 }}>모든 건축</span>의 인덱스.
          </h1>
          <p style={{
            fontSize: 13, lineHeight: 1.6,
            color: M.muted, fontWeight: 500, margin: 0,
            maxWidth: 340, textWrap: "pretty",
          }}>
            526곳을 카테고리·지역·시대로 펼쳐 두었습니다. 매월 에디터가 새 픽을 고릅니다.
          </p>
        </div>
      </section>

      {/* EDITOR'S PICKS — 1페이지에만 노출 */}
      {showPicks && (
        <section style={{ padding: "16px 56px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <MagCap color={M.terra}>EDITOR'S PICKS · 2026 SPRING</MagCap>
              <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em", margin: 0, color: M.ink }}>
                이번 호의 세 건축
              </h2>
            </div>
            <span style={{ fontSize: 12, color: M.terra, fontWeight: 800, cursor: "pointer" }}
              onClick={() => onNavigate("collection")}>
              큐레이션 컬렉션 전체 보기 →
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}>
            {picks.map((p) => (
              <FeaturedCard
                key={p.id}
                b={p}
                onClick={() => onNavigate("detail", p.id)}
                variant="compact"
              />
            ))}
          </div>
        </section>
      )}

      {/* STICKY FILTER (스크롤 내려도 nav 바로 아래 고정) */}
      <div style={{
        position: "sticky", top: 71, zIndex: 40,
        background: M.beige,
        borderBottom: `1px solid ${M.beigeAlt}`,
        boxShadow: "0 4px 12px rgba(58,46,34,0.04)",
      }}>
        <div style={{ padding: "0 56px" }}>
          <Hairline label={`ALL · ${filtered.length} / ${BUILDINGS.length} PLACES${totalPages > 1 ? ` · PAGE ${safePage}/${totalPages}` : ""}`} />
        </div>
        <section style={{ padding: "14px 0 14px" }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center", padding: "0 56px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <MagCap style={{ marginRight: 6 }}>TYPE</MagCap>
              {TYPES.map((t) => {
                const on = t.id === activeType;
                return (
                  <span key={t.id} onClick={() => changeType(t.id)} style={{
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
                  <span key={r.id} onClick={() => changeRegion(r.id)} style={{
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
      </div>

      {/* 4-COL 그리드 (masilground 톤) · 20개/페이지 */}
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
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "40px 24px",
          }}>
            {pageItems.map((b) => (
              <GridCard key={b.id} b={b} onClick={() => onNavigate("detail", b.id)} />
            ))}
          </div>
        )}

        {/* 페이지네이션 — totalPages > 1일 때만 노출 */}
        {totalPages > 1 && (
          <div style={{
            marginTop: 56, padding: "20px 0",
            borderTop: `1px solid ${M.beigeAlt}`,
            display: "flex", justifyContent: "center", alignItems: "center", gap: 4,
            fontSize: 13, fontWeight: 700, color: M.ink,
          }}>
            <span
              onClick={() => safePage > 1 && setPage(safePage - 1)}
              style={{
                padding: "6px 12px",
                color: safePage > 1 ? M.ink : M.muted,
                opacity: safePage > 1 ? 1 : 0.4,
                cursor: safePage > 1 ? "pointer" : "not-allowed",
              }}>← PREV</span>

            {(() => {
              // 노출할 페이지 번호 계산: 처음·끝·현재 주변 ±1
              const set = new Set([1, totalPages, safePage, safePage - 1, safePage + 1]);
              const nums = [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
              const out = [];
              for (let i = 0; i < nums.length; i++) {
                if (i > 0 && nums[i] - nums[i - 1] > 1) {
                  out.push(<span key={`dot-${i}`} style={{ padding: "6px 4px", color: M.muted }}>…</span>);
                }
                const n = nums[i];
                const on = n === safePage;
                out.push(
                  <span key={n} onClick={() => setPage(n)} style={{
                    padding: "6px 12px", borderRadius: 6, cursor: "pointer",
                    background: on ? M.terra : "transparent",
                    color: on ? M.cream : M.ink,
                  }}>{n}</span>
                );
              }
              return out;
            })()}

            <span
              onClick={() => safePage < totalPages && setPage(safePage + 1)}
              style={{
                padding: "6px 12px",
                color: safePage < totalPages ? M.ink : M.muted,
                opacity: safePage < totalPages ? 1 : 0.4,
                cursor: safePage < totalPages ? "pointer" : "not-allowed",
              }}>NEXT →</span>
          </div>
        )}
      </section>

      <MFooter />
    </MPage>
  );
}

Object.assign(window, { BuildingsIndexScreen, FeaturedCard, GridCard });
