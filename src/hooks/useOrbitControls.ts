import { useEffect } from 'react';

export function useOrbitControls() {
    useEffect(() => {
        console.log('✅ [useOrbitControls] 카메라 컨트롤 초기화');

        // @react-three/drei의 OrbitControls 컴포넌트 사용
        // 이 Hook에서는 설정값만 제공합니다.

        return () => {
            console.log('🧹 [useOrbitControls] 정리 완료');
        };
    }, []);

    return {
        controlsConfig: {
            enableDamping: true,
            dampingFactor: 0.05,
            minDistance: 2,
            maxDistance: 20,
            maxPolarAngle: Math.PI / 2,
            enablePan: true,
            panSpeed: 0.5,
            rotateSpeed: 0.5,
            zoomSpeed: 0.8,
            autoRotate: false,
            autoRotateSpeed: 2.0
        },
        // 컨트롤 함수들
        resetCamera: () => {
            console.log('🔄 카메라 리셋');
            // 카메라를 초기 위치로 되돌림
        },
        focusOnPart: (partName: string) => {
            console.log(`🎯 부품에 포커스: ${partName}`);
            // 특정 부품으로 카메라 이동
        }
    };
}
