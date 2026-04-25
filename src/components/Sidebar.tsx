'use client';

import { motion } from 'framer-motion';
import { 
  BookOpen, RotateCcw, MessageSquareQuote, 
  ChevronLeft, Sparkles
} from 'lucide-react';

interface KeyConcept {
  term: string;
  messageIndex: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  topicsHistory: string[];
  keyConcepts: KeyConcept[];
  messageCount: number;
  onNewTopic: () => void;
  onRequestQuiz: () => void;
  onRequestSummary: () => void;
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-24 h-24" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth="8"
        />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="progress-ring-circle"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{Math.round(progress)}%</span>
        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Progress</span>
      </div>
    </div>
  );
}

export default function Sidebar({ 
  isOpen, onClose, topicsHistory, keyConcepts, messageCount,
  onNewTopic, onRequestQuiz, onRequestSummary 
}: Props) {
  // Simple heuristic: progress increases with message count, caps at 100
  const progress = Math.min(100, Math.round((messageCount / 20) * 100));

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: isOpen ? 0 : -280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed lg:relative z-30 top-0 left-0 h-full w-[280px] flex flex-col border-r overflow-hidden"
      style={{ 
        background: 'var(--bg-secondary)', 
        borderColor: 'var(--border-color)' 
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Learning Hub</span>
        </div>
        <button 
          onClick={onClose} 
          className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close sidebar"
        >
          <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
        </button>
      </div>

      {/* Progress */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <ProgressRing progress={progress} />
        <p className="text-center text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
          Session Engagement
        </p>
      </div>

      {/* Quick Actions */}
      <div className="p-4 space-y-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
          Quick Actions
        </p>
        {[
          { label: 'New Topic', icon: RotateCcw, action: onNewTopic },
          { label: 'Quiz Me', icon: BookOpen, action: onRequestQuiz },
          { label: 'Summarize', icon: MessageSquareQuote, action: onRequestSummary },
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)' }}
            >
              <Icon className="w-4 h-4 text-indigo-500" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Key Concepts */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)' }}>
          Key Concepts
        </p>
        {keyConcepts.length === 0 ? (
          <p className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>
            Concepts will appear here as you learn...
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {keyConcepts.map((concept, idx) => (
              <span
                key={idx}
                className="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium border"
                style={{ 
                  borderColor: 'var(--border-color)', 
                  color: '#6366f1',
                  background: 'rgba(99, 102, 241, 0.08)'
                }}
              >
                {concept.term}
              </span>
            ))}
          </div>
        )}

        {/* Topics History */}
        {topicsHistory.length > 0 && (
          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)' }}>
              Topics Explored
            </p>
            <div className="space-y-1.5">
              {topicsHistory.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
