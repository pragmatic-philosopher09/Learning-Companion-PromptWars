import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '@/lib/gemini';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'model',
        parts: [{ text: "Hello! I'm your Learning Companion. What would you like to learn about today? (And how familiar are you with it already?)" }]
      }]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const extractPotentialTopic = (userInput: string) => {
      // Basic heuristic to grab a topic if it's the first message.
      if (!topic && messages.length <= 2) {
          // just use the user's first input as a very broad topic hint for Wikipedia
          setTopic(userInput);
      }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input.trim() }] };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    extractPotentialTopic(input.trim());

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, topic: topic || input.trim() })
      });
      const data = await res.json();
      
      if (data.reply) {
        setMessages([...newMessages, { role: 'model', parts: [{ text: data.reply }] }]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages([...newMessages, { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting right now. Please try again." }] }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
      setTopic(null);
      setMessages([]);
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[800px] w-full max-w-4xl mx-auto glass-panel rounded-3xl overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
               <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Learning Companion</h2>
              <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">Adaptive AI Tutor</p>
            </div>
        </div>
        <button 
          onClick={resetChat}
          className="p-2 text-slate-400 hover:text-indigo-500 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Start a new topic"
        >
            <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${isUser ? 'bg-pink-500' : 'bg-indigo-500'}`}>
                  {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                
                <div className={`max-w-[80%] rounded-2xl p-5 ${
                  isUser 
                    ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-tr-sm shadow-md shadow-pink-500/20' 
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-sm shadow-sm text-slate-800 dark:text-slate-200'
                }`}>
                  <div className={`prose max-w-none ${isUser ? 'prose-invert prose-p:text-white' : 'prose-indigo dark:prose-invert'} prose-sm sm:prose-base`}>
                    <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm">
                 <Bot className="w-4 h-4 text-white" />
             </div>
             <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm p-5 shadow-sm flex items-center gap-2">
                 <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                 <span className="text-sm font-medium text-slate-500">Thinking...</span>
             </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer or ask a question..."
            disabled={loading}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-shadow"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
