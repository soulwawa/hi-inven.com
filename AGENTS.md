# hi-inven.com

안녕재고 iOS 앱의 정적 동반 사이트다. GitHub Pages와 Jekyll로 운영한다.

## Related App

- 앱 저장소: `/Users/eee/dev/myinven/hi-inven`
- 번들 ID: `com.hi-inven.app`
- 사이트: `https://hi-inven.com`

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

## Remote Policy

정책 형식과 채널별 영향 확인 절차는 `docs/update-policy.md`를 기준으로 한다.
