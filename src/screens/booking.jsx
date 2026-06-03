/* ================================================================
   masilmap — 예약 플로우
   (#3) 도슨트 예약 → (#4) 결제 / 완료 → (#5) 외부 공간 연결
   ================================================================ */

/* ---------- 진행 단계 표시 ---------- */
function StepBar({ active }) {
  const steps = ["코스 선택", "예약 정보", "결제", "확정"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 56px", borderBottom: `1px solid ${M.beigeAlt}` }}>
      {steps.map((s, i) => {
        const isOn = i === active;
        const done = i < active;
        return (
          <React.Fragment key={s}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 999,
                background: done ? M.olive : isOn ? M.terra : "transparent",
                border: !done && !isOn ? `1.5px solid ${M.beigeAlt}` : "none",
                color: done || isOn ? M.cream : M.muted,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 12,
              }}>{done ? "✓" : i + 1}</div>
              <span style={{
                fontSize: 13, fontWeight: 800,
                color: done ? M.olive : isOn ? M.ink : M.muted,
                whiteSpace: "nowrap",
              }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 36, height: 1, background: done ? M.olive : M.beigeAlt }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ---------- 캘린더 그리드 ---------- */
function Calendar({ value, onChange }) {
  const today = 25; // pretend "today"
  const days = ["일","월","화","수","목","금","토"];
  // June 2026 grid (just illustrative)
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: M.ink, letterSpacing: "-0.01em" }}>2026년 6월</span>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: 999, background: M.beige, display: "flex", alignItems: "center", justifyContent: "center", color: M.muted, cursor: "pointer" }}>‹</div>
          <div style={{ width: 28, height: 28, borderRadius: 999, background: M.beige, display: "flex", alignItems: "center", justifyContent: "center", color: M.muted, cursor: "pointer" }}>›</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
        {days.map((d, i) => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? M.terra : i === 6 ? M.olive : M.muted, padding: "6px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const d = i + 1;
          const isSelected = d === value;
          const isPast = d < today;
          const isAvail = !isPast && (d % 7 === 0 || d % 7 === 6 || d === 25 || d === 27 || d === 28);
          const sun = (i + 1) % 7 === 1;
          return (
            <div key={d} onClick={() => isAvail && onChange(d)} style={{
              aspectRatio: "1/1",
              borderRadius: 12,
              background: isSelected ? M.terra : "transparent",
              color: isSelected ? M.cream : isPast ? M.faint : isAvail ? M.ink : M.muted,
              border: !isSelected && isAvail ? `1px solid ${M.beigeAlt}` : "none",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 14,
              cursor: isAvail ? "pointer" : "default",
              opacity: isPast ? 0.4 : 1,
              position: "relative",
            }}>
              <span>{d}</span>
              {isAvail && !isSelected && (
                <span style={{ width: 4, height: 4, borderRadius: 999, background: M.olive, marginTop: 2 }}/>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, color: M.muted, fontWeight: 600 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: 999, background: M.olive }}/> 예약 가능</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: 999, background: M.terra }}/> 선택됨</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: 999, background: M.faint }}/> 마감</span>
      </div>
    </div>
  );
}

/* ================================================================
   (#3) 도슨트 코스 예약 — 정보 입력 단계
   ================================================================ */
function BookingDocentScreen({ onNavigate, courseId }) {
  const c = COURSES.find((x) => x.id === courseId) || COURSES[0];
  const [date, setDate] = React.useState(27);
  const [time, setTime] = React.useState(c.schedule[0]);
  const [people, setPeople] = React.useState(2);
  const total = c.price * people;

  return (
    <MPage>
      <MasilNav route="booking" onNavigate={onNavigate}/>
      <StepBar active={1}/>

      <section style={{ padding: "32px 56px", maxWidth: 1200, margin: "0 auto" }}>
        <Hairline label="RESERVE · 도슨트 예약" style={{ marginBottom: 24 }}/>
        <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05, color: M.ink, margin: 0, textWrap: "balance" }}>
          언제, 몇 분이서<br/>
          <span style={{ color: M.olive, fontWeight: 900 }}>마실</span> 다녀오실까요?
        </h1>
        <p style={{ fontSize: 15, color: M.muted, marginTop: 14, fontWeight: 500, fontFamily: "'Noto Serif KR', serif" }}>
          {c.curator.name} 큐레이터가 직접 안내합니다. 우천 시에도 운영되며, 1시간 전까지 무료 취소.
        </p>
      </section>

      <section style={{ padding: "0 56px 64px", maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32 }}>
        {/* 좌측 입력 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* 코스 요약 카드 */}
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 20, boxShadow: MS.cardSm, display: "flex", gap: 16 }}>
            <div style={{ width: 140, flexShrink: 0, background: c.cover, borderRadius: 16, padding: 14, color: M.cream, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <MagCap color="rgba(255,248,236,0.7)">{c.type === "도슨트" ? "DOCENT" : "SELF"}</MagCap>
              <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em" }}>{c.buildings.length}곳</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <MagCap>{c.distance} · {c.duration}</MagCap>
                <MagCap color={M.olive}>★ {c.rating}</MagCap>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em", marginTop: 6 }}>{c.name}</div>
              <p style={{ fontSize: 13, color: M.ink, lineHeight: 1.55, marginTop: 8, fontWeight: 500, textWrap: "pretty" }}>{c.blurb}</p>
            </div>
          </div>

          {/* 날짜 */}
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 24, boxShadow: MS.cardSm }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <div>
                <MagCap color={M.terra}>STEP 01</MagCap>
                <h3 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: "4px 0 0" }}>날짜를 골라주세요</h3>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: M.muted }}>* 가능한 일자만 활성화</span>
            </div>
            <Calendar value={date} onChange={setDate}/>
          </div>

          {/* 시간 */}
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 24, boxShadow: MS.cardSm }}>
            <MagCap color={M.terra}>STEP 02</MagCap>
            <h3 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: "4px 0 16px" }}>시간대</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {c.schedule.map((s) => {
                const on = s === time;
                return (
                  <div key={s} onClick={() => setTime(s)} style={{
                    padding: "16px 12px", borderRadius: 16, textAlign: "center",
                    background: on ? M.terra : "transparent",
                    color: on ? M.cream : M.ink,
                    border: on ? "none" : `1px solid ${M.beigeAlt}`,
                    cursor: "pointer",
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.01em" }}>{s}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.8, marginTop: 2 }}>남은 자리 8</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 인원 */}
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 24, boxShadow: MS.cardSm }}>
            <MagCap color={M.terra}>STEP 03</MagCap>
            <h3 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: "4px 0 16px" }}>몇 분이서 가시나요?</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: 16, background: M.beige }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: M.ink }}>성인 인원</div>
                <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 2 }}>최대 12명까지 (코스당)</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button onClick={() => setPeople(Math.max(1, people - 1))} style={{ width: 36, height: 36, borderRadius: 999, background: M.cream, border: "none", color: M.ink, fontWeight: 900, fontSize: 18, cursor: "pointer", boxShadow: MS.cardSm }}>−</button>
                <span style={{ fontSize: 22, fontWeight: 900, color: M.ink, minWidth: 24, textAlign: "center" }}>{people}</span>
                <button onClick={() => setPeople(Math.min(12, people + 1))} style={{ width: 36, height: 36, borderRadius: 999, background: M.terra, border: "none", color: M.cream, fontWeight: 900, fontSize: 18, cursor: "pointer" }}>+</button>
              </div>
            </div>
          </div>

          {/* 안내 */}
          <div style={{ padding: 20, borderRadius: MR.card, border: `1px dashed ${M.beigeAlt}`, background: "transparent" }}>
            <MagCap color={M.terra} style={{ marginBottom: 8 }}>도슨트 안내</MagCap>
            <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 13, lineHeight: 1.7, color: M.ink, fontWeight: 500 }}>
              <li>{c.curator.name} 큐레이터가 직접 진행합니다 · 한국어</li>
              <li>집합: <b>{c.meetingPoint}</b> · 출발 15분 전 도착 권장</li>
              <li>편한 신발과 가벼운 외투를 추천드려요</li>
              <li>1시간 전까지 무료 취소 · 이후 50% 환불</li>
            </ul>
          </div>
        </div>

        {/* 우측 가격 요약 (sticky) */}
        <aside style={{ position: "sticky", top: 110, alignSelf: "flex-start" }}>
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 24, boxShadow: MS.cardLg }}>
            <MagCap color={M.terra}>YOUR RESERVATION</MagCap>
            <h3 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, margin: "8px 0 16px" }}>예약 요약</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
              <Row label="코스" value={c.name}/>
              <Row label="날짜" value={`2026.06.${date.toString().padStart(2,"0")} (${["일","월","화","수","목","금","토"][(date+0)%7]})`}/>
              <Row label="시간" value={time}/>
              <Row label="인원" value={`${people}명`}/>
              <Row label="도슨트" value={c.curator.name}/>
            </div>
            <Hairline style={{ margin: "20px 0 12px" }}/>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <Row label={`1인 가격 × ${people}`} value={`₩ ${c.price.toLocaleString()} × ${people}`}/>
              <Row label="할인" value="−" muted/>
            </div>
            <Hairline style={{ margin: "12px 0" }}/>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <MagCap>총 결제 금액</MagCap>
              <span style={{ fontSize: 32, fontWeight: 900, color: M.terra, letterSpacing: "-0.025em" }}>₩ {total.toLocaleString()}</span>
            </div>
            <MButton kind="primary" size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 20 }} onClick={() => onNavigate("booking-payment", c.id)}>
              결제하기 →
            </MButton>
            <p style={{ fontSize: 11, color: M.muted, textAlign: "center", marginTop: 10, fontWeight: 600 }}>다음 단계에서 결제 정보를 입력합니다</p>
          </div>
        </aside>
      </section>

      <MFooter/>
    </MPage>
  );
}

function Row({ label, value, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span style={{ color: M.muted, fontWeight: 700 }}>{label}</span>
      <span style={{ color: muted ? M.muted : M.ink, fontWeight: 800, textAlign: "right", maxWidth: 200, textWrap: "pretty" }}>{value}</span>
    </div>
  );
}

/* ================================================================
   (#4) 결제 화면 + 완료 상태
   ================================================================ */
function BookingPaymentScreen({ onNavigate, courseId }) {
  const c = COURSES.find((x) => x.id === courseId) || COURSES[0];
  const [done, setDone] = React.useState(false);
  const [pay, setPay] = React.useState("card");
  const [agree1, setAgree1] = React.useState(false);
  const [agree2, setAgree2] = React.useState(false);
  const people = 2;
  const total = c.price * people;
  // 예약번호는 컴포넌트 마운트 시 한 번만 생성 (매 렌더마다 다른 값 방지)
  const [bookingRef] = React.useState(() => `B2026-${Math.floor(Math.random()*9000+1000)}`);

  if (done) {
    return (
      <MPage>
        <MasilNav route="booking" onNavigate={onNavigate}/>
        <StepBar active={3}/>
        <section style={{ padding: "80px 24px", maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            width: 88, height: 88, borderRadius: 999,
            background: M.olive, color: M.cream,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 44, fontWeight: 900, marginBottom: 24,
          }}>✓</div>
          <MagCap color={M.olive}>예약이 확정되었습니다</MagCap>
          <h1 style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.05, color: M.ink, margin: "16px 0", textWrap: "balance" }}>
            6월 27일,<br/>
            <span style={{ color: M.olive, fontWeight: 900 }}>마실</span> 갑니다.
          </h1>
          <p style={{ fontSize: 16, color: M.muted, fontFamily: "'Noto Serif KR', serif", lineHeight: 1.7, fontWeight: 400, margin: "0 auto 40px", maxWidth: 480, textWrap: "pretty" }}>
            확정 안내를 카카오톡과 이메일로 보내드렸어요. 당일 출발 15분 전까지 집합 장소에서 만나요.
          </p>

          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 32, boxShadow: MS.card, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <MagCap>예약 번호</MagCap>
              <Serial color={M.terra} size={14}>{bookingRef}</Serial>
            </div>
            <Hairline style={{ marginBottom: 16 }}/>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <Row label="코스" value={c.name}/>
              <Row label="날짜" value="2026.06.27 (토)"/>
              <Row label="시간" value="10:00"/>
              <Row label="인원" value={`${people}명`}/>
              <Row label="집합" value={c.meetingPoint}/>
              <Row label="결제" value={`₩ ${total.toLocaleString()} · 카드`}/>
            </div>
            <Hairline style={{ margin: "20px 0" }}/>
            <div style={{ display: "flex", gap: 8 }}>
              <MButton kind="primary" size="md" style={{ flex: 1, justifyContent: "center" }} onClick={() => onNavigate("mypage")}>예약 내역 확인 →</MButton>
              <MButton kind="secondary" size="md" style={{ flex: 1, justifyContent: "center" }} onClick={() => onNavigate("course", c.id)}>코스 다시 보기</MButton>
            </div>
          </div>

          <div style={{ marginTop: 24, padding: 16, borderRadius: MR.card, border: `1px dashed ${M.beigeAlt}`, textAlign: "left" }}>
            <MagCap color={M.terra} style={{ marginBottom: 6 }}>당일 안내</MagCap>
            <div style={{ fontSize: 13, color: M.ink, lineHeight: 1.7, fontWeight: 500, textWrap: "pretty" }}>
              지하철 3호선 안국역 1번 출구로 나와 도보 2분. 광장 시계탑 앞에서 <b>{c.curator.name} 큐레이터</b>가 마실맵 로고 모자를 쓰고 기다리고 있어요.
            </div>
          </div>
        </section>
        <MFooter/>
      </MPage>
    );
  }

  return (
    <MPage>
      <MasilNav route="booking" onNavigate={onNavigate}/>
      <StepBar active={2}/>

      <section style={{ padding: "32px 56px 64px", maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
        {/* 좌측 결제 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Hairline label="PAYMENT" style={{ marginBottom: 4 }}/>
          <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0, color: M.ink }}>결제 정보 입력</h1>

          {/* 주문 요약 */}
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 24, boxShadow: MS.cardSm }}>
            <MagCap>ORDER · 주문 요약</MagCap>
            <div style={{ marginTop: 14, display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 80, height: 80, background: c.cover, borderRadius: 14, padding: 10, color: M.cream, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <MagCap color="rgba(255,248,236,0.7)" style={{ fontSize: 9 }}>{c.type === "도슨트" ? "DOCENT" : "SELF"}</MagCap>
                <div style={{ fontSize: 16, fontWeight: 900 }}>{c.buildings.length}곳</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: M.ink, letterSpacing: "-0.02em" }}>{c.name}</div>
                <div style={{ fontSize: 12, color: M.muted, fontWeight: 600, marginTop: 4 }}>2026.06.27 (토) · 10:00 · {people}명</div>
              </div>
            </div>
          </div>

          {/* 결제 수단 */}
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 24, boxShadow: MS.cardSm }}>
            <MagCap>PAYMENT METHOD · 결제 수단</MagCap>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: M.ink, margin: "8px 0 16px", letterSpacing: "-0.01em" }}>어떻게 결제하시겠어요?</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
              {[
                { id: "card",   label: "신용카드", icon: "💳" },
                { id: "toss",   label: "토스",     icon: "🟦" },
                { id: "naver",  label: "네이버",   icon: "🟩" },
                { id: "kakao",  label: "카카오",   icon: "🟨" },
              ].map((p) => {
                const on = pay === p.id;
                return (
                  <div key={p.id} onClick={() => setPay(p.id)} style={{
                    padding: "16px 8px", borderRadius: 16, textAlign: "center",
                    border: on ? `2px solid ${M.terra}` : `1px solid ${M.beigeAlt}`,
                    background: on ? `${M.terra}0d` : "transparent",
                    cursor: "pointer",
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{p.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: on ? M.terra : M.ink }}>{p.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Toss Payments widget placeholder */}
            <div style={{
              background: M.beige, borderRadius: MR.inner,
              padding: 32, textAlign: "center",
              border: `1.5px dashed ${M.beigeAlt}`,
              minHeight: 200,
              display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10,
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: M.muted, letterSpacing: "0.14em" }}>
                TOSS PAYMENTS WIDGET
              </div>
              <div style={{ padding: "20px", borderRadius: 14, background: `${M.olive}12`, border: `1.5px solid ${M.olive}44`, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: M.olive, letterSpacing: "-0.02em" }}>무료 도슨트 코스</div>
                <div style={{ fontSize: 13, color: M.muted, fontWeight: 600, marginTop: 6, lineHeight: 1.6 }}>
                  현재 마실맵 도슨트 코스는 무료로 운영됩니다.<br/>신청 후 카카오톡으로 확정 안내를 드립니다.
                </div>
              </div>
            </div>
          </div>

          {/* 약관 동의 */}
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 24, boxShadow: MS.cardSm }}>
            <MagCap>TERMS · 약관 동의</MagCap>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: M.ink, margin: "8px 0 16px", letterSpacing: "-0.01em" }}>다음 사항에 동의해주세요</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Check on={agree1} onToggle={() => setAgree1(!agree1)} label="(필수) 마실맵 이용약관 및 환불 규정에 동의합니다"/>
              <Check on={agree2} onToggle={() => setAgree2(!agree2)} label="(필수) 개인정보 수집·이용에 동의합니다"/>
              <Check on={false} onToggle={() => {}} label="(선택) 다음 코스 추천을 카카오톡으로 받기"/>
            </div>
          </div>
        </div>

        {/* 우측 결제 요약 */}
        <aside style={{ position: "sticky", top: 110, alignSelf: "flex-start" }}>
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 24, boxShadow: MS.cardLg }}>
            <MagCap>CONFIRM · 신청 확인</MagCap>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <Row label="코스" value={c.name}/>
              <Row label="인원" value={`${people}명`}/>
              <Row label="참가비" value="무료"/>
            </div>
            <Hairline style={{ margin: "16px 0" }}/>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <MagCap>참가비</MagCap>
              <span style={{ fontSize: 36, fontWeight: 900, color: M.olive, letterSpacing: "-0.025em" }}>무료</span>
            </div>
            <MButton kind="primary" size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 20, opacity: agree1 && agree2 ? 1 : 0.5, pointerEvents: agree1 && agree2 ? "auto" : "none" }} onClick={() => setDone(true)}>
              도슨트 코스 신청하기
            </MButton>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, fontSize: 11, color: M.muted, fontWeight: 700 }}>
              <span>📩</span>
              <span>신청 완료 후 카카오톡으로 확정 안내를 드립니다</span>
            </div>
          </div>
        </aside>
      </section>

      <MFooter/>
    </MPage>
  );
}

function Check({ on, onToggle, label }) {
  return (
    <label onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <div style={{
        width: 22, height: 22, borderRadius: 7,
        background: on ? M.terra : "transparent",
        border: on ? "none" : `1.5px solid ${M.beigeAlt}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: M.cream, fontWeight: 900, fontSize: 13,
        flexShrink: 0,
      }}>{on ? "✓" : ""}</div>
      <span style={{ fontSize: 13, color: M.ink, fontWeight: 600 }}>{label}</span>
    </label>
  );
}

/* ================================================================
   (#5) 외부 공간 예약 연결
   ================================================================ */
function BookingExternalScreen({ onNavigate, spaceId }) {
  const s = EXTERNAL_SPACES.find((x) => x.id === spaceId) || EXTERNAL_SPACES[0];
  const b = BUILDINGS.find((x) => x.id === s.building) || BUILDINGS[0];
  const [showModal, setShowModal] = React.useState(false);

  return (
    <MPage>
      <MasilNav route="booking" onNavigate={onNavigate}/>

      <section style={{ padding: "32px 56px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: M.muted, fontWeight: 700, marginBottom: 20 }}>
          <span onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>지도</span>
          <MIcon name="chevron" size={12} color={M.muted}/>
          <span onClick={() => onNavigate("detail", b.id)} style={{ cursor: "pointer" }}>{b.name}</span>
          <MIcon name="chevron" size={12} color={M.muted}/>
          <span style={{ color: M.ink }}>외부 공간</span>
        </div>
        <Hairline label={`EXTERNAL · ${s.type.toUpperCase()} · 외부 플랫폼 연결`} style={{ marginBottom: 24 }}/>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "end" }}>
          <div>
            <MagCap color={M.terra} style={{ marginBottom: 12 }}>{s.typeIcon} {b.region} · {b.name} 옆</MagCap>
            <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.02, color: M.ink, margin: 0, textWrap: "balance" }}>{s.name}</h1>
            <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 19, lineHeight: 1.65, color: M.muted, marginTop: 20, marginBottom: 0, fontWeight: 400, textWrap: "pretty" }}>{s.summary}</p>
          </div>
          <div>
            <MetaRow items={[
              { label: "공간 유형", value: s.type },
              { label: "공간",     value: b.name },
            ]} style={{ marginBottom: 10 }}/>
            <MetaRow items={[
              { label: "설계자",   value: b.architect },
              { label: "준공",     value: b.year },
            ]}/>
          </div>
        </div>
      </section>

      <section style={{ padding: "16px 56px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <ImgPlaceholder ratio="21/9" tone="terra" caption={`${s.name} · 공간 전경`} style={{ borderRadius: MR.cardLg }}/>
      </section>

      <section style={{ padding: "0 56px 32px", maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* 마실맵 큐레이션 한 줄 */}
          <div style={{ padding: 24, background: M.cream, borderRadius: MR.cardLg, boxShadow: MS.cardSm, borderLeft: `4px solid ${M.terra}` }}>
            <MagCap color={M.terra} style={{ marginBottom: 10 }}>MASILMAP CURATION</MagCap>
            <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 22, lineHeight: 1.5, color: M.ink, margin: 0, fontWeight: 500, textWrap: "pretty" }}>
              “{b.name}의 동선을 그대로 옮긴 곳. 머무는 것 자체가 건축 산책의 연장이 됩니다.”
            </p>
            <div style={{ marginTop: 14, fontSize: 12, color: M.muted, fontWeight: 700 }}>— 마실맵 에디터팀</div>
          </div>

          {/* 안내 박스 */}
          <div style={{ padding: 20, borderRadius: MR.card, background: M.cream, border: `1px solid ${M.beigeAlt}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ fontSize: 20 }}>ℹ️</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: M.ink, letterSpacing: "-0.01em" }}>마실맵은 OTA가 아닙니다</div>
                <p style={{ fontSize: 13, color: M.ink, lineHeight: 1.65, margin: "6px 0 0", fontWeight: 500, textWrap: "pretty" }}>
                  마실맵은 건축적으로 가치 있는 공간을 <b>큐레이션</b>합니다. 예약과 결제는 검증된 외부 서비스에서 진행되며, 마실맵은 거래에 직접 관여하지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 외부 예약 CTA */}
        <aside style={{ position: "sticky", top: 110, alignSelf: "flex-start" }}>
          <div style={{ background: M.cream, borderRadius: MR.cardLg, padding: 24, boxShadow: MS.cardLg }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <MagCap>{s.type.toUpperCase()}</MagCap>
              <MagCap color={M.muted}>FROM</MagCap>
            </div>
            <div style={{ marginTop: 8, fontSize: 36, fontWeight: 900, color: M.ink, letterSpacing: "-0.025em" }}>₩ {s.minPrice.toLocaleString()}<span style={{ fontSize: 14, color: M.muted, marginLeft: 4 }}>~</span></div>
            <Hairline style={{ margin: "16px 0" }}/>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: M.beige, borderRadius: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: M.ink, color: M.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 14 }}>{s.partnerLogo}</div>
              <div>
                <MagCap>예약 파트너</MagCap>
                <div style={{ fontSize: 15, fontWeight: 800, color: M.ink, marginTop: 2 }}>{s.partner}</div>
              </div>
            </div>
            <MButton kind="primary" size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={() => setShowModal(true)}>
              {s.partner}에서 예약하기 ↗
            </MButton>
            <p style={{ fontSize: 11, color: M.muted, textAlign: "center", marginTop: 10, fontWeight: 600, lineHeight: 1.55, textWrap: "pretty" }}>
              마실맵은 공간을 큐레이션하고,<br/>예약은 검증된 외부 서비스에서 진행됩니다.
            </p>
          </div>
        </aside>
      </section>

      {/* 외부 이동 모달 */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{
          position: "fixed", inset: 0, background: "rgba(58,46,34,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 20,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: M.cream, borderRadius: MR.cardLg, padding: 32, maxWidth: 460, width: "100%",
            boxShadow: MS.cardLg,
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: M.ink, color: M.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 22 }}>{s.partnerLogo}</div>
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", color: M.ink, textAlign: "center", margin: 0 }}>
              {s.partner}로 이동합니다
            </h3>
            <p style={{ fontSize: 14, color: M.muted, textAlign: "center", lineHeight: 1.65, margin: "10px 0 24px", fontWeight: 500, textWrap: "pretty" }}>
              새 창에서 외부 플랫폼이 열립니다. 예약은 해당 서비스의 약관에 따라 진행됩니다.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <MButton kind="outline" size="md" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowModal(false)}>취소</MButton>
              <MButton kind="primary" size="md" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowModal(false)}>이동 →</MButton>
            </div>
          </div>
        </div>
      )}

      <MFooter/>
    </MPage>
  );
}

Object.assign(window, { BookingDocentScreen, BookingPaymentScreen, BookingExternalScreen });
