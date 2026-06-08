import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession();
  
  if (!session || !session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = getAllUsers();
  return NextResponse.json(users);
}
