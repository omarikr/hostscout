import { cookies } from 'next/headers';
import { getUserByEmail, getUserById, createUser as dbCreateUser } from './db';
import bcrypt from 'bcryptjs';

export interface Session {
  id: number;
  email: string;
  username: string;
  name: string;
  isAdmin: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
}

const CURSE_WORDS = ['nigga', 'nigger', 'fuck', 'shit', 'bitch', 'whore', 'slut', 'faggot', 'retard'];

export function containsCurseWord(text: string): boolean {
  const lower = text.toLowerCase();
  return CURSE_WORDS.some(word => lower.includes(word));
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateUsername(username: string): boolean {
  if (containsCurseWord(username)) return false;
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
}

export async function createSession(user: any): Promise<Session> {
  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    isAdmin: user.isAdmin === 1,
    isSuspended: user.isSuspended === 1,
    suspensionReason: user.suspensionReason,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    isAdmin: user.isAdmin === 1,
    isSuspended: user.isSuspended === 1,
    suspensionReason: user.suspensionReason,
  };
}

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  if (!sessionCookie) return null;
  
  try {
    const session = JSON.parse(sessionCookie.value);
    
    // Refresh user data from DB
    const user = getUserById(session.id);
    if (!user) {
      await deleteSession();
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      isAdmin: user.isAdmin === 1,
      isSuspended: user.isSuspended === 1,
      suspensionReason: user.suspensionReason,
    };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function createUser(email: string, username: string, password: string, name?: string) {
  return dbCreateUser(email, username, password, name);
}
