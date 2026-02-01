export type MachineId =
  | 'v4-engine'
  | 'drone'
  | 'robot-arm'
  | 'robot-gripper'
  | 'suspension'
  | 'leaf-spring'
  | 'machine-vice'

export interface Machine {
  id: MachineId
  name: string
  nameKo: string
  description: string
  descriptionKo: string
  thumbnail: string
  modelPath: string
  assemblyDiagrams: string[]
  parts: string[]
}

export interface PartPosition {
  assembled: [number, number, number]
  exploded: [number, number, number]
  rotation?: [number, number, number]
}

export interface PartInfo {
  id: string
  machineId: MachineId
  name: string
  nameKo: string
  description: string
  descriptionKo: string
  material: string
  materialKo: string
  function: string
  functionKo: string
  assemblyOrder: number
  modelFile: string
  position: PartPosition
  relatedParts: string[]
}
