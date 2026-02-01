import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from '@/components/ui'
import { useUIStore, useViewerStore, useQuizStore } from '@/stores'
import { quizQuestionsByMachine } from '@/data/quizzes'
import { machines } from '@/data/machines'
import { QuizQuestion } from './QuizQuestion'
import { QuizResults } from './QuizResults'

export function QuizModal() {
  const { quizModalOpen, setQuizModalOpen, language } = useUIStore()
  const { currentMachine } = useViewerStore()
  const { quiz, startQuiz, resetQuiz, getProgress } = useQuizStore()

  // Reset quiz when modal closes
  useEffect(() => {
    if (!quizModalOpen) {
      resetQuiz()
    }
  }, [quizModalOpen, resetQuiz])

  const handleStartQuiz = () => {
    if (!currentMachine) return
    const questions = quizQuestionsByMachine[currentMachine] ?? []
    if (questions.length > 0) {
      startQuiz(currentMachine, questions, 5) // 5 questions for MVP
    }
  }

  const machine = currentMachine ? machines[currentMachine] : null
  const questions = currentMachine ? (quizQuestionsByMachine[currentMachine] ?? []) : []
  const progress = getProgress()

  return (
    <Dialog open={quizModalOpen} onOpenChange={setQuizModalOpen}>
      <DialogContent className="max-w-lg">
        {!quiz ? (
          // Quiz start screen
          <>
            <DialogHeader>
              <DialogTitle>
                {language === 'ko' ? '퀴즈' : 'Quiz'}
              </DialogTitle>
              <DialogDescription>
                {language === 'ko'
                  ? `${machine?.nameKo ?? '기계'}에 대한 학습 내용을 테스트해보세요.`
                  : `Test your knowledge about the ${machine?.name ?? 'machine'}.`}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {questions.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  {language === 'ko'
                    ? '이 기계에 대한 퀴즈가 아직 준비되지 않았습니다.'
                    : 'Quiz questions for this machine are not yet available.'}
                </p>
              ) : (
                <>
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-primary">
                      {questions.length}
                    </div>
                    <p className="text-muted-foreground">
                      {language === 'ko' ? '문제 준비됨' : 'questions available'}
                    </p>
                  </div>
                  <Button onClick={handleStartQuiz} className="w-full">
                    {language === 'ko' ? '퀴즈 시작하기' : 'Start Quiz'}
                  </Button>
                </>
              )}
            </div>
          </>
        ) : quiz.isComplete ? (
          // Quiz results screen
          <QuizResults onClose={() => setQuizModalOpen(false)} />
        ) : (
          // Quiz question screen
          <>
            <DialogHeader>
              <DialogTitle>
                {language === 'ko' ? '문제' : 'Question'} {progress.current} / {progress.total}
              </DialogTitle>
            </DialogHeader>
            <QuizQuestion />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
