import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';

/**
 * POST /api/progress — Save learning session progress to Firestore
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, sessionId, topicsExplored, keyConcepts, quizScores, messageCount } = body;

    if (!userId || !sessionId) {
      return NextResponse.json({ error: 'userId and sessionId are required' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const docRef = db.collection('learning_sessions').doc(sessionId);

    await docRef.set({
      userId,
      topicsExplored: topicsExplored || [],
      keyConcepts: keyConcepts || [],
      quizScores: quizScores || [],
      messageCount: messageCount || 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ success: true, sessionId });
  } catch (error) {
    console.error('Progress API Error:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}

/**
 * GET /api/progress?userId=xxx — Retrieve learning history from Firestore
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const snapshot = await db
      .collection('learning_sessions')
      .where('userId', '==', userId)
      .orderBy('updatedAt', 'desc')
      .limit(20)
      .get();

    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Progress API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}
