'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Bot, User } from 'lucide-react';
import InlineQuiz from '@/components/InlineQuiz';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
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

const ChatMessageList = memo(function ChatMessageList({ messages, loading, messagesEndRef }: ChatMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {messages.map((m, idx) => {
        const isModel = m.role === 'model';
        const content = m.parts[0].text;
        const parsedParts = parseContent(content);

        return (
          <div key={idx} className={`flex gap-4 max-w-3xl mx-auto ${isModel ? '' : 'flex-row-reverse'}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isModel ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600'
            }`}>
              {isModel ? <Bot size={18} /> : <User size={18} />}
            </div>

            {/* Message Bubble */}
            <div className={`flex flex-col gap-4 max-w-[85%] ${isModel ? '' : 'items-end'}`}>
              {parsedParts.map((part, partIdx) => {
                if (part.type === 'text') {
                  // Only wrap in bubble if it has actual text content to avoid empty bubbles above quizzes
                  if (!part.content.trim()) return null;
                  return (
                    <div
                      key={partIdx}
                      className={`p-4 rounded-2xl prose prose-sm max-w-none ${
                        isModel 
                          ? 'bg-white border text-gray-800 rounded-tl-sm' 
                          : 'bg-indigo-600 text-white rounded-tr-sm'
                      }`}
                      style={isModel ? { borderColor: 'var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' } : {}}
                    >
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]} 
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className={isModel ? "text-indigo-500 hover:text-indigo-600" : "text-indigo-200 hover:text-white underline"} />,
                          code: ({ ...props }) => <code {...props} className="bg-black/10 rounded px-1 py-0.5 font-mono text-[0.9em]" />
                        }}
                      >
                        {part.content}
                      </ReactMarkdown>
                    </div>
                  );
                } else if (part.type === 'quiz') {
                  let parsedQuiz = null;
                  try {
                    parsedQuiz = JSON.parse(part.content);
                  } catch (e) {
                    console.error("Failed to parse quiz", e);
                  }
                  
                  if (!parsedQuiz) return null;
                  
                  return (
                    <div key={partIdx} className="w-full max-w-xl mx-auto my-2">
                      <InlineQuiz quiz={parsedQuiz} />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        );
      })}

      {loading && (
        <div className="flex gap-4 max-w-3xl mx-auto">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div className="p-4 rounded-2xl bg-white border rounded-tl-sm w-24 flex items-center justify-center gap-1" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
});

export default ChatMessageList;
