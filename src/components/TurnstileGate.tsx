'use client';

import { useEffect, useState } from 'react';

export default function TurnstileGate() {
  const [isVerified, setIsVerified] = useState(false);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if already verified
    const verified = localStorage.getItem('turnstile_verified');
    if (verified === 'true') {
      setIsVerified(true);
      return;
    }

    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || isVerified) return;

    const container = document.getElementById('turnstile-container');
    if (!container || !window.turnstile) return;

    const id = window.turnstile.render(container, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
      callback: (token: string) => {
        localStorage.setItem('turnstile_verified', 'true');
        localStorage.setItem('turnstile_token', token);
        setIsVerified(true);
      },
      'error-callback': () => {
        console.error('Turnstile error');
      },
      theme: 'light',
      appearance: 'always',
    });

    setWidgetId(id);

    return () => {
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [isScriptLoaded, isVerified, widgetId]);

  if (isVerified) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div id="turnstile-container" />
    </div>
  );
}
