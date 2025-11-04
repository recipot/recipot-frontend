# Deployment Guide

## 배포 플랫폼

- **Web**: Vercel
- **Mobile**: EAS Build/Submit
- **Cache & CI**: Turborepo + pnpm

## 버전 관리

현재 버전: **v1.0.0**

### 버전 번호 규칙 (Semantic Versioning)

- **MAJOR (v2.0.0)**: 호환성을 깨는 변경사항
- **MINOR (v1.1.0)**: 새로운 기능 추가 (하위 호환성 유지)
- **PATCH (v1.0.1)**: 버그 수정 및 작은 개선사항

## 릴리즈 프로세스

### 1. dev → main 머지

```bash
# dev 브랜치에서 main으로 PR 생성 및 머지
# GitHub PR: dev → main
```

### 2. 버전 태그 생성

```bash
# main 브랜치로 전환
git checkout main
git pull origin main

# 버전 태그 생성 (예: v1.0.1)
git tag -a v1.0.1 -m "Release v1.0.1: 변경사항 요약"

# 태그 푸시
git push origin v1.0.1
```

### 3. 배포

- **Web**: Vercel이 main 브랜치 변경사항을 자동으로 감지하여 배포
- **Mobile**: EAS Build를 통해 수동 배포

## 핫픽스 프로세스 (필요시)

프로덕션에서 발견된 긴급 버그 수정:

```bash
# main 브랜치에서 핫픽스 브랜치 생성
git checkout main
git checkout -b hotfix/v1.0.1

# 버그 수정 후
git checkout main
git merge hotfix/v1.0.1
git tag -a v1.0.1 -m "Hotfix v1.0.1: 버그 수정 내용"
git push origin main --tags

# dev에도 머지 (핫픽스 반영)
git checkout dev
git merge hotfix/v1.0.1
git push origin dev
```

## 릴리즈 체크리스트

릴리즈 전 확인사항:

- [ ] dev 브랜치에서 모든 테스트 통과
- [ ] 코드 리뷰 완료
- [ ] 빌드 성공 (`pnpm build`)
- [ ] 린트 통과 (`pnpm lint`)
- [ ] 타입 체크 통과 (`pnpm typecheck`)
- [ ] 변경사항 문서화
- [ ] 버전 태그 생성 및 푸시
