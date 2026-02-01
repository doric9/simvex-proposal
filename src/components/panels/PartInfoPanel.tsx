import { Info, Package, Wrench, Link2 } from 'lucide-react'
import { ScrollArea, Button } from '@/components/ui'
import { useViewerStore, useUIStore } from '@/stores'
import { getPartById, getPartsByMachine } from '@/data/parts'
import { machines } from '@/data/machines'

export function PartInfoPanel() {
  const { currentMachine, selectedPart, setSelectedPart } = useViewerStore()
  const { language } = useUIStore()

  // Show machine info if no part selected
  if (!currentMachine) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center text-muted-foreground">
          <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {language === 'ko'
              ? '기계를 선택하세요'
              : 'Select a machine to view'}
          </p>
        </div>
      </div>
    )
  }

  const machine = machines[currentMachine]
  const parts = getPartsByMachine(currentMachine)
  const part = selectedPart ? getPartById(currentMachine, selectedPart) : null

  if (!part) {
    // Show machine overview and parts list
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {/* Machine info */}
          <div>
            <h3 className="font-semibold text-lg">
              {language === 'ko' ? machine?.nameKo : machine?.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'ko' ? machine?.descriptionKo : machine?.description}
            </p>
          </div>

          {/* Parts list */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Package className="h-4 w-4" />
              {language === 'ko' ? '부품 목록' : 'Parts List'}
              <span className="text-muted-foreground">({parts.length})</span>
            </h4>
            <div className="space-y-1">
              {parts.map((p) => (
                <Button
                  key={p.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setSelectedPart(p.id)}
                >
                  <div>
                    <div className="font-medium text-sm">
                      {language === 'ko' ? p.nameKo : p.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'ko' ? p.materialKo : p.material}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {parts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {language === 'ko'
                ? '이 기계의 부품 정보가 준비 중입니다.'
                : 'Part information for this machine is being prepared.'}
            </p>
          )}
        </div>
      </ScrollArea>
    )
  }

  // Show selected part info
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Back to parts list */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedPart(null)}
          className="text-muted-foreground -ml-2"
        >
          ← {language === 'ko' ? '부품 목록' : 'Parts List'}
        </Button>

        {/* Part name */}
        <div>
          <h3 className="font-semibold text-lg">
            {language === 'ko' ? part.nameKo : part.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            #{part.assemblyOrder} in assembly order
          </p>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
            <Info className="h-4 w-4" />
            {language === 'ko' ? '설명' : 'Description'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {language === 'ko' ? part.descriptionKo : part.description}
          </p>
        </div>

        {/* Material */}
        <div>
          <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
            <Package className="h-4 w-4" />
            {language === 'ko' ? '재질' : 'Material'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {language === 'ko' ? part.materialKo : part.material}
          </p>
        </div>

        {/* Function */}
        <div>
          <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            {language === 'ko' ? '기능' : 'Function'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {language === 'ko' ? part.functionKo : part.function}
          </p>
        </div>

        {/* Related parts */}
        {part.relatedParts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              {language === 'ko' ? '관련 부품' : 'Related Parts'}
            </h4>
            <div className="flex flex-wrap gap-1">
              {part.relatedParts.map((relatedId) => {
                const relatedPart = getPartById(currentMachine, relatedId)
                if (!relatedPart) return null
                return (
                  <Button
                    key={relatedId}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setSelectedPart(relatedId)}
                  >
                    {language === 'ko' ? relatedPart.nameKo : relatedPart.name}
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
