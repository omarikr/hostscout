import { NextResponse } from 'next/server';
import { getPosts, createPost, assignTagToPost, getFilteredPosts } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const tag = searchParams.get('tag');
  
  const posts = getFilteredPosts(search || undefined, tag ? parseInt(tag) : undefined);
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await getServerSession();
  
  if (!session || !session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.isSuspended) {
    return NextResponse.json({ error: 'Account suspended' }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, content, logo, tags } = body;

  if (!title || !description || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const postId = createPost(title, description, content, logo || '', session.id);
    
    // Assign tags if provided
    if (tags && Array.isArray(tags)) {
      for (const tagId of tags) {
        assignTagToPost(String(postId), tagId);
      }
    }
    
    return NextResponse.json({ success: true, id: postId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
