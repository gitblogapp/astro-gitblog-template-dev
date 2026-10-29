# Astro Template Standard 검증 기록

2026-10-20에 GitBlog Template Standard 0.1.0을 기존 Astro 템플릿에 적용하고 아래 검사를 실행했습니다. 이전 기록은 [2026-10-06 검증](verification-2026-10-06.md)에 보관했습니다.

## 적용 상태

- 예제 원문 5개(초안 포함)와 영어 번역 2개를 삭제했습니다. 현재 원문·번역 글은 모두 0개입니다.
- `.gitblog/authoring.json`은 `deepl`이며 기존 원문 `ko` / 번역 `en` 설정을 유지했습니다.
- 출력 경로는 `build/`입니다. 예전 예제 글을 포함하던 `dist/`도 제거했습니다.
- 기존 홈 화면, 전역 CSS, 사용자 확장 슬롯, CMS 설정, 사이트 소개 및 영어 소개는 변경하지 않았습니다.
- 공통 하네스와 Astro 어댑터의 출처·차이는 [.gitblog/template-standard.json](../.gitblog/template-standard.json)과 [구현 안내](gitblog/template-porting.md)에 기록했습니다.

## 실행 결과

로컬 환경은 Node.js 26.7.0, npm 11.19.0, Astro 7.3.5였습니다. 프로젝트의 최소 Node.js 버전은 24.12이며 Actions는 Node.js 24를 사용합니다.

| 검사                          | 결과                                                                    |
| ----------------------------- | ----------------------------------------------------------------------- |
| `npm ci --no-audit --no-fund` | lockfile로 재설치 성공                                                  |
| `npm run update:check`        | 전체 통과; 보호 파일 변경 없음                                          |
| 위 명령의 `test:harness`      | 21개 통과                                                               |
| 위 명령의 `check:site`        | Astro 75개 파일 오류·경고·힌트 0개, 단위 테스트 5개 통과                |
| 위 명령의 `build`             | 실제 빈 블로그 빌드, Hub 계약, discovery 검사 통과; Pagefind 색인 생략  |
| 위 명령의 `test:seo`          | 루트 GitHub Pages / 프로젝트 하위 경로 / 커스텀 도메인 통과             |
| `npm run test:integration`    | 위 도메인 검사 및 번역 최신성·공개 export 제거·발행 취소·빈 블로그 통과 |
| `npm run test:browser`        | 설치된 Chrome headless에서 검색·경로·화면 동작 통과                     |
| workflow YAML 파싱            | `ci`, `deploy`, `sync-hub`, `hub-discussion-comment` 모두 통과          |

통합 검사는 임시 디렉터리에 원문·번역·초안, 사용자 페이지와 확장 슬롯을 만들어 실제 빌드 명령을 실행합니다. canonical/hreflang, 번역 시각의 lastmod 반영, XML·불변 ID·buildCommit, 공개 Markdown 및 링크, llms/discovery, Pagefind 언어별 색인, CNAME, 사용자 파일 보존을 검사합니다. Markdown 비활성화와 원문 발행 취소 후 이전 출력이 사라지는 것도 확인했습니다.

브라우저 검사는 `/preview` 하위 경로에서 한국어·영어 Pagefind 검색, 검색어 없는 카테고리 필터, 공백·한글 slug 링크, Markdown 응답의 MIME, 초안 미노출, 테마 저장, 390px·320px 가로 넘침과 브라우저 예외를 확인합니다. Astro가 동적 import 코드를 인라인 처리할 때 남기는 Vite preload 참조 문제를 피하도록 JS를 별도 파일로 출력합니다.

테스트 콘텐츠는 임시 디렉터리에만 생성되며 검사 후 제거합니다. 템플릿의 공개 콘텐츠에 예제 글을 다시 넣지 않습니다.

## 원격 확인 범위

이 검증에서는 실제 DeepL 요청, GitHub push/Actions, Pages 배포·DNS·HTTPS, 댓글 provider App 설치·실제 위젯, GitBlog 등록·수집을 실행하지 않았습니다. 관련 하네스 테스트의 네트워크 동작은 fixture로 검증했습니다.

배포 시 실제 블로그 저장소와 공개 설정을 먼저 확정하고 `site:check`를 통과해야 합니다. DeepL 번역이 필요하면 실행 환경 또는 Actions secret의 `DEEPL_API_KEY`를 설정합니다. 이 로컬 소스 폴더에는 Git 메타데이터가 없으므로 저장소 작업은 실제 블로그 저장소에서 실행합니다.

Astro 저장소의 공식 GitBlog 등록은 서비스 측 템플릿 지원이 필요합니다. [플랫폼 연동 경계](gitblog/platform-integration.md)에 승인 조건과 미구현 기능을 구분했습니다.
