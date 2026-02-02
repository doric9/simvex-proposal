# SimVex 3D Viewer MVP - Hook 패턴 적용 버전

## 🎯 프로젝트 개요

**Blaybus 2026 MVP 해커톤**을 위한 SimVex 기반 3D 시뮬레이션 학습 플랫폼의 MVP 버전입니다.

### 🔥 **Hook 패턴 적용**

이 프로젝트는 **3명의 개발자가 병렬로 작업할 수 있도록** Hook 패턴으로 리팩토링되었습니다.

---

## 👥 팀 구성 및 역할 분담

| 역할 | 담당자 | 작업 영역 | 파일 |
|------|--------|----------|------|
| **PM + 씬 초기화** | 본인 | Three.js 씬 설정 | `src/hooks/useSceneSetup.js` |
| **카메라 컨트롤** | 도영님 | OrbitControls | `src/hooks/useOrbitControls.js` |
| **애니메이션** | 상진님 | 분해도/하이라이트 | `src/hooks/useModelAnimations.js` |
| **공통** | 전체 | 모델 로딩/인터랙션 | `src/hooks/useModelLoader.js` <br> `src/hooks/usePartInteraction.js` |

---

## 📂 폴더 구조 (Hook 패턴)

```
simvex-3d-viewer/
├── src/
│   ├── hooks/                    🆕 Hook 로직 분리
│   │   ├── useSceneSetup.js      ← 본인 담당 (씬 설정)
│   │   ├── useOrbitControls.js   ← 도영님 담당 (카메라)
│   │   ├── useModelAnimations.js ← 상진님 담당 (애니메이션)
│   │   ├── useModelLoader.js     ← 공통 (모델 로딩)
│   │   └── usePartInteraction.js ← 공통 (클릭/호버)
│   │
│   ├── components/
│   │   └── Viewer/
│   │       ├── Scene3D.tsx       🔄 수정됨 (Hook 사용)
│   │       └── ModelGroup.tsx    🔄 수정됨 (Hook 사용)
│   │
│   ├── stores/                   ✅ 유지 (Zustand)
│   ├── utils/                    ✅ 유지
│   └── types/                    ✅ 유지
│
├── public/models/                ✅ 유지 (GLB 파일)
└── package.json
```

---

## 🚀 빠른 시작

### 1. 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 빌드

```bash
npm run build
```

### 4. 배포 (Vercel)

```bash
vercel
```

---

## 🎣 Hook 사용 방법

### **컴포넌트에서 Hook 조합하기**

```tsx
import { useSceneSetup } from '../../hooks/useSceneSetup';
import { useOrbitControls } from '../../hooks/useOrbitControls';
import { useModelAnimations } from '../../hooks/useModelAnimations';

function MyComponent() {
  // Hook을 "레고 블록"처럼 조립
  const { lightingConfig } = useSceneSetup();
  const { controlsConfig } = useOrbitControls();
  const { calculateExplodePosition } = useModelAnimations(0.5, null);

  return (
    <Canvas>
      {/* Hook에서 가져온 설정 사용 */}
      <ambientLight intensity={lightingConfig.ambient.intensity} />
      <OrbitControls {...controlsConfig} />
    </Canvas>
  );
}
```

---

## 👨‍💻 개발 워크플로우

### **병렬 작업 (3명 동시 개발)**

#### **Day 1-3: 독립 작업**

```bash
# 본인 (PM)
git checkout -b feature/scene-setup
# src/hooks/useSceneSetup.js 작업
git commit -m "feat: 씬 초기화 Hook 구현"
git push origin feature/scene-setup

# 도영님
git checkout -b feature/orbit-controls
# src/hooks/useOrbitControls.js 작업
git commit -m "feat: OrbitControls Hook 구현"
git push origin feature/orbit-controls

# 상진님
git checkout -b feature/animations
# src/hooks/useModelAnimations.js 작업
git commit -m "feat: 애니메이션 Hook 구현"
git push origin feature/animations
```

#### **Day 4: PR 생성 및 순차 머지**

```bash
# 순서대로 머지 (충돌 방지)
1. 본인 → main
2. 도영님 → main
3. 상진님 → main
```

#### **Day 5: 통합 테스트**

```bash
# 통합 확인
npm run dev
# 테스트 후 배포
vercel --prod
```

---

## 🔧 Hook 수정 가이드

### **본인 담당: useSceneSetup.js**

```javascript
// 수정 예시: 조명 강도 변경
export function useSceneSetup() {
  return {
    lightingConfig: {
      ambient: { intensity: 0.7 },  // 0.5 → 0.7로 변경
      // ...
    }
  };
}
```

### **도영님 담당: useOrbitControls.js**

```javascript
// 수정 예시: 줌 속도 변경
export function useOrbitControls() {
  return {
    controlsConfig: {
      zoomSpeed: 1.2,  // 0.8 → 1.2로 변경
      // ...
    }
  };
}
```

### **상진님 담당: useModelAnimations.js**

```javascript
// 수정 예시: 분해 거리 변경
const calculateExplodePosition = (originalPos, center, factor) => {
  const explodeDistance = factor * 5;  // 3 → 5로 변경
  // ...
};
```

---

## ⚠️ 주의사항

### 1. **Hook 규칙 준수**

- Hook 이름은 `use`로 시작
- Hook은 React 컴포넌트 또는 다른 Hook 내부에서만 호출
- 조건문 안에서 Hook 호출 금지

### 2. **충돌 방지**

- 각자 **자신의 Hook 파일만 수정**
- 공통 파일(`useModelLoader.js`, `usePartInteraction.js`)은 **사전 협의 후 수정**
- 머지는 **순차적으로** (본인 → 도영님 → 상진님)

### 3. **테스트**

- 로컬에서 **독립적으로 테스트** 후 커밋
- PR 생성 시 **Preview 배포 URL 확인**
- 통합 후 **전체 기능 테스트**

---

## 📊 진행 상황 체크리스트

### Week 1 (2/1 - 2/7)

- [ ] Day 1 (2/1): 역할 분담 확정, 개발 환경 세팅
- [ ] Day 2 (2/2): Hook 파일 기본 구조 작성
- [ ] Day 3 (2/3): Hook 로직 구현 완료
- [ ] Day 4 (2/4): 로컬 테스트 및 PR 생성
- [ ] Day 5 (2/5): 순차 머지 및 통합
- [ ] Day 6 (2/6): 통합 테스트 및 버그 수정
- [ ] Day 7 (2/7): UI 폴리싱

### Week 2 (2/8 - 2/10)

- [ ] Day 8 (2/8): AI 챗봇 통합
- [ ] Day 9 (2/9): 최종 테스트 및 배포
- [ ] Day 10 (2/10): 발표 자료 준비

---

## 🆘 문제 해결

### **Hook이 동작하지 않을 때**

1. **콘솔 로그 확인**
   ```javascript
   console.log('✅ [useSceneSetup] 씨 초기화 완료');
   ```

2. **의존성 배열 확인**
   ```javascript
   useEffect(() => {
     // ...
   }, [dependency]); // 의존성 누락 확인
   ```

3. **Hook 반환값 확인**
   ```javascript
   const { lightingConfig } = useSceneSetup();
   console.log(lightingConfig); // undefined 체크
   ```

### **Git 충돌 발생 시**

```bash
# 최신 main 가져오기
git pull origin main

# 충돌 해결 후
git add .
git commit -m "fix: 충돌 해결"
git push
```

---

## 📝 커밋 메시지 규칙

```
feat: 새 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
docs: 문서 수정
style: 코드 포맷팅
test: 테스트 추가
chore: 빌드/설정 변경
```

**예시:**
```bash
git commit -m "feat: useOrbitControls Hook 구현"
git commit -m "fix: 분해 애니메이션 버그 수정"
git commit -m "refactor: useModelLoader 성능 최적화"
```

---

## 🎉 완성도 목표

### Bronze (최소 완성)
- ✅ 3D 모델 뷰어 (1개 모델)
- ✅ 회전/줌 컨트롤
- ✅ AI 챗봇 기본

### Silver (권장)
- ✅ Bronze +
- ✅ 3-5개 모델 지원
- ✅ 분해도 애니메이션
- ✅ 부품 클릭/하이라이트

### Gold (이상적)
- ✅ Silver +
- ✅ 물리 시뮬레이션
- ✅ 워크플로우 차트
- ✅ 학습 노트 기능

---

## 📞 연락처

문제 발생 시 팀 채팅방에 공유해주세요!

**화이팅! 🔥**
