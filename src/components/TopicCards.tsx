'use client';

import { motion } from 'framer-motion';
import { 
  Atom, Brain, Globe2, Cpu, Dna, Landmark, Rocket, 
  BookOpen, TrendingUp, Palette
} from 'lucide-react';

const TOPICS = [
  { title: 'Quantum Computing', icon: Atom, color: 'from-violet-500 to-purple-600', tagline: 'Beyond binary' },
  { title: 'Machine Learning', icon: Cpu, color: 'from-blue-500 to-cyan-500', tagline: 'Teaching machines to think' },
  { title: 'Climate Change', icon: Globe2, color: 'from-emerald-500 to-green-600', tagline: 'Our changing planet' },
  { title: 'Human Brain', icon: Brain, color: 'from-pink-500 to-rose-500', tagline: '100 billion neurons' },
  { title: 'Space Exploration', icon: Rocket, color: 'from-orange-500 to-amber-500', tagline: 'The final frontier' },
  { title: 'Genetics & DNA', icon: Dna, color: 'from-teal-500 to-emerald-500', tagline: 'Code of life' },
  { title: 'World History', icon: Landmark, color: 'from-amber-500 to-yellow-500', tagline: 'Lessons of the past' },
  { title: 'Philosophy', icon: BookOpen, color: 'from-indigo-500 to-violet-500', tagline: 'Questions that matter' },
  { title: 'Economics', icon: TrendingUp, color: 'from-sky-500 to-blue-500', tagline: 'How the world trades' },
  { title: 'Art & Design', icon: Palette, color: 'from-fuchsia-500 to-pink-500', tagline: 'Creative expression' },
];

interface Props {
  onSelectTopic: (topic: string) => void;
}

export default function TopicCards({ onSelectTopic }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          What would you like to learn today?
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Pick a topic to get started, or type your own below
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-3xl w-full">
        {TOPICS.map((topic, idx) => {
          const Icon = topic.icon;
          return (
            <motion.button
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelectTopic(topic.title)}
              className="group relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] cursor-pointer"
              style={{ 
                background: 'var(--bg-secondary)', 
                borderColor: 'var(--border-color)' 
              }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold leading-tight text-center" style={{ color: 'var(--text-primary)' }}>
                {topic.title}
              </span>
              <span className="text-[10px] leading-tight" style={{ color: 'var(--text-tertiary)' }}>
                {topic.tagline}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
