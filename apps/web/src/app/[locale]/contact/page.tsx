import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { PageHero } from '@/components/shared/PageHero';
import { contactConfig } from '@/config/contact';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
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
  
  // Hardcoding text for simplicity, using i18n where available
  const title = isRtl ? 'اتصل بنا' : 'Contact Us';
  const description = isRtl 
    ? 'نحن هنا لمساعدتك. تواصل معنا لأي استفسارات أو تعليقات، أو لطلب عرض سعر لخدماتنا.'
    : 'We are here to help. Reach out to us for any inquiries, feedback, or to request a proposal for our services.';

  return (
    <main className="min-h-screen bg-slate-50">
      <PageHero 
        locale={locale as any}
        badge={title}
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
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#8E2829]/10 flex items-center justify-center flex-shrink-0 text-[#8E2829]">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{isRtl ? 'العنوان' : 'Address'}</h4>
                    <p className="text-gray-600 mt-1">{contactConfig.address}</p>
                    <a href={contactConfig.mapsLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-semibold text-[#8E2829] hover:underline">
                      {isRtl ? 'احصل على الاتجاهات' : 'Get Directions'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#8E2829]/10 flex items-center justify-center flex-shrink-0 text-[#8E2829]">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{isRtl ? 'الهاتف' : 'Phone'}</h4>
                    <p className="text-gray-600 mt-1" dir="ltr">{contactConfig.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#8E2829]/10 flex items-center justify-center flex-shrink-0 text-[#8E2829]">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{isRtl ? 'البريد الإلكتروني' : 'Email'}</h4>
                    <p className="text-gray-600 mt-1">{contactConfig.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#8E2829]/10 flex items-center justify-center flex-shrink-0 text-[#8E2829]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{isRtl ? 'ساعات العمل' : 'Working Hours'}</h4>
                    <p className="text-gray-600 mt-1">
                      {isRtl ? 'السبت - الخميس: 8 صباحاً - 10 مساءً' : 'Sat - Thu: 8:00 AM - 10:00 PM'}
                    </p>
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113659.63854973347!2d49.88210332822165!3d26.658605557762696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e35e7df2dfcff79%3A0xc3b86940d99dc0ec!2sSalamatek%20Medical%20Group!5e0!3m2!1sen!2ssa!4v1714562473456!5m2!1sen!2ssa" 
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
