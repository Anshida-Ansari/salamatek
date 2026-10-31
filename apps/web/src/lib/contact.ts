import { contactConfig, type ContactSettings } from '@/config/contact';

export async function getContactSettings(): Promise<ContactSettings> {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/contact-settings`, {
      next: { revalidate: 60, tags: ['contact-settings'] },
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        return {
          ...contactConfig,
          ...json.data,
          social: {
            ...contactConfig.social,
            ...(json.data.social || {}),
          },
          additionalPhones: Array.isArray(json.data.additionalPhones) && json.data.additionalPhones.length > 0
            ? json.data.additionalPhones
            : contactConfig.additionalPhones,
          customFields: Array.isArray(json.data.customFields)
            ? json.data.customFields
            : [],
        };
      }
    }
  } catch (err) {
    // Graceful fallback to static contactConfig
    console.warn('[ContactSettings] Failed to fetch dynamic contact settings, using defaults:', err);
  }

  return contactConfig;
}

export function cleanPhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^0-9+]/g, '');
}

export function getTelLink(phone: string): string {
  return `tel:${cleanPhone(phone)}`;
}

export function getMailtoLink(email: string): string {
  return `mailto:${email.trim()}`;
}

export function getWhatsAppLink(phoneOrWa: string, message?: string): string {
  const digits = cleanPhone(phoneOrWa).replace('+', '');
  const base = `https://wa.me/${digits}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}
