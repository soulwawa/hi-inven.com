# hi-inven.com

안녕재고 iOS 앱의 정적 동반 사이트다. GitHub Pages와 Jekyll로 운영한다.

## Related App

- 앱 저장소: `/Users/eee/dev/myinven/hi-inven`
- 번들 ID: `com.hi-inven.app`
- 사이트: `https://hi-inven.com`

## 작업 시작과 공통 지침

- `README.md`와 현재 Git 상태를 확인한 뒤 [공통 개발·작업공간·릴리스 절차](/Users/eee/dev/docs/release-cycle.md)를 실제로 읽고, [프로덕트 사이트 지침](/Users/eee/dev/docs/product-site.md)을 관련 범위에서 확인한다.
- 앱 개인정보·업데이트 정책·출시 연계 작업에서는 [앱 공통 개발·검증 지침](/Users/eee/dev/docs/apps.md)과 [앱 저장소 지침](/Users/eee/dev/myinven/hi-inven/AGENTS.md)의 관련 절을 실제로 읽는다. 사이트 작업에 앱 전체 빌드·심사를 일괄 적용하지 않는다.
- 아래 게시·채널별 정책·검수 조건과 기존 승인 범위를 유지한다. 문서 연결만 바꾸는 작업은 링크·앵커·diff로 검증하고, 사이트 동작 변경은 `README.md`의 로컬 검사를 따른다. 공통 지침 연결은 외부 변경·게시 승인을 추가하지 않는다.

## Site Structure

- `index.html`: 랜딩 페이지
- `privacy/`: 개인정보처리방침
- `support/`: 고객 지원
- `blog/`, `release/`: 카테고리별 글 목록
- `_posts/`: 블로그와 릴리스 글
- `hi-inven-dev.json`: 개발 채널 업데이트 정책
- `hi-inven-testflight.json`: TestFlight 업데이트 정책
- `hi-inven.json`: App Store 업데이트 정책

## Rules

- `main` 반영은 운영 사이트에 자동 배포되므로 공개 페이지와 앱 영향을 먼저 확인한다.
- 정책 JSON은 실행 중인 앱에 즉시 영향을 줄 수 있다. 한 번에 한 채널만 변경하고 버전 범위를 검증한다.
- 개인정보처리방침은 앱의 `PrivacyInfo.xcprivacy`와 실제 데이터 흐름을 기준으로 작성한다.
- 출시 이력은 앱 저장소의 annotated tag와 GitHub Release, 사이트의 같은 날짜 릴리스 글을 함께 확인한다.
- 원격 저장소 생성, push, DNS, App Store Connect 변경은 사용자 승인 없이 수행하지 않는다.

## Release Follow-up

App Store 승인 후 `docs/release.md` 순서대로 앱 merge, annotated tag와 GitHub Release, 사이트 글 발행, Pages 확인을 진행한다.

## 출시 게시물 검토

- 일반 출시는 블로그+릴리스 노트, 핫픽스는 릴리스 노트만 준비한다. 출시 검토 절차와
  검증된 현행 담당·수신처는 [공통 절차의 목적과 담당](/Users/eee/dev/app-growth/playbooks/release-review.md#목적과-담당)에서 확인한다. 담당 변경은 검증된 인계 기록으로만 따른다.
- 원 담당이 최종 원고/식별·목표 URL·공개 기능/버전/날짜·생성 HTML의 제목/설명/내부·설치 링크·
  기존 게시 권한과 검증 근거를 전달한다. 사용자가 이 담당에게 출시 연계 블로그·릴리스 노트의
  게시 승인권을 위임했다. **게시 전 출시 게시물 검토 승인**의 원고/URL 일치와 게시 승인 포함 회신
  또는 사용자 직접 승인을 확인한다. 위임 범위는 사용자에게 재확인하지 않고 최종본 변경은 다시 검토받는다.
  부재·불일치면 게시하지 않는다. 앱 자동 출시에 추가 게이트를 두지 않으며
  게시물 검토 승인을 앱 main/태그/GitHub Release 등 다른 원격 권한으로 확대하지 않는다.
- 작성·보완·사이트 검증·게시는 원 담당 책임이다. 변경 없는 앱 QA·공개 확인은 반복하지 않는다.
  게시 후 최종 URL·시각/한계·반영 원고·검증 결과를 출시 검토 담당에게 한 번 보고하고
  성장 전략 담당에게 중간 보고를 자동 중계하지 않는다. 상세 실행은 `docs/release.md`를 따른다.

## Remote Policy

정책 형식과 채널별 영향 확인 절차는 `docs/update-policy.md`를 기준으로 한다.
