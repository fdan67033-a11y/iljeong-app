// ===== 투표 설정 =====
// 이 파일은 공개됩니다. 개인 토큰(QR 속 비밀값)은 여기 싣지 않고,
// 토큰의 SHA-256 해시 앞 16자리(h)만 실어서 결과판이 표의 진위를 검증합니다.
// 개인 QR 카드(토큰 원본 포함)는 저장소 밖, 관리자 PC에만 보관하세요.
const POLL = {
  // 실시간 채널 ID — 새 투표를 시작하려면 뒤의 v2를 v3, v4...로 바꾸세요
  id: "fdan67033a11y-teamvote-v2",

  title: "최고의 팀을 뽑아주세요",
  subtitle: "서로 다른 3팀 선택 · 자기 팀에는 투표할 수 없습니다",

  // 1인당 투표 수 (서로 다른 팀만 선택 가능)
  maxPicks: 3,

  // 관리자 비밀번호의 해시 — board.html?admin=비밀번호 로 열면 초기화 버튼이 나타남
  adminHash: "5279ec42c3490395",

  teams: [
    { key: "t1", name: "1팀", emoji: "🦁" },
    { key: "t2", name: "2팀", emoji: "🐯" },
    { key: "t3", name: "3팀", emoji: "🦅" },
    { key: "t4", name: "4팀", emoji: "🐺" },
    { key: "t5", name: "5팀", emoji: "🐬" },
  ],

  // 투표자 명단 — h: 개인 토큰의 해시, name: 이름, team: 소속 팀 key
  // 이름은 자유롭게 실명으로 바꿔도 됩니다 (h는 QR 카드와 짝이므로 건드리지 마세요)
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

  // 무료 공개 MQTT 브로커 (가입 불필요). 두 곳 모두에 표를 저장/구독합니다.
  brokers: [
    "wss://broker.emqx.io:8084/mqtt",
    "wss://broker.hivemq.com:8884/mqtt",
  ],
};

// 토큰/비밀번호 → 해시 (양쪽 페이지 공용)
function sha16(s) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)).then(function (buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) {
      return ("0" + b.toString(16)).slice(-2);
    }).join("").slice(0, 16);
  });
}

// 표 내용 검증 (양쪽 페이지 공용): 서로 다른 maxPicks개 팀, 자기 팀 제외
function validTeams(teams, ownTeam) {
  if (!Array.isArray(teams) || teams.length !== POLL.maxPicks) return false;
  var seen = {};
  for (var i = 0; i < teams.length; i++) {
    var k = teams[i];
    if (typeof k !== "string") return false;
    var known = false;
    for (var j = 0; j < POLL.teams.length; j++) if (POLL.teams[j].key === k) known = true;
    if (!known || k === ownTeam || seen[k]) return false;
    seen[k] = true;
  }
  return true;
}

// 타임스탬프 검증: 유한한 숫자 + 미래로 10분 이상 조작 불가
function validTs(ts) {
  return typeof ts === "number" && isFinite(ts) && ts > 1e12 && ts < Date.now() + 600000;
}
