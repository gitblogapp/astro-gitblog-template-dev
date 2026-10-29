# Margin — Astro GitBlog template

크림색 종이와 초록색 잉크를 모티프로 만든 개인 블로그 템플릿입니다. Astro의 정적 HTML 위에 검색·주제 필터·색상 테마 전환만 작은 브라우저 스크립트로 추가했습니다. 외부 폰트나 UI 프레임워크 없이 동작합니다.

GitBlog Template Standard 0.1.0의 빌드·배포·LLM 하네스를 적용했습니다. 예제 원문과 번역 글은 없는 상태로 시작하며, 기본 번역 모드는 **DeepL**입니다. 사이트 소개, 테마, CMS 설정과 분류 컬렉션은 별도로 관리합니다.

## 시작하기

Node.js **24.12 이상**과 npm을 사용합니다.

```sh
npm ci
npm run dev                 # http://localhost:4321
npm run build               # build/에 정적 출력과 검색 인덱스 생성
npm run preview             # http://127.0.0.1:4173, 설정된 base path 반영
```

글이 없는 상태도 빌드됩니다. 발행 글이 0개면 Pagefind 색인을 만들지 않고 검색은 빈 결과를 표시합니다. 글이 있으면 실제 Pagefind 오류는 빌드를 실패시킵니다. 개발 서버에서는 `search.json`, production build에서는 Pagefind를 사용합니다.

## LLM으로 블로그 개설·운영

에이전트의 시작점은 [AGENTS.md](../../AGENTS.md)입니다. [공식 문서](../../docs/gitblog/README.md)와 [Astro 구현 안내](../../docs/gitblog/template-porting.md)를 확인하세요. 루트 README는 블로그 소유자의 소개로 바꿔도 됩니다.

```sh
npm run author:context
npm run site:setup
# 대화에서 선택한 설정을 .gitblog/work/setup.json에 저장
npm run site:configure -- --from .gitblog/work/setup.json
npm run site:check
npm run site:pages
```

실제 블로그의 Git origin과 인증된 GitHub CLI가 필요합니다. 최초 언어·도메인·댓글 사용 여부를 확정하고 [설정 가이드](../../docs/gitblog/setup.md)를 따릅니다. `gh`/PAT 인증과 댓글 provider App 설치는 별도입니다. 토큰은 저장소나 채팅에 넣지 않습니다.

```sh
npm run author:new -- 2026-10-20-my-post \
  --title '글 제목' --description '짧은 소개' --date '2026-10-20T10:00:00+09:00'
npm run author:status
npm run author:check
npm run author:verify
```

예제 날짜는 실제 작성 시점으로 바꾸세요. 새 글은 `published: false`이고 UUID를 갖습니다. 발행 요청에 따라 상태를 변경하고, diff를 검토하여 관련 파일을 커밋한 뒤 `author:deploy`, `author:deploy-status -- <SHA>`를 실행합니다. 이 명령은 stage/commit/force-push를 자동 수행하지 않습니다. 상세 절차는 [작성·번역 하네스](../../docs/gitblog/authoring.md)에 있습니다.

기존 `posts:new -- <slug> <title>`도 하네스로 연결되지만, 설명과 날짜를 명시하는 `author:new`를 권장합니다.

## 콘텐츠·설정

| 경로                                                          | 역할                                           |
| ------------------------------------------------------------- | ---------------------------------------------- |
| `content/posts/*.md`                                          | 원문. UUID/ULID, title, description, date 필수 |
| `content/translations/<locale>/posts/*.md`                    | 같은 ID·파일명의 번역                          |
| `content/site.json`                                           | 기존 Astro 사이트 소개·설정의 fallback         |
| `content/translations/<locale>/site.json`                     | 번역된 사이트 소개                             |
| `content/categories`, `content/tags`, `content/taxonomy.json` | CMS 분류와 다국어 라벨                         |
| `static/uploads/`                                             | 업로드. 글에서는 `/uploads/...` 사용           |
| `.env.production`                                             | 공개 운영 설정. 비밀 금지                      |
| `.gitblog/authoring.json`                                     | `deepl` / `manual` 번역 정책                   |
| `.gitblog/user-instructions.md`                               | 사용자 문체·작업 선호                          |
| `src/theme`, `src/extensions`                                 | 사용자 테마·확장                               |

설정 우선순위는 **실행 환경변수 → `.env.production` → 기존 `content/site.json` → 기본값**입니다. 하네스와 렌더러가 같은 로더를 사용합니다. 명시적인 빈 값은 설정을 지우는 선택이며 fallback으로 다시 채우지 않습니다. `.env.development.local` 등을 운영 설정으로 혼용하지 않습니다. 개발·CI에서 필요한 임시 변경은 프로세스 환경변수로 전달하세요.

```dotenv
PUBLIC_SITE_URL=https://your-name.github.io/my-blog
PUBLIC_SITE_REPOSITORY=your-name/my-blog
PUBLIC_SOURCE_LOCALE=ko
PUBLIC_TRANSLATION_LOCALES=en
PUBLIC_HUB_ENABLED=false
```

`PUBLIC_SITE_REPOSITORY`가 표준 키이며 `PUBLIC_HUB_REPOSITORY`는 기존 블로그의 fallback 별칭입니다. CI의 `GITHUB_REPOSITORY`가 우선합니다. `PUBLIC_SITE_OWNER`는 작성자이며 기존 `PUBLIC_SITE_AUTHOR`도 fallback으로 지원합니다. 기본 base는 URL에서 계산하고 `SITE_BASE_PATH`는 테스트·preview에서만 명시적으로 덮어씁니다.

원문 ID·파일명·최초 날짜를 임의로 변경하지 않습니다. `published` 생략은 발행이며 미래 날짜는 예약 발행이 아닙니다. 비공개 원문의 번역도 HTML·RSS·sitemap·Markdown·검색에서 제외됩니다.

## 번역과 댓글

DeepL 모드는 `content:prepare`에서 ID를 준비하고 `translate:content`에서 번역을 동기화합니다. **일반 `build`는 API를 호출하거나 원문·번역을 수정하지 않습니다.** 배포 CI에는 Actions secret `DEEPL_API_KEY`가 필요하며, 필요한 경우 `DEEPL_API_URL`도 설정합니다. 한국어/영어의 기존 언어 설정은 유지했습니다. 로컬에서는 키를 비공개 환경변수로 주입한 뒤 실행하세요.

```sh
npm run content:prepare
npm run translate:content
npm run build
```

manual 모드로 바꿀 때는 [번역 등록 절차](../../docs/gitblog/authoring.md)를 따릅니다. 발행 원문은 모든 설정 언어의 최신 번역과 해시가 필요합니다. 검증 우회를 위해 모드·대상 언어를 바꾸지 않습니다.

댓글은 `PUBLIC_GISCUS_ENABLED`, repo/category ID, `PUBLIC_GISCUS_PROVIDER`, `PUBLIC_GISCUS_HOST`를 사용합니다. 기존 Astro의 `giscus` / `https://giscus.app` 기본 provider를 유지했습니다. `site:configure`로 연결을 확인하고 실제 provider App과 위젯을 검증하세요. 원문 ID로 계산한 `giscus-post-<hash>`를 사용하며 CI가 Discussion을 동기화합니다.

## 빌드·배포 규칙

```text
build: author:check → Astro 정적 빌드 → CNAME → Hub 계약 → discovery → 검색 색인
CI: site:check → 콘텐츠 준비·ID 저장 → 번역·저장 → Discussion 동기화
    → 실제 HEAD SHA 기록 → build → Release 동기화 → Pages artifact → 배포
    → live discovery 검사 / 조건부 GitBlog 등록
```

`main` push와 workflow dispatch로 배포합니다. template 저장소에서는 배포 job을 건너뜁니다. `.well-known`을 tar에 포함하고, `.git`, `.github`, `.env*`를 제외합니다. Custom domain은 `site:pages`로 Pages 설정도 맞춰야 하며 `CNAME` 파일만으로 DNS 설정이 되지 않습니다.

GitBlog 자동 등록은 기본 비활성입니다. 별도 Astro 템플릿의 계보와 workflow가 서비스에서 승인된 뒤 `PUBLIC_HUB_ENABLED`, `PUBLIC_HUB_URL`, Actions 변수 `GITBLOG_OFFICIAL_INTEGRATION=true`를 설정합니다. 이 변수만으로 서비스 승인이 되지는 않습니다. [플랫폼 연동 경계](../../docs/gitblog/platform-integration.md)를 확인하세요. 이력 삭제 workflow는 포함하지 않았습니다.

## 커스터마이징·검증

테마는 `src/theme`, 확장은 `src/extensions/Slot.astro`에 있습니다. 확장 슬롯은 `article-before-body`, `article-after-body`, `site-footer`이며 site/locale/pathname/post context를 받습니다. 실제 경로에 맞춘 보존 정책은 [.gitblog/update-policy.json](../../.gitblog/update-policy.json)에 있습니다.

```sh
npm run check                 # 공통 하네스 + 콘텐츠/ID + Astro/단위 검사
npm run test:integration      # 임시 fixture로 실제 build·발행 취소·빈 블로그 검사
npm run update:check          # check + build + SEO, 보호 파일 보존 검사
npm run test:browser          # 임시 사이트·preview·설치된 Chrome으로 검색/UI 검사
```

`test:seo`, `test:template`, `test:authoring:build` 명령도 제공합니다. 테스트 글은 임시 디렉터리에만 생성합니다. 공개 디렉터리에 예제 글을 복원하지 않습니다. [검증 기록](../../docs/verification.md)에 실행 범위와 외부 미검증 항목을 구분했습니다.
