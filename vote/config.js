// ===== 청렴 슬로건 공모·투표 설정 =====
// 이 파일은 공개됩니다. 개인 토큰(QR 속 비밀값)은 여기 싣지 않고,
// 토큰의 SHA-256 해시 앞 16자리(h)만 실습니다. 제출·투표의 진위 검증은
// Firebase 서버 규칙이 담당합니다 (DB의 voters/<h>/secret과 대조).
// 개인 QR 카드(토큰 원본 포함)는 저장소 밖, 관리자 PC에만 보관하세요.
const POLL = {
  // DB 경로 이름 — 새 공모를 시작하려면 이름을 바꾸고 시드 JSON을 다시 가져오세요
  id: "slogan-2026",

  title: "청렴 슬로건 공모",
  subCollect: "고지서·알림톡에 실릴 새 슬로건을 제출해주세요 (팀별 1개 이상)",
  subVote: "우리 팀 문구를 제외하고 3개를 골라주세요 · 문구 순서는 접속할 때마다 무작위로 섞입니다",
  subClosed: "투표가 마감되었습니다 — 결과는 결과판에서 확인하세요",

  // 1인당 투표 수 — 3 고정. 바꾸려면 index.html/board.html의 picks(a·b·c 슬롯)와
  // Firebase 보안 규칙(firebase-rules.json)을 함께 고쳐야 합니다.
  maxPicks: 3,

  // 슬로건 최대 글자 수 (서버 규칙과 동일하게 유지)
  sloganMax: 80,

  // 관리자 = 이 구글 계정. Firebase 콘솔을 만든 구글 계정 이메일을 넣으세요.
  // 시드의 admin/email과 동일해야 하며, 이 계정으로 admin.html에서 'Google로 로그인'합니다.
  adminEmail: "semugijang11@gmail.com",

  // 슬로건 글자체 (구글 폰트, 무료 OFL 라이선스). key는 DB에 저장, css는 표시에 사용.
  fonts: [
    { key: "sans", label: "기본", css: "'Malgun Gothic','Apple SD Gothic Neo',sans-serif" },
    { key: "gothic", label: "굵은 고딕", css: "'Black Han Sans',sans-serif" },
    { key: "dohyeon", label: "도현체", css: "'Do Hyeon',sans-serif" },
    { key: "round", label: "둥근체", css: "'Jua',sans-serif" },
    { key: "gowundodum", label: "고운돋움", css: "'Gowun Dodum',sans-serif" },
    { key: "nanumgothic", label: "나눔고딕", css: "'Nanum Gothic',sans-serif" },
    { key: "stylish", label: "스타일리시", css: "'Stylish',sans-serif" },
    { key: "myeongjo", label: "송명조", css: "'Song Myung',serif" },
    { key: "nanummyeongjo", label: "나눔명조", css: "'Nanum Myeongjo',serif" },
    { key: "gowunbatang", label: "고운바탕", css: "'Gowun Batang',serif" },
    { key: "pen", label: "손글씨(펜)", css: "'Nanum Pen Script',cursive" },
    { key: "brush", label: "붓글씨", css: "'Nanum Brush Script',cursive" },
    { key: "gaegu", label: "개구쟁이", css: "'Gaegu',cursive" },
    { key: "dongle", label: "동글동글", css: "'Dongle',sans-serif" },
    { key: "kirang", label: "기랑해랑", css: "'Kirang Haerang',cursive" },
    { key: "yeonsung", label: "연성체", css: "'Yeon Sung',cursive" },
    { key: "gamja", label: "감자꽃", css: "'Gamja Flower',cursive" },
    { key: "himelody", label: "하이멜로디", css: "'Hi Melody',cursive" },
  ],

  // 슬로건 카드 배경색 (연한 파스텔 — 어두운 글씨가 잘 보이는 색). key는 DB에 저장.
  cardBgs: [
    { key: "none", label: "흰색", css: "" },
    { key: "yellow", label: "노랑", css: "#fef9c3" },
    { key: "amber", label: "살구", css: "#fef3c7" },
    { key: "orange", label: "주황", css: "#ffedd5" },
    { key: "red", label: "연빨강", css: "#fee2e2" },
    { key: "pink", label: "분홍", css: "#fce7f3" },
    { key: "purple", label: "보라", css: "#f3e8ff" },
    { key: "indigo", label: "남보라", css: "#e0e7ff" },
    { key: "blue", label: "하늘", css: "#dbeafe" },
    { key: "cyan", label: "청록", css: "#cffafe" },
    { key: "teal", label: "민트", css: "#ccfbf1" },
    { key: "green", label: "연두", css: "#dcfce7" },
    { key: "lime", label: "라임", css: "#ecfccb" },
    { key: "stone", label: "베이지", css: "#f5f5f4" },
  ],

  // 괄호 강조 부분의 글자색 (자유 선택). 첫 항목(auto)은 고지서 종류별 기본색 사용.
  textColors: [
    { key: "auto", label: "고지서색 자동", css: "" },
    { key: "navy", label: "원본 남색", css: "#00448b" },
    { key: "orange", label: "주황", css: "#fe7e00" },
    { key: "brown", label: "갈색", css: "#a15500" },
    { key: "cyan", label: "청록", css: "#00bec8" },
    { key: "red", label: "빨강", css: "#d92b2b" },
    { key: "green", label: "초록", css: "#2e9e4f" },
    { key: "purple", label: "보라", css: "#7a4fd6" },
    { key: "pink", label: "분홍", css: "#e0559b" },
    { key: "black", label: "검정", css: "#1f2330" },
  ],

  // 고지서 종류별 기본 강조색 (미리보기)
  billKinds: [
    { key: "origin", label: "원본(BI)", img: "bi-origin.png", color: "#00448b" },
    { key: "chenap", label: "체납분", img: "bi-chenap.png", color: "#fe7e00" },
    { key: "dokchok", label: "독촉분", img: "bi-dokchok.png", color: "#a15500" },
    { key: "susi", label: "수시분", img: "bi-susi.png", color: "#00bec8" },
  ],

  teams: [
    { key: "t1", name: "세입운영팀", emoji: "🦁" },
    { key: "t2", name: "재산세팀", emoji: "🐯" },
    { key: "t3", name: "지방소득세팀", emoji: "🦅" },
    { key: "t4", name: "세원조사팀", emoji: "🐺" },
    { key: "t5", name: "세외수입징수팀", emoji: "🐬" },
  ],

  // 투표자 명단 — h: 개인 토큰의 해시, name: 이름, team: 소속 팀 key
  // 이름은 실명으로 바꿔도 됩니다 (h는 QR 카드와 짝이므로 건드리지 마세요)
  voters: [
    { h: "7da75b0a8ee2e968", name: "세입운영팀1", team: "t1" },
    { h: "f3aa87f60cd1c949", name: "세입운영팀2", team: "t1" },
    { h: "b392b480caae167c", name: "세입운영팀3", team: "t1" },
    { h: "2997e7034b223db0", name: "세입운영팀4", team: "t1" },
    { h: "45faaf90cbd0ceb6", name: "재산세팀1", team: "t2" },
    { h: "1ea7149efe154449", name: "재산세팀2", team: "t2" },
    { h: "408eabbdc9624632", name: "재산세팀3", team: "t2" },
    { h: "f8fc10822859789c", name: "재산세팀4", team: "t2" },
    { h: "f645014370162ec1", name: "재산세팀5", team: "t2" },
    { h: "48380595d7aa8ac6", name: "지방소득세팀1", team: "t3" },
    { h: "459c3e46f0f90af4", name: "지방소득세팀2", team: "t3" },
    { h: "477caa4e219227eb", name: "지방소득세팀3", team: "t3" },
    { h: "038db96b6ab15dc8", name: "지방소득세팀4", team: "t3" },
    { h: "78897b630658a39b", name: "세원조사팀1", team: "t4" },
    { h: "a0df75dda75ea6e7", name: "세원조사팀2", team: "t4" },
    { h: "2d6fd14cf58c46fc", name: "세원조사팀3", team: "t4" },
    { h: "10e3aa4eb9f1813e", name: "세외수입팀1", team: "t5" },
    { h: "2979554529b6551c", name: "세외수입팀2", team: "t5" },
    { h: "8c593e055fa937d4", name: "세외수입팀3", team: "t5" },
    { h: "ac9809fa74b6b4e6", name: "세외수입팀4", team: "t5" },
  ],

  // Firebase 접속 주소 (비밀 아님 — 보안은 서버 규칙이 담당)
  firebase: {
    apiKey: "AIzaSyDfkQGoRN3jB7ZDPFwGPPe6dFlm8FF2OhM",
    authDomain: "project-team-vote.firebaseapp.com",
    databaseURL: "https://project-team-vote-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "project-team-vote",
    storageBucket: "project-team-vote.firebasestorage.app",
    messagingSenderId: "25157355213",
    appId: "1:25157355213:web:7e2ce6e82cb4124f5e0b84",
  },
};

// 토큰 → 해시 (투표 페이지에서 사용)
function sha16(s) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)).then(function (buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) {
      return ("0" + b.toString(16)).slice(-2);
    }).join("").slice(0, 16);
  });
}

// 슬로건 표시용 안전 렌더: HTML 이스케이프 후 (괄호) 안 글자를 굵게(<b>)로 변환
// 괄호 기호는 아이폰·갤럭시 모두 기호 자판 첫 화면에 있어 입력이 쉽습니다.
// cols: 괄호 구간별 글자색 배열(선택). 없으면 기본 강조색(각 고지서 색상)을 씁니다.
function sloganHtml(text, cols) {
  var esc = String(text == null ? "" : text)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  var idx = 0;
  function wrap(whole, inner) {
    var c = safeColor(cols && cols[idx]);
    idx++;
    return c ? '<b style="color:' + c + '">' + inner + "</b>" : "<b>" + inner + "</b>";
  }
  esc = esc.replace(/\(([^()]+)\)/g, wrap);                  // (강조) -> 굵게, 괄호는 표시 안 함
  esc = esc.replace(/（([^（）]+)）/g, wrap);                   // 전각 괄호도 지원
  esc = esc.replace(/\*\*([^*]+)\*\*/g, wrap);               // 예전 ** 표기 호환
  var LF = String.fromCharCode(10), CR = String.fromCharCode(13);
  return esc.split(CR).join("").split(LF).join("<br>");      // 줄바꿈(최대 2줄)
}
// 색상값 검증: 팔레트에 있는 #rrggbb 만 허용 (CSS 삽입 차단)
function safeColor(c) {
  if (typeof c !== "string" || !/^#[0-9a-fA-F]{6}$/.test(c)) return "";
  var v = c.toLowerCase();
  for (var i = 0; i < POLL.textColors.length; i++) {
    if (POLL.textColors[i].css.toLowerCase() === v) return v;
  }
  return "";
}
// 괄호 구간 개수 세기 (색상 선택칸 개수)
function countEmphasis(text) {
  var m = String(text || "").match(/\(([^()]+)\)|（([^（）]+)）|\*\*([^*]+)\*\*/g);
  return m ? m.length : 0;
}
// 글자체 key → CSS font-family (모르는 값은 기본 글꼴)
function fontCss(key) {
  for (var i = 0; i < POLL.fonts.length; i++) if (POLL.fonts[i].key === key) return POLL.fonts[i].css;
  return POLL.fonts[0].css;
}
// 카드 배경색 key → CSS 색 (없음/모르는 값은 빈 문자열)
function bgCss(key) {
  for (var i = 0; i < POLL.cardBgs.length; i++) if (POLL.cardBgs[i].key === key) return POLL.cardBgs[i].css;
  return "";
}
