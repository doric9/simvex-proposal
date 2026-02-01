import type { PartInfo, MachineId } from '@/types'
import { v4EngineParts, v4EnginePartsMap } from './v4-engine'
import { droneParts, dronePartsMap } from './drone'

export const partsByMachine: Record<MachineId, PartInfo[]> = {
  'v4-engine': v4EngineParts,
  'drone': droneParts,
  'robot-arm': [],
  'robot-gripper': [],
  'suspension': [],
  'leaf-spring': [],
  'machine-vice': [],
}

export const partsMapByMachine: Record<MachineId, Record<string, PartInfo>> = {
  'v4-engine': v4EnginePartsMap,
  'drone': dronePartsMap,
  'robot-arm': {},
  'robot-gripper': {},
  'suspension': {},
  'leaf-spring': {},
  'machine-vice': {},
}

export function getPartsByMachine(machineId: MachineId): PartInfo[] {
  return partsByMachine[machineId] ?? []
}

export function getPartById(machineId: MachineId, partId: string): PartInfo | undefined {
  return partsMapByMachine[machineId]?.[partId]
}

export function getPartByModelFile(machineId: MachineId, modelFile: string): PartInfo | undefined {
  const parts = partsByMachine[machineId]
  return parts?.find((part) => part.modelFile === modelFile)
}

export { v4EngineParts, droneParts }
