import { NextResponse } from 'next/server';
import { likeComment } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

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

  try {
    likeComment(parseInt(params.id), session.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to like comment' }, { status: 500 });
  }
}
