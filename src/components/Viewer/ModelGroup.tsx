/**
 * ModelGroup Component (Hook 패턴 적용)
 * 
 * 이 컴포넌트는 3D 모델 그룹을 렌더링합니다.
 * - Hook을 조합해서 사용
 * - UI 로직만 포함
 * - Three.js 로직은 모두 Hook으로 분리
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Machinery } from '../../types';
import { useViewerStore } from '../../stores/viewerStore';

// Hook Import
import { useModelLoader } from '../../hooks/useModelLoader';
import { useModelAnimations } from '../../hooks/useModelAnimations';
import { usePartInteraction } from '../../hooks/usePartInteraction';

interface ModelGroupProps {
  machinery: Machinery;
  physicsEnabled: boolean;
}

export default function ModelGroup({ machinery, physicsEnabled }: ModelGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Zustand Store
  const { explodeFactor, selectedPart, setSelectedPart } = useViewerStore();

  // 🎣 Hook 1: 모델 로딩 (공통)
  const { models, originalPositions, isLoading, error } = useModelLoader(machinery);

  // 🎣 Hook 2: 애니메이션 (상진님)
  const { 
    calculateExplodePosition, 
    applyHighlight 
  } = useModelAnimations(explodeFactor, selectedPart);

  // 🎣 Hook 3: 인터랙션 (공통)
  const {
    handlePartClick,
    handlePointerOver,
    handlePointerOut
  } = usePartInteraction(selectedPart, setSelectedPart);

  // 프레임마다 실행되는 애니메이션 루프
  useFrame(() => {
    if (!groupRef.current) return;

    const center = new THREE.Vector3(0, 0, 0);

    models.forEach((model, partName) => {
      const originalPos = originalPositions.get(partName);
      if (!originalPos) return;

      // 분해 애니메이션 적용
      const targetPos = calculateExplodePosition(originalPos, center, explodeFactor);
      model.position.lerp(targetPos, 0.1);

      // 하이라이트 적용
      applyHighlight(model, partName, selectedPart);
    });
  });

  // 로딩 중
  if (isLoading) {
    return null;
  }

  // 에러 발생
  if (error) {
    console.error('모델 로딩 에러:', error);
    return null;
  }

  // 렌더링
  return (
    <group ref={groupRef}>
      {Array.from(models.entries()).map(([partName, model]) => (
        <primitive
          key={partName}
          object={model}
          onClick={handlePartClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      ))}
    </group>
  );
}
