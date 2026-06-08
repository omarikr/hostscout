import { NextResponse } from 'next/server';
import { votePost, getUserVote } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ voteType: null });
  }

  const vote = getUserVote(session.id, params.id);
  return NextResponse.json({ voteType: vote?.voteType || null });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.isSuspended) {
    return NextResponse.json({ error: 'Account suspended' }, { status: 403 });
  }

  const body = await request.json();
  const { voteType } = body;

  if (voteType !== 1 && voteType !== -1) {
    return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
  }

  try {
    votePost(params.id, session.id, voteType);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}
