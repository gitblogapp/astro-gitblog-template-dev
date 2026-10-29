# 검증 기록

검증일: 2026-10-06 (Asia/Seoul). Astro 7.3.5, 기본 Margin 예제와 이 작업 공간의 기존 `gitblog-template`을 대상으로 실행했습니다. 기존 블로그는 임시 복사본에서 빌드했으며 원본 소스와 저장소 상태를 변경하지 않았습니다.

## 실행 결과

| 검사 | 결과 |
| --- | --- |
| `npm run check` | 통과. 오류·경고·힌트 0 |
| `npm test` | 9개 계약 테스트 통과 |
| `npm run test:template` | 루트와 `/my-blog`의 실제 정적 빌드·산출물 검증 통과 |
| `npm run update:check` | 정적 빌드와 보호 경로·파일 바이트 보존 검사 통과 |
| `npm run test:reference -- ../gitblog-template` | 기존 원문 6개, ko/en/ja 공개 변형 18개 빌드 통과. canonical·Giscus term/repo 보존 확인 |
| `npm run test:browser` | 루트 개발 서버의 Chrome 동작 검사 통과 |
| `TEST_URL=http://127.0.0.1:4322/my-blog npm run test:browser` | 하위 경로 정적 preview의 Chrome 동작 검사 통과 |
| `npm audit` | 설치 완료 시 알려진 취약점 0개 |

## 규약 수용 기준별 증거

| 기준 | 확인 내용 | 상태 |
| --- | --- | --- |
| 원본 보존 | 콘텐츠·미디어·설정·테마·확장·사용자 추가 페이지의 경로와 SHA-256, 알 수 없는 JSON 파일 포함 | 통과 |
| ID | 계약의 UUID와 SHA-256 예시, 제목 변경 후 고정 ID, 누락·중복·번역 불일치 오류 | 통과 |
| CMS | 기존 컬렉션·미디어 경로·merge 설정 유지, 새 글 ID 입력 지원 | 설정 구현 완료. 실제 원격 저장·업로드 왕복 미검증 |
| 공개 여부 | 비공개 글과 그 공개 번역을 산출물에서 제외, 초안 직접 요청 404 | 통과 |
| 날짜 | 시간대 포함·날짜만·시간대 없는 입력의 Date.parse 결과, 미래 날짜 공개, RSS 수정일 | 통과 |
| 다국어 | 실제 ko/en/ja 입력, 공개 alternate만 생성, 없는 en 글 URL 404 | 통과 |
| URL | 한글·공백 slug, 루트·하위 경로, 미디어·canonical·feed, deep link 직접 접속·새로고침 | 통과 |
| 개발·빌드 설정 | production 기본값 공통 로드, development.local 및 실행 환경변수 우선순위 | 통과 |
| Markdown | GFM, 중첩·번호 목록, 표, 이미지, raw HTML, unknown code escape, heading ID | 통과 |
| 긴 본문 | 320px 브라우저에 긴 코드와 다열 표를 넣어 전체 페이지 가로 넘침 없음 확인 | 통과 |
| Hub manifest | schema, repository, sourceLocale, feed 개수, 동일 origin/base 경로, HTTPS 설정 | 로컬 출력 검증 통과. 실제 Hub 수집 미검증 |
| RSS | XML 문법, literal hub namespace, ID/GUID, hash, locale, 날짜, category→tags 순서 | 통과 |
| 댓글 | 규약 예시 `giscus-post-b27eb57690b38dc2`, 기존 18개 출력의 term/repo 보존 | 로컬 출력 검증 통과. 실제 Discussion 연결 미검증 |
| 검색 | 제목·본문 검색, 한국어/영어 결과 링크, 초안 제외, 임의 검색 입력은 textContent 처리 | 통과 |
| 확장·사용자 페이지 | 임시 사용자 Astro 페이지와 세 슬롯의 locale/post ID 전달, 원본 보존 | 통과. 기존 Svelte 사용자 컴포넌트 자동 이식은 미지원 |
| 디자인 | 데스크톱 1440px·모바일 390px의 홈/글/검색, 밝음/어두움 화면 검수; 320px 추가 overflow 검사 | 통과 |
| 실패·복구 | 검증 실패 시 명령 오류, deploy의 needs 조건, 원본 비변경 | 로컬 검증/CI 구성 완료. GitHub Actions 실배포·복구 실행 미검증 |

## 브라우저에서 확인한 동작

주제 필터의 목록 갱신, 다크 모드 전환과 새로고침 후 유지, 본문만 존재하는 단어 검색, 없는 결과, HTML 모양의 검색 문자열, 영어 검색 결과의 영어 글 이동, 비공개 글·없는 번역 404, 한글/공백 주소 직접 접근 및 새로고침을 검증했습니다. 클라이언트 예외는 없었습니다.

검수 이미지는 `test-results/home-desktop.png`, `home-dark.png`, `home-mobile.png`, `article-desktop.png`, `article-mobile.png`, `search-mobile.png`에 생성됩니다. 이 폴더는 Git에서 제외됩니다. 스크린샷은 새 디자인의 검수이며, 기존 Svelte 디자인과의 동일성을 주장하지 않습니다.

## 남아 있는 외부 확인

실제 사이트 주소·저장소로 Hub 참여를 활성화한 뒤 manifest와 feed가 HTTPS에서 redirect 없이 응답하는지 확인해야 합니다. Giscus 실서비스 연결, Pages CMS 저장 후 사용자 필드·ID 보존, GitHub Pages 실배포는 계정과 실제 저장소가 연결된 환경에서 수행해야 합니다. 로컬 테스트 통과를 서비스 등록·수집 완료로 표시하지 않습니다.
