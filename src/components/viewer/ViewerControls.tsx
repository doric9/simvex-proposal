import { RotateCcw, Maximize2, Move3D, Tag } from 'lucide-react'
import { Button, Slider } from '@/components/ui'
import { useViewerStore, useUIStore } from '@/stores'

export function ViewerControls() {
  const {
    explodeLevel,
    setExplodeLevel,
    autoRotate,
    setAutoRotate,
    showLabels,
    setShowLabels,
    resetView,
  } = useViewerStore()

  const { language } = useUIStore()

  return (
    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
      {/* Left controls - Explode slider */}
      <div className="bg-background/90 backdrop-blur rounded-lg p-3 shadow-lg pointer-events-auto">
        <div className="flex items-center gap-3">
          <Move3D className="h-4 w-4 text-muted-foreground" />
          <div className="w-40">
            <Slider
              value={[explodeLevel * 100]}
              onValueChange={([value]) => setExplodeLevel((value ?? 0) / 100)}
              max={100}
              step={1}
            />
          </div>
          <span className="text-xs text-muted-foreground w-12">
            {Math.round(explodeLevel * 100)}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'ko' ? '분해 수준' : 'Explode Level'}
        </p>
      </div>

      {/* Right controls - View buttons */}
      <div className="flex gap-2 pointer-events-auto">
        <Button
          variant={showLabels ? 'default' : 'outline'}
          size="icon"
          onClick={() => setShowLabels(!showLabels)}
          title={language === 'ko' ? '라벨 표시' : 'Show Labels'}
        >
          <Tag className="h-4 w-4" />
        </Button>
        <Button
          variant={autoRotate ? 'default' : 'outline'}
          size="icon"
          onClick={() => setAutoRotate(!autoRotate)}
          title={language === 'ko' ? '자동 회전' : 'Auto Rotate'}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetView}
          title={language === 'ko' ? '뷰 초기화' : 'Reset View'}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
