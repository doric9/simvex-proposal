# 🎣 Hook 패턴 완전 가이드

## 📌 Hook이란?

### 한 줄 요약
> **Hook = React에서 로직을 재사용 가능하게 만드는 함수**

### 왜 Hook을 사용하나?

#### ❌ Hook 없이 (문제점)
```tsx
// ModelViewer.tsx - 200줄의 거대한 컴포넌트
function ModelViewer() {
  // 씬 초기화 (30줄)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  // ... 

  // OrbitControls (40줄)
  const controls = new OrbitControls();
  // ...

  // 애니메이션 (50줄)
  const animate = () => { /* ... */ };
  // ...

  // 모델 로딩 (40줄)
  const loader = new GLTFLoader();
  // ...

  return <canvas />;
}
```

**문제:**
- 3명이 같은 파일 수정 → **Git 충돌 100%**
- 코드가 너무 길어서 읽기 힘듦
- 재사용 불가능

#### ✅ Hook 사용 (해결)
```tsx
// Hook으로 로직 분리
function ModelViewer() {
  // 각 Hook은 별도 파일
  const { lightingConfig } = useSceneSetup();        // 본인
  const { controlsConfig } = useOrbitControls();     // 도영님
  const { calculateExplodePosition } = useModelAnimations(); // 상진님

  return <canvas />;
}
```

**장점:**
- 각자 다른 파일 작업 → **충돌 0%**
- 코드가 짧고 깔끔
- 재사용 가능

---

## 🎯 우리 프로젝트의 Hook 구조

### 파일 구조

```
src/hooks/
├── useSceneSetup.js         ← 본인 담당
├── useOrbitControls.js      ← 도영님 담당
├── useModelAnimations.js    ← 상진님 담당
├── useModelLoader.js        ← 공통
└── usePartInteraction.js    ← 공통
```

### 역할 분담

| Hook | 담당자 | 역할 | 작업 시간 |
|------|--------|------|----------|
| `useSceneSetup` | **본인** | 씬/조명 초기화 | 2-3시간 |
| `useOrbitControls` | **도영님** | 카메라 컨트롤 | 3-4시간 |
| `useModelAnimations` | **상진님** | 분해도/하이라이트 | 4-5시간 |
| `useModelLoader` | **공통** | 모델 로딩 | 이미 완성 |
| `usePartInteraction` | **공통** | 클릭/호버 | 이미 완성 |

---

## 📝 Hook 작성 예시

### 1. useSceneSetup.js (본인 담당)

#### 기본 구조

```javascript
import { useEffect } from 'react';

export function useSceneSetup() {
  useEffect(() => {
    // 초기화 작업
    console.log('씬 초기화');
    
    return () => {
      // 정리 작업
      console.log('씬 정리');
    };
  }, []);

  return {
    // 반환할 값
    lightingConfig: { /* ... */ }
  };
}
```

#### 수정 포인트 (본인 작업)

```javascript
export function useSceneSetup() {
  return {
    lightingConfig: {
      // 🔧 여기를 수정하세요!
      ambient: { 
        intensity: 0.5  // 조명 밝기 조절
      },
      directional: {
        position: [10, 10, 5],  // 조명 위치
        intensity: 1,           // 조명 밝기
        castShadow: true        // 그림자 활성화
      }
    },
    environment: 'studio'  // 환경 맵 (studio, sunset, dawn 등)
  };
}
```

#### 테스트 방법

```tsx
// Scene3D.tsx에서 사용
function Scene3D() {
  const { lightingConfig } = useSceneSetup();
  
  console.log(lightingConfig); // 출력 확인
  
  return (
    <Canvas>
      <ambientLight intensity={lightingConfig.ambient.intensity} />
    </Canvas>
  );
}
```

---

### 2. useOrbitControls.js (도영님 담당)

#### 기본 구조

```javascript
import { useEffect } from 'react';

export function useOrbitControls() {
  useEffect(() => {
    console.log('OrbitControls 초기화');
  }, []);

  return {
    controlsConfig: { /* ... */ }
  };
}
```

#### 수정 포인트 (도영님 작업)

```javascript
export function useOrbitControls() {
  return {
    controlsConfig: {
      // 🔧 여기를 수정하세요!
      enableDamping: true,      // 부드러운 움직임
      dampingFactor: 0.05,      // 감속 정도 (작을수록 부드러움)
      minDistance: 2,           // 최소 줌 거리
      maxDistance: 20,          // 최대 줌 거리
      maxPolarAngle: Math.PI / 2, // 최대 회전 각도
      
      // 속도 조절
      rotateSpeed: 0.5,   // 회전 속도
      zoomSpeed: 0.8,     // 줌 속도
      panSpeed: 0.5,      // 패닝 속도
      
      // 자동 회전
      autoRotate: false,  // 자동 회전 활성화
      autoRotateSpeed: 2.0 // 자동 회전 속도
    }
  };
}
```

#### 테스트 방법

```tsx
// Scene3D.tsx에서 사용
function Scene3D() {
  const { controlsConfig } = useOrbitControls();
  
  return (
    <Canvas>
      <OrbitControls {...controlsConfig} />
    </Canvas>
  );
}
```

---

### 3. useModelAnimations.js (상진님 담당)

#### 기본 구조

```javascript
import { useRef } from 'react';
import * as THREE from 'three';

export function useModelAnimations(explodeFactor, selectedPart) {
  const animationStateRef = useRef({
    isRotating: false
  });

  // 분해 위치 계산
  const calculateExplodePosition = (originalPos, center, factor) => {
    // ...
  };

  // 하이라이트 적용
  const applyHighlight = (model, partName, selectedPartName) => {
    // ...
  };

  return {
    calculateExplodePosition,
    applyHighlight
  };
}
```

#### 수정 포인트 (상진님 작업)

```javascript
export function useModelAnimations(explodeFactor, selectedPart) {
  // 🔧 1. 분해 거리 조절
  const calculateExplodePosition = (originalPos, center, factor) => {
    const direction = new THREE.Vector3()
      .subVectors(originalPos, center)
      .normalize();

    const explodeDistance = factor * 3;  // 여기를 조절! (3 → 5로 변경하면 더 멀리 분해)
    return new THREE.Vector3().addVectors(
      originalPos,
      direction.multiplyScalar(explodeDistance)
    );
  };

  // 🔧 2. 하이라이트 색상 조절
  const applyHighlight = (model, partName, selectedPartName) => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (partName === selectedPartName) {
          // 선택된 부품 색상
          child.material.emissive.setHex(0x00ff00);  // 녹색 (변경 가능)
          child.material.emissiveIntensity = 0.3;    // 밝기
        } else {
          // 일반 부품
          child.material.emissive.setHex(0x000000);  // 검정
          child.material.emissiveIntensity = 0;
        }
      }
    });
  };

  return {
    calculateExplodePosition,
    applyHighlight
  };
}
```

#### 테스트 방법

```tsx
// ModelGroup.tsx에서 사용
function ModelGroup() {
  const { explodeFactor, selectedPart } = useViewerStore();
  const { calculateExplodePosition, applyHighlight } = useModelAnimations(
    explodeFactor, 
    selectedPart
  );
  
  useFrame(() => {
    // 애니메이션 로직
    const targetPos = calculateExplodePosition(originalPos, center, explodeFactor);
    model.position.lerp(targetPos, 0.1);
    
    applyHighlight(model, partName, selectedPart);
  });
}
```

---

## 🔄 작업 흐름 (3명 병렬)

### Day 1-3: 독립 작업

```bash
# 본인
cd src/hooks
# useSceneSetup.js 수정
# 로컬 테스트: npm run dev
git add useSceneSetup.js
git commit -m "feat: 씬 초기화 Hook 구현"
git push origin feature/scene-setup

# 도영님
cd src/hooks
# useOrbitControls.js 수정
# 로컬 테스트: npm run dev
git add useOrbitControls.js
git commit -m "feat: OrbitControls Hook 구현"
git push origin feature/orbit-controls

# 상진님
cd src/hooks
# useModelAnimations.js 수정
# 로컬 테스트: npm run dev
git add useModelAnimations.js
git commit -m "feat: 애니메이션 Hook 구현"
git push origin feature/animations
```

### Day 4: PR 생성 및 머지

```bash
# GitHub에서 PR 생성
1. 본인 → main (먼저 머지)
2. 도영님 → main (그 다음)
3. 상진님 → main (마지막)

# 순차적으로 머지하면 충돌 최소화!
```

### Day 5: 통합 테스트

```bash
# main 브랜치 최신화
git pull origin main

# 전체 테스트
npm run dev

# 3개 Hook이 모두 동작하는지 확인
# - 씬 초기화 (본인)
# - 카메라 컨트롤 (도영님)
# - 애니메이션 (상진님)
```

---

## ⚠️ 주의사항

### 1. Hook 규칙

```javascript
// ✅ 올바른 Hook 사용
function MyComponent() {
  const { data } = useMyHook();  // 컴포넌트 최상위
  return <div>{data}</div>;
}

// ❌ 잘못된 Hook 사용
function MyComponent() {
  if (condition) {
    const { data } = useMyHook();  // 조건문 안에서 Hook 호출 금지!
  }
}
```

### 2. 의존성 배열

```javascript
// ✅ 올바른 의존성
useEffect(() => {
  console.log(explodeFactor);
}, [explodeFactor]);  // explodeFactor 변경 시 실행

// ❌ 잘못된 의존성
useEffect(() => {
  console.log(explodeFactor);
}, []);  // explodeFactor 변경해도 실행 안 됨!
```

### 3. 충돌 방지

```bash
# ✅ 올바른 작업 방식
- 본인: useSceneSetup.js만 수정
- 도영님: useOrbitControls.js만 수정
- 상진님: useModelAnimations.js만 수정

# ❌ 충돌 위험
- 3명이 Scene3D.tsx 동시 수정 → 충돌 발생!
```

---

## 🆘 문제 해결

### Hook이 실행 안 될 때

```javascript
// 1. 콘솔 로그 추가
export function useSceneSetup() {
  console.log('🔍 useSceneSetup 호출됨');
  
  useEffect(() => {
    console.log('✅ useEffect 실행됨');
  }, []);
}

// 2. 브라우저 콘솔 확인
// - "🔍 useSceneSetup 호출됨" 보이면 Hook은 실행됨
// - "✅ useEffect 실행됨" 보이면 초기화도 완료
```

### Hook 반환값이 undefined일 때

```javascript
// ❌ 잘못된 반환
export function useSceneSetup() {
  useEffect(() => {
    // ...
  }, []);
  
  // return 없음!
}

// ✅ 올바른 반환
export function useSceneSetup() {
  useEffect(() => {
    // ...
  }, []);
  
  return {
    lightingConfig: { /* ... */ }
  };
}
```

---

## 📊 체크리스트

### 본인 (PM)

- [ ] `useSceneSetup.js` 기본 구조 작성
- [ ] 조명 설정 구현
- [ ] 환경 설정 구현
- [ ] 로컬 테스트 완료
- [ ] PR 생성

### 도영님

- [ ] `useOrbitControls.js` 기본 구조 작성
- [ ] 카메라 컨트롤 설정 구현
- [ ] 리셋/포커스 함수 구현 (선택)
- [ ] 로컬 테스트 완료
- [ ] PR 생성

### 상진님

- [ ] `useModelAnimations.js` 기본 구조 작성
- [ ] 분해 애니메이션 로직 구현
- [ ] 하이라이트 로직 구현
- [ ] 자동 회전 함수 구현 (선택)
- [ ] 로컬 테스트 완료
- [ ] PR 생성

---

## 🎉 완료 기준

### Hook이 성공적으로 동작하면:

1. ✅ 브라우저에서 3D 뷰어가 보임
2. ✅ 마우스로 회전/줌이 됨
3. ✅ 슬라이더로 분해가 됨
4. ✅ 부품 클릭 시 하이라이트가 됨
5. ✅ 콘솔에 에러 없음

---

**화이팅! 🔥**
