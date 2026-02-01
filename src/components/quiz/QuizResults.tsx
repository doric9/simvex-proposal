import { Trophy, Target, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { Button, ScrollArea } from '@/components/ui'
import { useQuizStore, useUIStore } from '@/stores'
import { formatDuration, cn } from '@/lib/utils'

interface QuizResultsProps {
  onClose: () => void
}

export function QuizResults({ onClose }: QuizResultsProps) {
  const { language } = useUIStore()
  const { quiz, calculateScore } = useQuizStore()

  if (!quiz) return null

  const { score, total, percentage } = calculateScore()
  const timeSpent = quiz.startTime
    ? Math.floor((Date.now() - quiz.startTime.getTime()) / 1000)
    : 0

  const getGrade = () => {
    if (percentage >= 90) return { label: 'A', color: 'text-green-500' }
    if (percentage >= 80) return { label: 'B', color: 'text-blue-500' }
    if (percentage >= 70) return { label: 'C', color: 'text-yellow-500' }
    if (percentage >= 60) return { label: 'D', color: 'text-orange-500' }
    return { label: 'F', color: 'text-red-500' }
  }

  const grade = getGrade()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold">
          {language === 'ko' ? '퀴즈 완료!' : 'Quiz Complete!'}
        </h3>
      </div>

      {/* Score summary */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 rounded-lg bg-muted">
          <Target className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <div className="text-2xl font-bold">{score}/{total}</div>
          <div className="text-xs text-muted-foreground">
            {language === 'ko' ? '정답' : 'Correct'}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted">
          <div className={cn('text-4xl font-bold', grade.color)}>
            {grade.label}
          </div>
          <div className="text-xs text-muted-foreground">
            {percentage}%
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted">
          <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <div className="text-2xl font-bold">{formatDuration(timeSpent)}</div>
          <div className="text-xs text-muted-foreground">
            {language === 'ko' ? '소요시간' : 'Time'}
          </div>
        </div>
      </div>

      {/* Detailed results */}
      <div>
        <h4 className="font-medium mb-2">
          {language === 'ko' ? '문제별 결과' : 'Question Results'}
        </h4>
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {quiz.questions.map((question, index) => {
              const userAnswer = quiz.answers[question.id]
              const isCorrect = userAnswer === question.correctAnswer
              return (
                <div
                  key={question.id}
                  className={cn(
                    'p-3 rounded-lg border',
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  )}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {language === 'ko' ? '문제' : 'Q'}{index + 1}. {language === 'ko' ? question.questionKo : question.question}
                      </p>
                      {!isCorrect && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {language === 'ko' ? '정답' : 'Correct'}: {
                            (language === 'ko' && question.optionsKo
                              ? question.optionsKo
                              : question.options)?.[question.correctAnswer as number] ?? question.correctAnswer
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Actions */}
      <Button onClick={onClose} className="w-full">
        {language === 'ko' ? '닫기' : 'Close'}
      </Button>
    </div>
  )
}
