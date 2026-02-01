import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei'
import { useViewerStore } from '@/stores'
import { ModelLoader } from './ModelLoader'
import { ViewerControls } from './ViewerControls'

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#666" wireframe />
    </mesh>
  )
}

export function Scene() {
  const { currentMachine, autoRotate } = useViewerStore()

  return (
    <div className="relative flex-1 bg-gradient-to-b from-slate-100 to-slate-200">
      <Canvas
        camera={{ position: [5, 4, 5], fov: 50 }}
        className="three-canvas"
        shadows
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-10, 5, -5]} intensity={0.3} />

        <Suspense fallback={<LoadingFallback />}>
          {currentMachine && (
            <Center>
              <ModelLoader machineId={currentMachine} />
            </Center>
          )}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
          <Environment preset="studio" />
        </Suspense>

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          enablePan={true}
          enableZoom={true}
          minDistance={2}
          maxDistance={20}
          makeDefault
        />

        <gridHelper args={[10, 10, '#888', '#ccc']} position={[0, -1.5, 0]} />
      </Canvas>

      {/* Welcome message when no machine selected */}
      {!currentMachine && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-700 mb-2">SIMVEX</h2>
            <p className="text-slate-500">Select a machine from the header to begin</p>
            <p className="text-slate-400 text-sm mt-1">상단에서 기계를 선택하세요</p>
          </div>
        </div>
      )}

      {/* Viewer controls overlay */}
      {currentMachine && <ViewerControls />}
    </div>
  )
}
