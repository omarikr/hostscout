'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';

interface TurnstileProps {
    siteKey: string;
    onVerify: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
}

declare global {
    interface Window {
        onloadTurnstileCallback: () => void;
        turnstile: {
            render: (
                element: string | HTMLElement,
                options: {
                    sitekey: string;
                    callback: (token: string) => void;
                    'error-callback'?: () => void;
                    'expired-callback'?: () => void;
                    theme?: 'light' | 'dark' | 'auto';
                    appearance?: 'always' | 'execute' | 'interaction-only';
                }
            ) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
        };
    }
}

export default function Turnstile({ siteKey, onVerify, onError, onExpire }: TurnstileProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const isRenderedRef = useRef(false);
    const { theme, systemTheme } = useTheme();

    const onVerifyRef = useRef(onVerify);
    const onErrorRef = useRef(onError);
    const onExpireRef = useRef(onExpire);

    useEffect(() => {
        onVerifyRef.current = onVerify;
    }, [onVerify]);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    const handleVerify = useCallback((token: string) => {
        onVerifyRef.current?.(token);
    }, []);

    const handleError = useCallback(() => {
        onErrorRef.current?.();
    }, []);

    const handleExpire = useCallback(() => {
        onExpireRef.current?.();
    }, []);

    useEffect(() => {
        const scriptId = 'cloudflare-turnstile-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        const renderWidget = () => {
            if (window.turnstile && containerRef.current && !widgetIdRef.current) {
                const currentTheme = theme === 'system' ? systemTheme : theme;
                widgetIdRef.current = window.turnstile.render(containerRef.current, {
                    sitekey: siteKey,
                    callback: handleVerify,
                    'error-callback': handleError,
                    'expired-callback': handleExpire,
                    theme: currentTheme === 'dark' ? 'dark' : 'light',
                    appearance: 'always',
                });
                isRenderedRef.current = true;
            }
        };

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
            script.onload = renderWidget;
        } else {
            if (window.turnstile) {
                renderWidget();
            } else {
                script.addEventListener('load', renderWidget);
            }
        }

        return () => {
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
                isRenderedRef.current = false;
            }
        };
    }, [siteKey, handleVerify, handleError, handleExpire, theme, systemTheme]);

    return (
        <div
            ref={containerRef}
            className="flex justify-center my-4 overflow-hidden"
            style={{ minHeight: '65px', minWidth: '300px' }}
        />
    );
}
