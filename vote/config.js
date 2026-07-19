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
  subVote: "우리 팀 문구를 제외하고 2개를 골라주세요",
  subClosed: "투표가 마감되었습니다 — 결과는 결과판에서 확인하세요",

  // 1인당 투표 수 — 2 고정. 바꾸려면 index.html/board.html의 picks(a·b 슬롯)와
  // Firebase 보안 규칙(firebase-rules.json)을 함께 고쳐야 합니다.
  maxPicks: 2,

  // 슬로건 최대 글자 수 (서버 규칙과 동일하게 유지)
  sloganMax: 60,

  // 관리자 = 이 구글 계정. Firebase 콘솔을 만든 구글 계정 이메일을 넣으세요.
  // 시드의 admin/email과 동일해야 하며, 이 계정으로 admin.html에서 'Google로 로그인'합니다.
  adminEmail: "semugijang11@gmail.com",

  // 슬로건 글자체 (구글 폰트, 무료 OFL 라이선스). key는 DB에 저장, css는 표시에 사용.
  fonts: [
    { key: "sans", label: "기본", css: "'Malgun Gothic','Apple SD Gothic Neo',sans-serif" },
    { key: "myeongjo", label: "명조", css: "'Song Myung',serif" },
    { key: "gothic", label: "굵은고딕", css: "'Black Han Sans',sans-serif" },
    { key: "round", label: "둥근", css: "'Jua',sans-serif" },
    { key: "pen", label: "손글씨", css: "'Nanum Pen Script',cursive" },
  ],

  // 슬로건 카드 배경색 (연한 파스텔 — 어두운 글씨가 잘 보이는 색). key는 DB에 저장.
  cardBgs: [
    { key: "none", label: "흰색", css: "" },
    { key: "yellow", label: "노랑", css: "#fef3c7" },
    { key: "blue", label: "파랑", css: "#dbeafe" },
    { key: "green", label: "초록", css: "#dcfce7" },
    { key: "pink", label: "분홍", css: "#fce7f3" },
    { key: "purple", label: "보라", css: "#ede9fe" },
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
    { h: "7da75b0a8ee2e968", name: "seip1", team: "t1" },
    { h: "f3aa87f60cd1c949", name: "seip2", team: "t1" },
    { h: "b392b480caae167c", name: "seip3", team: "t1" },
    { h: "2997e7034b223db0", name: "seip4", team: "t1" },
    { h: "45faaf90cbd0ceb6", name: "jasan1", team: "t2" },
    { h: "1ea7149efe154449", name: "jasan2", team: "t2" },
    { h: "408eabbdc9624632", name: "jasan3", team: "t2" },
    { h: "f8fc10822859789c", name: "jasan4", team: "t2" },
    { h: "f645014370162ec1", name: "jasan5", team: "t2" },
    { h: "48380595d7aa8ac6", name: "jiso1", team: "t3" },
    { h: "459c3e46f0f90af4", name: "jiso2", team: "t3" },
    { h: "477caa4e219227eb", name: "jiso3", team: "t3" },
    { h: "038db96b6ab15dc8", name: "jiso4", team: "t3" },
    { h: "78897b630658a39b", name: "sewon1", team: "t4" },
    { h: "a0df75dda75ea6e7", name: "sewon2", team: "t4" },
    { h: "2d6fd14cf58c46fc", name: "sewon3", team: "t4" },
    { h: "10e3aa4eb9f1813e", name: "sewae1", team: "t5" },
    { h: "2979554529b6551c", name: "sewae2", team: "t5" },
    { h: "8c593e055fa937d4", name: "sewae3", team: "t5" },
    { h: "ac9809fa74b6b4e6", name: "sewae4", team: "t5" },
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

// 슬로건 표시용 안전 렌더: HTML 이스케이프 후 **강조** 만 굵게(<b>)로 변환
function sloganHtml(text) {
  var esc = String(text == null ? "" : text)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
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
