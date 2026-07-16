# Firebase 전환 가이드

현재 시스템은 공개 MQTT 브로커의 보존 메시지에 표를 저장합니다. 이 문서는 저장소를
Firebase Realtime Database(RTDB)로 바꾸는 방법을 단계별로 정리한 것입니다.

## 왜 전환하나

| 항목 | 지금 (공개 MQTT) | 전환 후 (Firebase) |
|---|---|---|
| 표 보관 | 브로커 선의에 의존, 영구 보관 보장 없음 | 구글 서버에 영구 저장 |
| 위조 방어 | 페이지 소스만으론 불가, 채널 도청 후엔 가능 | 서버 규칙이 개인 코드 대조 — 도청 자체가 불가(https) |
| 규칙 집행 (1인 3표, 자기 팀 금지) | 결과판 쪽 클라이언트 검증 | 서버가 저장 자체를 거부 |
| 안정성 | 무료 공용 브로커 (가끔 느리거나 접속 거부) | 구글 인프라 |
| 외부인 방해 | 채널 이름을 알면 쓰레기 메시지 투척 가능 | 규칙으로 차단 |
| 비용 | 0원 | 0원 (Spark 무료 플랜으로 충분) |

## 전환해도 그대로인 것

- **QR 카드와 개인 코드** — 그대로 사용 (다시 인쇄할 필요 없음)
- 페이지 구조 (index.html / board.html / config.js), GitHub Pages 호스팅, 화면 디자인
- 사용 흐름: QR 스캔 → 3팀 선택 → 제출 → 결과판 실시간 반영/상시 복원

바뀌는 것은 "표를 어디에 저장하고 누가 검증하느냐"뿐입니다.

## 데이터 구조 (RTDB)

```
polls/
  teamvote-v2/
    teams/                 ← 유효한 팀 목록 (규칙 검증용)
      t1: true ... t5: true
    voters/
      <해시>/
        secret: "개인코드"     ← 아무도 못 읽음 (규칙으로 봉인)
        public/               ← 누구나 읽음
          name: "학생01"
          team: "t1"
    ballots/
      <해시>/
        proof: "개인코드"      ← 못 읽음. 저장 시 secret과 일치해야만 저장됨
        vote/                 ← 누구나 읽음 (결과판이 구독)
          picks: { a: "t2", b: "t3", c: "t5" }
          ts: 1789...
```

핵심 아이디어: 표를 쓸 때 `proof`에 개인 코드를 담고, 서버 규칙이
`voters/<해시>/secret`과 비교해서 일치할 때만 저장을 허락합니다.
개인 코드는 서버 안에서만 비교되고 아무도 읽을 수 없으므로, DB를 통째로
들여다봐도 남의 표를 위조할 수 없습니다.

## 1단계 — Firebase 프로젝트 만들기 (5분, 구글 계정 필요)

1. https://console.firebase.google.com 접속 → 구글 로그인
2. "프로젝트 추가" → 이름 예: `team-vote` → Google Analytics **사용 안 함** → 만들기
3. 요금제는 기본 Spark(무료) 그대로 두면 됩니다. 카드 등록 불필요.

## 2단계 — Realtime Database 만들기

1. 왼쪽 메뉴 빌드 → **Realtime Database** → "데이터베이스 만들기"
2. 위치: `asia-southeast1` (싱가포르 — 한국에서 가장 가까움)
3. 보안 규칙: **잠금 모드로 시작** 선택
4. 생성되면 상단에 뜨는 DB 주소를 메모:
   `https://<프로젝트명>-default-rtdb.asia-southeast1.firebasedatabase.app`

## 3단계 — 웹 앱 등록

1. 프로젝트 개요 옆 톱니바퀴 → 프로젝트 설정 → 아래 "내 앱" → 웹(`</>`) 아이콘
2. 앱 닉네임 아무거나 → 등록 (호스팅 체크 불필요 — GitHub Pages 계속 씀)
3. 화면에 나오는 `firebaseConfig` 값(apiKey, databaseURL 등)을 복사해 둡니다.
   ※ 이 값은 비밀이 아니라 공개해도 되는 접속 주소입니다. 보안은 규칙이 담당.

## 4단계 — 명단(시드 데이터) 넣기

관리자 PC의 `firebase-seed.json` 파일(개인 코드 포함 — 저장소에 올리지 말 것)을 사용:

1. Realtime Database → 데이터 탭 → 루트에 `polls` → `teamvote-v2` 경로를 만들거나,
   루트에서 ⋮ 메뉴 → **JSON 가져오기**로 파일을 통째로 업로드
2. 업로드 후 `polls/teamvote-v2/voters/<해시>/secret`에 개인 코드가 들어있는지 확인

## 5단계 — 보안 규칙 붙여넣기

Realtime Database → 규칙 탭에 아래 전체를 붙여넣고 게시:

```json
{
  "rules": {
    "polls": {
      "$poll": {
        "teams": { ".read": true },
        "voters": {
          "$h": {
            "public": { ".read": true }
          }
        },
        "ballots": {
          "$h": {
            ".write": "newData.child('proof').isString() && newData.child('proof').val() === root.child('polls/' + $poll + '/voters/' + $h + '/secret').val()",
            ".validate": "newData.hasChildren(['proof', 'vote'])",
            "vote": {
              ".read": true,
              ".validate": "newData.hasChildren(['picks', 'ts']) && newData.child('ts').isNumber()",
              "picks": {
                ".validate": "newData.hasChildren(['a', 'b', 'c'])",
                "a": { ".validate": "newData.isString() && root.child('polls/' + $poll + '/teams/' + newData.val()).exists() && newData.val() !== root.child('polls/' + $poll + '/voters/' + $h + '/public/team').val() && newData.val() !== newData.parent().child('b').val() && newData.val() !== newData.parent().child('c').val()" },
                "b": { ".validate": "newData.isString() && root.child('polls/' + $poll + '/teams/' + newData.val()).exists() && newData.val() !== root.child('polls/' + $poll + '/voters/' + $h + '/public/team').val() && newData.val() !== newData.parent().child('a').val() && newData.val() !== newData.parent().child('c').val()" },
                "c": { ".validate": "newData.isString() && root.child('polls/' + $poll + '/teams/' + newData.val()).exists() && newData.val() !== root.child('polls/' + $poll + '/voters/' + $h + '/public/team').val() && newData.val() !== newData.parent().child('a').val() && newData.val() !== newData.parent().child('b').val()" },
                "$other": { ".validate": false }
              },
              "$other": { ".validate": false }
            },
            "$other": { ".validate": false }
          }
        }
      }
    }
  }
}
```

이 규칙이 서버에서 강제하는 것:

- 표 저장은 `proof`(개인 코드)가 서버에 저장된 `secret`과 일치할 때만 가능 → 위조 불가
- 선택은 정확히 3개 슬롯(a·b·c), 서로 달라야 하고, 존재하는 팀이어야 하며,
  **본인 소속 팀이면 거부** → 1인 3표·자기 팀 금지가 서버 규칙
- `secret`/`proof`는 읽기 규칙이 없어서(기본 거부) 아무도 조회 불가
- 표 삭제(초기화)는 규칙을 우회하는 콘솔 관리자만 가능

## 6단계 — 페이지 코드 교체

바뀌는 부분은 "통신 계층"뿐입니다. 요점:

1. 두 페이지에서 mqtt.js `<script>`를 Firebase SDK로 교체:
```html
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js"></script>
```
2. config.js에 3단계에서 복사한 `firebaseConfig` 추가, brokers 항목 삭제
3. index.html — 제출 부분을 MQTT publish 대신:
```js
firebase.initializeApp(POLL.firebaseConfig);
var db = firebase.database();
// 제출 (proof가 secret과 다르면 서버가 거부함)
db.ref("polls/" + POLL.id + "/ballots/" + myHash).set({
  proof: token,
  vote: { picks: { a: picks[0], b: picks[1], c: picks[2] }, ts: firebase.database.ServerValue.TIMESTAMP }
}).then(성공처리).catch(실패처리);
// 내 표 복원/초기화 감지 (vote만 읽힘)
db.ref("polls/" + POLL.id + "/ballots/" + myHash + "/vote").on("value", ...);
```
4. board.html — MQTT 구독 대신 사람별 리스너 20개:
```js
POLL.voters.forEach(function (v) {
  db.ref("polls/" + POLL.id + "/ballots/" + v.h + "/vote").on("value", function (snap) {
    ballots[v.h] = snap.val();   // null이면 미제출/초기화됨
    recount();
  });
});
// 연결 상태 표시등: db.ref(".info/connected").on("value", ...)
```
5. 클라이언트의 해시 대조·묘비 메시지·이중 브로커 코드는 전부 삭제 (서버가 대신함)

## 7단계 — 초기화와 새 투표

- **초기화**: Firebase 콘솔 → 데이터 탭 → `polls/teamvote-v2/ballots` 노드 삭제.
  모든 결과판/투표 페이지에 즉시 반영됩니다. (?admin= 방식은 더 이상 불필요)
- **새 투표**: config.js의 id를 `teamvote-v3`으로 바꾸고, 콘솔에서 시드 JSON을
  `polls/teamvote-v3`에 다시 가져오기

## 점검 목록 (전환 후 리허설)

- [ ] 개인 QR로 접속 → 이름/팀 표시, 자기 팀 잠금
- [ ] 3팀 제출 → 결과판 즉시 반영
- [ ] 결과판 새로고침/다른 기기에서 열기 → 집계 복원
- [ ] 잘못된 코드로 제출 시도(개발자도구에서 proof 조작) → PERMISSION_DENIED
- [ ] 콘솔에서 ballots 삭제 → 전 화면 0표로, 투표 페이지 "다시 선택" 안내

## 비용/한도 (Spark 무료 플랜)

- 동시 접속 100 (20명 투표 + 전원 결과판 시청도 여유), 저장 1GB, 다운로드 10GB/월
- 이 규모(20명 × 몇 KB)에서는 어떤 한도에도 근접하지 않음 — 결제 정보 등록 불필요

## 역할 분담

- **직접 하셔야 하는 것**: 1~3단계 (구글 로그인이 필요해서), 그리고 4단계의 JSON 가져오기
- **Claude에게 시키면 되는 것**: firebaseConfig 값을 주시면 4~6단계 코드 전환 전부와
  규칙 붙여넣을 내용 준비, 배포, 리허설 검증까지
