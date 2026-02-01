import { PanelRightClose, PanelRight } from 'lucide-react'
import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { useUIStore } from '@/stores'
import { PartInfoPanel } from './PartInfoPanel'
import { NotesPanel } from './NotesPanel'
import { ChatPanel } from './ChatPanel'

export function SidePanel() {
  const { sidePanelOpen, sidePanelTab, sidePanelWidth, setSidePanelOpen, setSidePanelTab, language } =
    useUIStore()

  if (!sidePanelOpen) {
    return (
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidePanelOpen(true)}
          className="bg-background/90 backdrop-blur shadow-lg"
        >
          <PanelRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className="h-full border-l bg-background flex flex-col"
      style={{ width: sidePanelWidth }}
    >
      {/* Panel header */}
      <div className="h-12 border-b px-3 flex items-center justify-between">
        <Tabs
          value={sidePanelTab}
          onValueChange={(v) => setSidePanelTab(v as typeof sidePanelTab)}
          className="flex-1"
        >
          <TabsList className="h-8">
            <TabsTrigger value="info" className="text-xs px-3">
              {language === 'ko' ? '정보' : 'Info'}
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs px-3">
              {language === 'ko' ? '노트' : 'Notes'}
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs px-3">
              {language === 'ko' ? 'AI 채팅' : 'AI Chat'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidePanelOpen(false)}
          className="h-8 w-8"
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={sidePanelTab} className="h-full">
          <TabsContent value="info" className="h-full m-0">
            <PartInfoPanel />
          </TabsContent>
          <TabsContent value="notes" className="h-full m-0">
            <NotesPanel />
          </TabsContent>
          <TabsContent value="chat" className="h-full m-0">
            <ChatPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
