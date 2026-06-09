'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassyButton } from '@/components/ui/glassy-button';
import Turnstile from './Turnstile';

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!captchaToken) {
      setError('Please complete the captcha');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, name, captchaToken }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push('/auth/login');
    } else {
      setError(data.error || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-none backdrop-blur-none bg-transparent p-8" style={{ borderRadius: '32px' }}>
          <div className="text-center mb-8">
            <img src="/icon.png" alt="HostScout" className="h-20 w-20 mx-auto mb-4" />
            <h1 className="text-4xl font-bold">Create an account</h1>
            <p className="text-muted-foreground mt-3 text-lg">Join HostScout today</p>
          </div>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="m@example.com"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username (3-20 characters, alphanumeric and underscore only)</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  pattern="^[a-zA-Z0-9_]{3,20}$"
                  placeholder="username123"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password (min 8 characters)</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="h-12 rounded-xl"
                />
              </div>

              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                onVerify={(token) => setCaptchaToken(token)}
              />

              <GlassyButton type="submit" className="w-full h-12 text-lg">
                Register
              </GlassyButton>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 mt-6">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account? <Link href="/auth/login" className="text-primary hover:underline font-medium">Login</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}