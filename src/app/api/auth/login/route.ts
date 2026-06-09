import { NextResponse } from 'next/server';
import { getUserByEmail, getUserByUsername } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, captchaToken } = body;

    if (!identifier || !password || !captchaToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify captcha (you'll need to implement this with CF Turnstile API)
    // For now, we'll skip actual verification since we don't have the secret key

    const user = getUserByEmail(identifier) || getUserByUsername(identifier);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.isSuspended) {
      return NextResponse.json({ 
        error: `Your account has been suspended. Reason: ${user.suspensionReason}` 
      }, { status: 403 });
    }

    const session = await createSession(user);

    return NextResponse.json(session);
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
