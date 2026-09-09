import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

type Props = {
  locale: Locale;
  t: Translations;
};

async function getDepartments() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/departments?active=true&limit=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export async function AppointmentSection({ locale, t }: Props) {
  const p = t.pages.home;
  const depts = await getDepartments();
  const isAr = locale === 'ar';

  const deptOptions = [
    { value: '', label: isAr ? 'اختر القسم' : 'Select Department' },
    ...depts.map((d: any) => ({
      value: d.slug,
      label: d.name[locale] || d.name.en,
    }))
  ];

  return (
    <section
      className="relative bg-brand-mint py-16 md:py-24 overflow-hidden"
      aria-labelledby="appointment-heading"
      id="book-appointment"
    >
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-brand-pale/30 blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-white/60 blur-3xl mix-blend-overlay" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-card-lg overflow-hidden flex flex-col lg:flex-row">
          
          {/* Image Side */}
          <div className="lg:w-5/12 relative min-h-[300px] lg:min-h-full bg-brand-light">
            <Image
              src="/images/doctor-patient.jpg"
              alt="Doctor consulting with patient"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl font-serif font-bold mb-2">
                {isAr ? 'رعاية تثق بها' : 'Care you can trust'}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {isAr 
                  ? 'فريقنا الطبي جاهز لتقديم أفضل رعاية لك ولعائلتك.' 
                  : 'Our medical team is ready to provide the best care for you and your family.'}
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-7/12 p-8 md:p-12 lg:p-16">
            <div className="mb-8">
              <h2
                id="appointment-heading"
                className="text-3xl md:text-display-sm font-serif font-bold text-text-base mb-3"
              >
                {p.appointmentHeading}
              </h2>
              <p className="text-text-muted">
                {p.appointmentSubtext}
              </p>
            </div>

            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-sm font-medium text-text-base">
                    {isAr ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder={isAr ? 'الاسم الكامل' : 'Full Name'}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-sm font-medium text-text-base">
                    {isAr ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="05X XXX XXXX"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="department" className="block text-sm font-medium text-text-base">
                    {isAr ? 'القسم' : 'Department'}
                  </label>
                  <Select
                    id="department"
                    name="department"
                    required
                    defaultValue=""
                    options={deptOptions}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="date" className="block text-sm font-medium text-text-base">
                    {isAr ? 'التاريخ المفضل' : 'Preferred Date'}
                  </label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-sm font-medium text-text-base">
                  {isAr ? 'رسالة' : 'Message'} <span className="text-text-subtle font-normal">({isAr ? 'اختياري' : 'Optional'})</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder={isAr ? 'أي ملاحظات إضافية؟' : 'Any additional notes?'}
                />
              </div>

              <div className="pt-2">
                <Button type="button" size="lg" className="w-full sm:w-auto">
                  {t.common.bookNow}
                </Button>
                <p className="mt-4 text-xs text-text-subtle text-center sm:text-start">
                  {isAr 
                    ? 'سيقوم فريقنا بالتواصل معك لتأكيد الموعد خلال ساعات العمل.' 
                    : 'Our team will contact you to confirm the appointment during working hours.'}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
