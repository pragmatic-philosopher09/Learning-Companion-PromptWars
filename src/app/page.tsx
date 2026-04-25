'use client';

import { useState, useCallback } from 'react';
import { Brain, Sun, Moon, PanelLeftOpen, BookOpenCheck } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import ChatInterface from '@/components/ChatInterface';
import Sidebar from '@/components/Sidebar';
import ReferencePanel from '@/components/ReferencePanel';
import TopicCards from '@/components/TopicCards';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refPanelOpen, setRefPanelOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [wikiData, setWikiData] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [keyConcepts, setKeyConcepts] = useState<{ term: string; messageIndex: number }[]>([]);
  const [topicsHistory, setTopicsHistory] = useState<string[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [externalMessage, setExternalMessage] = useState<string | null>(null);

  const handleTopicSelect = useCallback((topic: string) => {
    setHasStarted(true);
    setExternalMessage(`I want to learn about ${topic}`);
  }, []);

  const handleTopicDetected = useCallback((topic: string) => {
    setTopicsHistory(prev => prev.includes(topic) ? prev : [...prev, topic]);
    setRefPanelOpen(true);
  }, []);

  const handleNewTopic = useCallback(() => {
    setHasStarted(false);
    setWikiData(null);
    setBooks([]);
    setRelatedTopics([]);
    setKeyConcepts([]);
    setRefPanelOpen(false);
  }, []);

  const handleWikiData = useCallback((data: any) => {
    setWikiData(data);
    if (data) setRefPanelOpen(true);
  }, []);

  return (
    /*
     * LAYOUT STRUCTURE:
     *   ┌──────────────────────────────────────┐
     *   │  Header (flex-shrink-0)              │
     *   ├────────┬───────────────┬─────────────┤
     *   │Sidebar │  Main Chat   │  Ref Panel  │
     *   │ 280px  │  (flex-1)    │   320px     │
     *   │        │              │             │
     *   └────────┴───────────────┴─────────────┘
     *
     *   Outer div: h-dvh, flex-col
     *   Middle row: flex-1, flex-row, min-h-0 (KEY!)
     *   Each column: h-full, overflow managed internally
     */
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
      }}
    >
      {/* ─── Header ─── */}
      <header
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ padding: 8, borderRadius: 12, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            aria-label="Toggle sidebar"
          >
            <PanelLeftOpen size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
            }}>
              <Brain size={20} color="white" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                Learning Companion
              </h1>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: '#6366f1' }}>
                Adaptive AI Tutor
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setRefPanelOpen(!refPanelOpen)}
            style={{ padding: 8, borderRadius: 12, border: 'none', background: 'none', cursor: 'pointer', color: refPanelOpen ? '#6366f1' : 'var(--text-secondary)' }}
            aria-label="Toggle reference panel"
          >
            <BookOpenCheck size={20} />
          </button>
          <button
            onClick={toggleTheme}
            style={{ padding: 8, borderRadius: 12, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* ─── Body: sidebar + main + reference — this MUST have min-h-0 to prevent flex blowout ─── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
        {/* Background blobs */}
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: '#6366f1', filter: 'blur(120px)', opacity: 0.06,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: '#ec4899', filter: 'blur(120px)', opacity: 0.06,
          pointerEvents: 'none',
        }} />

        {/* Left Sidebar */}
        {sidebarOpen && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            topicsHistory={topicsHistory}
            keyConcepts={keyConcepts}
            messageCount={messageCount}
            onNewTopic={handleNewTopic}
            onRequestQuiz={() => setExternalMessage("Can you give me a quick quiz on what we've covered so far?")}
            onRequestSummary={() => setExternalMessage("Can you summarize everything we've learned so far?")}
          />
        )}

        {/* Center: Topic Cards + Chat */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          position: 'relative',
          zIndex: 10,
        }}>
          {/* Topic cards — shown before user starts, scrollable if needed */}
          {!hasStarted && (
            <div style={{
              flexShrink: 0,
              maxHeight: '40%',
              overflowY: 'auto',
              borderBottom: '1px solid var(--border-color)',
            }}>
              <TopicCards onSelectTopic={handleTopicSelect} />
            </div>
          )}

          {/* Chat fills remaining space */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <ChatInterface
              onWikiData={handleWikiData}
              onBooksData={setBooks}
              onRelatedTopics={setRelatedTopics}
              onKeyConcepts={setKeyConcepts}
              onTopicDetected={(t) => { handleTopicDetected(t); setHasStarted(true); }}
              onMessageCountChange={setMessageCount}
              externalMessage={externalMessage}
              onExternalMessageConsumed={() => setExternalMessage(null)}
            />
          </div>
        </div>

        {/* Right Reference Panel */}
        {refPanelOpen && (
          <ReferencePanel
            isOpen={refPanelOpen}
            onClose={() => setRefPanelOpen(false)}
            wikiData={wikiData}
            relatedTopics={relatedTopics}
            books={books}
            onSelectTopic={(t) => setExternalMessage(`Let's explore ${t} next.`)}
          />
        )}
      </div>
    </div>
  );
}
