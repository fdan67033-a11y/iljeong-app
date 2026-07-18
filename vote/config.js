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

  teams: [
    { key: "t1", name: "1팀", emoji: "🦁" },
    { key: "t2", name: "2팀", emoji: "🐯" },
    { key: "t3", name: "3팀", emoji: "🦅" },
    { key: "t4", name: "4팀", emoji: "🐺" },
    { key: "t5", name: "5팀", emoji: "🐬" },
  ],

  // 투표자 명단 — h: 개인 토큰의 해시, name: 이름, team: 소속 팀 key
  // 이름은 실명으로 바꿔도 됩니다 (h는 QR 카드와 짝이므로 건드리지 마세요)
  voters: [
    { h: "7da75b0a8ee2e968", name: "학생01", team: "t1" },
    { h: "f3aa87f60cd1c949", name: "학생02", team: "t1" },
    { h: "b392b480caae167c", name: "학생03", team: "t1" },
    { h: "2997e7034b223db0", name: "학생04", team: "t1" },
    { h: "45faaf90cbd0ceb6", name: "학생05", team: "t2" },
    { h: "1ea7149efe154449", name: "학생06", team: "t2" },
    { h: "408eabbdc9624632", name: "학생07", team: "t2" },
    { h: "f8fc10822859789c", name: "학생08", team: "t2" },
    { h: "f645014370162ec1", name: "학생09", team: "t3" },
    { h: "48380595d7aa8ac6", name: "학생10", team: "t3" },
    { h: "459c3e46f0f90af4", name: "학생11", team: "t3" },
    { h: "477caa4e219227eb", name: "학생12", team: "t3" },
    { h: "038db96b6ab15dc8", name: "학생13", team: "t4" },
    { h: "78897b630658a39b", name: "학생14", team: "t4" },
    { h: "a0df75dda75ea6e7", name: "학생15", team: "t4" },
    { h: "2d6fd14cf58c46fc", name: "학생16", team: "t4" },
    { h: "10e3aa4eb9f1813e", name: "학생17", team: "t5" },
    { h: "2979554529b6551c", name: "학생18", team: "t5" },
    { h: "8c593e055fa937d4", name: "학생19", team: "t5" },
    { h: "ac9809fa74b6b4e6", name: "학생20", team: "t5" },
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
