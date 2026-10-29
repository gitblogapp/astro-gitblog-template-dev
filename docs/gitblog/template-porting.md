# Astro 규격 구현

이 템플릿은 공통 starter의 미구현 훅을 모두 Astro에 연결했습니다. 기준 버전과 출처는 [.gitblog/template-standard.json](../../.gitblog/template-standard.json)에 있습니다.

| 표준 명령          | Astro 구현                                                             |
| ------------------ | ---------------------------------------------------------------------- |
| `dev`              | `astro dev`                                                            |
| `build:site`       | `astro build`; 출력은 `build/`, 공개 자산은 `static/`                  |
| `check:site`       | `astro check`                                              |
| `test:seo`         | root/project/custom domain fixture의 실제 전체 파이프라인 검사         |
| `test:integration` | SEO 검사 + stale manual 번역 거절·공개 export 제거·발행 취소·빈 블로그 |
| `search:index`     | 발행 글이 있을 때 Pagefind 실행, 없으면 색인 생략                      |
| `preview`          | base path와 Markdown MIME을 지원하는 정적 서버                         |

## 데이터와 경로

`src/lib/template`은 코어, `src/theme`은 테마, `src/extensions`는 사용자 확장입니다. Astro 파일의 `$lib` 같은 Svelte 의존성은 없습니다. 공통 하네스는 `scripts/*.mjs`, `scripts/lib/`에 있습니다.

`src/lib/template/config.ts`와 `scripts/lib/env.mjs`는 `scripts/lib/site-settings.mjs`로 기존 `content/site.json` fallback을 공유합니다. setup 명령은 저장된 설정과 fallback을 읽어 확인하며, 임시 프로세스 설정을 파일에 자동 저장하지 않습니다. 새 설정은 `.env.production`을 우선 사용합니다.

HTML, RSS, sitemap, Hub manifest, AI discovery, llms, 공개 Markdown은 같은 발행 콘텐츠 목록에서 생성합니다. 표준 canonical·hreflang 언어 코드는 `en`, `en-GB`, `zh-Hans`, `zh-Hant`처럼 audience를 유지합니다. 번역의 실제 `translatedAt`이 더 최신이면 SEO lastmod에 반영합니다.

`PUBLIC_SITE_URL`의 `/repo`는 공개 URL에 한 번 반영하며 파일은 `build/rss.xml`처럼 배치합니다. 빌드가 출력 디렉터리를 새로 생성하므로 제거한 글과 비활성 Markdown이 남지 않습니다. 본문은 `.article-content`, 검색 인덱스는 `data-pagefind-body`와 locale/category/tag 필터를 사용합니다.

## 검색·댓글

production은 Pagefind, 개발 서버는 `search.json`을 사용합니다. 빈 언어의 검색은 Pagefind를 요청하지 않고 빈 결과를 표시합니다. 태그 사전이 있으면 번역 라벨과 검색 alias를 공유합니다.

Giscus provider/host와 표시 설정을 렌더링 및 theme 메시지 origin에 반영합니다. App 설치·원격 위젯 정상 동작은 로컬 빌드 성공과 별도로 확인합니다. 추천 패널·분석·멤버십 임베드·TTS·이미지 최적화는 공통 패키지와 Astro 어댑터로 연결합니다. [공통 패키지](shared-packages.md)를 참고하세요.

## 보존·배포

[보존 규칙](customization.md), [플랫폼 연동](platform-integration.md)을 따릅니다. `main` push 배포는 setup 완료 후에만 성공합니다. Git 메타데이터와 실제 remote가 없는 로컬 소스 폴더에서는 작성·빌드·테스트는 가능하지만 GitHub 설정·push는 실제 블로그 저장소에서 실행해야 합니다.

## Development and user repositories

Development-only commands (`test:*`) and browser/SEO fixtures live in [the development repository](https://github.com/gitblogapp/astro-gitblog-template-dev). User distributions retain framework checks, authoring validation and `update:check` with source preservation, without tests. See the development repository’s `DEVELOPMENT.md` for the verified release pipeline.
