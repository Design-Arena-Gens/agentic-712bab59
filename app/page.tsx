'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  Send,
  Activity,
  Zap,
  Radio,
  Cpu,
  Sparkles,
  MessageSquare
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'jarvis'
  text: string
  timestamp: Date
}

export default function JarvisAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'jarvis',
      text: 'Good evening, sir. JARVIS online and ready to assist.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [systemStatus, setSystemStatus] = useState({
    cpu: 0,
    network: 0,
    power: 100
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus({
        cpu: Math.floor(Math.random() * 40) + 30,
        network: Math.floor(Math.random() * 30) + 70,
        power: Math.floor(Math.random() * 10) + 90
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    setTimeout(() => {
      const response = getJarvisResponse(input)
      const jarvisMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'jarvis',
        text: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, jarvisMessage])
    }, 1000)
  }

  const getJarvisResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes('hello') || input.includes('hi')) {
      return 'Good to see you, sir. How may I be of assistance today?'
    }
    if (input.includes('weather')) {
      return 'Current conditions: Clear skies, 72°F. Perfect weather for testing the Mark XLVII suit, sir.'
    }
    if (input.includes('time')) {
      return `Current time is ${new Date().toLocaleTimeString()}. All systems synchronized.`
    }
    if (input.includes('status') || input.includes('report')) {
      return `All systems operational. CPU at ${systemStatus.cpu}%, network connectivity at ${systemStatus.network}%, power reserves at ${systemStatus.power}%.`
    }
    if (input.includes('joke')) {
      return 'Why did the AI cross the road? To optimize the path for future crossings, sir.'
    }
    if (input.includes('help')) {
      return 'I can assist with system status, time, weather updates, calculations, and general queries. Just ask, sir.'
    }
    if (input.includes('calculate') || input.includes('math')) {
      return 'I can perform calculations. Try asking me something like "calculate 25 * 47".'
    }
    if (input.match(/\d+\s*[\+\-\*\/]\s*\d+/)) {
      try {
        const result = eval(input.replace(/[^0-9+\-*/(). ]/g, ''))
        return `The result is ${result}, sir.`
      } catch {
        return 'I had trouble computing that calculation, sir.'
      }
    }
    if (input.includes('thank')) {
      return 'My pleasure, sir. Always happy to assist.'
    }

    return 'I understand, sir. Processing your request... Based on my analysis, I recommend proceeding with standard protocols. Is there anything specific you would like me to elaborate on?'
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      setTimeout(() => setIsListening(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-jarvis-dark grid-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-jarvis-blue rounded-full blur-[100px] animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-jarvis-blue rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-jarvis-blue/30 bg-jarvis-panel/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <Cpu className="w-8 h-8 text-jarvis-blue" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <Radio className="w-8 h-8 text-jarvis-blue/50" />
                </motion.div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-glow">J.A.R.V.I.S</h1>
                <p className="text-xs text-jarvis-blue/70">Just A Rather Very Intelligent System</p>
              </div>
            </motion.div>

            {/* System Status */}
            <div className="flex gap-6">
              <StatusIndicator icon={Cpu} label="CPU" value={systemStatus.cpu} />
              <StatusIndicator icon={Radio} label="Network" value={systemStatus.network} />
              <StatusIndicator icon={Zap} label="Power" value={systemStatus.power} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4 scrollbar-thin scrollbar-thumb-jarvis-blue/30 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl ${message.type === 'user' ? 'bg-jarvis-blue/20' : 'bg-jarvis-panel/80'} border border-jarvis-blue/30 rounded-lg p-4 border-glow`}>
                  <div className="flex items-start gap-3">
                    {message.type === 'jarvis' && (
                      <div className="mt-1">
                        <Sparkles className="w-5 h-5 text-jarvis-blue animate-pulse-glow" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1 text-jarvis-blue">
                        {message.type === 'jarvis' ? 'JARVIS' : 'You'}
                      </p>
                      <p className="text-gray-300">{message.text}</p>
                      <p className="text-xs text-jarvis-blue/50 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.type === 'user' && (
                      <div className="mt-1">
                        <MessageSquare className="w-5 h-5 text-jarvis-blue" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-jarvis-panel/80 border border-jarvis-blue/30 rounded-lg p-4 border-glow backdrop-blur-sm">
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleListening}
              className={`p-3 rounded-lg border transition-all ${
                isListening
                  ? 'bg-jarvis-blue/30 border-jarvis-blue animate-pulse-glow'
                  : 'bg-jarvis-panel border-jarvis-blue/30 hover:bg-jarvis-blue/10'
              }`}
            >
              <Mic className="w-5 h-5 text-jarvis-blue" />
            </motion.button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Speak or type your command..."
              className="flex-1 bg-jarvis-dark/50 border border-jarvis-blue/30 rounded-lg px-4 py-3 text-gray-300 placeholder-jarvis-blue/50 focus:outline-none focus:border-jarvis-blue transition-all"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              className="p-3 rounded-lg bg-jarvis-blue/20 border border-jarvis-blue hover:bg-jarvis-blue/30 transition-all border-glow"
            >
              <Send className="w-5 h-5 text-jarvis-blue" />
            </motion.button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-jarvis-blue/30 bg-jarvis-panel/50 backdrop-blur-sm py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-xs text-jarvis-blue/70">
            <Activity className="w-4 h-4 animate-pulse-glow" />
            <span>All systems operational • Stark Industries Technology</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StatusIndicator({ icon: Icon, label, value }: { icon: any, label: string, value: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      <Icon className="w-4 h-4 text-jarvis-blue" />
      <div>
        <p className="text-xs text-jarvis-blue/70">{label}</p>
        <p className="text-sm font-bold text-jarvis-blue">{value}%</p>
      </div>
    </motion.div>
  )
}
