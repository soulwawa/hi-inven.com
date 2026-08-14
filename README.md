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

## 공개 전 필수 확인

- `support@hi-inven.com` 메일 수신이 되는지 확인합니다.
- `_config.yml`의 `app_store_url`을 신규 앱 URL로 바꿉니다.
- 정책 JSON의 `appStoreURL`과 버전 범위를 채널별로 확인합니다.
- GitHub Pages를 `main` 브랜치 루트에서 배포하도록 설정합니다.
- `CNAME`과 도메인 DNS를 연결하고 HTTPS 적용을 확인합니다.

원격 저장소와 공개 사이트가 준비되기 전에는 앱의 웹 링크를 변경하지 않습니다.
