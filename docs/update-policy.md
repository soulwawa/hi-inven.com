# 업데이트 정책 운영

## 공개 경로

| 채널 | 파일 | URL |
| --- | --- | --- |
| dev | `hi-inven-dev.json` | `https://hi-inven.com/hi-inven-dev.json` |
| TestFlight | `hi-inven-testflight.json` | `https://hi-inven.com/hi-inven-testflight.json` |
| production | `hi-inven.json` | `https://hi-inven.com/hi-inven.json` |

## 판정 규칙

버전은 `major.minor.patch` 숫자로 비교합니다.

1. 앱 버전이 `minimumVersion`보다 낮으면 강제 업데이트입니다.
2. 그렇지 않고 `recommendedVersion`보다 낮으면 권장 업데이트입니다.
3. 그 외에는 업데이트 안내를 표시하지 않습니다.
4. 파일 조회나 해석에 실패하면 앱 사용을 막지 않습니다.

현재 세 정책은 모두 `0.0.0`, `appStoreURL: null`인 비활성 상태입니다. App Store URL이 확정되기 전에는 임계 버전을 올리지 않습니다.

## 변경 전 확인

1. 수정하려는 파일과 앱 빌드 채널이 일치하는지 확인합니다.
2. `recommendedVersion`이 `minimumVersion`보다 낮지 않은지 확인합니다.
3. 임계 버전을 활성화할 때 `appStoreURL`이 신규 안녕재고 App Store 페이지인지 확인합니다.
4. 최소 버전 미만, 두 임계값 사이, 권장 버전 이상을 각각 대입해 결과를 확인합니다.
5. 운영 정책은 한 번에 한 채널만 바꾸고 되돌릴 커밋을 기록합니다.
6. `bundle exec ruby script/check.rb`가 통과한 뒤 변경 내용을 다시 확인합니다.

정책 파일은 `main` 반영 직후 실행 중인 앱에 영향을 줄 수 있습니다. 앱에 원격 정책 조회가 구현되기 전에는 URL만 준비하고 임계 버전은 비활성 상태로 유지합니다.
