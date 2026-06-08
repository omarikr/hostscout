import { NextResponse } from 'next/server';
import { getAllTags, createTag } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

export async function GET() {
  const tags = getAllTags();
  return NextResponse.json(tags);
}

export async function POST(request: Request) {
  const session = await getServerSession();
  
  if (!session || !session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
  }

  if (name.length > 50) {
    return NextResponse.json({ error: 'Tag name must be 50 characters or less' }, { status: 400 });
  }

  try {
    const tagId = createTag(name.trim());
    return NextResponse.json({ success: true, id: tagId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tag (tag may already exist)' }, { status: 500 });
  }
}
