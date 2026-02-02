import { useEffect } from 'react';

export function useSceneSetup() {
    useEffect(() => {
        console.log('✅ [useSceneSetup] 씬 초기화 완료');

        // @react-three/fiber의 Canvas 컴포넌트가 자동으로 Scene을 생성하므로
        // 여기서는 추가 설정만 수행합니다.

        return () => {
            console.log('🧹 [useSceneSetup] 정리 완료');
        };
    }, []);

    return {
        // 필요한 설정값 반환
        lightingConfig: {
            ambient: { intensity: 0.5 },
            directional: {
                position: [10, 10, 5],
                intensity: 1,
                castShadow: true,
                shadowMapSize: { width: 2048, height: 2048 }
            },
            point: {
                position: [-10, -10, -5],
                intensity: 0.5
            },
            hemisphere: {
                intensity: 0.3
            }
        },
        environment: 'studio'
    };
}
