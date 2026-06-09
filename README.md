# 솔솔글방 웹사이트

## 로컬 실행

이 프로젝트는 `pnpm`을 사용합니다.

```bash
pnpm install
pnpm dev
```

개발 서버가 실행되면 브라우저에서 아래 주소로 접속합니다.

```text
http://127.0.0.1:5173/
```

프로덕션 빌드를 로컬에서 확인하려면 아래 명령을 사용합니다.

```bash
pnpm build
pnpm preview
```

## 배포

배포 전에 빌드가 정상적으로 완료되는지 확인합니다.

```bash
pnpm build
```

이 저장소는 GitHub Pages용 정적 사이트입니다. 변경 사항을 `main` 브랜치에 커밋하고 푸시하면 GitHub Pages 설정에 따라 배포됩니다.

```bash
git add .
git commit -m "Update site"
git push origin main
```

빌드 결과물은 `dist/`에 생성됩니다.
