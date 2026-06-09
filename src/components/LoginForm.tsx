'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassyButton } from '@/components/ui/glassy-button';
import Turnstile from './Turnstile';

export function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!captchaToken) {
      setError('Please complete the captcha');
      return;
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password, captchaToken }),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = '/';
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-2 shadow-2xl backdrop-blur-sm bg-white/70 dark:bg-black/70 p-8" style={{ borderRadius: '32px' }}>
          <div className="text-center mb-8">
            <img src="/icon.png" alt="HostScout" className="h-20 w-20 mx-auto mb-4" />
            <h1 className="text-4xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-3 text-lg">Sign in to your HostScout account</p>
          </div>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium">Email or Username</Label>
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="Enter your email or username"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="h-12 rounded-xl"
                />
              </div>

              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                onVerify={(token) => setCaptchaToken(token)}
              />

              <GlassyButton type="submit" className="w-full h-12 text-lg">
                Login
              </GlassyButton>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 mt-6">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account? <Link href="/auth/register" className="text-primary hover:underline font-medium">Register</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
