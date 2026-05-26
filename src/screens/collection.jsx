/* ================================================================
   masilmap — 컬렉션 / 매거진
   collectionLayout 변형 3종:
     - magazine: 헤로 스프레드 + 큰 표지 + 하이라이트
     - index:    목차/인덱스 리스트 (잡지 차례)
     - bento:    비대칭 벤또 그리드
   ================================================================ */

const FEATURE_PARAGRAPHS = [
  "벽돌은 한국에서 가장 흔하고 가장 가난한 재료다. 그러나 1960년대부터 90년대에 이르는 한 세대의 한국 건축가들은 그 가난을 시(詩)로 옮겼다. 김수근의 검은 벽돌, 김중업의 붉은 벽돌, 우규승의 회색 콘크리트와 벽돌의 만남. 이 컬렉션은 그 시간의 기록이다.",
  "벽돌의 미덕은 작다는 데에 있다. 인간의 한 손에 들어오는 크기 — 그래서 한 장씩 쌓아 올린 벽은 손의 흔적을 그대로 간직한다. 도면이 결정한 형태가 아니라, 매일의 노동이 만들어낸 표면이다.",
  "수십 년이 지난 지금, 이 벽돌 건축들은 다시 화제다. 카페가 들어서고, 갤러리가 옮겨오고, 외벽의 담쟁이가 가을마다 새로 자란다. 한국 모더니즘이 가장 인간적인 얼굴을 한 시기 — 그 얼굴을 다시 본다.",
];

function CollectionScreen({ route, onNavigate, collectionId, t }) {
  const c = COLLECTIONS.find((x) => x.id === collectionId) || COLLECTIONS[0];
  const buildings = c.buildings.map((id) => BUILDINGS.find((b) => b.id === id)).filter(Boolean);
  const layout = t.collectionLayout;
  const accent = c.cover;

  /* ---------- 공용: 컬렉션 페이지 헤더 (이슈 라인) ---------- */
  const IssueLine = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 56px", borderBottom: `1px solid ${M.beigeAlt}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span onClick={() => onNavigate("collection")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: M.muted }}>
          <MIcon name="chevron" size={12} color={M.muted} style={{ transform: "rotate(180deg)" }}/>
          <span>전체 컬렉션</span>
        </span>
        <span style={{ color: M.faint }}>·</span>
        <MagCap>마실 저널 / {c.issue}</MagCap>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <MButton kind="secondary" size="sm" icon={<MIcon name="bookmark" size={12} color={M.ink}/>}>저장</MButton>
        <MButton kind="secondary" size="sm" icon={<MIcon name="share" size={12} color={M.ink}/>}>공유</MButton>
      </div>
    </div>
  );

  // === COLLECTION 인덱스 페이지 (collectionId가 없으면 전체 목록) ===
  if (!collectionId) {
    return <CollectionIndex onNavigate={onNavigate} t={t}/>;
  }

  // === MAGAZINE 변형 ===
  if (layout === "magazine") {
    return (
      <MPage>
        <MasilNav route={route} onNavigate={onNavigate}/>
        <IssueLine/>

        {/* 큰 표지 스프레드 */}
        <section style={{ padding: 56, background: c.cover, color: M.cream, position: "relative", minHeight: 600 }}>
          {/* 코너 메타 */}
          <div style={{ position: "absolute", top: 56, left: 56, right: 56, display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,248,236,0.7)" }}>
            <span>MASILMAP · COLLECTION · {c.no}</span>
            <span>{c.tag}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, marginTop: 80 }}>
            <div>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontStyle: "italic", fontSize: 20, opacity: 0.85, marginBottom: 12 }}>
                a masilmap collection
              </div>
              <h1 style={{
                fontSize: 120, fontWeight: 900,
                letterSpacing: "-0.05em", lineHeight: 0.92,
                margin: 0, textWrap: "balance",
              }}>{c.title}</h1>
              <div style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: 28, fontStyle: "italic",
                marginTop: 20, opacity: 0.9, fontWeight: 400,
              }}>{c.subtitle}</div>
            </div>
            <div style={{ alignSelf: "end" }}>
              <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 18, lineHeight: 1.7, margin: 0, opacity: 0.92, textWrap: "pretty" }}>
                {c.blurb}
              </p>
              <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid rgba(255,248,236,0.25)`, display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, letterSpacing: "0.05em" }}>
                <span>EDITOR · {c.editor}</span>
                <span>{c.count} 곳 · {c.readTime}분</span>
              </div>
            </div>
          </div>
        </section>

        {/* 에디터 노트 */}
        <section style={{ padding: "64px 56px 32px", maxWidth: 1100, margin: "0 auto" }}>
          <Hairline label="EDITOR'S NOTE" style={{ marginBottom: 32 }}/>
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 56 }}>
            <div>
              <MAvatar initial={c.editor[0]} color={accent} size={56}/>
              <div style={{ fontSize: 16, fontWeight: 900, color: M.ink, marginTop: 12, letterSpacing: "-0.01em" }}>{c.editor}</div>
              <div style={{ fontSize: 12, color: M.muted, fontWeight: 700, marginTop: 4 }}>{c.editorRole}</div>
              <Hairline style={{ margin: "16px 0 12px" }}/>
              <MetaRow items={[
                { label: "발행", value: c.issue },
              ]} style={{ marginBottom: 8 }}/>
              <MetaRow items={[
                { label: "분량", value: `${c.count} 곳` },
                { label: "읽기", value: `${c.readTime}분` },
              ]}/>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <BodyBlock block={{ kind: "lead", text: FEATURE_PARAGRAPHS[0] }}/>
              <BodyBlock block={{ kind: "para", text: FEATURE_PARAGRAPHS[1] }}/>
              <BodyBlock block={{ kind: "quote", text: "벽돌은 가난한 재료다. 그러나 가난한 재료만이 사람의 손길을 견딘다.", attribution: "— 김수근, 1971" }}/>
              <BodyBlock block={{ kind: "para", text: FEATURE_PARAGRAPHS[2] }}/>
            </div>
          </div>
        </section>

        {/* 본 컬렉션의 건축물들 */}
        <section style={{ padding: "48px 56px 64px" }}>
          <Hairline label={`${c.count} PLACES IN THIS COLLECTION`} style={{ marginBottom: 36 }}/>

          {buildings.map((b, i) => (
            <div key={b.id} onClick={() => onNavigate("detail", b.id)} style={{
              display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr",
              gap: 56, alignItems: "center",
              padding: "48px 0",
              borderTop: i === 0 ? `1px solid ${M.beigeAlt}` : "none",
              borderBottom: `1px solid ${M.beigeAlt}`,
              cursor: "pointer",
            }}>
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <ImgPlaceholder
                  ratio="4/5"
                  tone={b.pinTone === "olive" ? "olive" : i % 2 === 0 ? "beige" : "deep"}
                  caption={`${b.name} · 외관`}
                  style={{ borderRadius: MR.cardLg }}
                />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <Serial color={accent} size={28}>0{i + 1}</Serial>
                  <MagCap>{b.region} · {b.year}</MagCap>
                </div>
                <h2 style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.04, color: M.ink, margin: "12px 0 12px", textWrap: "balance" }}>
                  {b.name}
                </h2>
                <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 17, fontStyle: "italic", color: M.muted, marginBottom: 20 }}>
                  {b.architect}, {b.year}
                </div>
                <p style={{ fontSize: 17, lineHeight: 1.75, color: M.ink, fontWeight: 500, textWrap: "pretty", margin: 0 }}>
                  {b.longRead}
                </p>
                <div style={{ marginTop: 24, display: "flex", gap: 8, alignItems: "center" }}>
                  <MButton kind="primary" size="md">{b.name} 보기 →</MButton>
                  <span style={{ fontSize: 12, color: M.muted, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                    p.{(i + 1).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 다음 호 */}
        <CollectionFooter c={c} onNavigate={onNavigate}/>
        <MFooter/>
      </MPage>
    );
  }

  // === INDEX 변형 (잡지 차례 톤) ===
  if (layout === "index") {
    return (
      <MPage>
        <MasilNav route={route} onNavigate={onNavigate}/>
        <IssueLine/>

        <section style={{ padding: "48px 56px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "end" }}>
            <div>
              <Serial color={accent} size={16}>마실 저널 / {c.no}</Serial>
              <h1 style={{ fontSize: 84, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.96, margin: "16px 0 0", color: M.ink, textWrap: "balance" }}>{c.title}</h1>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 22, fontStyle: "italic", color: M.muted, marginTop: 12 }}>{c.subtitle}</div>
            </div>
            <div>
              <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 17, lineHeight: 1.7, color: M.ink, fontWeight: 400, margin: 0, textWrap: "pretty" }}>{c.blurb}</p>
              <MetaRow items={[
                { label: "에디터", value: c.editor },
                { label: "발행", value: c.issue },
                { label: "분량", value: `${c.count}곳 · ${c.readTime}분` },
              ]} style={{ marginTop: 16 }}/>
            </div>
          </div>
        </section>

        <Hairline style={{ margin: "32px 56px" }}/>

        <section style={{ padding: "0 56px 64px", display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: 64 }}>
          {/* TOC 좌측 */}
          <aside>
            <MagCap style={{ marginBottom: 16 }}>CONTENTS · 차례</MagCap>
            <div style={{ position: "sticky", top: 110, display: "flex", flexDirection: "column", gap: 2 }}>
              {buildings.map((b, i) => (
                <a key={b.id} onClick={() => onNavigate("detail", b.id)} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  padding: "16px 0",
                  borderTop: `1px solid ${M.beigeAlt}`,
                  cursor: "pointer", textDecoration: "none",
                }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                    <Serial color={accent} size={14} style={{ width: 24 }}>0{i + 1}</Serial>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: M.ink, letterSpacing: "-0.015em" }}>{b.name}</div>
                      <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 2 }}>{b.architect} · {b.region}</div>
                    </div>
                  </div>
                  <Serial size={11}>p.{((i+1) * 4).toString().padStart(2, "0")}</Serial>
                </a>
              ))}
              <div style={{ borderTop: `1px solid ${M.beigeAlt}`, paddingTop: 20, marginTop: 4 }}/>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: M.muted, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                <span>EDITOR'S NOTE</span><span>p.02</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: M.muted, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>
                <span>FURTHER READING</span><span>p.32</span>
              </div>
            </div>
          </aside>

          {/* 우측 메인 콘텐츠 */}
          <main style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <ImgPlaceholder ratio="16/9" tone="deep" caption={`${c.title} · 표지 이미지`} style={{ borderRadius: MR.cardLg }}/>

            <div>
              <Hairline label="EDITOR'S NOTE · p.02" style={{ marginBottom: 24 }}/>
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <BodyBlock block={{ kind: "lead", text: FEATURE_PARAGRAPHS[0] }}/>
                <BodyBlock block={{ kind: "para", text: FEATURE_PARAGRAPHS[1] }}/>
                <BodyBlock block={{ kind: "para", text: FEATURE_PARAGRAPHS[2] }}/>
              </div>
              <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
                <MAvatar initial={c.editor[0]} color={accent} size={36}/>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: M.ink }}>{c.editor}</div>
                  <div style={{ fontSize: 11, color: M.muted, fontWeight: 600 }}>{c.editorRole}</div>
                </div>
              </div>
            </div>

            <Hairline label="01 · 첫 번째 장소"/>
            <div onClick={() => onNavigate("detail", buildings[0]?.id)} style={{ cursor: "pointer" }}>
              <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.04, color: M.ink, margin: "0 0 12px", textWrap: "balance" }}>{buildings[0]?.name}</h2>
              <MetaRow items={[
                { label: "건축가", value: buildings[0]?.architect },
                { label: "준공", value: buildings[0]?.year },
                { label: "지역", value: buildings[0]?.region },
              ]} style={{ marginBottom: 20 }}/>
              <ImgPlaceholder ratio="4/3" tone={buildings[0]?.pinTone === "olive" ? "olive" : "beige"} caption={buildings[0]?.name}/>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: M.ink, fontWeight: 500, marginTop: 20, textWrap: "pretty" }}>{buildings[0]?.longRead}</p>
              <div style={{ marginTop: 16 }}>
                <MButton kind="outline" size="md">전문 읽기 →</MButton>
              </div>
            </div>
          </main>
        </section>

        <CollectionFooter c={c} onNavigate={onNavigate}/>
        <MFooter/>
      </MPage>
    );
  }

  // === BENTO 변형 ===
  return (
    <MPage>
      <MasilNav route={route} onNavigate={onNavigate}/>
      <IssueLine/>

      <section style={{ padding: "32px 56px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 32, alignItems: "end", marginBottom: 24 }}>
          <div>
            <MagCap color={accent} style={{ marginBottom: 12 }}>{c.no} · {c.tag} · {c.issue}</MagCap>
            <h1 style={{ fontSize: 72, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1, color: M.ink, margin: 0, textWrap: "balance" }}>{c.title}</h1>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 22, fontStyle: "italic", color: M.muted, marginTop: 12 }}>{c.subtitle}</div>
          </div>
          <div>
            <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 16, lineHeight: 1.7, color: M.ink, fontWeight: 400, margin: 0, textWrap: "pretty" }}>{c.blurb}</p>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <MAvatar initial={c.editor[0]} color={accent} size={32}/>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: M.ink }}>EDITOR · {c.editor}</div>
                <div style={{ fontSize: 11, color: M.muted, fontWeight: 600 }}>{c.count} 곳 · {c.readTime}분</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 56px 32px" }}>
        <Hairline label="BENTO · 컬렉션 한눈에" style={{ marginBottom: 24 }}/>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridAutoRows: "180px",
          gap: 16,
        }}>
          {/* big cover tile */}
          <div style={{
            gridColumn: "span 3", gridRow: "span 2",
            borderRadius: MR.cardLg, background: c.cover, color: M.cream,
            padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <MagCap color="rgba(255,248,236,0.7)">FEATURE · {c.no}</MagCap>
            <div>
              <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.02 }}>{c.title}</div>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontStyle: "italic", fontSize: 18, opacity: 0.85, marginTop: 8 }}>{c.subtitle}</div>
            </div>
          </div>

          {/* editor pull-quote */}
          <div style={{ gridColumn: "span 3", gridRow: "span 1", background: M.cream, borderRadius: MR.cardLg, padding: 24, boxShadow: MS.cardSm, display: "flex", alignItems: "center" }}>
            <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 22, fontStyle: "italic", lineHeight: 1.45, color: M.ink, margin: 0, fontWeight: 500, textWrap: "pretty" }}>
              “가난한 재료만이 사람의 손길을 견딘다.”
            </p>
          </div>

          {/* metric tile */}
          <div style={{ gridColumn: "span 1", gridRow: "span 1", background: M.terra, color: M.cream, borderRadius: MR.card, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <MagCap color="rgba(255,248,236,0.7)">분량</MagCap>
            <div>
              <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em" }}>{c.count}</div>
              <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, marginTop: 4 }}>곳</div>
            </div>
          </div>
          <div style={{ gridColumn: "span 1", gridRow: "span 1", background: M.olive, color: M.cream, borderRadius: MR.card, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <MagCap color="rgba(255,248,236,0.7)">읽기</MagCap>
            <div>
              <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em" }}>{c.readTime}</div>
              <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, marginTop: 4 }}>분</div>
            </div>
          </div>

          {/* building tiles */}
          {buildings.map((b, i) => (
            <div key={b.id} onClick={() => onNavigate("detail", b.id)} style={{
              gridColumn: i === 0 ? "span 2" : "span 2",
              gridRow: "span 2",
              borderRadius: MR.cardLg, overflow: "hidden",
              background: M.cream, boxShadow: MS.cardSm, cursor: "pointer",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ flex: 1, position: "relative" }}>
                <ImgPlaceholder ratio="auto" tone={b.pinTone === "olive" ? "olive" : i === 0 ? "deep" : "beige"} caption={b.name} style={{ height: "100%", aspectRatio: "auto", borderRadius: 0 }}/>
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <Serial color={b.pinTone === "olive" ? M.olive : M.terra}>#{b.no}</Serial>
                  <MagCap>{b.region}</MagCap>
                </div>
                <div style={{ fontSize: 19, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{b.name}</div>
                <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 2 }}>{b.architect} · {b.year}</div>
              </div>
            </div>
          ))}

          {/* if fewer buildings, fill */}
          {buildings.length < 4 && (
            <div style={{ gridColumn: "span 2", gridRow: "span 2", border: `1.5px dashed ${M.beigeAlt}`, borderRadius: MR.cardLg, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: M.muted, padding: 20, textAlign: "center" }}>
              <MIcon name="plus" size={24} color={M.muted}/>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 10 }}>다음 장소</div>
              <div style={{ fontSize: 11, fontWeight: 500, marginTop: 4 }}>아직 추가 중인 항목</div>
            </div>
          )}
        </div>
      </section>

      {/* full content below — building roll */}
      <section style={{ padding: "32px 56px 64px" }}>
        <Hairline label={`전체 ${c.count}곳 · 펼쳐 보기`} style={{ marginBottom: 24 }}/>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {buildings.map((b) => (
            <div key={b.id} onClick={() => onNavigate("detail", b.id)} style={{ background: M.cream, borderRadius: MR.card, padding: 14, boxShadow: MS.cardSm, cursor: "pointer" }}>
              <ImgPlaceholder ratio="4/3" tone={b.pinTone === "olive" ? "olive" : "beige"} caption={b.name}/>
              <div style={{ padding: "14px 4px 4px" }}>
                <Serial color={b.pinTone === "olive" ? M.olive : M.terra}>#{b.no}</Serial>
                <div style={{ fontSize: 19, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", marginTop: 4 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 2 }}>{b.architect} · {b.year}</div>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: M.ink, fontWeight: 500, marginTop: 10, textWrap: "pretty" }}>{b.intro}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CollectionFooter c={c} onNavigate={onNavigate}/>
      <MFooter/>
    </MPage>
  );
}

/* ---------- 컬렉션 푸터 (관련 컬렉션) ---------- */
function CollectionFooter({ c, onNavigate }) {
  const others = COLLECTIONS.filter((x) => x.id !== c.id).slice(0, 3);
  return (
    <section style={{ padding: "48px 56px 64px", background: M.beigeAlt }}>
      <Hairline label="다른 호 · OTHER ISSUES" style={{ marginBottom: 28 }}/>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {others.map((o) => (
          <div key={o.id} onClick={() => onNavigate("collection", o.id)} style={{ background: M.cream, borderRadius: MR.card, padding: 16, cursor: "pointer", boxShadow: MS.cardSm }}>
            <div style={{ height: 120, background: o.cover, borderRadius: 14, padding: 16, color: M.cream, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <MagCap color="rgba(255,248,236,0.7)">{o.no} · {o.tag}</MagCap>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.05 }}>{o.title}</div>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: M.muted, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
              <span>EDITOR · {o.editor}</span>
              <span>{o.count} 곳</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 컬렉션 인덱스 (전체 목록 페이지) ---------- */
function CollectionIndex({ onNavigate, t }) {
  return (
    <MPage>
      <MasilNav route="collection" onNavigate={onNavigate}/>

      <section style={{ padding: "48px 56px 32px" }}>
        <Hairline label="MASILMAP / 마실 저널 · 2026 SPRING · VOL.07" style={{ marginBottom: 32 }}/>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 56, alignItems: "end" }}>
          <div>
            <MagCap color={M.terra} style={{ marginBottom: 16 }}>EDITORIAL · 매 분기 발행</MagCap>
            <h1 style={{ fontSize: 84, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.96, margin: 0, color: M.ink, textWrap: "balance" }}>
              건축은 결국<br/>
              <span style={{ color: M.terra, fontFamily: "'Noto Serif KR', serif", fontStyle: "italic", fontWeight: 700 }}>걸어야</span> 알게 된다
            </h1>
          </div>
          <div>
            <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 17, lineHeight: 1.75, color: M.ink, fontWeight: 400, margin: 0, textWrap: "pretty" }}>
              마실 저널은 한국 건축을 한 호씩 천천히 모은 컬렉션입니다. 한 호의 분량은 보통 7곳에서 12곳 — 하루나 이틀이면 다 걷을 수 있는 거리에 묶여 있습니다.
            </p>
            <MetaRow items={[
              { label: "발행", value: "분기별" },
              { label: "에디터", value: "12명" },
              { label: "지금까지", value: "47호" },
            ]} style={{ marginTop: 16 }}/>
          </div>
        </div>
      </section>

      {/* 표지 그리드 */}
      <section style={{ padding: "32px 56px 48px" }}>
        <Hairline label="현재 호 · 2026 봄" style={{ marginBottom: 24 }}/>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {COLLECTIONS.slice(0, 3).map((c) => (
            <div key={c.id} onClick={() => onNavigate("collection", c.id)} style={{
              background: M.cream, borderRadius: MR.cardLg, overflow: "hidden",
              boxShadow: MS.card, cursor: "pointer",
            }}>
              <div style={{ height: 280, background: c.cover, color: M.cream, padding: 24, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em" }}>
                  <span>MASILMAP · {c.no}</span>
                  <span>{c.tag}</span>
                </div>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.04 }}>{c.title}</div>
                  <div style={{ fontFamily: "'Noto Serif KR', serif", fontStyle: "italic", fontSize: 15, marginTop: 6, opacity: 0.85 }}>{c.subtitle}</div>
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <p style={{ fontSize: 13, color: M.ink, lineHeight: 1.6, margin: 0, fontWeight: 500, textWrap: "pretty" }}>{c.blurb}</p>
                <Hairline style={{ margin: "14px 0" }}/>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: M.muted, fontWeight: 700 }}>
                  <span>EDITOR · {c.editor}</span>
                  <span>{c.count} 곳 · {c.readTime}분</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "32px 56px 64px", background: M.beigeAlt }}>
        <Hairline label="지난 호 · ARCHIVE" style={{ marginBottom: 24 }}/>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {COLLECTIONS.slice(3).map((c, i) => (
            <div key={c.id} onClick={() => onNavigate("collection", c.id)} style={{
              display: "grid", gridTemplateColumns: "80px 1fr 1fr auto", gap: 24, alignItems: "center",
              padding: "20px 0",
              borderTop: `1px solid #D9CCB4`,
              borderBottom: i === COLLECTIONS.slice(3).length - 1 ? `1px solid #D9CCB4` : "none",
              cursor: "pointer",
            }}>
              <div style={{ height: 80, borderRadius: 12, background: c.cover, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MagCap color="rgba(255,248,236,0.85)" style={{ fontSize: 9 }}>{c.no}</MagCap>
              </div>
              <div>
                <Serial color={M.terra}>{c.tag}</Serial>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, marginTop: 4 }}>{c.title}</div>
                <div style={{ fontFamily: "'Noto Serif KR', serif", fontStyle: "italic", fontSize: 14, color: M.muted, marginTop: 2 }}>{c.subtitle}</div>
              </div>
              <div style={{ fontSize: 13, color: M.muted, fontWeight: 600, lineHeight: 1.55 }}>
                EDITOR · {c.editor} ({c.editorRole}) · {c.issue}
              </div>
              <MIcon name="arrow" size={20} color={M.terra}/>
            </div>
          ))}
        </div>
      </section>

      <MFooter/>
    </MPage>
  );
}

Object.assign(window, { CollectionScreen, CollectionIndex });
