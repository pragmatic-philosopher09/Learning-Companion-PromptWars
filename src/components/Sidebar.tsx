'use client';

import { memo } from 'react';

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
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: 64, height: 64, margin: '0 auto' }}>
      <svg width="64" height="64" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r={radius} fill="none" stroke="var(--border-color)" strokeWidth="6" />
        <circle
          cx="35" cy="35" r={radius}
          fill="none" stroke="url(#gradient)" strokeWidth="6"
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
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

const Sidebar = memo(function Sidebar({ 
  isOpen, onClose, topicsHistory, keyConcepts, messageCount,
  onNewTopic, onRequestQuiz, onRequestSummary 
}: Props) {
  const progress = Math.min(100, Math.round((messageCount / 20) * 100));

  if (!isOpen) return null;

  return (
    <aside style={{
      width: 260,
      flexShrink: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--border-color)',
      background: 'var(--bg-secondary)',
      zIndex: 30,
      overflow: 'hidden',
    }}>
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} className="chat-scroll">
        {/* Progress */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border-color)' }}>
          <ProgressRing progress={progress} />
          <p style={{ textAlign: 'center', fontSize: 11, marginTop: 6, color: 'var(--text-secondary)' }}>
            Session Engagement
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: 8 }}>
            Quick Actions
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 12, border: 'none',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    color: 'var(--text-primary)', background: 'var(--bg-tertiary)',
                  }}
                >
                  <Icon size={16} color="#6366f1" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Key Concepts */}
        <div style={{ padding: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: 10 }}>
            Key Concepts
          </p>
          {keyConcepts.length === 0 ? (
            <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
              Concepts will appear here as you learn...
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {keyConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-block', padding: '4px 10px',
                    borderRadius: 999, fontSize: 11, fontWeight: 500,
                    border: '1px solid var(--border-color)',
                    color: '#6366f1', background: 'rgba(99, 102, 241, 0.08)',
                  }}
                >
                  {concept.term}
                </span>
              ))}
            </div>
          )}

          {/* Topics History */}
          {topicsHistory.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: 10 }}>
                Topics Explored
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {topicsHistory.map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
});

export default Sidebar;
