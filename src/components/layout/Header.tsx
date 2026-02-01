import {
  Box,
  FileText,
  Settings,
  HelpCircle,
  Workflow,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { useViewerStore, useUIStore } from '@/stores'
import { machines, machinePriority } from '@/data/machines'
import type { MachineId } from '@/types'

export function Header() {
  const { currentMachine, setCurrentMachine } = useViewerStore()
  const {
    setQuizModalOpen,
    setExportModalOpen,
    setWorkflowModalOpen,
    setSettingsModalOpen,
    language
  } = useUIStore()

  const handleMachineSelect = (machineId: MachineId) => {
    setCurrentMachine(machineId)
  }

  return (
    <header className="h-14 border-b bg-background px-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Box className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">SIMVEX</span>
      </div>

      {/* Machine Selector */}
      <nav className="flex items-center gap-1">
        {machinePriority.slice(0, 4).map((machineId) => {
          const machine = machines[machineId]
          if (!machine) return null

          return (
            <Button
              key={machineId}
              variant={currentMachine === machineId ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleMachineSelect(machineId)}
              className="text-xs"
            >
              {language === 'ko' ? machine.nameKo : machine.name}
            </Button>
          )
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setWorkflowModalOpen(true)}
          disabled={!currentMachine}
          title={language === 'ko' ? '조립 순서' : 'Assembly Workflow'}
        >
          <Workflow className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setQuizModalOpen(true)}
          disabled={!currentMachine}
          title={language === 'ko' ? '퀴즈' : 'Quiz'}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExportModalOpen(true)}
          disabled={!currentMachine}
          title={language === 'ko' ? 'PDF 내보내기' : 'Export PDF'}
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSettingsModalOpen(true)}
          title={language === 'ko' ? '설정' : 'Settings'}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
