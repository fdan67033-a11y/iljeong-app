// ===== 투표 설정: 이 파일만 고치면 질문/선택지가 바뀝니다 =====
const POLL = {
  // 실시간 채널 ID — 전 세계 공용 브로커에서 이 투표를 구분하는 이름입니다.
  // 새 투표를 시작하려면 뒤의 v1을 v2, v3...으로 바꾸세요 (집계가 0부터 새로 시작됨)
  id: "fdan67033a11y-qrvote-v1",

  question: "오늘 점심, 뭐가 좋아요?",

  options: [
    { key: "kor", emoji: "🍚", label: "한식" },
    { key: "chn", emoji: "🍜", label: "중식" },
    { key: "jpn", emoji: "🍣", label: "일식" },
    { key: "wst", emoji: "🍕", label: "양식" },
  ],

  // 무료 공개 MQTT 브로커 (가입 불필요). 앞에서부터 차례로 연결을 시도합니다.
  brokers: [
    "wss://broker.emqx.io:8084/mqtt",
    "wss://broker.hivemq.com:8884/mqtt",
  ],
};
