import { Globe, Moon, Sun, Monitor } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from '@/components/ui'
import { useUIStore } from '@/stores'

export function SettingsModal() {
  const {
    settingsModalOpen,
    setSettingsModalOpen,
    language,
    setLanguage,
    theme,
    setTheme,
  } = useUIStore()

  return (
    <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'ko' ? '설정' : 'Settings'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ko'
              ? '애플리케이션 설정을 변경합니다.'
              : 'Customize your application settings.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Language setting */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {language === 'ko' ? '언어' : 'Language'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={language === 'ko' ? 'default' : 'outline'}
                onClick={() => setLanguage('ko')}
                className="w-full"
              >
                한국어
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                onClick={() => setLanguage('en')}
                className="w-full"
              >
                English
              </Button>
            </div>
          </div>

          {/* Theme setting */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === 'ko' ? '테마' : 'Theme'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="w-full"
              >
                <Sun className="h-4 w-4 mr-1" />
                {language === 'ko' ? '라이트' : 'Light'}
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="w-full"
              >
                <Moon className="h-4 w-4 mr-1" />
                {language === 'ko' ? '다크' : 'Dark'}
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
                className="w-full"
              >
                <Monitor className="h-4 w-4 mr-1" />
                {language === 'ko' ? '시스템' : 'System'}
              </Button>
            </div>
          </div>

          {/* Info section */}
          <div className="pt-4 border-t">
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">SIMVEX</p>
              <p className="text-xs text-muted-foreground">
                3D Mechanical Parts Viewer for Education
              </p>
              <p className="text-xs text-muted-foreground">
                Version 0.1.0 (MVP)
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
