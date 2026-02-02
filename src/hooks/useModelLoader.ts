import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Machinery } from '../../types';

export function useModelLoader(machinery: Machinery) {
    const [models, setModels] = useState<Map<string, THREE.Group>>(new Map());
    const [originalPositions, setOriginalPositions] = useState<Map<string, THREE.Vector3>>(new Map());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('📦 [useModelLoader] 모델 로딩 시작...');
        setIsLoading(true);
        setError(null);

        const loadedModels = new Map<string, THREE.Group>();
        const positions = new Map<string, THREE.Vector3>();

        try {
            machinery.parts.forEach((part, index) => {
                // 실제 프로젝트에서는 GLTFLoader 사용
                // 데모용으로 간단한 박스 생성
                const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                const material = new THREE.MeshStandardMaterial({
                    color: 0x3b82f6,
                    metalness: 0.5,
                    roughness: 0.3,
                });
                const mesh = new THREE.Mesh(geometry, material);

                // 원형 배치
                const angle = (index / machinery.parts.length) * Math.PI * 2;
                const radius = 1.5;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = 0;

                mesh.position.set(x, y, z);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.userData = { partName: part.name };

                const group = new THREE.Group();
                group.add(mesh);

                loadedModels.set(part.name, group);
                positions.set(part.name, new THREE.Vector3(x, y, z));

                console.log(`  ✓ ${part.name} 로딩 완료`);
            });

            setModels(loadedModels);
            setOriginalPositions(positions);
            setIsLoading(false);
            console.log('✅ [useModelLoader] 모든 모델 로딩 완료');
        } catch (err: any) {
            console.error('❌ [useModelLoader] 모델 로딩 실패:', err);
            setError(err.message || 'Unknown error');
            setIsLoading(false);
        }
    }, [machinery]);

    return {
        models,
        originalPositions,
        isLoading,
        error
    };
}
