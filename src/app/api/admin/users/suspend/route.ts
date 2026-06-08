import { NextResponse } from 'next/server';
import { suspendUser, unsuspendUser } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession();
  
  if (!session || !session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { userId, suspend, reason } = body;

  try {
    if (suspend) {
      suspendUser(userId, reason || 'No reason provided');
    } else {
      unsuspendUser(userId);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
  }
}
