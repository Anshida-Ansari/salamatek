'use client';

import { useState, type FormEvent } from 'react';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { departments } from '@/data/departments';

type Props = {
  locale: Locale;
  t: Translations;
};

type FormState = 'idle' | 'submitted';

export function AppointmentSection({ locale, t }: Props) {
  const p = t.pages.home;
  const [formState, setFormState] = useState<FormState>('idle');
  const [selectedTime, setSelectedTime] = useState('');

  const timeOptions = [
    { value: 'morning',   label: p.appointmentFieldTimeMorning },
    { value: 'afternoon', label: p.appointmentFieldTimeAfternoon },
    { value: 'evening',   label: p.appointmentFieldTimeEvening },
  ];

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Phase 2: UI only — no backend submission
    setFormState('submitted');
  }

  return (
    <section
      className="bg-brand-dark py-16 md:py-24"
      aria-labelledby="appointment-heading"
      id="appointment"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: Copy + contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-light mb-4">
              {p.appointmentEyebrow}
            </p>

            <h2
              id="appointment-heading"
              className="text-3xl md:text-display-md font-serif font-bold text-white leading-tight mb-4 whitespace-pre-line"
            >
              {p.appointmentHeading}
            </h2>

            <p className="text-sm text-white/60 leading-relaxed mb-8 max-w-sm">
              {p.appointmentSubtext}
            </p>

            {/* Contact options */}
            <div className="flex flex-wrap gap-4">
              <a
                href={`tel:${p.appointmentPhone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 rounded-xl px-5 py-4 transition-colors duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
              >
                <svg className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5">{p.appointmentCallUs}</p>
                  <p className="text-sm font-semibold text-white tabular-nums">{p.appointmentPhone}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/966${p.appointmentWa.replace(/\s/g, '').replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 rounded-xl px-5 py-4 transition-colors duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
              >
                <svg className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.554 4.11 1.523 5.84L0 24l6.336-1.498A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.579 9.579 0 01-4.893-1.344l-.35-.21-3.647.864.924-3.558-.229-.365A9.558 9.558 0 012.4 12C2.4 6.7 6.7 2.4 12 2.4S21.6 6.7 21.6 12 17.3 21.6 12 21.6z"/>
                </svg>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5">{p.appointmentWhatsapp}</p>
                  <p className="text-sm font-semibold text-white tabular-nums">{p.appointmentWa}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Form card */}
          <div className="bg-white rounded-2xl shadow-card-lg overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-border">
              <h3 className="text-base font-semibold text-text-base">
                {p.appointmentFormTitle}
              </h3>
              <span className="text-[10px] font-semibold text-brand-medium bg-brand-mint px-2 py-1 rounded-full">
                {p.appointmentConfirm}
              </span>
            </div>

            {formState === 'submitted' ? (
              <div className="px-6 py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-brand-mint flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-brand-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-text-base mb-2">
                  {locale === 'ar' ? 'تم إرسال طلبك' : 'Request received'}
                </h4>
                <p className="text-sm text-text-muted">
                  {locale === 'ar'
                    ? 'سيتصل بك فريق رعاية المرضى لتأكيد موعدك قريبًا.'
                    : 'Our patient-care team will contact you to confirm your appointment shortly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">
                {/* Full name */}
                <div>
                  <label htmlFor="appt-name" className="block text-xs font-semibold text-text-muted mb-1.5">
                    {p.appointmentFieldName}
                  </label>
                  <input
                    id="appt-name"
                    type="text"
                    required
                    placeholder={p.appointmentFieldNamePH}
                    className="w-full h-10 px-3 text-sm border border-border rounded-lg bg-white text-text-base placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-medium"
                  />
                </div>

                {/* Mobile + Department row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="appt-mobile" className="block text-xs font-semibold text-text-muted mb-1.5">
                      {p.appointmentFieldMobile}
                    </label>
                    <input
                      id="appt-mobile"
                      type="tel"
                      required
                      placeholder={p.appointmentFieldMobilePH}
                      className="w-full h-10 px-3 text-sm border border-border rounded-lg bg-white text-text-base placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor="appt-dept" className="block text-xs font-semibold text-text-muted mb-1.5">
                      {p.appointmentFieldDept}
                    </label>
                    <div className="relative">
                      <select
                        id="appt-dept"
                        required
                        className="w-full h-10 ps-3 pe-8 text-sm border border-border rounded-lg bg-white text-text-base appearance-none focus:outline-none focus:ring-2 focus:ring-brand-medium"
                      >
                        <option value="">{p.appointmentFieldDeptPH}</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>{d.name[locale]}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center" aria-hidden="true">
                        <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date + Time row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="appt-date" className="block text-xs font-semibold text-text-muted mb-1.5">
                      {p.appointmentFieldDate}
                    </label>
                    <input
                      id="appt-date"
                      type="date"
                      required
                      className="w-full h-10 px-3 text-sm border border-border rounded-lg bg-white text-text-base focus:outline-none focus:ring-2 focus:ring-brand-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor="appt-time" className="block text-xs font-semibold text-text-muted mb-1.5">
                      {p.appointmentFieldTime}
                    </label>
                    <div className="relative">
                      <select
                        id="appt-time"
                        required
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full h-10 ps-3 pe-8 text-sm border border-border rounded-lg bg-white text-text-base appearance-none focus:outline-none focus:ring-2 focus:ring-brand-medium"
                      >
                        <option value="">{p.appointmentFieldTimeMorning}</option>
                        {timeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center" aria-hidden="true">
                        <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-brand-red hover:bg-brand-red-dark text-white text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                >
                  {p.appointmentSubmit}
                </button>

                {/* Disclaimer */}
                <p className="text-[10px] text-text-subtle text-center leading-relaxed">
                  {p.appointmentDisclaimer}
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
