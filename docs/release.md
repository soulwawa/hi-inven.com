# 출시 절차

App Store 심사가 통과된 뒤 아래 순서를 지킵니다.

1. 승인된 앱 release 브랜치를 앱 저장소 `main`에 병합합니다.
2. 앱 저장소에 annotated `vX.Y.Z` 태그를 만들고 push합니다.
3. 같은 태그로 GitHub Release를 작성합니다.
4. 사이트 `_posts/`에 같은 날짜의 글 두 개를 작성합니다.
   - 릴리스 노트: `YYYY-MM-DD-vX-Y-Z.md`, `categories: release`, 기능 중심
   - 블로그: `YYYY-MM-DD-<slug>.md`, `categories: blog`, 만든 이유와 제품 방향 중심
5. 사이트 변경과 채널별 정책 범위를 검증한 뒤 사이트 `main`에 반영합니다.
6. GitHub Pages 배포 후 홈페이지, `/privacy/`, `/support/`, 두 글과 정책 JSON의 HTTPS 응답을 확인합니다.
7. App Store Connect의 마케팅, 지원, 개인정보처리방침 URL과 실제 iPhone의 앱 링크를 확인합니다.
8. 확인이 끝나면 release 브랜치를 정리합니다.

출시 여부는 앱 저장소의 annotated tag와 GitHub Release, 사이트 릴리스 글을 함께 보고 판단합니다.
