import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { quizData } from '../../data/quizData';
import { QuizQuestion } from '../../types';

interface QuizPanelProps {
  machineryId: string;
}

export default function QuizPanel({ machineryId }: QuizPanelProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  useEffect(() => {
    const filtered = quizData.filter(q => q.machineryId === machineryId);
    setQuestions(filtered);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(0);
  }, [machineryId]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setAnswered(answered + 1);

    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswered(0);
  };

  if (questions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-4">
        <p>이 장비에 대한 퀴즈가 없습니다</p>
      </div>
    );
  }

  if (answered === questions.length && showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">퀴즈 완료!</h3>
          <div className="text-6xl font-bold text-primary mb-4">
            {percentage}%
          </div>
          <p className="text-lg text-gray-600 mb-8">
            {questions.length}문제 중 {score}문제 정답
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            <span>다시 풀기</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>문제 {currentIndex + 1} / {questions.length}</span>
          <span>정답: {score} / {answered}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  showCorrect
                    ? 'border-green-500 bg-green-50'
                    : showWrong
                    ? 'border-red-500 bg-red-50'
                    : isSelected
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800">{option}</span>
                  {showCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {showWrong && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      {showResult && currentIndex < questions.length - 1 && (
        <button
          onClick={handleNext}
          className="w-full mt-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          다음 문제
        </button>
      )}
    </div>
  );
}
