import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (session.isSuspended) {
      return NextResponse.json({ 
        error: `Your account has been suspended. Reason: ${session.suspensionReason}` 
      }, { status: 403 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Session check failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
