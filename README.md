# hi-inven.com

안녕재고 iOS 앱의 GitHub Pages 동반 사이트입니다.

## 역할

- 랜딩 페이지
- 고객 지원과 개인정보처리방침
- Jekyll 블로그와 릴리스 노트
- dev, TestFlight, production 업데이트 정책 JSON

## 로컬 확인

```sh
bundle install
bundle exec ruby script/check.rb
RUBYOPT=-r./script/ruby4_compat.rb bundle exec jekyll serve
```

웹 분석 동의·전송 범위 검사(Node.js 18 이상, 외부 요청 없음):

```sh
node --test script/check-analytics.cjs
```

웹 분석의 구현·검사 범위는 [웹 분석 설정과 로컬 검증](docs/web-measurement-2026-10-15.md)을 참고합니다.

## 작업 지침과 운영 자료

사이트 작업 기준은 [AGENTS.md](AGENTS.md), 출시·게시 순서는 [출시 절차](docs/release.md), 채널별 버전 판정은 [업데이트 정책](docs/update-policy.md)을 따릅니다. 환경별 공통 지침은 제공된 원문을 확인하며 개인 경로나 비공개 파일을 빌드의 필수 조건으로 두지 않습니다.

AI 지침·README·docs·script는 사이트 빌드에서 제외합니다. 승인 원문·운영 관리 식별자·날짜별 로그와 화면 원본은 공개 저장소 밖에 보존합니다. 기존 미추적 검수 자료는 공개 추적 대상에서 제외하고, 공개 저장소와 빌드 산출물의 제외 여부를 각각 검사합니다.

## 공개 전 필수 확인

- `soulwawa85@gmail.com`으로 문의 메일이 연결되는지 확인합니다.
- `_config.yml`의 `app_store_url`을 신규 앱 URL로 바꿉니다.
- 정책 JSON의 `appStoreURL`과 버전 범위를 채널별로 확인합니다.
- GitHub Pages를 `main` 브랜치 루트에서 배포하도록 설정합니다.
- `CNAME`과 도메인 DNS를 연결하고 HTTPS 적용을 확인합니다.

원격 저장소와 공개 사이트가 준비되기 전에는 앱의 웹 링크를 변경하지 않습니다.
