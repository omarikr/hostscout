import { NextResponse } from 'next/server';
import { createComment, getCommentsByPostId } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const comments = getCommentsByPostId(params.id);
  return NextResponse.json(comments);
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
  const { content, parentId } = body;

  if (!content || !content.trim()) {
    return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
  }

  try {
    const commentId = createComment(params.id, session.id, content, parentId);
    return NextResponse.json({ success: true, id: commentId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
