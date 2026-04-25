import { NextResponse } from 'next/server';
import { chatWithTutor, ChatMessage } from '@/lib/gemini';
import { fetchWikipediaSummary } from '@/lib/wikipedia';
import { fetchRecommendedBooks } from '@/lib/openlibrary';
import { findClosestTopic } from '@/lib/topic-database';

export async function POST(request: Request) {
  try {
    const { messages, topic } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // ── Gather enrichment data from multiple sources ──
    let enrichmentParts: string[] = [];
    let wikiData = null;
    let books: { title: string; author: string; coverUrl?: string }[] = [];
    let topicMeta = null;
    let relatedTopics: string[] = [];

    if (topic) {
      // 1. Pre-populated Topic Database (instant, no API call)
      topicMeta = findClosestTopic(topic);
      if (topicMeta) {
        enrichmentParts.push(
          `CURATED TOPIC DATA:\n` +
          `- Category: ${topicMeta.category}\n` +
          `- Difficulty: ${topicMeta.difficulty}\n` +
          `- Prerequisites: ${topicMeta.prerequisites.join(', ') || 'None'}\n` +
          `- Key Terms: ${topicMeta.keyTerms.join(', ')}\n` +
          `- Suggested Learning Path: ${topicMeta.learningPath.join(' → ')}\n` +
          `- Fun Fact: ${topicMeta.funFact}`
        );
        relatedTopics = topicMeta.relatedTopics;
      }

      // 2. Wikipedia (real-time, first few messages only to keep latency low)
      if (messages.length <= 4) {
        const [wikiResult, booksResult] = await Promise.all([
          fetchWikipediaSummary(topic),
          fetchRecommendedBooks(topic),
        ]);

        wikiData = wikiResult;
        books = booksResult;

        if (wikiResult?.extract) {
          enrichmentParts.push(`WIKIPEDIA SUMMARY:\n${wikiResult.extract}`);
        }
      }
    }

    // 3. Build the enrichment context string
    const enrichmentContext = enrichmentParts.length > 0
      ? enrichmentParts.join('\n\n---\n\n')
      : undefined;

    // ── Call Gemini with enriched context ──
    const reply = await chatWithTutor(messages as ChatMessage[], enrichmentContext);

    return NextResponse.json({
      reply,
      wikiData,
      books,
      relatedTopics,
      topicMeta: topicMeta ? {
        name: topicMeta.name,
        category: topicMeta.category,
        difficulty: topicMeta.difficulty,
        learningPath: topicMeta.learningPath,
        funFact: topicMeta.funFact,
      } : null,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate chat response' }, { status: 500 });
  }
}
