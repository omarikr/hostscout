'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
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
    const [isLoaded, setIsLoaded] = useState(false);

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
        if (!siteKey) return;

        const scriptId = 'cloudflare-turnstile-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        const renderWidget = () => {
            if (window.turnstile && containerRef.current && !widgetIdRef.current) {
                const currentTheme = theme === 'system' ? systemTheme : theme;
                try {
                    widgetIdRef.current = window.turnstile.render(containerRef.current, {
                        sitekey: siteKey,
                        callback: handleVerify,
                        'error-callback': handleError,
                        'expired-callback': handleExpire,
                        theme: currentTheme === 'dark' ? 'dark' : 'light',
                        appearance: 'always',
                    });
                    isRenderedRef.current = true;
                } catch (error) {
                    console.error('Turnstile render error:', error);
                }
            }
        };

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
            script.onload = () => {
                setIsLoaded(true);
                renderWidget();
            };
        } else {
            if (window.turnstile) {
                setIsLoaded(true);
                renderWidget();
            } else {
                script.addEventListener('load', () => {
                    setIsLoaded(true);
                    renderWidget();
                });
            }
        }

        return () => {
            if (widgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch (error) {
                    console.error('Turnstile remove error:', error);
                }
                widgetIdRef.current = null;
                isRenderedRef.current = false;
            }
        };
    }, [siteKey]);

    // Handle theme changes separately to avoid re-rendering the widget
    useEffect(() => {
        if (widgetIdRef.current && window.turnstile && isLoaded) {
            const currentTheme = theme === 'system' ? systemTheme : theme;
            // Note: Turnstile doesn't support dynamic theme changes after render
            // We would need to remove and re-render, but that can cause issues
            // For now, we'll keep the initial theme
        }
    }, [theme, systemTheme, isLoaded]);

    if (!siteKey) {
        return (
            <div className="flex justify-center my-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                Turnstile site key is not configured
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="flex justify-center my-4 overflow-hidden"
            style={{ minHeight: '65px', minWidth: '300px' }}
        />
    );
}
