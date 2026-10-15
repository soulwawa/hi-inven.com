# 안녕재고 웹 측정 연결

2026-10-15, Asia/Seoul. 현재 단계: 사이트 구현·배포·공개 확인과 실제 Google 전송 검사 완료. Google DebugView 수신/일반 보고 조회는 성장 담당의 후속 검증이며 이 문서에서 완료로 간주하지 않는다.

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

- 운영 소스 commit `51e7ae86b933ade060a843d3ff4ad3db04ac2fbb`를 기존 원격 `main`에 fast-forward push했다. Pages의 source는 main/root이며 같은 commit의 `built`와 오류 없음, `updated_at=2026-10-15T07:11:10Z`(16:11:10 KST)를 확인했다. PR·앱 원격 변경은 하지 않았다.
- 공개 확인은 16:13:09 KST다. HTML 6곳·정책 JSON 3개·JS/CSS 2개 모두 HTTPS 200. 모든 HTML에 정확한 ID의 로컬 include 1개, 직접 로드하는 Google script 0개를 확인했다. 공개 JS/CSS는 검증한 소스와 바이트가 일치하고 정책 3개는 배포 전 SHA256과 같다. [공개 응답/Pages 근거](web-measurement-2026-10-15/public-readback.json).
- 실제 공개 페이지의 마지막 Chrome 검사 완료는 16:15:29 KST다. 동의 전/거부 시 Google 태그·전송 0, 허용 후 태그 1개, `page_view` 1회·정확한 `click` 1회 각각 HTTP204를 관측했다. 두 이벤트의 `ep.debug_mode=true`, `gcs=G101`, 안전한 페이지/유입/설치 URL, 임의 query/hash·UTM fixture 미전송을 확인했다. 철회 후 재로드·거부 보존·추가 전송 0과 해당 GA 쿠키 삭제도 통과했다. App Store 문서는 테스트 브라우저에서 가로챘으며 실제 앱 설치 시험은 아니다. [실제 전송 결과](web-measurement-2026-10-15/public-browser-result-2.txt), [재현 스크립트](web-measurement-2026-10-15/public-browser-check.js), [구조화 결과](web-measurement-2026-10-15/transport.json).
- 첫 공개 검사는 테스트 코드가 debug의 wire 값을 `1`로만 예상해 실패했다. 실제 config는 `debug_mode:true`, 전송은 `ep.debug_mode=true`였고 주소 제한/전송은 이미 통과했다. 관측한 형식을 검사에 반영하고 새 브라우저로 전체 순서를 통과했다. 운영 JS를 바꾼 회귀 수정은 아니다. [첫 실패](web-measurement-2026-10-15/public-browser-result-1.txt), [표시 확인·철회](web-measurement-2026-10-15/debug-flag-inspection.txt)를 보존한다. 실제 외부 검사는 두 번의 debug 방문에서 실행했으며 고객 방문 성과로 합산하지 않는다.
- HTTP204는 전송 성공 근거다. Google DebugView에서의 수신 확인, 일반 보고서 데이터 생성/조회, 공통 대시보드와 매일 모니터링 반영은 성장 담당이 별도로 완료해야 한다. Search Console 소유권은 위 인계 근거이며 이 담당이 별도 Google 로그인/키/권한 작업을 수행하지 않았다.
- 후속 조건 대조: 운영 config/event에는 `debug_mode:false`가 없고, `analytics_debug=1`에서만 `true`를 설정한다. 일반 방문과 `analytics_debug=0`에서 필드 자체가 없다는 기존 Node 검사(`script/check-analytics.cjs`, 7/7 통과)도 확인했다. 이 조건 때문에 운영 코드를 바꾸거나 외부 테스트를 반복하지 않았다.
- 성장 담당의 최신 인계에서는 DebugView 개발 기기/이벤트가 아직 보이지 않는다. Developer Traffic 필터의 UI 활성과 실제 적용 지연을 구분하고 2026-10-15를 초기 검증일로 분리한다. 테스트가 이미 고객 보고에서 제외됐다고 단정하지 않는다. `transport.json`의 정확한 `checked_at=2026-10-15T07:15:29.887Z`는 해당 두 HTTP204를 관측한 검사 완료 시각이며, 각 요청의 개별 송신 시각은 별도 기록하지 않았다. G-ID·eventName·debug 표시·동의 상태는 같은 파일의 허용 목록에 보존했고 cid·쿠키·실제 이메일·인증값은 복제하지 않았다.
- 배포 후 근거만 추가한 후속 문서 commit은 운영 코드·설정과 정책을 바꾸지 않는다. 이 작업의 임시 정적 서버와 별도 검증 브라우저는 종료한다.

문제가 생기면 이 작업의 커밋을 대상으로 수정/원복 커밋을 만들고 기존 Pages 경로로 배포한다. 태그 삭제·강제 push·정책 JSON 초기화는 하지 않는다. 긴급 측정 중지는 `_config.yml`에서 이 GA4 ID 설정만 제거하고 배포하면 공통 include/태그가 렌더링되지 않는다. 이 중지 시 정책/기존 글/앱에 영향을 주지 않도록 대조한다. 이미 전송된 Google 데이터는 별도로 다뤄야 한다.

근거: [Google basic consent](https://developers.google.com/tag-platform/security/concepts/consent-mode), [수동 page_view와 중복 방지](https://developers.google.com/analytics/devguides/collection/ga4/views), [태그 중지](https://developers.google.com/tag-platform/security/guides/privacy), [DebugView 설정](https://support.google.com/analytics/answer/7201382). 2026-10-15 조회.
