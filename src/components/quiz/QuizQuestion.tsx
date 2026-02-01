import { Button } from '@/components/ui'
import { useQuizStore, useUIStore } from '@/stores'
import { cn } from '@/lib/utils'

export function QuizQuestion() {
  const { language } = useUIStore()
  const {
    quiz,
    getCurrentQuestion,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    getProgress,
  } = useQuizStore()

  const question = getCurrentQuestion()
  const progress = getProgress()

  if (!question || !quiz) return null

  const selectedAnswer = quiz.answers[question.id]
  const isLastQuestion = progress.current === progress.total

  const handleAnswer = (answer: number) => {
    answerQuestion(question.id, answer)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      submitQuiz()
    } else {
      nextQuestion()
    }
  }

  const options = language === 'ko' && question.optionsKo
    ? question.optionsKo
    : question.options ?? []

  return (
    <div className="space-y-4">
      {/* Question text */}
      <div className="py-4">
        <p className="text-lg font-medium">
          {language === 'ko' ? question.questionKo : question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={cn(
              'w-full p-3 text-left rounded-lg border transition-colors',
              selectedAnswer === index
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50 hover:bg-muted'
            )}
          >
            <span className="font-medium mr-2">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={progress.current === 1}
        >
          {language === 'ko' ? '이전' : 'Previous'}
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedAnswer === undefined}
        >
          {isLastQuestion
            ? (language === 'ko' ? '제출하기' : 'Submit')
            : (language === 'ko' ? '다음' : 'Next')}
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center gap-1 pt-2">
        {Array.from({ length: progress.total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-2 h-2 rounded-full',
              i < progress.current - 1
                ? 'bg-primary'
                : i === progress.current - 1
                  ? 'bg-primary/50'
                  : 'bg-muted'
            )}
          />
        ))}
      </div>
    </div>
  )
}
