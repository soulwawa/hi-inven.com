# 안녕재고 웹 측정 연결

2026-10-15, Asia/Seoul. 현재 단계: 실제 설정 반영·로컬 검사 통과, 배포 및 공개 확인 진행 중. Google 수신/보고 조회는 아직 미검증이다.

사용자는 성장 채팅 `01a125cd-6f0f-7c63-be12-0c83c6cc3bbe`의 턴 `01a13e4a-3386-7d83-9c6d-fb03222cf1a6`에서 세 사이트의 GA4·Search Console 연결, 방문·유입·설치 링크 클릭 대시보드와 기존 매일 모니터링 반영을 승인했다. 이 저장소는 hi-inven.com 구현·기존 Pages 배포만 담당한다. Google 설정·인증·공통 대시보드·예약은 성장 담당이 소유한다.

## 확정 설정과 경계

- 사이트 `https://hi-inven.com/`, 앱 링크 `https://apps.apple.com/kr/app/id6802033161`.
- 전용 GA4 property `559121189`, stream `16132986772`, measurement ID `G-1ZDPFSWQ01`, 시간대 `Asia/Seoul`: 성장 담당이 Google 화면에서 확인해 전달했다.
- Search Console URL prefix `https://hi-inven.com/`는 기존 DNS 근거로 자동 소유권 확인됐다는 인계를 받았다. DNS·추가 meta·새 키는 변경하지 않는다. 본 담당이 Google 관리 화면을 독립 검증한 것은 아니다.
- Google 측 Enhanced Measurement는 전체 OFF로 설정한다는 성장 담당 계약이다. `send_page_view:false` 후 `page_view` 1회, 별도 `click` 1회를 수동 전송하며 향상된 outbound click을 함께 켜지 않는다.
- 성장 담당이 HI 스트림의 Enhanced Measurement 전체 OFF와 Developer Traffic 제외 필터 활성 상태를 확인해 전달했다. 로컬 브라우저 검사는 Google 요청을 가로채어 외부 전송 없이 수행했다. 배포 후 실제 전송 확인은 `?analytics_debug=1`로만 진행하며 Google 측 수신/보고 확인은 성장 담당이 맡는다.

## 구현

- `_config.yml`의 실제 ID → 공통 footer의 `_includes/web-analytics.html` → `assets/js/analytics.js`. 홈·페이지·글 모두 공통 경로를 사용한다. head는 명시적 `strict-origin` referrer 정책만 추가한다.
- HTTPS의 정확한 `hi-inven.com`에서만 동작한다. 로컬·미리보기·www에서는 Google 태그를 불러오지 않는다. 별도 라이브러리를 추가하지 않았다.
- 선택 전/거부 시 Google 분석 스크립트·이벤트 전송 없음. ‘거부/허용’과 footer ‘웹 분석 설정’ 제공. 선택은 `hi-inven.web-analytics.v1` localStorage에 저장하며 저장 불가 시 현재 페이지의 선택만 적용한다.
- 허용 후 basic consent 순서(default denied → analytics granted, ads denied)로 Google 태그 1개를 로드한다. 광고 개인화·Google signals는 사용하지 않는다.
- 허용 철회는 즉시 해당 ID의 `ga-disable`을 켜고 사이트의 `_ga`, `_ga_1ZDPFSWQ01` 쿠키를 만료한 뒤 다시 로드한다. 다른 탭의 철회도 반영한다. 이미 수집된 데이터의 소급 삭제는 아니다.
- `page_location`은 Jekyll의 정적 canonical URL만, `page_referrer`는 HTTP(S) origin만 사용한다. 임의 query/hash, 유입 경로, 이메일/계정 원문과 앱 데이터를 전송하지 않는다.
- 클릭 계약: `event_name=click`, `outbound=true`, `link_domain=apps.apple.com`, `link_url=https://apps.apple.com/kr/app/id6802033161`, 해당 ID로 `send_to`. 목적지 origin+pathname이 이 URL인 링크에만 적용하며 query/hash와 링크 문구를 전송하지 않는다. 링크 이동을 차단하거나 지연하지 않는다.
- `analytics_debug=1`일 때만 config에 `debug_mode:true`; 일반 방문에서는 필드 자체를 생략한다. 클릭은 설치가 아니며 통계는 분석에 동의한 웹 방문 표본이다.
- 앱 개인정보처리방침은 그대로 두고 웹 전용 안내를 `/privacy/#website-analytics`에 추가했다. 앱 소스·빌드·스토어·가격·게시 글·업데이트 정책 JSON은 이 작업 범위 밖이다.

## 검증과 보존

기준: site `6fdeccdef610d3104262df60475bca0f48253fba`. 작업 브랜치 `codex/web-measurement-20261015`. 기존 `AGENTS.md`, `docs/release.md` 변경은 제외·보존한다. 시작 시 Git blob hash는 각각 `aa2df7f871d7f495d823b8eda17a234042e5baae`, `7d202d176f4bf75cfc65100da7c553f34eddd51e`다.

- `node --test script/check-analytics.cjs`: 7/7 통과. 동의 전/거부/재허용, 태그·이벤트 중복 방지, 정확한 설치 링크, 안전한 주소, 운영 host 제한, debug 분리, 탭 간 철회, storage 실패를 외부 요청 없이 검사한다.
- `bundle exec ruby script/check.rb`: Jekyll 빌드·정책 보존을 검사하며, 모든 생성 HTML의 분석 include 1회·실제 ID·JS 복사 일치도 확인한다.
- 별도 Playwright Chrome에서 390×844/1280×900 화면, 동의 전·거부·재허용·철회·설치 링크 이동과 로컬 비활성 검사를 통과했다. Google 태그 요청 1회는 로컬 mock으로 처리했고 Google 외부 전송은 0회다. `page_view`/정확한 설치 `click`은 queue에 각 1회이며 임의 쿼리·해시는 없다. [로컬 결과](web-measurement-2026-10-15/local-browser-result.txt), [재현 스크립트](web-measurement-2026-10-15/local-browser-check.js), [모바일](web-measurement-2026-10-15/mobile-consent.png), [설정 변경](web-measurement-2026-10-15/desktop-settings.png).
- 배포 전 공개 6 HTML·3 정책 JSON 모두 HTTPS 200, 기존 분석 태그 0개를 확인했다. [배포 전 응답](web-measurement-2026-10-15/preflight.json).

## 배포·공개·복구

아직 commit/push/Pages 배포 전이다. 같은 사용자 승인으로 기존 `main` Pages 배포를 이어간다. 실제 commit·배포 시각·공개 확인 시각과 검증 범위는 완료 후 이 문서에 기록한다. Google 관리 설정/필터/이벤트 수신/일반 보고서 생성은 서로 구분한다.

문제가 생기면 이 작업의 커밋을 대상으로 수정/원복 커밋을 만들고 기존 Pages 경로로 배포한다. 태그 삭제·강제 push·정책 JSON 초기화는 하지 않는다. 긴급 측정 중지는 `_config.yml`에서 이 GA4 ID 설정만 제거하고 배포하면 공통 include/태그가 렌더링되지 않는다. 이 중지 시 정책/기존 글/앱에 영향을 주지 않도록 대조한다. 이미 전송된 Google 데이터는 별도로 다뤄야 한다.

근거: [Google basic consent](https://developers.google.com/tag-platform/security/concepts/consent-mode), [수동 page_view와 중복 방지](https://developers.google.com/analytics/devguides/collection/ga4/views), [태그 중지](https://developers.google.com/tag-platform/security/guides/privacy), [DebugView 설정](https://support.google.com/analytics/answer/7201382). 2026-10-15 조회.
