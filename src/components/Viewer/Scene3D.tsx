/**
 * Scene3D Component (Hook 패턴 적용)
 * 
 * 이 컴포넌트는 3D 씬을 렌더링합니다.
 * - Hook을 조합해서 사용
 * - UI 로직만 포함
 * - 설정값은 Hook에서 가져옴
 */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Machinery } from '../../types';
import ModelGroup from './ModelGroup';
import { useViewerStore } from '../../stores/viewerStore';

// Hook Import
import { useSceneSetup } from '../../hooks/useSceneSetup';
import { useOrbitControls } from '../../hooks/useOrbitControls';

interface Scene3DProps {
  machinery: Machinery;
}

export default function Scene3D({ machinery }: Scene3DProps) {
  const { physicsEnabled } = useViewerStore();

  // 🎣 Hook 1: 씬 설정 (본인)
  const { lightingConfig, environment } = useSceneSetup();

  // 🎣 Hook 2: 카메라 컨트롤 설정 (도영님)
  const { controlsConfig } = useOrbitControls();

  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
      
      {/* 조명 (설정값은 Hook에서) */}
      <ambientLight intensity={lightingConfig.ambient.intensity} />
      <directionalLight
        position={lightingConfig.directional.position as [number, number, number]}
        intensity={lightingConfig.directional.intensity}
        castShadow={lightingConfig.directional.castShadow}
        shadow-mapSize-width={lightingConfig.directional.shadowMapSize.width}
        shadow-mapSize-height={lightingConfig.directional.shadowMapSize.height}
      />
      <pointLight 
        position={lightingConfig.point.position as [number, number, number]} 
        intensity={lightingConfig.point.intensity} 
      />
      <hemisphereLight intensity={lightingConfig.hemisphere.intensity} />

      {/* 환경 */}
      <Environment preset={environment as any} />

      {/* 3D 모델 그룹 */}
      <Suspense fallback={null}>
        <ModelGroup machinery={machinery} physicsEnabled={physicsEnabled} />
      </Suspense>

      {/* 카메라 컨트롤 (설정값은 Hook에서) */}
      <OrbitControls
        enableDamping={controlsConfig.enableDamping}
        dampingFactor={controlsConfig.dampingFactor}
        minDistance={controlsConfig.minDistance}
        maxDistance={controlsConfig.maxDistance}
        maxPolarAngle={controlsConfig.maxPolarAngle}
        enablePan={controlsConfig.enablePan}
        panSpeed={controlsConfig.panSpeed}
        rotateSpeed={controlsConfig.rotateSpeed}
        zoomSpeed={controlsConfig.zoomSpeed}
        autoRotate={controlsConfig.autoRotate}
        autoRotateSpeed={controlsConfig.autoRotateSpeed}
      />

      {/* 그리드 */}
      <gridHelper args={[20, 20, 0x888888, 0xcccccc]} />
    </Canvas>
  );
}
