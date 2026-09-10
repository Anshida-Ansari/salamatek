'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * GlobalLoader — top-bar progress indicator for Next.js App Router.
 *
 * Strategy:
 *  - START: listen for clicks on internal <a> links (before navigation begins)
 *  - STOP:  watch usePathname — fires when new page has actually rendered
 *
 * This gives a real visual gap between click and completion.
 */
export function GlobalLoader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathRef = useRef(pathname);
  const loadingRef = useRef(false); // prevents double-start

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const start = useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    clear();

    setVisible(true);
    setProgress(8);

    let p = 8;
    intervalRef.current = setInterval(() => {
      // Fast at start, slows near 85%
      const inc = p < 25 ? 7 : p < 50 ? 4 : p < 75 ? 2 : 0.4;
      p = Math.min(p + inc, 85);
      setProgress(p);
    }, 120);
  }, []);

  const finish = useCallback(() => {
    clear();
    loadingRef.current = false;
    setProgress(100);
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 380);
  }, []);

  // ── START: intercept internal link clicks ──────────────────────
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Walk up from the clicked element to find an <a>
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Skip: fragment-only, mailto, tel, external, new-tab
      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank' ||
        (href.startsWith('http') && !href.includes(window.location.hostname))
      ) return;

      // Skip if it's the current page
      const targetPath = href.startsWith('/') ? href : `/${href}`;
      if (targetPath === window.location.pathname) return;

      start();
    };

    document.addEventListener('click', onClick, true); // capture phase
    return () => document.removeEventListener('click', onClick, true);
  }, [start]);

  // ── STOP: pathname changed = new page rendered ─────────────────
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (loadingRef.current) {
        finish();
      }
    }
  }, [pathname, finish]);

  // Cleanup on unmount
  useEffect(() => () => clear(), []);

  if (!visible && progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: '3px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #C0392B 0%, #E05522 55%, #ff7a40 100%)',
          boxShadow: '0 0 12px rgba(224,85,34,0.65), 0 0 4px rgba(192,57,43,0.5)',
          borderRadius: '0 3px 3px 0',
          transition:
            progress === 100
              ? 'width 0.18s ease-out, opacity 0.38s ease'
              : 'width 0.12s linear',
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
