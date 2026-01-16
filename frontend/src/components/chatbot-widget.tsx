"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { toast } from "sonner"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! 👋 I'm your AI financial advisor. I can help you analyze your spending, budget planning, and provide personalized financial advice. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const quickQuestions = [
    { text: "Analyze my spending this month", icon: "📊" },
    { text: "How can I save more money?", icon: "💰" },
    { text: "Review my budget plan", icon: "📝" },
    { text: "Tips for financial goals", icon: "🎯" },
  ]

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await api.post("/ai/chat", {
        message: input,
      })

      console.log('🔍 Full Response:', response)
      console.log('📦 Response Data:', response.data)

      // Handle nested response structure from NestJS interceptor
      const responseData = response.data.data || response.data
      console.log('📝 Extracted Data:', responseData)

      if (response.data.success) {
        // Extract message from nested structure
        const messageContent = responseData.data?.message || responseData.message
        console.log('💬 Message Content:', messageContent)
        
        const aiMessage: Message = {
          role: "assistant",
          content: messageContent,
          timestamp: new Date(),
        }
        console.log('✅ Success! Message:', aiMessage.content)
        setMessages((prev) => [...prev, aiMessage])
      } else {
        console.error('❌ Response not successful:', response.data)
        throw new Error(response.data.message)
      }
    } catch (error: any) {
      console.error("AI Chat Error:", error)
      console.error("Error Response:", error.response?.data)
      toast.error("Failed to get AI response. Please try again.")
      
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    setTimeout(() => handleSend(), 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      {/* Chat Window */}
      <div className={cn(
        "bg-white dark:bg-slate-900 border border-border rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right w-[calc(100vw-2rem)] md:w-[420px] max-h-[85vh] pointer-events-auto flex flex-col",
        isOpen 
          ? "scale-100 opacity-100 translate-y-0" 
          : "scale-95 opacity-0 translate-y-10 pointer-events-none hidden"
      )}>
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-5 flex items-center justify-between relative overflow-hidden shrink-0">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-xl -ml-10 -mb-10" />

            <div className="flex items-center gap-3 relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                    <Sparkles className="w-6 h-6 text-white fill-current" />
                </div>
                <div>
                    <h3 className="font-black text-white text-base tracking-tight">AI Financial Advisor</h3>
                    <div className="flex items-center gap-1.5 opacity-90">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse shadow-sm shadow-emerald-300" />
                        <p className="text-emerald-50 text-[11px] font-bold">Powered by Groq AI</p>
                    </div>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded-xl h-9 w-9 relative z-10 transition-colors">
                <X className="w-5 h-5" />
            </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-5 bg-slate-50 dark:bg-slate-950 overflow-y-auto emerald-scrollbar min-h-0">
            <div className="space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className={cn(
                        "flex gap-3",
                        message.role === "user" ? "justify-end" : "justify-start"
                    )}>
                        {message.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-current" />
                            </div>
                        )}
                        <div className={cn(
                            "max-w-[85%] p-3.5 rounded-2xl shadow-sm",
                            message.role === "user"
                                ? "bg-emerald-600 text-white rounded-tr-none"
                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-border rounded-tl-none"
                        )}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            <p className={cn(
                                "text-[10px] mt-1.5 font-medium",
                                message.role === "user" ? "text-emerald-100" : "text-slate-400"
                            )}>
                                {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-current" />
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl rounded-tl-none border border-border shadow-sm">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                <span className="text-sm text-slate-600 dark:text-slate-300">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                {messages.length === 1 && !isLoading && (
                    <div className="pl-11 space-y-2 mt-4">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Quick Questions:</p>
                        {quickQuestions.map((q, i) => (
                            <button 
                                key={i}
                                onClick={() => handleQuickQuestion(q.text)}
                                className="w-full text-left bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-border hover:border-emerald-200 dark:hover:border-emerald-800 p-3 rounded-2xl text-sm text-slate-700 dark:text-slate-300 transition-all duration-200 group flex items-center gap-3 shadow-sm hover:translate-x-1"
                            >
                                <span className="text-base">{q.icon}</span>
                                <span className="font-medium">{q.text}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-border shrink-0">
            <div className="relative flex items-center gap-2">
                <input 
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    placeholder="Ask me anything about your finances..." 
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-border rounded-2xl pl-4 pr-12 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 text-slate-700 dark:text-slate-200 disabled:opacity-50"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4 ml-0.5" />
                    )}
                </button>
            </div>
            
            <div className="text-center mt-2">
                <p className="text-[9px] text-slate-400 font-medium">Powered by <span className="text-emerald-500 font-bold">Groq AI</span> • Lightning Fast</p>
            </div>
        </div>
      </div>

      {/* Floating Button */}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
            "h-14 w-14 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 relative pointer-events-auto border-2 border-white dark:border-slate-800",
            isOpen ? "bg-slate-800 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 rotate-90 scale-90" : "bg-emerald-600 hover:bg-emerald-500 hover:-translate-y-1 hover:scale-105"
        )}
      >
        {isOpen ? (
            <X className={cn("w-6 h-6 transition-colors", isOpen ? "text-white dark:text-slate-900" : "text-white")} />
        ) : (
            <Sparkles className="w-7 h-7 text-white fill-current" />
        )}
        
        {!isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white fill-current" />
            </span>
        )}
      </Button>
    </div>
  )
}
