'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { contactConfig, type ContactSettings } from '@/config/contact';

const ContactContext = createContext<ContactSettings>(contactConfig);

export function ContactProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: Partial<ContactSettings>;
}) {
  const [settings, setSettings] = useState<ContactSettings>({
    ...contactConfig,
    ...(initialSettings || {}),
  });

  // Client-side refresh on mount or custom event
  useEffect(() => {
    let isMounted = true;
    const fetchLatest = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
        const res = await fetch(`${apiUrl}/contact-settings`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json && json.data && isMounted) {
            setSettings({
              ...contactConfig,
              ...json.data,
              social: {
                ...contactConfig.social,
                ...(json.data.social || {}),
              },
            });
          }
        }
      } catch {
        // keep initialSettings
      }
    };

    fetchLatest();

    const handleUpdate = () => fetchLatest();
    window.addEventListener('salamatek-contact-updated', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('salamatek-contact-updated', handleUpdate);
    };
  }, []);

  return (
    <ContactContext.Provider value={settings}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContactSettings(): ContactSettings {
  const context = useContext(ContactContext);
  return context || contactConfig;
}

