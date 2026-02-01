import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, FileText } from 'lucide-react'
import { Button, ScrollArea, Textarea, Input } from '@/components/ui'
import { useNotesStore, useViewerStore, useUIStore } from '@/stores'
import { debounce, formatDate } from '@/lib/utils'

export function NotesPanel() {
  const { currentMachine, selectedPart } = useViewerStore()
  const { language } = useUIStore()
  const {
    currentNote,
    isSaving,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    getFilteredNotes,
    setFilterMachine,
    setFilterPart,
  } = useNotesStore()

  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  // Load notes when machine changes
  useEffect(() => {
    if (currentMachine) {
      loadNotes(currentMachine)
      setFilterMachine(currentMachine)
    }
  }, [currentMachine, loadNotes, setFilterMachine])

  // Update filter when part changes
  useEffect(() => {
    setFilterPart(selectedPart)
  }, [selectedPart, setFilterPart])

  // Sync edit state with current note
  useEffect(() => {
    if (currentNote) {
      setEditTitle(currentNote.title)
      setEditContent(currentNote.content)
    }
  }, [currentNote])

  // Debounced save
  const debouncedSave = useCallback(
    debounce((id: number, title: string, content: string) => {
      updateNote(id, { title, content })
    }, 1000),
    [updateNote]
  )

  const handleTitleChange = (value: string) => {
    setEditTitle(value)
    if (currentNote?.id) {
      debouncedSave(currentNote.id, value, editContent)
    }
  }

  const handleContentChange = (value: string) => {
    setEditContent(value)
    if (currentNote?.id) {
      debouncedSave(currentNote.id, editTitle, value)
    }
  }

  const handleCreateNote = async () => {
    if (!currentMachine) return
    await createNote({
      machineId: currentMachine,
      partId: selectedPart ?? undefined,
      title: language === 'ko' ? '새 노트' : 'New Note',
      content: '',
      tags: [],
    })
  }

  const handleDeleteNote = async () => {
    if (currentNote?.id) {
      await deleteNote(currentNote.id)
      setCurrentNote(null)
    }
  }

  const filteredNotes = getFilteredNotes()

  if (!currentMachine) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center text-muted-foreground">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {language === 'ko'
              ? '기계를 선택하여 노트를 작성하세요'
              : 'Select a machine to take notes'}
          </p>
        </div>
      </div>
    )
  }

  // Note editor view
  if (currentNote) {
    return (
      <div className="h-full flex flex-col">
        {/* Editor header */}
        <div className="p-3 border-b flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentNote(null)}
          >
            ← {language === 'ko' ? '목록' : 'List'}
          </Button>
          <div className="flex-1" />
          {isSaving && (
            <span className="text-xs text-muted-foreground">
              {language === 'ko' ? '저장 중...' : 'Saving...'}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteNote}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor content */}
        <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
          <Input
            value={editTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder={language === 'ko' ? '제목' : 'Title'}
            className="font-medium"
          />
          <Textarea
            value={editContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={language === 'ko' ? '노트 내용을 입력하세요...' : 'Write your notes here...'}
            className="flex-1 resize-none"
          />
        </div>
      </div>
    )
  }

  // Notes list view
  return (
    <div className="h-full flex flex-col">
      {/* List header */}
      <div className="p-3 border-b flex items-center justify-between">
        <span className="text-sm font-medium">
          {language === 'ko' ? '노트' : 'Notes'}
          {selectedPart && (
            <span className="text-muted-foreground ml-1">
              ({language === 'ko' ? '선택된 부품' : 'selected part'})
            </span>
          )}
        </span>
        <Button variant="outline" size="sm" onClick={handleCreateNote}>
          <Plus className="h-4 w-4 mr-1" />
          {language === 'ko' ? '새 노트' : 'New'}
        </Button>
      </div>

      {/* Notes list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {language === 'ko' ? '노트가 없습니다' : 'No notes yet'}
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={handleCreateNote}
                className="mt-2"
              >
                {language === 'ko' ? '첫 노트 작성하기' : 'Create your first note'}
              </Button>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <Button
                key={note.id}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-2 px-3"
                onClick={() => setCurrentNote(note)}
              >
                <div className="w-full overflow-hidden">
                  <div className="font-medium text-sm truncate">{note.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {note.content || (language === 'ko' ? '내용 없음' : 'No content')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(note.updatedAt, language)}
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
