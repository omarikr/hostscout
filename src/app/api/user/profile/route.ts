import { NextResponse } from 'next/server';
import { updateUser } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

export async function PUT(request: Request) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, bio, pronouns, avatar } = body;

  try {
    updateUser(session.id, { name, bio, pronouns, avatar });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
