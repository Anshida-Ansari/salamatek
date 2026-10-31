import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { PageHero } from '@/components/shared/PageHero';
import { getContactSettings, getTelLink, getMailtoLink, getWhatsAppLink } from '@/lib/contact';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return { title: getTranslations(locale as Locale).pages.contact.title };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  
  const isRtl = locale === 'ar';
  const contact = await getContactSettings();
  
  // Hardcoding text for simplicity, using i18n where available
  const title = isRtl ? 'اتصل بنا' : 'Contact Us';
  const description = isRtl 
    ? 'نحن هنا لمساعدتك. تواصل معنا لأي استفسارات أو تعليقات، أو لطلب عرض سعر لخدماتنا.'
    : 'We are here to help. Reach out to us for any inquiries, feedback, or to request a proposal for our services.';

  const displayAddress = isRtl ? (contact.addressAr || contact.address) : contact.address;

  return (
    <main className="min-h-screen bg-slate-50">
      <PageHero 
        locale={locale as any}
        badge={isRtl ? 'التميز في الرعاية الصحية' : 'Excellence in Healthcare'}
        heading={title}
        subtext={description}
        imageSrc="https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2071&auto=format&fit=crop"
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {isRtl ? 'معلومات التواصل' : 'Contact Information'}
                </h2>
                <p className="text-gray-600 mb-8">
                  {isRtl ? 'فريقنا متاح لمساعدتك. تواصل معنا عبر القنوات التالية.' : 'Our team is available to assist you. Reach out to us through the following channels.'}
                </p>
              </div>

              <div className="space-y-6">
                {/* Physical Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#8E2829]/10 flex items-center justify-center flex-shrink-0 text-[#8E2829]">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{isRtl ? 'العنوان' : 'Address'}</h4>
                    <p className="text-gray-600 mt-1">{displayAddress}</p>
                    {contact.mapsLink && (
                      <a href={contact.mapsLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-semibold text-[#8E2829] hover:underline">
                        {isRtl ? 'احصل على الاتجاهات (Google Maps)' : 'Get Directions (Google Maps)'}
                      </a>
                    )}
                  </div>
                </div>

                {/* Phone & Direct Contacts */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-700">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{isRtl ? 'الهاتف وأرقام التواصل' : 'Phone & Direct Contacts'}</h4>
                    <div className="mt-1 space-y-1" dir="ltr">
                      {contact.phone && (
                        <div>
                          <a href={getTelLink(contact.phone)} className="text-gray-900 hover:text-emerald-700 font-medium block">
                            {contact.phone}
                          </a>
                          <span className="text-xs text-gray-500 block">
                            {isRtl ? 'الهاتف الثابت / المواعيد' : 'Landline / Appointments'}
                          </span>
                        </div>
                      )}

                      <div className="pt-1">
                        <span className="text-xs font-semibold text-gray-500 block">
                          {isRtl ? 'الجوال والطوارئ:' : 'Direct & Emergency:'}
                        </span>
                        {contact.emergencyPhone && (
                          <a href={getTelLink(contact.emergencyPhone)} className="text-emerald-700 hover:underline font-semibold block text-sm">
                            {contact.emergencyPhone}
                          </a>
                        )}
                        {contact.additionalPhones?.map((phone, idx) => (
                          <a key={idx} href={getTelLink(phone)} className="text-gray-800 hover:text-emerald-700 block text-sm">
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-700">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{isRtl ? 'البريد الإلكتروني' : 'Email'}</h4>
                    <a href={getMailtoLink(contact.email)} className="text-gray-600 hover:text-emerald-700 hover:underline mt-1 block" dir="ltr">
                      {contact.email}
                    </a>
                    {contact.additionalEmails?.map((em, idx) => (
                      <a key={idx} href={getMailtoLink(em)} className="text-gray-600 hover:text-emerald-700 hover:underline mt-1 block text-sm" dir="ltr">
                        {em}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Dynamic Custom Fields (if configured) */}
                {contact.customFields && contact.customFields.length > 0 && (
                  <div className="space-y-4 pt-2">
                    {contact.customFields.map((field) => (
                      <div key={field.key} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-700">
                          <Globe className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{isRtl ? field.labelAr : field.labelEn}</h4>
                          {field.type === 'phone' ? (
                            <a href={getTelLink(field.value)} className="text-gray-700 hover:underline block text-sm" dir="ltr">
                              {field.value}
                            </a>
                          ) : field.type === 'email' ? (
                            <a href={getMailtoLink(field.value)} className="text-gray-700 hover:underline block text-sm" dir="ltr">
                              {field.value}
                            </a>
                          ) : field.type === 'url' ? (
                            <a href={field.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block text-sm break-all">
                              {field.value}
                            </a>
                          ) : (
                            <p className="text-gray-600 text-sm mt-0.5">{field.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Social & WhatsApp Direct Channels */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 text-sm mb-3">
                    {isRtl ? 'قنوات التواصل المباشر' : 'Direct Social & Messaging'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {contact.whatsappNumber && (
                      <a
                        href={getWhatsAppLink(contact.whatsappNumber)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1ebe5c] transition-colors shadow-sm"
                      >
                        <span>WhatsApp ({contact.whatsappDisplay || contact.whatsappNumber})</span>
                      </a>
                    )}
                    {contact.social?.instagram && (
                      <a
                        href={contact.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <span>Instagram</span>
                      </a>
                    )}
                    {contact.social?.snapchat && (
                      <a
                        href={contact.social.snapchat}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFFC00] text-black text-xs font-semibold hover:bg-yellow-400 transition-colors shadow-sm border border-black/10"
                      >
                        <span>Snapchat</span>
                      </a>
                    )}
                    {contact.social?.facebook && (
                      <a
                        href={contact.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1877F2] text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <span>Facebook</span>
                      </a>
                    )}
                    {contact.social?.linkedin && (
                      <a
                        href={contact.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0A66C2] text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {contact.social?.youtube && (
                      <a
                        href={contact.social.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF0000] text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <span>YouTube</span>
                      </a>
                    )}
                    {contact.social?.tiktok && (
                      <a
                        href={contact.social.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:opacity-80 transition-opacity shadow-sm"
                      >
                        <span>TikTok</span>
                      </a>
                    )}
                    {contact.social?.twitter && (
                      <a
                        href={contact.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:opacity-80 transition-opacity shadow-sm"
                      >
                        <span>X (Twitter)</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Google Maps Integration */}
      <section className="h-[500px] w-full relative">
        <iframe 
          src="https://maps.google.com/maps?q=Salamatek%20Medical%20Group,%20Safwa,%20Saudi%20Arabia&t=&z=14&ie=UTF8&iwloc=&output=embed"
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Salamatek Medical Group Location"
          className="absolute inset-0"
        />
      </section>
    </main>
  );
}
