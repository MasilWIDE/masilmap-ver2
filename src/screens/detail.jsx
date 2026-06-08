/* ================================================================
   masilmap — 건축물 상세 화면
   detailLayout 변형 3종:
     - hero:     큰 헤로 갤러리 + 본문 + 사이드 메타 (잡지 피처)
     - sidebar:  목차 사이드바 좌측 + 본문 우측 (도큐먼트 톤)
     - longform: 단일 컬럼, 큰 이미지를 본문에 끼워넣기 (에세이)
   ================================================================ */

function MiniMap({ b, style = {} }) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: MR.card, overflow: "hidden", background: M.cream, ...style }}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <defs>
          <pattern id="mgrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(58,46,34,0.07)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mgrid)" />
        {/* roads */}
        <path d="M -20 80 C 120 100 220 60 420 90" fill="none" stroke="#D4C29E" strokeWidth="22" strokeLinecap="round" />
        <path d="M -20 180 C 100 200 240 170 420 220" fill="none" stroke="#D4C29E" strokeWidth="18" strokeLinecap="round" />
        <path d="M 120 -20 C 130 100 160 200 140 320" fill="none" stroke="#D4C29E" strokeWidth="16" strokeLinecap="round" />
        <path d="M 280 -20 C 270 80 300 200 290 320" fill="none" stroke="#D4C29E" strokeWidth="14" strokeLinecap="round" />
        {/* blocks */}
        {[[60,40,80,60],[180,30,80,40],[180,210,100,70],[300,140,80,90],[40,210,90,60]].map((r, i) => (
          <rect key={i} x={r[0]} y={r[1]} width={r[2]} height={r[3]} rx="6" fill="#E8D7B8" stroke="#D4C29E" strokeWidth="1"/>
        ))}
        {/* center pin */}
        <g transform="translate(200, 150)">
          <circle r="32" fill={b.pinTone === "olive" ? M.olive : M.terra} opacity="0.18">
            <animate attributeName="r" from="20" to="42" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.32" to="0" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <g transform="translate(-12, -32)">
            <path d="M12 0 C18 0 24 5 24 11 C24 17 17 25 13 28 C12.5 29 11.5 29 11 28 C7 25 0 17 0 11 C0 5 6 0 12 0 Z"
              fill={b.pinTone === "olive" ? M.olive : M.terra}/>
            <circle cx="12" cy="11" r="5" fill={M.cream}/>
          </g>
        </g>
        {/* compass */}
        <g transform="translate(360, 40)">
          <circle r="14" fill={M.cream} stroke={M.beigeAlt}/>
          <text textAnchor="middle" y="-3" fontSize="9" fontFamily={MT.family} fontWeight="700" fill={M.terra}>N</text>
          <path d="M 0 -10 L 3 0 L 0 10 L -3 0 Z" fill={M.terra} transform="translate(0, 4) scale(0.5)"/>
        </g>
      </svg>
    </div>
  );
}

function GalleryStrip({ b, count = 5, tones = ["beige", "deep", "olive", "terra", "cream"] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <ImgPlaceholder
          key={i}
          ratio="1/1"
          tone={tones[i % tones.length]}
          caption={i === 0 ? "외관 정면" : i === 1 ? "내부 진입" : i === 2 ? "디테일" : i === 3 ? "평면" : "주변"}
        />
      ))}
    </div>
  );
}

/* visitor note (community signal) — 채널 명의로 작성 (실명·소속 비공개) */
function VisitorNote({ channelId, time, text }) {
  const ch = (window.mxChannel ? mxChannel(channelId) : null) || { name: "마실러", color: M.terra, handle: "", official: false };
  return (
    <div style={{ padding: 16, background: M.beige, borderRadius: MR.card, display: "flex", gap: 12 }}>
      <MAvatar initial={ch.name[0]} color={ch.color} size={32}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: M.ink }}>{ch.name}</span>
            {ch.official && <MIcon name="sparkle" size={11} color={M.olive}/>}
            {ch.handle && <span style={{ fontSize: 11, color: M.faint, fontWeight: 600 }}>{ch.handle}</span>}
          </span>
          <span style={{ fontFamily: MT.family, fontSize: 10, color: M.muted, fontWeight: 600, whiteSpace: "nowrap" }}>{time}</span>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: M.ink, margin: 0, fontWeight: 500, textWrap: "pretty" }}>{text}</p>
      </div>
    </div>
  );
}

/* 후기 컴포저 — 현재 활동 채널 명의로 작성됨을 명시 */
function NoteComposer() {
  const sh = useMasilShared();
  const auth = window.__masilAuth || { isLoggedIn: false };
  const ch = mxChannel(sh.s.currentChannelId);
  if (!auth.isLoggedIn) {
    return (
      <div style={{ padding: 16, background: M.cream, borderRadius: MR.card, border: `1px dashed ${M.beigeAlt}`, fontSize: 13, color: M.muted, fontWeight: 600, textAlign: "center" }}>
        로그인하면 채널 명의로 후기를 남길 수 있어요.
      </div>
    );
  }
  return (
    <div style={{ padding: 14, background: M.cream, borderRadius: MR.card, border: `1px solid ${M.beigeAlt}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <MAvatar initial={ch.name[0]} color={ch.color} size={30}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: M.ink, display: "inline-flex", alignItems: "center", gap: 4 }}>
            {ch.name}{ch.official && <MIcon name="sparkle" size={10} color={M.olive}/>}
            <span style={{ fontSize: 11, color: M.muted, fontWeight: 600 }}>채널로 작성</span>
          </div>
          <div style={{ fontSize: 11, color: M.faint, fontWeight: 600, marginTop: 1 }}>실명·소속은 공개되지 않아요</div>
        </div>
        <MButton kind="primary" size="sm">후기 남기기</MButton>
      </div>
    </div>
  );
}

/* 건축물 태그 — 통합 분류(원천 + 방문자 폴크소노미) + 태그 추가 */
function BuildingTagsBlock({ b }) {
  const sh = useMasilShared();
  const auth = window.__masilAuth || { isLoggedIn: false };
  const tags = txBuildingTags(b, sh.s);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: M.ink }}>태그 <span style={{ color: M.muted, fontWeight: 600 }}>· 사람들이 본 이 곳</span></span>
        <span style={{ fontSize: 11, color: M.faint, fontWeight: 600 }}>누구나 추가할 수 있어요</span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {tags.length === 0 && <span style={{ fontSize: 13, color: M.muted, fontWeight: 600 }}>아직 태그가 없어요. 첫 태그를 달아보세요.</span>}
        {tags.map((t) => (
          <span key={t.tag} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 999, background: M.beige, border: `1px solid ${M.beigeAlt}`, fontSize: 13, fontWeight: 700, color: M.ink }}>
            # {t.tag}
            {t.source !== "base" && t.votes > 1 && <span style={{ fontSize: 11, color: M.olive, fontWeight: 800 }}>+{t.votes}</span>}
          </span>
        ))}
      </div>
      {auth.isLoggedIn ? (
        <TxTagAdder building={b} store={sh.s} onAdd={(id, tag) => sh.addTag(id, tag)}/>
      ) : (
        <div style={{ padding: "12px 16px", background: M.cream, borderRadius: 999, border: `1px dashed ${M.beigeAlt}`, fontSize: 12.5, color: M.muted, fontWeight: 600, textAlign: "center" }}>
          로그인하면 이 곳에 태그를 달 수 있어요
        </div>
      )}
    </div>
  );
}

const SAMPLE_NOTES = [
  { channelId: "seochon",  time: "2일 전",  text: "비 오는 날 회랑을 따라 끝까지 걸어봤는데, 비례가 더 또렷이 느껴졌어요. 사람이 거의 없어서 더 좋았습니다." },
  { channelId: "noeul",    time: "1주 전",  text: "오후 4시쯤 빛이 가장 좋다고 들어서 그 시간에 맞춰 갔습니다. 카페에서 천천히 시간 보내기 좋아요." },
  { channelId: "concrete", time: "2주 전",  text: "주차가 어렵다는 후기가 많아서 대중교통으로 갔는데, 마지막 200m 골목길이 더 인상적이었어요." },
];

const SAMPLE_BODY = [
  { kind: "lead", text: "오래된 건물은 처음 봐도 익숙하다. 그 익숙함은 시간 자체에서 온다." },
  { kind: "para", text: "외벽 가까이 다가가 보면, 벽돌 한 장 한 장이 모두 손길이 닿은 흔적을 가지고 있다. 모서리가 살짝 무너진 곳, 줄눈이 깊게 패인 곳, 담쟁이가 자국을 남긴 곳. 도면으로는 표현할 수 없는, 시간이 새긴 디테일이다." },
  { kind: "quote", text: "건축은 결국 빛과 그림자의 일이다. 재료는 그 그림자가 어떻게 떨어지는지를 결정할 뿐이다.", attribution: "—  건축가의 일기 중에서" },
  { kind: "para", text: "내부 동선은 도시의 골목과 닮아있다. 좁고 어두운 계단을 올라가다 보면 갑자기 작은 마당이 나타나고, 마당을 가로지르면 또 다른 좁은 통로가 시작된다. 한국 전통 건축이 가진 비밀스러운 동선, 그러나 모더니즘의 어휘로 다시 쓴 것이다." },
  { kind: "para", text: "가을이 되면 외벽의 담쟁이덩굴이 붉게 물든다. 건물 자체가 계절을 입는다. 이 단순한 사실이 한국 건축에서 가장 드물고 귀한 장면이다." },
];

/* ---------- 본문 블록 렌더링 ---------- */
function BodyBlock({ block, style = {} }) {
  if (block.kind === "lead") {
    return (
      <p style={{
        fontFamily: MT.family,
        fontSize: 24, fontWeight: 500,
        lineHeight: 1.5, color: M.ink, margin: 0,
        textWrap: "pretty",
        ...style,
      }}>{block.text}</p>
    );
  }
  if (block.kind === "para") {
    return (
      <p style={{
        fontSize: 16, fontWeight: 500,
        lineHeight: 1.85, color: M.ink, margin: 0,
        textWrap: "pretty",
        ...style,
      }}>{block.text}</p>
    );
  }
  if (block.kind === "quote") {
    return (
      <blockquote style={{
        margin: 0, padding: "20px 0 20px 24px",
        borderLeft: `3px solid ${M.terra}`,
        ...style,
      }}>
        <p style={{
          fontFamily: MT.family,
          fontSize: 22, fontWeight: 500,
          lineHeight: 1.5, color: M.ink, margin: 0,
          textWrap: "pretty",
        }}>“{block.text}”</p>
        <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: M.muted, letterSpacing: "0.02em" }}>{block.attribution}</div>
      </blockquote>
    );
  }
  return null;
}

/* ---------- NetworkSection: 이 건축이 등장하는 코스·컬렉션 그물망 ----------
   NetworkSection      = 풀 wrapper (section + Hairline + 내부 그리드)
   NetworkSectionInner = 내부 그리드만 (sidebar/longform처럼 부모가 이미 wrap한 경우) */
function NetworkSectionInner({ b, inCourses, inCollections, onNavigate }) {
  const accent = b.pinTone === "olive" ? M.olive : M.terra;
  const isMobile = useIsMobile();
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? 20 : 32,
    }}>
        {/* 좌: 코스 */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <MagCap color={accent}>코스 · {inCourses.length}</MagCap>
            {inCourses.length > 0 && (
              <span onClick={() => onNavigate("course")} style={{
                fontSize: 11, fontWeight: 800, color: M.muted, cursor: "pointer",
              }}>전체 코스 →</span>
            )}
          </div>

          {inCourses.length === 0 ? (
            <div style={{
              padding: "32px 16px", borderRadius: MR.card,
              background: M.cream, border: `1px dashed ${M.beigeAlt}`,
              fontSize: 12, color: M.muted, fontWeight: 600, textAlign: "center",
            }}>
              아직 이 건축이 포함된 코스가 없습니다
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {inCourses.map((c) => (
                <div key={c.id} onClick={() => onNavigate("course", c.id)} style={{
                  display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 14,
                  padding: 14, borderRadius: MR.card,
                  background: M.cream, boxShadow: MS.cardSm,
                  cursor: "pointer", alignItems: "center",
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 12,
                    background: c.cover, color: M.cream,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 800, opacity: 0.8 }}>
                      {c.type === "도슨트" ? "DOCENT" : "SELF"}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, marginTop: 2 }}>{c.buildings.length}곳</div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: M.ink, letterSpacing: "-0.01em",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 4 }}>
                      {c.duration} · {c.curator.name} 큐레이션
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: accent }}>↗</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 우: 시리즈 */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <MagCap color={accent}>시리즈 · {inCollections.length}</MagCap>
            {inCollections.length > 0 && (
              <span onClick={() => onNavigate("collection")} style={{
                fontSize: 11, fontWeight: 800, color: M.muted, cursor: "pointer",
              }}>전체 시리즈 →</span>
            )}
          </div>

          {inCollections.length === 0 ? (
            <div style={{
              padding: "32px 16px", borderRadius: MR.card,
              background: M.cream, border: `1px dashed ${M.beigeAlt}`,
              fontSize: 12, color: M.muted, fontWeight: 600, textAlign: "center",
            }}>
              아직 이 건축이 속한 시리즈가 없습니다
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {inCollections.map((c) => (
                <div key={c.id} onClick={() => onNavigate("collection", c.id)} style={{
                  display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 14,
                  padding: 14, borderRadius: MR.card,
                  background: M.cream, boxShadow: MS.cardSm,
                  cursor: "pointer", alignItems: "center",
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 12,
                    background: c.cover, color: M.cream,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 800, opacity: 0.8, fontFamily: MT.family, letterSpacing: "0.08em" }}>
                      {c.no}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, marginTop: 2 }}>{(c.courses || []).length}코스</div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: M.ink, letterSpacing: "-0.01em",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.title}
                    </div>
                    <div style={{ fontSize: 11, color: M.muted, fontWeight: 600, marginTop: 4 }}>
                      {c.kind} · {c.badge}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: accent }}>↗</div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
}

/* 풀 wrapper — hero/longform 등에서 단독 섹션으로 쓸 때 */
function NetworkSection({ b, inCourses, inCollections, onNavigate }) {
  const px = pageX(useIsMobile(), useIsTablet());
  if (inCourses.length === 0 && inCollections.length === 0) return null;
  return (
    <section style={{ padding: `48px ${px}px 32px`, maxWidth: 1200, margin: "0 auto" }}>
      <Hairline label="NETWORK · 이 건축이 등장하는 곳" style={{ marginBottom: 28 }}/>
      <NetworkSectionInner b={b} inCourses={inCourses} inCollections={inCollections} onNavigate={onNavigate}/>
    </section>
  );
}

/* ---------- DetailScreen ---------- */
function DetailScreen({ route, onNavigate, buildingId, t }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const px = pageX(isMobile, isTablet);
  const b = BUILDINGS.find((x) => x.id === buildingId) || BUILDINGS[0];
  const accent = b.pinTone === "olive" ? M.olive : M.terra;
  const layout = t.detailLayout;
  const related = BUILDINGS.filter((x) => x.id !== b.id && x.typeKey === b.typeKey).slice(0, 3);
  const inCollections = seriesForBuilding(b.id);
  const inCourses     = COURSES.filter((c) => c.buildings.includes(b.id));
  // 호환용 (기존 inCollection 참조 코드)
  const inCollection  = inCollections[0];

  // === HERO ===
  if (layout === "hero") {
    return (
      <MPage>
        <MasilNav route={route} onNavigate={onNavigate} />

        {/* hero header */}
        <section style={{ padding: `32px ${px}px 28px` }}>
          <Hairline label={`PLACE · ${(b.region || "").toUpperCase()} · ${(b.typeKey || "").toUpperCase()}`} style={{ marginBottom: 24 }}/>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: 56, alignItems: "end" }}>
            <div>
              <MagCap color={accent} style={{ marginBottom: 16 }}>
                {b.region} · {b.style}
              </MagCap>
              <h1 style={{
                fontSize: 84, fontWeight: 900,
                letterSpacing: "-0.04em", lineHeight: 0.98,
                color: M.ink, margin: 0, textWrap: "balance",
              }}>{b.name}</h1>
              <div style={{
                fontFamily: MT.family,
                fontSize: 18, fontStyle: "italic",
                color: M.muted, marginTop: 14, fontWeight: 400,
              }}>{b.nameEn}</div>
              <p style={{
                fontFamily: MT.family,
                fontSize: 20, lineHeight: 1.65,
                color: M.ink, marginTop: 28, marginBottom: 0,
                fontWeight: 400, maxWidth: 680, textWrap: "pretty",
              }}>{b.intro}</p>
            </div>
            <div>
              <MetaRow items={[
                { label: "건축가", value: b.architect },
                { label: "준공", value: `${b.year}` },
              ]} style={{ marginBottom: 12 }}/>
              <MetaRow items={[
                { label: "용도", value: b.type },
                { label: "층수", value: `${b.metrics.floors}F` },
              ]} style={{ marginBottom: 12 }}/>
              <MetaRow items={[
                { label: "연면적", value: b.metrics.gfa },
                { label: "관람", value: b.metrics.visit },
              ]} style={{ marginBottom: 20 }}/>
              <div style={{ marginBottom: 24 }}>
                <BuildingTagsBlock b={b}/>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <MButton kind="primary" size="md" icon={<MIcon name="bookmark" size={14} color={M.cream}/>}>저장</MButton>
                <MButton kind="secondary" size="md" icon={<MIcon name="share" size={14} color={M.ink}/>}>공유</MButton>
                <MButton kind="secondary" size="md" icon={<MIcon name="walk" size={14} color={M.ink}/>}>코스 추가</MButton>
              </div>
            </div>
          </div>
        </section>

        {/* hero image */}
        <section style={{ padding: "0 56px 32px" }}>
          <ImgPlaceholder ratio="21/9" tone={b.pinTone === "olive" ? "olive" : "beige"} caption={`${b.name} · 정면 외관 · ${b.year}`} style={{ borderRadius: MR.cardLg }}/>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 4px 0" }}>
            <Serial>FIG. 01 · 01/05</Serial>
            <span style={{ fontSize: 11, color: M.muted, fontWeight: 600 }}>사진 · 한지수, 2025</span>
          </div>
        </section>

        {/* body + sidebar */}
        <section style={{ padding: `32px ${px}px 64px`, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: 64 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Hairline label="STORY" style={{ marginBottom: 4 }}/>
            <BodyBlock block={{ kind: "lead", text: b.longRead }} />
            <Hairline style={{ margin: "8px 0" }}/>
            {SAMPLE_BODY.map((blk, i) => <BodyBlock key={i} block={blk}/>)}
            <Hairline style={{ margin: "8px 0" }}/>
            <div>
              <MagCap style={{ marginBottom: 12 }}>GALLERY · 05 PHOTOS</MagCap>
              <GalleryStrip b={b} />
            </div>
          </div>

          {/* sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div>
              <MagCap style={{ marginBottom: 10 }}>LOCATION</MagCap>
              <MiniMap b={b}/>
              <div style={{ fontSize: 13, color: M.ink, fontWeight: 600, marginTop: 10 }}>{b.address}</div>
              <MetaRow items={[
                { label: "교통", value: "지하철+도보 12분" },
                { label: "주차", value: "공영" },
              ]} style={{ marginTop: 8 }}/>
            </div>

            <Hairline label="ALSO IN THIS SERIES"/>
            {inCollection && (
              <div onClick={() => onNavigate("collection", inCollection.id)} style={{
                padding: 18, borderRadius: MR.card,
                background: inCollection.cover, color: M.cream,
                cursor: "pointer",
              }}>
                <MagCap color="rgba(255,248,236,0.7)" style={{ marginBottom: 8 }}>{inCollection.no} · {inCollection.kind}</MagCap>
                <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.1 }}>{inCollection.title}</div>
                <div style={{ fontSize: 13, marginTop: 4, opacity: 0.85, fontWeight: 600 }}>{inCollection.subtitle}</div>
                <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: MT.family, fontSize: 10, fontWeight: 600 }}>
                  <span>{(inCollection.courses || []).length} 코스 · {inCollection.badge}</span>
                  <span>정복 →</span>
                </div>
              </div>
            )}

            <div>
              <Hairline label="VISITOR NOTES" style={{ marginBottom: 14 }}/>
              <div style={{ marginBottom: 12 }}><NoteComposer/></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SAMPLE_NOTES.map((n, i) => <VisitorNote key={i} {...n}/>)}
              </div>
              <div style={{ marginTop: 14, textAlign: "center" }}>
                <MButton kind="outline" size="sm">전체 보기 ({Math.floor(b.visited / 32)}개)</MButton>
              </div>
            </div>
          </aside>
        </section>

        {/* NETWORK · 이 건축이 등장하는 코스·컬렉션 */}
        <NetworkSection b={b} inCourses={inCourses} inCollections={inCollections} onNavigate={onNavigate}/>

        {/* related */}
        <section style={{ padding: `32px ${px}px 64px`, background: M.beigeAlt }}>
          <Hairline label="RELATED PLACES · 비슷한 결의 건축" style={{ marginBottom: 24 }}/>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
            {related.map((r) => (
              <div key={r.id} onClick={() => onNavigate("detail", r.id)} style={{
                background: M.cream, borderRadius: MR.card, padding: 14, cursor: "pointer", boxShadow: MS.cardSm,
              }}>
                <ImgPlaceholder ratio="4/3" tone={r.pinTone === "olive" ? "olive" : "beige"} caption={r.name}/>
                <div style={{ padding: "14px 4px 4px" }}>
                  <div style={{ marginBottom: 6 }}>
                    <MagCap>{r.region}</MagCap>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 4 }}>{r.architect} · {r.year}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <MFooter />
      </MPage>
    );
  }

  // === SIDEBAR (도큐먼트 톤, 좌측 TOC) ===
  if (layout === "sidebar") {
    const mb = (window.mkBuildings ? mkBuildings().find((x) => x.id === b.id) : null) || null;
    const sections = [
      { id: "intro",   label: "01. 개요" },
      { id: "story",   label: "02. 이야기" },
      { id: "gallery", label: "03. 갤러리" },
      { id: "info",    label: "04. 방문 정보" },
      { id: "maps",    label: "05. 지도 · 예약" },
      { id: "network", label: "06. 코스 · 시리즈" },
      { id: "notes",   label: "07. 방문 후기" },
      { id: "more",    label: "08. 더 깊이 보기" },
      { id: "related", label: "09. 비슷한 건축" },
    ];
    return (
      <MPage>
        <MasilNav route={route} onNavigate={onNavigate} />
        <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "240px 1fr", gap: 0, minHeight: "calc(100vh - 92px)" }}>
          {/* sticky sidebar */}
          <aside style={{
            position: "sticky", top: 92, alignSelf: "flex-start",
            height: "calc(100vh - 92px)", padding: "32px 28px",
            borderRight: `1px solid ${M.beigeAlt}`,
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <div onClick={() => onNavigate("buildings")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: M.muted, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
              <MIcon name="chevron" size={12} color={M.muted} style={{ transform: "rotate(180deg)" }}/>
              <span>공간 목록</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, lineHeight: 1.15 }}>{b.name}</div>
            <div style={{ fontSize: 12, color: M.muted, fontWeight: 600 }}>{b.architect} · {b.year}</div>
            <Hairline style={{ margin: "12px 0" }}/>
            <MagCap style={{ marginBottom: 4 }}>CONTENTS</MagCap>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {sections.map((s, i) => (
                <a key={s.id} href={`#${s.id}`} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "8px 0", fontSize: 13, fontWeight: 700,
                  color: M.ink, textDecoration: "none",
                  borderBottom: i < sections.length - 1 ? `1px dashed ${M.beigeAlt}` : "none",
                }}>
                  <span>{s.label}</span>
                </a>
              ))}
            </nav>
            <div style={{ marginTop: "auto", display: "flex", gap: 6 }}>
              <MButton kind="primary" size="sm">저장</MButton>
              <MButton kind="secondary" size="sm">공유</MButton>
            </div>
          </aside>

          {/* main column */}
          <main style={{ padding: `32px ${px}px 80px`, maxWidth: 900 }}>
            <section id="intro" style={{ marginBottom: 56 }}>
              <Hairline label="01 · OVERVIEW" style={{ marginBottom: 28 }}/>
              <MagCap color={accent} style={{ marginBottom: 14 }}>{b.region} · {b.style}</MagCap>
              <h1 style={{ fontSize: isMobile ? 36 : 64, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.02, margin: 0, color: M.ink, textWrap: "balance" }}>{b.name}</h1>
              <div style={{ fontFamily: MT.family, fontSize: 17, fontStyle: "italic", color: M.muted, marginTop: 10 }}>{b.nameEn}</div>
              <ImgPlaceholder ratio="16/9" tone={b.pinTone === "olive" ? "olive" : "beige"} caption={`${b.name} · 외관`} style={{ marginTop: 32 }}/>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 16, marginTop: 28 }}>
                {[
                  { l: "건축가", v: b.architect },
                  { l: "준공",   v: b.year },
                  { l: "용도",   v: b.type },
                  { l: "연면적", v: b.metrics.gfa },
                ].map((m, i) => (
                  <div key={i} style={{ padding: "16px 0", borderTop: `1px solid ${M.beigeAlt}` }}>
                    <MagCap style={{ marginBottom: 6 }}>{m.l}</MagCap>
                    <div style={{ fontSize: 16, fontWeight: 800, color: M.ink, letterSpacing: "-0.01em" }}>{m.v}</div>
                  </div>
                ))}
              </div>
            </section>

            <section id="story" style={{ marginBottom: 56 }}>
              <Hairline label="02 · STORY" style={{ marginBottom: 28 }}/>
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <BodyBlock block={{ kind: "lead", text: b.longRead }}/>
                {SAMPLE_BODY.map((blk, i) => <BodyBlock key={i} block={blk}/>)}
              </div>
            </section>

            <section id="gallery" style={{ marginBottom: 56 }}>
              <Hairline label="03 · GALLERY" style={{ marginBottom: 28 }}/>
              <GalleryStrip b={b} count={5}/>
              <div style={{ marginTop: 12, fontSize: 11, color: M.muted }}>전체 14장 · 사진 · 한지수, 윤서경 외</div>
            </section>

            <section id="info" style={{ marginBottom: 56 }}>
              <Hairline label="04 · VISIT INFO" style={{ marginBottom: 28 }}/>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: 32 }}>
                <MiniMap b={b}/>
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 18px", fontSize: 14 }}>
                    {[
                      ["주소",   b.address],
                      ["관람",   b.metrics.visit],
                      ["입장료", "무료 (특별전 별도)"],
                      ["휴관",   "매주 월요일"],
                      ["문의",   "02-000-0000"],
                    ].map(([l, v]) => (
                      <React.Fragment key={l}>
                        <div style={{ color: M.muted, fontWeight: 700, fontSize: 12 }}>{l}</div>
                        <div style={{ color: M.ink, fontWeight: 600 }}>{v}</div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                    <MButton kind="primary" size="sm">길찾기 →</MButton>
                    <MButton kind="secondary" size="sm">코스에 추가</MButton>
                  </div>
                </div>
              </div>
            </section>

            {/* 05 · 지도 저장 · 예약 (지도 패널과 공통 모듈) */}
            {mb && (
              <section id="maps" style={{ marginBottom: 56 }}>
                <Hairline label="05 · 지도 저장 · 예약" style={{ marginBottom: 28 }}/>
                <div style={{ display: "grid", gridTemplateColumns: (isMobile || !mb.ext) ? "1fr" : "1fr 1fr", gap: 28, alignItems: "start" }}>
                  <MKExtMapsModule b={mb}/>
                  {mb.ext && <MKBookingModule b={mb} onNavigate={onNavigate}/>}
                </div>
              </section>
            )}

            {/* 06 · NETWORK · 코스 + 컬렉션 (sidebar: 자체 wrap 사용) */}
            {(inCourses.length > 0 || inCollections.length > 0) && (
              <section id="network" style={{ marginBottom: 56 }}>
                <Hairline label="06 · 코스 · 시리즈 · 이 건축이 등장하는 곳" style={{ marginBottom: 28 }}/>
                <NetworkSectionInner b={b} inCourses={inCourses} inCollections={inCollections} onNavigate={onNavigate}/>
              </section>
            )}

            <section style={{ marginBottom: 56 }}>
              <Hairline label="07 · 태그 · 사용자 분류" style={{ marginBottom: 28 }}/>
              <BuildingTagsBlock b={b}/>
            </section>

            <section id="notes" style={{ marginBottom: 56 }}>
              <Hairline label="08 · VISITOR NOTES" style={{ marginBottom: 28 }}/>
              <div style={{ marginBottom: 16 }}><NoteComposer/></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {SAMPLE_NOTES.map((n, i) => <VisitorNote key={i} {...n}/>)}
              </div>
            </section>

            {/* 08 · 더 깊이 보기 — 외부 전문 정보 (마실지도는 핵심만) */}
            {mb && (
              <section id="more" style={{ marginBottom: 56 }}>
                <Hairline label="08 · 더 깊이 보기 · 외부 전문 정보" style={{ marginBottom: 28 }}/>
                <MKExtRefsModule b={mb}/>
              </section>
            )}

            <section id="related" style={{ marginBottom: 56 }}>
              <Hairline label="09 · RELATED" style={{ marginBottom: 28 }}/>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
                {related.map((r) => (
                  <div key={r.id} onClick={() => onNavigate("detail", r.id)} style={{ cursor: "pointer" }}>
                    <ImgPlaceholder ratio="4/3" tone={r.pinTone === "olive" ? "olive" : "beige"} caption={r.name}/>
                    <div style={{ fontSize: 16, fontWeight: 800, color: M.ink, marginTop: 12, letterSpacing: "-0.015em" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 2 }}>{r.architect} · {r.year}</div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </section>
        <MFooter />
      </MPage>
    );
  }

  // === LONGFORM (싱글 컬럼 에세이) ===
  return (
    <MPage>
      <MasilNav route={route} onNavigate={onNavigate}/>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 24px", textAlign: "center" }}>
        <Serial color={accent} size={14}>마실맵 / 건축 노트</Serial>
        <h1 style={{ fontSize: isMobile ? 36 : 64, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.04, margin: "20px 0 16px", color: M.ink, textWrap: "balance" }}>
          {b.name}
        </h1>
        <div style={{ fontFamily: MT.family, fontSize: 18, fontStyle: "italic", color: M.muted, marginBottom: 24 }}>{b.nameEn}</div>
        <Hairline label={`${b.region} · ${b.architect} · ${b.year}`}/>
      </section>

      <section style={{ padding: "20px 24px 40px" }}>
        <ImgPlaceholder ratio="21/9" tone={b.pinTone === "olive" ? "olive" : "beige"} caption={`${b.name} · 외관`} style={{ borderRadius: MR.cardLg, maxWidth: 1200, margin: "0 auto" }}/>
      </section>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 64px", display: "flex", flexDirection: "column", gap: 28 }}>
        <BodyBlock block={{ kind: "lead", text: b.longRead }} style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}/>

        <Hairline style={{ margin: "16px 0" }}/>

        <BodyBlock block={SAMPLE_BODY[0]}/>
        <BodyBlock block={SAMPLE_BODY[1]}/>

        <figure style={{ margin: "16px -120px" }}>
          <ImgPlaceholder ratio="16/9" tone="deep" caption={`${b.name} · 내부 디테일`} style={{ borderRadius: MR.cardLg }}/>
          <figcaption style={{ fontFamily: MT.family, fontSize: 13, color: M.muted, marginTop: 12, textAlign: "center" }}>
            FIG. 02 · 빛이 떨어지는 자리. 회랑 끝에서 본 모습.
          </figcaption>
        </figure>

        <BodyBlock block={SAMPLE_BODY[2]}/>
        <BodyBlock block={SAMPLE_BODY[3]}/>

        <figure style={{ margin: "16px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <ImgPlaceholder ratio="4/5" tone="terra" caption="디테일"/>
          <ImgPlaceholder ratio="4/5" tone="olive" caption="평면"/>
        </figure>

        <BodyBlock block={SAMPLE_BODY[4]}/>

        <Hairline label="VISITOR NOTES" style={{ margin: "40px 0 20px" }}/>
        <div style={{ marginBottom: 12 }}><NoteComposer/></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SAMPLE_NOTES.map((n, i) => <VisitorNote key={i} {...n}/>)}
        </div>

        <Hairline label="VISIT INFO" style={{ margin: "40px 0 20px" }}/>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <MiniMap b={b}/>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
            <MetaRow items={[{ label: "주소", value: b.address }]}/>
            <MetaRow items={[{ label: "관람", value: b.metrics.visit }, { label: "휴관", value: "월요일" }]}/>
            <MetaRow items={[{ label: "교통", value: "지하철+도보" }]}/>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <MButton kind="primary" size="sm">길찾기</MButton>
              <MButton kind="outline" size="sm">코스 추가</MButton>
            </div>
          </div>
        </div>
      </article>

      {/* NETWORK · 코스 + 컬렉션 */}
      <NetworkSection b={b} inCourses={inCourses} inCollections={inCollections} onNavigate={onNavigate}/>

      <section style={{ padding: "32px 24px 64px", background: M.beigeAlt }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Hairline label="다음 글 · NEXT READ" style={{ marginBottom: 24 }}/>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
            {related.map((r) => (
              <div key={r.id} onClick={() => onNavigate("detail", r.id)} style={{ background: M.cream, borderRadius: MR.card, padding: 14, cursor: "pointer", boxShadow: MS.cardSm }}>
                <ImgPlaceholder ratio="4/3" tone={r.pinTone === "olive" ? "olive" : "beige"} caption={r.name}/>
                <div style={{ padding: "12px 4px 4px" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 2 }}>{r.architect} · {r.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MFooter />
    </MPage>
  );
}

Object.assign(window, { DetailScreen });
