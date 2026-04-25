'use client';

import { useState } from 'react';
import ChatMessageList, { ChatMessage } from '@/components/ChatMessageList';
import ChatInputForm from '@/components/ChatInputForm';

interface WikiData {
  title: string;
  extract: string;
  url: string;
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
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'model',
    parts: [{ text: "Hey there! 👋 I'm your Learning Companion — think of me as a patient friend who loves explaining things.\n\nWhat would you like to learn about today? Pick a topic from the cards, or just type anything you're curious about!" }]
  }]);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  const [allConcepts, setAllConcepts] = useState<{ term: string; messageIndex: number }[]>([]);
  const [hasConsumedExternal, setHasConsumedExternal] = useState(false);

  // Auto-trigger external message exactly once when it arrives
  if (externalMessage && !hasConsumedExternal && !loading) {
    setHasConsumedExternal(true);
    sendMessage(externalMessage);
    onExternalMessageConsumed?.();
  }

  // Reset external message consumption flag if external message changes
  if (!externalMessage && hasConsumedExternal) {
    setHasConsumedExternal(false);
  }

  async function sendMessage(text: string) {
    const userMessage: ChatMessage = { role: 'user', parts: [{ text }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);
    onMessageCountChange(newMessages.length);

    let currentTopic = topic;
    // Detect topic from first user message
    if (!currentTopic && messages.length <= 2) {
      currentTopic = text;
      setTopic(text);
      onTopicDetected(text);
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, topic: currentTopic || text }),
      });
      const data = await res.json();

      if (data.reply) {
        const updatedMessages: ChatMessage[] = [...newMessages, { role: 'model', parts: [{ text: data.reply }] }];
        setMessages(updatedMessages);
        onMessageCountChange(updatedMessages.length);

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
  }

  return (
    <div className="flex flex-col h-full bg-white relative" style={{ background: 'var(--bg-primary)' }}>
      <ChatMessageList 
        messages={messages} 
        loading={loading} 
        messagesEndRef={{ current: null }}
      />
      
      <ChatInputForm 
        onSendMessage={sendMessage} 
        loading={loading} 
      />
    </div>
  );
}
