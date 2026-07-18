# Firebase 구조·운영 문서

이 시스템은 Firebase Realtime Database(프로젝트 `project-team-vote`, 싱가포르 리전)를
저장소로 사용합니다. 제출·투표의 검증(위조·중복·자기 팀 투표 차단, 단계 강제)은 전부
서버 보안 규칙이 수행하므로, 페이지 소스나 DB를 들여다봐도 조작할 수 없습니다.

## 데이터 구조

```
polls/
  slogan-2026/
    state/
      phase: "collect"|"vote"|"closed"  ← 누구나 읽음, 쓰기는 콘솔(관리자 구글 로그인)만
    teams/                  ← 유효한 팀 목록 (규칙 검증용)
      t1: true ... t5: true
    voters/
      <해시>/
        secret: "개인코드"    ← 아무도 못 읽음 (규칙으로 봉인)
        public/              ← 누구나 읽음
          name: "학생01"
          team: "t1"
    slogans/                ← 제출 원본(제출자 증명 포함) — 아무도 못 읽음
      <문구ID>/ { proof, h, text, team, ts }
    sloganList/             ← 공개 사본 (갤러리·투표 대상) — 누구나 읽음
      <문구ID>/ { text, team, ts }
        ※ 규칙이 원본(slogans)과 text/team 일치를 검증 — 위조 사본 불가
    ballots/
      <해시>/
        proof: "개인코드"     ← 못 읽음. 저장 시 secret과 일치해야만 생성됨
        vote/                ← 누구나 읽음 (현황판이 구독)
          picks: { a: "<문구ID>", b: "<문구ID>" }
          ts: <서버 시각>
```

## 핵심 설계 네 가지

1. **증명 기반 저장**: 문구 제출과 투표 모두 `proof`에 개인 코드를 담아야 하고,
   서버 규칙이 `voters/<해시>/secret`과 대조해 일치할 때만 저장합니다.
   secret과 proof는 읽기 권한이 없어 외부로 새지 않습니다.
2. **단계(phase) 강제**: 문구 제출은 collect 단계에만, 투표는 vote 단계에만
   서버가 허용합니다. `state/phase` 변경은 Firebase Authentication으로 로그인한
   관리자 계정(auth.uid가 `admin/uid`와 일치)만 가능합니다. admin.html에서 관리자가
   이메일/비밀번호로 로그인하면 단계 전환 버튼이 활성화됩니다. (데이터에 저장한 비밀키로
   막는 방식은 부분 쓰기가 기존 값을 물려받아 뚫리므로 폐기하고 auth 기반으로 전환)
3. **1회 제출 확정(불변)**: 이미 표가 있으면(`data.exists()`) 어떤 쓰기도 거부합니다.
   "수정 허용" 규칙은 부분 업데이트로 기존 proof를 상속받아 남의 picks만 바꿔치기하는
   공격이 가능해서 의도적으로 막았습니다. 재투표는 관리자가 콘솔에서 표 삭제로 허용.
4. **문구 이중 저장**: 제출 원본(slogans, 제출자 증명 포함)은 비공개, 갤러리·투표가
   읽는 공개 사본(sloganList)은 규칙이 원본과 내용 일치를 검증합니다 — 제안자 익명을
   유지하면서 위조 등록을 차단.

## 보안 규칙 (콘솔 → Realtime Database → 규칙 탭에 전문 붙여넣기)

원본 파일: 관리자 PC의 `C:\todo_manual_dashboard\firebase-rules.json`

규칙이 강제하는 것:
- 단계(state/phase)는 관리자 계정(auth.uid === admin/uid)만 변경 가능
- 문구는 collect 단계에만, 1~60자, 제출자 소속 팀으로만 등록 가능
- 표 생성은 vote 단계에만, proof 일치 시 **최초 1회만**
- picks는 a·b 두 슬롯, 서로 다른 문구, 실존하는 문구, **본인 팀 문구 제외**
- 허용된 필드 외에는 저장 불가(`$other: false`), secret/proof/원본 slogans는 조회 불가
- 삭제는 규칙을 우회하는 콘솔 관리자만 가능

## 명단(시드) 넣기

원본 파일: 관리자 PC의 `C:\todo_manual_dashboard\firebase-seed.json`

콘솔 → Realtime Database → 데이터 탭 → 루트(DB 주소 줄) 오른쪽 ⋮ → **JSON 가져오기**
→ 파일 선택. `polls/slogan-2026` 아래에 state/admin/teams/voters가 들어가면 성공.
※ 가져오기는 해당 위치를 통째로 교체하므로, 진행 중(문구·표 존재)에는 하지 말 것.

## 관리자 계정 설정 (한 번만)

단계 전환 버튼(admin.html)을 쓰려면 관리자 로그인 계정이 필요합니다.

1. 콘솔 → **Authentication** → 시작하기 → **Sign-in method** → **이메일/비밀번호** 사용 설정
2. **Users** 탭 → 사용자 추가 → 이메일 `admin@example.com`(= config.js의 adminEmail,
   시드의 admin/email과 동일해야 함) + 원하는 비밀번호 → 추가
   (이메일은 실제 수신용이 아니라 로그인 ID일 뿐. 바꾸려면 세 곳을 함께 수정)
3. admin.html 접속 → 그 비밀번호로 로그인. 최초 로그인 시 이 계정의 uid가
   `admin/uid`에 자동 등록되고(규칙상 지정 이메일 1회만), 이후 그 계정만 단계를 바꿀 수 있음.

이메일은 공개돼도 되고(로그인 ID), 실제 보안은 비밀번호(Firebase가 해시 보관)와
uid 검증이 담당합니다. 비밀번호는 코드 어디에도 저장되지 않습니다.

## 운영

| 작업 | 방법 |
|---|---|
| 단계 전환 (접수→투표→마감) | admin.html 로그인 후 단계 버튼 클릭 (또는 콘솔에서 state/phase 직접 편집) |
| 부적절한 문구 삭제 | 콘솔에서 `polls/slogan-2026/sloganList/<항목>` 삭제 |
| 한 사람 재투표 허용 | 콘솔에서 `polls/slogan-2026/ballots/<해시>` 삭제 (해시는 config.js에서 이름으로 검색) |
| 전체 표 초기화 | 콘솔에서 `polls/slogan-2026/ballots` 노드 삭제 |
| 새 공모 | config.js의 id 변경 + 시드 JSON을 새 경로에 가져오기 |
| 이름/팀 변경 | config.js·QR카드 파일·DB voters/public 세 곳을 같은 순서로 수정 |

## 점검 목록 (리허설)

- [ ] 개인 QR 접속 → 이름/팀 표시, 접수 단계 화면
- [ ] 문구 제출 → 갤러리·현황판 즉시 반영, 팀 자동 표시
- [ ] 관리자 페이지에서 투표 개시 → 모든 화면이 투표 모드로 전환
- [ ] 자기 팀 문구 잠금, 2개 선택 제출 → 순위 즉시 반영
- [ ] 같은 사람 재제출 시도 → 거부되는지
- [ ] 투표 마감 → 👑 확정 표시, 추가 투표 거부
- [ ] 콘솔에서 표 하나 삭제 → 그 사람 폰에 재투표 안내 뜨는지

## 비용/한도 (Spark 무료 플랜)

동시 접속 100(20명 규모는 여유), 저장 1GB, 다운로드 10GB/월 — 결제 등록 불필요.
