import { useState } from 'react'
import { ChevronLeft, ChevronRight, Workflow as WorkflowIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from '@/components/ui'
import { useUIStore, useViewerStore } from '@/stores'
import { machines } from '@/data/machines'
import { getPartsByMachine } from '@/data/parts'

export function WorkflowModal() {
  const { workflowModalOpen, setWorkflowModalOpen, language } = useUIStore()
  const { currentMachine, setSelectedPart, setExplodeLevel } = useViewerStore()

  const [currentDiagramIndex, setCurrentDiagramIndex] = useState(0)

  const machine = currentMachine ? machines[currentMachine] : null
  const parts = currentMachine ? getPartsByMachine(currentMachine) : []
  const diagrams = machine?.assemblyDiagrams ?? []

  // Sort parts by assembly order
  const sortedParts = [...parts].sort((a, b) => a.assemblyOrder - b.assemblyOrder)

  const handlePartClick = (partId: string) => {
    setSelectedPart(partId)
    // Partially explode to show the part
    setExplodeLevel(0.5)
    setWorkflowModalOpen(false)
  }

  const nextDiagram = () => {
    setCurrentDiagramIndex((prev) =>
      prev < diagrams.length - 1 ? prev + 1 : prev
    )
  }

  const prevDiagram = () => {
    setCurrentDiagramIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  // Get folder path for diagrams
  const getDiagramPath = (diagram: string) => {
    if (!currentMachine) return ''
    const folderMap: Record<string, string> = {
      'v4-engine': 'V4_Engine',
      'drone': 'Drone',
      'robot-arm': 'Robot Arm',
      'robot-gripper': 'Robot Gripper',
      'suspension': 'Suspension',
      'leaf-spring': 'Leaf Spring',
      'machine-vice': 'Machine Vice',
    }
    return `/3D Asset/${folderMap[currentMachine]}/${diagram}`
  }

  return (
    <Dialog open={workflowModalOpen} onOpenChange={setWorkflowModalOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WorkflowIcon className="h-5 w-5" />
            {language === 'ko' ? '조립 순서' : 'Assembly Workflow'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {/* Assembly diagrams */}
          {diagrams.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                {language === 'ko' ? '조립도' : 'Assembly Diagram'}
              </h4>
              <div className="relative bg-muted rounded-lg overflow-hidden">
                <img
                  src={getDiagramPath(diagrams[currentDiagramIndex] ?? '')}
                  alt={`Assembly diagram ${currentDiagramIndex + 1}`}
                  className="w-full h-auto max-h-64 object-contain"
                />
                {diagrams.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80"
                      onClick={prevDiagram}
                      disabled={currentDiagramIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80"
                      onClick={nextDiagram}
                      disabled={currentDiagramIndex === diagrams.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 px-2 py-1 rounded text-xs">
                      {currentDiagramIndex + 1} / {diagrams.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Assembly order list */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">
              {language === 'ko' ? '조립 순서' : 'Assembly Order'}
            </h4>
            <div className="space-y-1">
              {sortedParts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {language === 'ko'
                    ? '이 기계의 조립 정보가 준비 중입니다.'
                    : 'Assembly information for this machine is being prepared.'}
                </p>
              ) : (
                sortedParts.map((part, index) => (
                  <button
                    key={part.id}
                    onClick={() => handlePartClick(part.id)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {language === 'ko' ? part.nameKo : part.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {language === 'ko' ? part.functionKo : part.function}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
