import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { useViewerStore } from '@/stores'
import { getPartsByMachine } from '@/data/parts'
import type { MachineId, PartInfo } from '@/types'
import { lerpVector3 } from '@/lib/utils'

interface ModelLoaderProps {
  machineId: MachineId
}

interface PartMeshProps {
  part: PartInfo
  scene: THREE.Group
  explodeLevel: number
  isSelected: boolean
  isHovered: boolean
  onSelect: (partId: string) => void
  onHover: (partId: string | null) => void
}

// Map model file names to asset paths
function getModelPath(machineId: MachineId, modelFile: string): string {
  const folderMap: Record<MachineId, string> = {
    'v4-engine': 'V4_Engine',
    'drone': 'Drone',
    'robot-arm': 'Robot Arm',
    'robot-gripper': 'Robot Gripper',
    'suspension': 'Suspension',
    'leaf-spring': 'Leaf Spring',
    'machine-vice': 'Machine Vice',
  }
  const folder = folderMap[machineId]
  return `/3D Asset/${folder}/${modelFile}`
}

function PartMesh({
  part,
  scene,
  explodeLevel,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: PartMeshProps) {
  // Calculate interpolated position based on explode level
  const targetPosition = useMemo(() => {
    return lerpVector3(
      part.position.assembled,
      part.position.exploded,
      explodeLevel
    )
  }, [part.position, explodeLevel])

  // Spring animation for smooth transitions
  const { position } = useSpring({
    position: targetPosition,
    config: { mass: 1, tension: 170, friction: 26 },
  })

  // Clone the scene for independent manipulation
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    // Set up materials for selection/hover highlighting
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = child.material.clone()
      }
    })
    return clone
  }, [scene])

  // Update material based on selection/hover state
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshStandardMaterial
        if (isSelected) {
          material.emissive = new THREE.Color(0x0066ff)
          material.emissiveIntensity = 0.3
        } else if (isHovered) {
          material.emissive = new THREE.Color(0x0066ff)
          material.emissiveIntensity = 0.15
        } else {
          material.emissive = new THREE.Color(0x000000)
          material.emissiveIntensity = 0
        }
      }
    })
  }, [clonedScene, isSelected, isHovered])

  return (
    <animated.group
      position={position as unknown as [number, number, number]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(part.id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(part.id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        onHover(null)
        document.body.style.cursor = 'default'
      }}
    >
      <primitive object={clonedScene} />
    </animated.group>
  )
}

export function ModelLoader({ machineId }: ModelLoaderProps) {
  const { explodeLevel, selectedPart, hoveredPart, setSelectedPart, setHoveredPart } =
    useViewerStore()

  const parts = getPartsByMachine(machineId)

  // Preload all models
  const modelPaths = useMemo(
    () => parts.map((part) => getModelPath(machineId, part.modelFile)),
    [machineId, parts]
  )

  // Load each model
  const models = modelPaths.map((path) => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useGLTF(path)
    } catch {
      return null
    }
  })

  // Clear selection when machine changes
  useEffect(() => {
    setSelectedPart(null)
    setHoveredPart(null)
  }, [machineId, setSelectedPart, setHoveredPart])

  return (
    <group>
      {parts.map((part, index) => {
        const model = models[index]
        if (!model) return null

        return (
          <PartMesh
            key={part.id}
            part={part}
            scene={model.scene}
            explodeLevel={explodeLevel}
            isSelected={selectedPart === part.id}
            isHovered={hoveredPart === part.id}
            onSelect={setSelectedPart}
            onHover={setHoveredPart}
          />
        )
      })}
    </group>
  )
}

// Preload helper for better loading experience
export function preloadModels(machineId: MachineId) {
  const parts = getPartsByMachine(machineId)
  parts.forEach((part) => {
    const path = getModelPath(machineId, part.modelFile)
    useGLTF.preload(path)
  })
}
