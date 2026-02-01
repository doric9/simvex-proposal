import { Layout } from '@/components/layout'
import { Scene } from '@/components/viewer'
import { SidePanel } from '@/components/panels'
import { QuizModal } from '@/components/quiz/QuizModal'
import { ExportModal } from '@/components/export/ExportModal'
import { WorkflowModal } from '@/components/workflow/WorkflowModal'
import { SettingsModal } from '@/components/settings/SettingsModal'

export default function App() {
  return (
    <Layout>
      <Scene />
      <SidePanel />

      {/* Modals */}
      <QuizModal />
      <ExportModal />
      <WorkflowModal />
      <SettingsModal />
    </Layout>
  )
}
