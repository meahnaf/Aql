import { useState } from 'react'
import { Send, FileText } from 'lucide-react'
import Layout from '../components/Layout'
import { chatAPI, ChatResponse } from '../lib/api'
import { useLanguage } from '../contexts/LanguageContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
  citations?: ChatResponse['citations']
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { language, t } = useLanguage()

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await chatAPI.send({
        message: input,
        language,
        conversation_history: messages.map((m) => ({ role: m.role, content: m.content })),
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.answer,
        citations: response.data.citations,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, an error occurred. Please try again.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-12rem)] flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">{t('chat')}</h2>
            <p className="text-sm text-gray-600">
              {language === 'ar' 
                ? 'اسأل عن مستنداتك بالعربية أو الإنجليزية' 
                : 'Ask questions about your documents in Arabic or English'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>{t('askQuestion')}</p>
              </div>
            )}

            {messages.map((message, idx) => (
              <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs font-semibold mb-2">{t('citations')}:</p>
                      {message.citations.map((citation, cidx) => (
                        <div key={cidx} className="text-xs bg-white bg-opacity-50 rounded p-2 mb-2">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                            <FileText className="w-3 h-3" />
                            <span className="font-medium">{citation.document_name}</span>
                          </div>
                          <p className="text-gray-700 line-clamp-2">{citation.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2 rtl:space-x-reverse">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('askQuestion')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}
