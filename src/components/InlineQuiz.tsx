'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Props {
  quiz: QuizData;
}

export default function InlineQuiz({ quiz }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  };

  const isCorrect = selected === quiz.correctIndex;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-4 p-5 rounded-2xl border-2 transition-all"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: revealed
          ? isCorrect ? '#10b981' : '#ef4444'
          : 'var(--border-color)',
      }}
    >
      <p className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
        🧩 Quick Check
      </p>
      <p className="text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
        {quiz.question}
      </p>

      <div className="space-y-2">
        {quiz.options.map((option, idx) => {
          let borderCol = 'var(--border-color)';
          let bgCol = 'transparent';
          let icon = null;

          if (revealed) {
            if (idx === quiz.correctIndex) {
              borderCol = '#10b981';
              bgCol = 'rgba(16, 185, 129, 0.08)';
              icon = <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
            } else if (idx === selected) {
              borderCol = '#ef4444';
              bgCol = 'rgba(239, 68, 68, 0.08)';
              icon = <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={revealed}
              className="w-full text-left px-4 py-3 rounded-xl border text-sm flex justify-between items-center gap-2 transition-all"
              style={{
                borderColor: borderCol,
                background: bgCol,
                color: 'var(--text-primary)',
                opacity: revealed && idx !== quiz.correctIndex && idx !== selected ? 0.4 : 1,
                cursor: revealed ? 'default' : 'pointer',
              }}
            >
              <span>{option}</span>
              {icon}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-3 border-t text-sm"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            {isCorrect
              ? <span className="text-emerald-600 font-semibold">🎉 Correct! </span>
              : <span className="text-red-500 font-semibold">Not quite. </span>
            }
            {quiz.explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
