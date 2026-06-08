import { NextResponse } from 'next/server';
import { createUser, validateEmail, validateUsername, containsCurseWord } from '@/lib/auth';
import { getUserByEmail, getUserByUsername } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, username, password, name, captchaToken } = body;

  if (!email || !username || !password || !captchaToken) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  if (!validateUsername(username)) {
    return NextResponse.json({ error: 'Invalid username. Must be 3-20 characters, alphanumeric and underscore only, no curse words' }, { status: 400 });
  }

  if (containsCurseWord(username)) {
    return NextResponse.json({ error: 'Username contains inappropriate language' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const existingEmail = getUserByEmail(email);
  if (existingEmail) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }

  const existingUsername = getUserByUsername(username);
  if (existingUsername) {
    return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
  }

  // Verify captcha (you'll need to implement this with CF Turnstile API)
  // For now, we'll skip actual verification since we don't have the secret key

  try {
    createUser(email, username, password, name);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
