/* ================================================================
   masilmap — 데이터 업로드
   (#7) 빠른 등록 (얇은 핀)
   (#8) 깊은 큐레이션 레코드 + 권리 게이트
   ================================================================ */

/* 공통 input */
function MInput({ label, placeholder, value, onChange, required, hint, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: M.ink, letterSpacing: "-0.005em" }}>{label}</span>
          {required && <span style={{ fontSize: 11, fontWeight: 800, color: M.terra }}>* 필수</span>}
        </div>
      )}
      <input
        value={value || ""} placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          padding: "12px 16px", borderRadius: 14,
          border: `1.5px solid ${M.beigeAlt}`,
          background: M.cream,
          fontSize: 14, fontWeight: 600, fontFamily: "inherit", color: M.ink,
          outline: "none",
        }}/>
      {hint && <div style={{ fontSize: 11, color: M.muted, fontWeight: 600 }}>{hint}</div>}
    </div>
  );
}

function MSelect({ label, value, options, onChange, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: M.ink }}>{label}</span>
          {required && <span style={{ fontSize: 11, fontWeight: 800, color: M.terra }}>* 필수</span>}
        </div>
      )}
      <select value={value} onChange={(e) => onChange?.(e.target.value)} style={{
        padding: "12px 16px", borderRadius: 14,
        border: `1.5px solid ${M.beigeAlt}`,
        background: M.cream,
        fontSize: 14, fontWeight: 600, fontFamily: "inherit", color: M.ink,
        outline: "none", cursor: "pointer",
      }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* localStorage 제보 저장/불러오기 */
const TIPS_KEY = "masil_tips_v1";
function loadTips() {
  try { return JSON.parse(localStorage.getItem(TIPS_KEY) || "[]"); } catch { return []; }
}
function saveTip(tip) {
  try {
    const tips = loadTips();
    tips.unshift(tip);
    localStorage.setItem(TIPS_KEY, JSON.stringify(tips));
  } catch {}
}
function updateTipStatus(id, status) {
  try {
    const tips = loadTips().map((t) => t.id === id ? { ...t, status } : t);
    localStorage.setItem(TIPS_KEY, JSON.stringify(tips));
    window.dispatchEvent(new Event("masil-tips-change"));
  } catch {}
}

/* ================================================================
   #7  공간 제보하기 (누구나 · 관리자 승인 후 등록)
   ================================================================ */
const TIP_CATEGORIES = ["미술관·갤러리","카페·레스토랑","한옥·전통건축","현대건축","공원·광장","도서관","종교건축","복합문화공간","주거·아파트","기타"];

function UploadQuickScreen({ onNavigate }) {
  const isMobile = useIsMobile();
  const [step, setStep] = React.useState("form"); // form | done
  const [name, setName]       = React.useState("");
  const [address, setAddress] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [note, setNote]       = React.useState("");
  const [contact, setContact] = React.useState("");
  const [tipId, setTipId]     = React.useState("");

  const canSubmit = name.trim().length > 0 && address.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const id = `tip_${Date.now()}`;
    saveTip({
      id, status: "pending",
      name: name.trim(), address: address.trim(),
      category: category || "기타",
      photoUrl: photoUrl.trim(),
      note: note.trim(),
      contact: contact.trim(),
      submittedAt: new Date().toISOString(),
    });
    setTipId(id);
    setStep("done");
    window.dispatchEvent(new Event("masil-tips-change"));
  };

  /* 완료 화면 */
  if (step === "done") {
    return (
      <MPage>
        <MasilNav route="upload" onNavigate={onNavigate}/>
        <section style={{ padding: isMobile ? "60px 24px 80px" : "80px 56px 100px", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `${M.olive}18`, border: `2px solid ${M.olive}`,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, marginBottom: 24,
          }}>📍</div>
          <MagCap color={M.olive} style={{ marginBottom: 12 }}>제보 완료 · SUBMITTED</MagCap>
          <h1 style={{ fontSize: isMobile ? 32 : 44, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.2, color: M.ink, margin: "0 0 16px", textWrap: "balance" }}>
            "{name}" 공간을<br/>제보해주셨어요!
          </h1>
          <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 15 : 17, lineHeight: 1.75, color: M.muted, margin: "0 0 36px", textWrap: "pretty" }}>
            마실맵 운영팀이 검토 후 지도에 올릴게요.<br/>
            보통 3~7일 안에 결과를 알려드립니다.
          </p>
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: "20px 24px", marginBottom: 32, textAlign: "left", border: `1px solid ${M.beigeAlt}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: M.muted, marginBottom: 12 }}>제보 요약</div>
            {[
              ["공간 이름", name],
              ["주소", address],
              ["분류", category || "기타"],
              ["접수 번호", tipId.replace("tip_", "").slice(-6)],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: M.ink, padding: "6px 0", borderBottom: `1px solid ${M.beigeAlt}` }}>
                <span style={{ color: M.muted }}>{l}</span>
                <span style={{ fontWeight: 800 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <MButton kind="primary" size="lg" onClick={() => onNavigate("home")} style={{ justifyContent: "center" }}>홈으로 돌아가기</MButton>
            <div onClick={() => { setStep("form"); setName(""); setAddress(""); setCategory(""); setPhotoUrl(""); setNote(""); setContact(""); }}
              style={{ fontSize: 13, fontWeight: 700, color: M.muted, cursor: "pointer", padding: "8px 0" }}>
              다른 공간도 제보하기 →
            </div>
          </div>
        </section>
        <MFooter/>
      </MPage>
    );
  }

  /* 제보 폼 */
  return (
    <MPage>
      <MasilNav route="upload" onNavigate={onNavigate}/>

      {/* 헤더 */}
      <section style={{ padding: isMobile ? "32px 20px 24px" : "48px 56px 32px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 20 }}>
          <span onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>마실맵</span>
          <MIcon name="chevron" size={12} color={M.muted}/>
          <span style={{ color: M.ink }}>공간 제보하기</span>
        </div>

        <MagCap color={M.terra} style={{ marginBottom: 12 }}>누구나 제보할 수 있어요</MagCap>
        <h1 style={{ fontSize: isMobile ? 34 : 52, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, color: M.ink, margin: "0 0 14px", textWrap: "balance" }}>
          걷기 좋은 공간을<br/>
          <span style={{ color: M.olive }}>발견</span>하셨나요?
        </h1>
        <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: isMobile ? 15 : 17, lineHeight: 1.7, color: M.muted, margin: 0, maxWidth: 520, textWrap: "pretty" }}>
          공간 이름과 위치만 알려주셔도 충분합니다. 운영팀이 검토해 마실맵 지도에 올려드립니다.
        </p>
      </section>

      {/* 폼 */}
      <section style={{ padding: isMobile ? "0 20px 64px" : "0 56px 80px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* 필수 */}
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: isMobile ? 20 : 28, boxShadow: MS.cardSm, display: "flex", flexDirection: "column", gap: 16 }}>
            <MagCap color={M.terra}>필수 정보</MagCap>
            <MInput
              label="공간 이름" required
              placeholder="예: 환기미술관, 성수연방, 오래된 한옥 갤러리"
              value={name} onChange={setName}/>
            <MInput
              label="주소 또는 위치 설명" required
              placeholder="예: 서울시 종로구 자하문로40길 63 / 성수역 3번 출구에서 도보 5분"
              value={address} onChange={setAddress}/>
          </div>

          {/* 분류 */}
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: isMobile ? 20 : 28, boxShadow: MS.cardSm }}>
            <MagCap style={{ marginBottom: 14 }}>분류 (선택)</MagCap>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TIP_CATEGORIES.map((c) => {
                const on = category === c;
                return (
                  <div key={c} onClick={() => setCategory(on ? "" : c)} style={{
                    padding: "9px 16px", borderRadius: 999, cursor: "pointer",
                    fontSize: 13, fontWeight: 700,
                    background: on ? M.terra : M.beige,
                    color: on ? "#fff" : M.ink,
                    border: `1.5px solid ${on ? M.terra : M.beigeAlt}`,
                    transition: "all .15s",
                  }}>{c}</div>
                );
              })}
            </div>
          </div>

          {/* 사진 URL */}
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: isMobile ? 20 : 28, boxShadow: MS.cardSm, display: "flex", flexDirection: "column", gap: 14 }}>
            <MagCap>사진 (선택)</MagCap>
            <MInput
              label="사진 URL"
              placeholder="예: https://example.com/photo.jpg (인스타그램·블로그·구글맵 사진 링크)"
              value={photoUrl} onChange={setPhotoUrl}
              hint="직접 찍은 사진이 있으면 구글 포토나 인스타그램 링크를 넣어주세요."/>
            {photoUrl.trim() && (
              <div style={{ borderRadius: 14, overflow: "hidden", maxHeight: 200 }}>
                <img src={photoUrl.trim()} alt="미리보기"
                  style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                  onError={(e) => e.target.style.display = "none"}/>
              </div>
            )}
          </div>

          {/* 추가 설명 */}
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: isMobile ? 20 : 28, boxShadow: MS.cardSm, display: "flex", flexDirection: "column", gap: 12 }}>
            <MagCap>이 공간에 대해 (선택)</MagCap>
            <textarea
              value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="어떤 공간인지, 어떤 점이 걷기 좋은지 자유롭게 적어주세요. 마실맵 팀이 소개글 작성에 참고합니다."
              style={{
                width: "100%", minHeight: 120, padding: "14px 16px",
                borderRadius: 14, border: `1.5px solid ${M.beigeAlt}`,
                background: M.beige, fontFamily: "inherit",
                fontSize: 14, lineHeight: 1.65, color: M.ink,
                resize: "vertical", outline: "none", boxSizing: "border-box",
              }}/>
          </div>

          {/* 연락처 */}
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: isMobile ? 20 : 28, boxShadow: MS.cardSm }}>
            <MInput
              label="연락처 (선택)"
              placeholder="검토 결과를 받고 싶으면 이메일 또는 인스타 계정을 남겨주세요"
              value={contact} onChange={setContact}
              hint="익명 제보도 가능합니다. 연락처는 결과 안내 외에 사용하지 않습니다."/>
          </div>

          {/* 제출 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 8 }}>
            <MButton
              kind="primary" size="lg"
              style={{ justifyContent: "center", opacity: canSubmit ? 1 : 0.45, pointerEvents: canSubmit ? "auto" : "none" }}
              onClick={handleSubmit}>
              제보 보내기 📍
            </MButton>
            {!canSubmit && (
              <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, textAlign: "center" }}>
                공간 이름과 주소를 입력하면 제보할 수 있어요
              </div>
            )}
            <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, textAlign: "center", lineHeight: 1.6 }}>
              익명 제보 가능 · 운영팀 검토 후 등록 · 보통 3~7일 소요
            </div>
          </div>
        </div>
      </section>

      <MFooter/>
    </MPage>
  );
}

/* ================================================================
   #8  깊은 큐레이션 레코드 + 권리 게이트
   ================================================================ */
function UploadDeepScreen({ onNavigate }) {
  const [section, setSection] = React.useState("photos");
  const [rightsOwned, setRightsOwned] = React.useState(null);
  const [assetType, setAssetType] = React.useState("사진");
  const [contributors, setContributors] = React.useState([
    { id: 1, name: "건축가 유족", share: 60 },
    { id: 2, name: "마실맵",      share: 40 },
  ]);

  const sections = [
    { id: "photos",   label: "01 사진·도면",     done: true },
    { id: "info",     label: "02 상세 속성",     done: true },
    { id: "intent",   label: "03 건축가의 한마디", done: false },
    { id: "rights",   label: "04 권리 게이트",    done: false, special: true },
  ];

  return (
    <MPage>
      <MasilNav route="upload" onNavigate={onNavigate}/>

      <section style={{ padding: "32px 56px 24px", maxWidth: 1300, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 20 }}>
          <span onClick={() => onNavigate("upload-quick")} style={{ cursor: "pointer" }}>빠른 등록</span>
          <MIcon name="chevron" size={12} color={M.muted}/>
          <span style={{ color: M.ink }}>깊은 큐레이션 레코드</span>
        </div>
        <Hairline label="UPLOAD · DEEP RECORD" style={{ marginBottom: 24 }}/>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "end" }}>
          <div>
            <MagCap color={M.terra} style={{ marginBottom: 12 }}>천천히 채워도 괜찮아요 · 자동 저장</MagCap>
            <h1 style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.04, color: M.ink, margin: 0, textWrap: "balance" }}>
              공간의 <span style={{ color: M.olive, fontWeight: 900 }}>이야기</span>를<br/>
              한 줄씩 모아주세요
            </h1>
          </div>
          <div>
            <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 16, lineHeight: 1.7, color: M.muted, margin: 0, fontWeight: 400, textWrap: "pretty" }}>
              사진과 도면, 운영시간 같은 정보부터 “건축가의 한마디”까지. 입력이 많지만, 한 섹션씩 완성하면 됩니다.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "16px 56px 64px", maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "240px 1fr", gap: 40 }}>
        {/* 사이드 진척도 */}
        <aside style={{ position: "sticky", top: 110, alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 4 }}>
          <MagCap style={{ marginBottom: 8 }}>SECTIONS</MagCap>
          {sections.map((s) => {
            const on = section === s.id;
            return (
              <div key={s.id} onClick={() => setSection(s.id)} style={{
                padding: "12px 14px", borderRadius: 14,
                background: on ? M.terra : "transparent",
                color: on ? M.cream : M.ink,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                border: !on && s.special ? `1px dashed ${M.terra}50` : "1px solid transparent",
              }}>
                <span style={{ fontSize: 13, fontWeight: 800 }}>{s.label}</span>
                {s.done
                  ? <span style={{ fontSize: 11, fontWeight: 800, color: on ? "rgba(255,248,236,0.7)" : M.olive }}>✓</span>
                  : <span style={{ fontSize: 11, fontWeight: 700, color: on ? "rgba(255,248,236,0.7)" : M.muted }}>—</span>}
              </div>
            );
          })}
          <Hairline style={{ margin: "16px 4px" }}/>
          <div style={{ padding: "12px 14px", fontSize: 11, color: M.muted, fontWeight: 700, lineHeight: 1.6 }}>
            진척도 · 2 / 4 섹션 완료<br/>
            <div style={{ width: "100%", height: 4, background: M.beigeAlt, borderRadius: 2, marginTop: 8 }}>
              <div style={{ width: "50%", height: "100%", background: M.terra, borderRadius: 2 }}/>
            </div>
          </div>
        </aside>

        {/* 메인 */}
        <div>
          {section === "photos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 28, boxShadow: MS.cardSm }}>
                <MagCap color={M.terra}>01 · PHOTOS · 사진 갤러리</MagCap>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", margin: "6px 0 16px" }}>여러 장의 사진을 올려주세요</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {[0,1,2].map((i) => (
                    <ImgPlaceholder key={i} ratio="1/1" tone={["beige","olive","terra"][i]} caption={["외관","내부","디테일"][i]}/>
                  ))}
                  <div style={{
                    aspectRatio: "1/1", borderRadius: 16,
                    border: `1.5px dashed ${M.beigeAlt}`,
                    background: M.beige,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                    cursor: "pointer",
                  }}>
                    <MIcon name="plus" size={22} color={M.muted}/>
                    <span style={{ fontSize: 12, color: M.muted, fontWeight: 700 }}>추가</span>
                  </div>
                </div>
                <div style={{ marginTop: 14, fontSize: 12, color: M.muted, fontWeight: 600 }}>3 / 20장 · JPG·PNG 최대 12MB</div>
              </div>

              <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 28, boxShadow: MS.cardSm }}>
                <MagCap color={M.terra}>01 · DRAWINGS · 도면 업로드</MagCap>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", margin: "6px 0 16px" }}>평면도·단면도 (선택)</h3>
                <div style={{
                  padding: 32, borderRadius: 16,
                  border: `1.5px dashed ${M.beigeAlt}`,
                  background: M.beige,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  cursor: "pointer",
                }}>
                  <MIcon name="edit" size={28} color={M.muted}/>
                  <span style={{ fontSize: 13, color: M.muted, fontWeight: 700 }}>드래그하거나 클릭해 PDF/DWG 업로드</span>
                  <span style={{ fontSize: 11, color: M.faint, fontWeight: 600 }}>최대 50MB · 다중 업로드 가능</span>
                </div>
              </div>
              <SectionNavRow onPrev={null} onNext={() => setSection("info")} nextLabel="다음 · 상세 속성"/>
            </div>
          )}

          {section === "info" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 28, boxShadow: MS.cardSm, display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <MagCap color={M.terra}>02 · ATTRIBUTES · 상세 속성</MagCap>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", margin: "6px 0 0" }}>건축의 기본 정보</h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <MSelect label="용도" value="미술관" options={["미술관","사무소","주택","사찰","교회","공공"]} required/>
                  <MInput label="층수" placeholder="예: 지하 1층 / 지상 3층" required/>
                  <MInput label="구조 / 재료" placeholder="예: 콘크리트 라멘 + 적벽돌 외장"/>
                  <MInput label="연면적 (㎡)" placeholder="예: 3,200"/>
                  <MInput label="설계자" placeholder="예: 우규승" required/>
                  <MInput label="완공연도" placeholder="예: 1992" required/>
                  <MInput label="운영시간" placeholder="예: 화-일 10:00 - 18:00 · 월요일 휴관"/>
                  <MInput label="입장료" placeholder="예: 무료 / ₩ 15,000"/>
                </div>
              </div>
              <SectionNavRow onPrev={() => setSection("photos")} onNext={() => setSection("intent")} nextLabel="다음 · 건축가의 한마디"/>
            </div>
          )}

          {section === "intent" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 28, boxShadow: MS.cardSm }}>
                <MagCap color={M.terra}>03 · INTENT · 건축가의 한마디</MagCap>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", margin: "6px 0 4px" }}>설계 의도를 자유롭게 적어주세요</h3>
                <p style={{ fontSize: 13, color: M.muted, fontWeight: 500, margin: "0 0 16px" }}>
                  방문자가 가장 오래 머무는 섹션입니다. 건축가의 인터뷰, 설계 노트, 일화 등 무엇이든 좋아요.
                </p>
                <textarea placeholder="이 건물은 김환기 화백의 점화에서 모티프를 가져와…" style={{
                  width: "100%", minHeight: 220, padding: 18,
                  borderRadius: 16, border: `1.5px solid ${M.beigeAlt}`,
                  background: M.beige, fontFamily: "'Noto Serif KR', serif",
                  fontSize: 16, lineHeight: 1.7, color: M.ink,
                  resize: "vertical", outline: "none",
                }}/>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: M.muted, fontWeight: 600 }}>
                  <span>마크다운 지원 · **굵게** *기울임* > 인용</span>
                  <span>0 / 4,000자</span>
                </div>
              </div>
              <SectionNavRow onPrev={() => setSection("info")} onNext={() => setSection("rights")} nextLabel="다음 · 권리 게이트"/>
            </div>
          )}

          {section === "rights" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{
                background: M.cream, borderRadius: MR.cardLg, padding: 28,
                boxShadow: MS.cardSm, borderTop: `4px solid ${M.terra}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <MagCap color={M.terra}>04 · RIGHTS GATE · 권리 게이트</MagCap>
                  <span style={{ fontSize: 10, fontWeight: 800, color: M.cream, background: M.terra, padding: "3px 8px", borderRadius: 999 }}>CRITICAL</span>
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", margin: "4px 0 6px" }}>이 자료의 권리를 알려주세요</h3>
                <p style={{ fontSize: 13, color: M.muted, fontWeight: 500, lineHeight: 1.65, margin: "0 0 24px", textWrap: "pretty" }}>
                  마실맵은 모든 자료의 권리 관계를 명확히 기록합니다. 공동 권리자가 있는 경우 동의 절차가 끝날 때까지 자료 노출이 <b>보류</b>됩니다.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  {/* 자료 유형 */}
                  <div>
                    <label style={{ fontSize: 14, fontWeight: 800, color: M.ink, display: "block", marginBottom: 10 }}>
                      Q1. 이 자료의 유형은? <span style={{ color: M.terra }}>*</span>
                    </label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {["사진","도면","3D 모델","다이어그램","영상","텍스트"].map((t) => {
                        const on = assetType === t;
                        return (
                          <div key={t} onClick={() => setAssetType(t)} style={{
                            padding: "10px 16px", borderRadius: 999,
                            background: on ? M.ink : "transparent",
                            color: on ? M.cream : M.ink,
                            border: on ? "none" : `1px solid ${M.beigeAlt}`,
                            fontSize: 13, fontWeight: 800, cursor: "pointer",
                          }}>{t}</div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 권리 보유 */}
                  <div>
                    <label style={{ fontSize: 14, fontWeight: 800, color: M.ink, display: "block", marginBottom: 10 }}>
                      Q2. 이 자료의 권리가 <b style={{ color: M.terra }}>100% 본인</b>에게 있습니까? <span style={{ color: M.terra }}>*</span>
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <RightsChoice on={rightsOwned === "yes"} onClick={() => setRightsOwned("yes")}
                        label="네, 100% 제 권리입니다"
                        sub="단독 저작권 · 즉시 공개 가능"
                        color={M.olive}/>
                      <RightsChoice on={rightsOwned === "no"} onClick={() => setRightsOwned("no")}
                        label="아니오, 공동 권리자가 있어요"
                        sub="공동 권리자 동의 후 공개"
                        color={M.terra}/>
                    </div>
                  </div>

                  {/* 공동 권리자 (아니오 선택 시) */}
                  {rightsOwned === "no" && (
                    <div style={{ padding: 20, borderRadius: 18, background: M.beige, border: `1px solid ${M.beigeAlt}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                        <MagCap color={M.terra}>공동 권리자 & 수익 배분</MagCap>
                        <span style={{ fontSize: 11, color: M.muted, fontWeight: 700 }}>합계 {contributors.reduce((s, c) => s + c.share, 0)}%</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {contributors.map((c, i) => (
                          <div key={c.id} style={{ display: "grid", gridTemplateColumns: "32px 1fr 120px 36px", gap: 10, alignItems: "center" }}>
                            <Serial color={M.terra} size={13}>0{i + 1}</Serial>
                            <input value={c.name} onChange={(e) => {
                              const next = [...contributors];
                              next[i] = { ...next[i], name: e.target.value };
                              setContributors(next);
                            }} placeholder="권리자 이름 또는 단체"
                            style={{
                              padding: "10px 14px", borderRadius: 12, border: `1px solid ${M.beigeAlt}`, background: M.cream,
                              fontSize: 13, fontWeight: 700, color: M.ink, fontFamily: "inherit", outline: "none",
                            }}/>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, background: M.cream, borderRadius: 12, padding: "8px 12px", border: `1px solid ${M.beigeAlt}` }}>
                              <input type="number" value={c.share} onChange={(e) => {
                                const next = [...contributors];
                                next[i] = { ...next[i], share: Number(e.target.value) || 0 };
                                setContributors(next);
                              }} style={{ width: 48, border: "none", outline: "none", background: "transparent", fontSize: 14, fontWeight: 800, color: M.ink, fontFamily: "inherit" }}/>
                              <span style={{ fontSize: 13, fontWeight: 800, color: M.muted }}>%</span>
                            </div>
                            <button onClick={() => setContributors(contributors.filter((x) => x.id !== c.id))} style={{ border: "none", background: "transparent", color: M.muted, fontSize: 18, cursor: "pointer" }}>×</button>
                          </div>
                        ))}
                        <button onClick={() => setContributors([...contributors, { id: Date.now(), name: "", share: 0 }])}
                          style={{ marginTop: 4, padding: "10px 14px", borderRadius: 12, background: "transparent", border: `1.5px dashed ${M.beigeAlt}`, color: M.terra, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                          <MIcon name="plus" size={14} color={M.terra}/> 권리자 추가
                        </button>
                      </div>
                      <div style={{ marginTop: 14, padding: 12, background: M.cream, borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ fontSize: 16 }}>📩</span>
                        <span style={{ fontSize: 12, color: M.ink, fontWeight: 600, lineHeight: 1.6, textWrap: "pretty" }}>
                          입력된 공동 권리자에게 자동으로 동의 요청 메일이 발송됩니다. 모든 공동 권리자의 동의 전까지 이 자료는 <b style={{ color: M.terra }}>‘보류’</b> 상태로 유지됩니다.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 동의 안내 */}
                  <div>
                    <label style={{ fontSize: 14, fontWeight: 800, color: M.ink, display: "block", marginBottom: 10 }}>Q3. 활용 동의</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 16, borderRadius: 14, background: M.beige, border: `1px solid ${M.beigeAlt}` }}>
                      <Check on={true} onToggle={() => {}} label="(필수) 마실맵 서비스 내 노출에 동의합니다"/>
                      <Check on={false} onToggle={() => {}} label="(선택) 마실맵 큐레이션 콘텐츠 제작에 활용 동의"/>
                      <Check on={false} onToggle={() => {}} label="(선택) 마실그라운드 제휴 매체 노출 동의"/>
                      <Check on={false} onToggle={() => {}} label="(선택) 추후 데이터 이전 시 사전 통지에 동의"/>
                    </div>
                  </div>
                </div>
              </div>

              <SectionNavRow onPrev={() => setSection("intent")} onNext={() => onNavigate("admin-content")} nextLabel="등록 완료 → 검수 대기"/>
            </div>
          )}
        </div>
      </section>

      <MFooter/>
    </MPage>
  );
}

function SectionNavRow({ onPrev, onNext, nextLabel }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10 }}>
      {onPrev
        ? <MButton kind="outline" size="md" onClick={onPrev}>← 이전 섹션</MButton>
        : <span/>}
      <MButton kind="primary" size="lg" onClick={onNext}>{nextLabel} →</MButton>
    </div>
  );
}

function RightsChoice({ on, onClick, label, sub, color }) {
  return (
    <div onClick={onClick} style={{
      padding: 18, borderRadius: 16, cursor: "pointer",
      border: on ? `2px solid ${color}` : `1.5px solid ${M.beigeAlt}`,
      background: on ? `${color}0d` : M.beige,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 999,
          border: `2px solid ${on ? color : M.beigeAlt}`,
          background: on ? color : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: M.cream, fontWeight: 900, fontSize: 12,
        }}>{on ? "●" : ""}</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: M.ink, letterSpacing: "-0.01em" }}>{label}</div>
      </div>
      <div style={{ fontSize: 12, color: M.muted, marginTop: 8, marginLeft: 32, fontWeight: 600 }}>{sub}</div>
    </div>
  );
}

Object.assign(window, { UploadQuickScreen, UploadDeepScreen, loadTips, updateTipStatus });
