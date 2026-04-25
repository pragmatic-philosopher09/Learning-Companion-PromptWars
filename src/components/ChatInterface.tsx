'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Bot, User, Mic, MicOff, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import InlineQuiz from '@/components/InlineQuiz';
import type { ChatMessage } from '@/lib/gemini';

interface WikiData {
  title: string;
  extract: string;
  url?: string;
  thumbnail?: string;
}

interface BookData {
  title: string;
  author: string;
  coverUrl?: string;
}

interface Props {
  onWikiData: (data: WikiData | null) => void;
  onBooksData: (data: BookData[]) => void;
  onRelatedTopics: (topics: string[]) => void;
  onKeyConcepts: (concepts: { term: string; messageIndex: number }[]) => void;
  onTopicDetected: (topic: string) => void;
  onMessageCountChange: (count: number) => void;
  externalMessage?: string | null;
  onExternalMessageConsumed?: () => void;
}

// Parse quiz blocks from markdown
function parseContent(text: string) {
  const parts: { type: 'text' | 'quiz'; content: string }[] = [];
  const quizRegex = /```quiz\s*\n?([\s\S]*?)\n?```/g;
  let lastIndex = 0;
  let match;

  while ((match = quizRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'quiz', content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts;
}

// Extract bold terms as key concepts
function extractKeyConcepts(text: string, messageIndex: number): { term: string; messageIndex: number }[] {
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const concepts: { term: string; messageIndex: number }[] = [];
  let match;
  while ((match = boldRegex.exec(text)) !== null) {
    const term = match[1].trim();
    if (term.length > 2 && term.length < 40 && !term.includes('\n')) {
      concepts.push({ term, messageIndex });
    }
  }
  return concepts;
}

export default function ChatInterface({
  onWikiData, onBooksData, onRelatedTopics, onKeyConcepts,
  onTopicDetected, onMessageCountChange,
  externalMessage, onExternalMessageConsumed,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [allConcepts, setAllConcepts] = useState<{ term: string; messageIndex: number }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'model',
        parts: [{ text: "Hey there! 👋 I'm your Learning Companion — think of me as a patient friend who loves explaining things.\n\nWhat would you like to learn about today? Pick a topic from the cards, or just type anything you're curious about!" }]
      }]);
    }
  }, [messages.length]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Report message count changes
  useEffect(() => {
    onMessageCountChange(messages.length);
  }, [messages.length, onMessageCountChange]);

  // Handle external messages (from topic cards, sidebar quick actions)
  useEffect(() => {
    if (externalMessage && !loading) {
      sendMessage(externalMessage);
      onExternalMessageConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalMessage]);

  // Voice input setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = { role: 'user', parts: [{ text }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Detect topic from first user message
    if (!topic && messages.length <= 2) {
      setTopic(text);
      onTopicDetected(text);
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, topic: topic || text }),
      });
      const data = await res.json();

      if (data.reply) {
        const updatedMessages: ChatMessage[] = [...newMessages, { role: 'model', parts: [{ text: data.reply }] }];
        setMessages(updatedMessages);

        // Extract key concepts from the AI response
        const newConcepts = extractKeyConcepts(data.reply, updatedMessages.length - 1);
        if (newConcepts.length > 0) {
          const merged = [...allConcepts, ...newConcepts];
          // Deduplicate by term
          const unique = merged.filter((c, i, arr) => arr.findIndex(x => x.term.toLowerCase() === c.term.toLowerCase()) === i);
          setAllConcepts(unique);
          onKeyConcepts(unique);
        }
      }

      // Update reference panel data
      if (data.wikiData) onWikiData(data.wikiData);
      if (data.books) onBooksData(data.books);
      if (data.relatedTopics) onRelatedTopics(data.relatedTopics);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages([...newMessages, { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting right now. Please try again." }] }]);
    } finally {
      setLoading(false);
    }
  }, [messages, topic, allConcepts, onWikiData, onBooksData, onRelatedTopics, onKeyConcepts, onTopicDetected]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
  };

  const resetChat = useCallback(() => {
    setTopic(null);
    setMessages([]);
    setAllConcepts([]);
    onWikiData(null);
    onBooksData([]);
    onRelatedTopics([]);
    onKeyConcepts([]);
  }, [onWikiData, onBooksData, onRelatedTopics, onKeyConcepts]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 sm:px-6 py-6 space-y-5">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const parsed = isUser ? [{ type: 'text' as const, content: msg.parts[0].text }] : parseContent(msg.parts[0].text);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
                  isUser 
                    ? 'bg-gradient-to-br from-pink-500 to-rose-500' 
                    : 'bg-gradient-to-br from-indigo-500 to-violet-600'
                }`}>
                  {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>

                {/* Content */}
                <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                  {isUser ? (
                    <div 
                      className="rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm"
                      style={{ 
                        background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                        color: 'white',
                      }}
                    >
                      <p className="text-sm leading-relaxed">{msg.parts[0].text}</p>
                    </div>
                  ) : (
                    <div 
                      className="rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm border"
                      style={{ 
                        background: 'var(--bg-secondary)', 
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {parsed.map((part, pIdx) => {
                        if (part.type === 'quiz') {
                          try {
                            const quizData = JSON.parse(part.content);
                            return <InlineQuiz key={pIdx} quiz={quizData} />;
                          } catch {
                            return <p key={pIdx} className="text-sm text-red-500">Failed to render quiz.</p>;
                          }
                        }
                        return (
                          <div key={pIdx} className="prose prose-sm sm:prose-base max-w-none prose-indigo dark:prose-invert prose-p:leading-relaxed prose-headings:font-bold prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400">
                            <ReactMarkdown>{part.content}</ReactMarkdown>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div 
              className="rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm border flex items-center gap-3"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Voice button */}
          {recognitionRef.current && (
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-3 rounded-xl transition-all ${
                isListening 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                  : ''
              }`}
              style={!isListening ? { color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)' } : {}}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Type your answer or ask a question..."}
              disabled={loading}
              className="w-full rounded-xl pl-5 pr-5 py-3.5 text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
              style={{ 
                background: 'var(--bg-tertiary)', 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)' 
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

// Export reset function handle type
export type ChatInterfaceHandle = {
  resetChat: () => void;
};
