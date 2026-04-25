'use client';

import ChatInterface from '@/components/ChatInterface';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8 md:p-12 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-4xl mx-auto relative z-10 flex flex-col items-center space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 glass-panel">
              <Brain className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500">
            Learning Companion
          </h1>
        </motion.div>

        {/* Main Chat Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <ChatInterface />
        </motion.div>
      </div>
    </main>
  );
}
