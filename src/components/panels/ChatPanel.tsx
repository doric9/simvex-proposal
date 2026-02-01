import { useState, useRef, useEffect } from 'react'
import { Send, Trash2, Bot, User, Loader2 } from 'lucide-react'
import { Button, ScrollArea, Textarea } from '@/components/ui'
import { useChatStore, useViewerStore, useUIStore } from '@/stores'
import { getPartById } from '@/data/parts'
import { machines } from '@/data/machines'
import { cn } from '@/lib/utils'

export function ChatPanel() {
  const { currentMachine, selectedPart } = useViewerStore()
  const { language } = useUIStore()
  const {
    messages,
    isStreaming,
    loadChatHistory,
    addMessage,
    clearHistory,
    setIsStreaming,
  } = useChatStore()

  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load chat history when machine changes
  useEffect(() => {
    if (currentMachine) {
      loadChatHistory(currentMachine)
    }
  }, [currentMachine, loadChatHistory])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !currentMachine || isStreaming) return

    const userMessage = input.trim()
    setInput('')

    // Add user message
    await addMessage({
      machineId: currentMachine,
      role: 'user',
      content: userMessage,
      partContext: selectedPart ?? undefined,
    })

    // Generate AI response
    setIsStreaming(true)
    try {
      const machine = machines[currentMachine]
      const part = selectedPart ? getPartById(currentMachine, selectedPart) : null

      // Build context
      let context = `Machine: ${machine?.name} (${machine?.nameKo})\n`
      if (part) {
        context += `Selected Part: ${part.name} (${part.nameKo})\n`
        context += `Description: ${part.description}\n`
        context += `Material: ${part.material}\n`
        context += `Function: ${part.function}\n`
      }

      // For MVP, we'll simulate AI response
      // In production, this would call the OpenAI API
      const aiResponse = await simulateAIResponse(userMessage, context, language)

      await addMessage({
        machineId: currentMachine,
        role: 'assistant',
        content: aiResponse,
      })
    } catch (error) {
      console.error('Failed to get AI response:', error)
      await addMessage({
        machineId: currentMachine,
        role: 'assistant',
        content: language === 'ko'
          ? '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.'
          : 'Sorry, there was an error generating a response.',
      })
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    if (currentMachine) {
      clearHistory(currentMachine)
    }
  }

  if (!currentMachine) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center text-muted-foreground">
          <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {language === 'ko'
              ? '기계를 선택하여 AI와 대화하세요'
              : 'Select a machine to chat with AI'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {language === 'ko' ? 'AI 학습 도우미' : 'AI Learning Assistant'}
          </span>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">
                {language === 'ko'
                  ? '질문을 입력하여 기계에 대해 배워보세요!'
                  : 'Ask questions to learn about the machine!'}
              </p>
              <div className="mt-4 space-y-2">
                <SuggestionButton
                  onClick={() => setInput(language === 'ko' ? '이 기계의 주요 부품은 무엇인가요?' : 'What are the main parts of this machine?')}
                  text={language === 'ko' ? '주요 부품 설명해줘' : 'Explain the main parts'}
                />
                <SuggestionButton
                  onClick={() => setInput(language === 'ko' ? '조립 순서를 알려주세요' : 'What is the assembly order?')}
                  text={language === 'ko' ? '조립 순서 알려줘' : 'Assembly order'}
                />
                <SuggestionButton
                  onClick={() => setInput(language === 'ko' ? '작동 원리가 무엇인가요?' : 'How does this work?')}
                  text={language === 'ko' ? '작동 원리 설명해줘' : 'How does it work?'}
                />
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id ?? index}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' && 'flex-row-reverse'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    'rounded-lg px-3 py-2 max-w-[80%]',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          {isStreaming && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="rounded-lg px-3 py-2 bg-muted">
                <p className="text-sm text-muted-foreground">
                  {language === 'ko' ? '생각 중...' : 'Thinking...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'ko'
                ? '질문을 입력하세요...'
                : 'Type your question...'
            }
            className="min-h-[40px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function SuggestionButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="text-xs"
    >
      {text}
    </Button>
  )
}

// Simulated AI response for MVP (would be replaced with actual API call)
async function simulateAIResponse(
  question: string,
  _context: string,
  language: 'ko' | 'en'
): Promise<string> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

  // Basic response based on question keywords
  const q = question.toLowerCase()

  if (q.includes('part') || q.includes('부품')) {
    return language === 'ko'
      ? '이 기계는 여러 중요한 부품으로 구성되어 있습니다. 왼쪽 패널의 "정보" 탭에서 각 부품을 클릭하면 자세한 설명을 볼 수 있습니다. 3D 뷰에서 부품을 직접 클릭해서 선택할 수도 있어요!'
      : 'This machine consists of several important parts. You can click on each part in the "Info" tab on the left panel to see detailed descriptions. You can also click directly on parts in the 3D view to select them!'
  }

  if (q.includes('assembly') || q.includes('조립')) {
    return language === 'ko'
      ? '조립 순서는 부품 정보의 "Assembly Order" 번호를 참고하세요. 일반적으로 가장 안쪽 또는 기본이 되는 부품부터 조립을 시작합니다. 분해 슬라이더를 사용하면 각 부품이 어떻게 결합되는지 시각적으로 확인할 수 있습니다.'
      : 'For assembly order, refer to the "Assembly Order" number in the part information. Generally, you start with the innermost or base components. Use the explode slider to visualize how the parts fit together.'
  }

  if (q.includes('work') || q.includes('원리') || q.includes('작동')) {
    return language === 'ko'
      ? '각 부품의 "기능" 정보를 확인하면 작동 원리를 이해하는 데 도움이 됩니다. 관련 부품들 간의 연결 관계도 확인해보세요. 궁금한 특정 부품이 있다면 그 부품을 선택하고 다시 질문해주세요!'
      : 'Check the "Function" information for each part to understand how it works. Also look at the connections between related parts. If you have questions about a specific part, select it and ask me again!'
  }

  // Default response
  return language === 'ko'
    ? `좋은 질문이네요! "${question}"에 대해 알려드릴게요.\n\n현재 선택된 기계의 3D 모델을 탐색하면서 각 부품을 클릭해보세요. 부품을 선택하면 해당 부품의 상세 정보와 기능을 확인할 수 있습니다.\n\n더 구체적인 질문이 있으시면 언제든지 물어보세요!`
    : `Great question! Let me help you with "${question}".\n\nExplore the 3D model of the currently selected machine and click on each part. When you select a part, you can see its detailed information and function.\n\nFeel free to ask more specific questions!`
}
