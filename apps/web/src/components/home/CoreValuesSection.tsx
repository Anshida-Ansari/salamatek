'use client';

import { useState, useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';

type Props = {
  locale: Locale;
  t: Translations;
};

const SALAMATEK_VALUES = [
  {
    letter: 'S',
    valueEn: 'Service',
    valueAr: 'الخدمة',
    descEn: 'Delivering compassionate, patient-first care in every interaction.',
    descAr: 'تقديم رعاية متعاطفة تضع المريض في المقام الأول في كل تفاعل.',
  },
  {
    letter: 'A',
    valueEn: 'Accountability',
    valueAr: 'المسئولية',
    descEn: 'Owning our actions and outcomes with transparency and integrity.',
    descAr: 'تحمّل المسؤولية الكاملة عن أعمالنا ونتائجها بشفافية ونزاهة.',
  },
  {
    letter: 'L',
    valueEn: 'Loyalty',
    valueAr: 'الاخلاص',
    descEn: 'Building lasting trust with every patient, family and colleague.',
    descAr: 'بناء الثقة الدائمة مع كل مريض وعائلة وزميل.',
  },
  {
    letter: 'A',
    valueEn: 'Accuracy',
    valueAr: 'الدقة',
    descEn: 'Precision in diagnosis, treatment and every clinical decision.',
    descAr: 'الدقة في التشخيص والعلاج وكل قرار طبي.',
  },
  {
    letter: 'M',
    valueEn: 'Motivation',
    valueAr: 'التحفيز',
    descEn: 'Inspiring our team and patients to reach their best health outcomes.',
    descAr: 'تحفيز فريقنا ومرضانا لتحقيق أفضل نتائج صحية.',
  },
  {
    letter: 'A',
    valueEn: 'Awareness',
    valueAr: 'الوعي',
    descEn: 'Promoting health education and informed decision-making.',
    descAr: 'تعزيز التثقيف الصحي واتخاذ القرارات المستنيرة.',
  },
  {
    letter: 'T',
    valueEn: 'Team Work',
    valueAr: 'العمل الجماعي',
    descEn: 'Achieving excellence together through collaboration and mutual respect.',
    descAr: 'تحقيق التميز معاً من خلال التعاون والاحترام المتبادل.',
  },
  {
    letter: 'E',
    valueEn: 'Efficiency',
    valueAr: 'الكفاءة',
    descEn: 'Delivering the highest quality care with speed, skill and purpose.',
    descAr: 'تقديم أعلى جودة رعاية بسرعة ومهارة وهدف.',
  },
  {
    letter: 'K',
    valueEn: 'Knowledge',
    valueAr: 'المعرفة',
    descEn: 'Continual learning and evidence-based practice to lead in healthcare.',
    descAr: 'التعلم المستمر والممارسة المبنية على الأدلة للريادة في الرعاية الصحية.',
  },
];

export function CoreValuesSection({ locale }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isRtl = locale === 'ar';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    const current = sectionRef.current;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, []);

  const active = SALAMATEK_VALUES[activeIndex]!

  return (
    <section
      ref={sectionRef}
      className="relative bg-brand-dark py-20 md:py-28 overflow-hidden"
      aria-labelledby="core-values-heading"
      id="core-values"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-brand/10 blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-light/5 blur-3xl" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 ${isVisible ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-light mb-4">
            {isRtl ? 'قيمنا الجوهرية' : 'Our Core Values'}
          </p>
          <h2 id="core-values-heading" className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight">
            {isRtl ? 'قيمنا في كل حرف' : 'Our values, in every letter'}
          </h2>
          <p className="text-white/50 text-base max-w-lg mx-auto">
            {isRtl
              ? 'كل حرف من اسم سلامتك يعبّر عن قيمة جوهرية تُشكّل رعايتنا.'
              : 'Every letter of SALAMATEK reflects a core value that shapes our care.'}
          </p>
        </div>

        {/* SALAMATEK Letters Row */}
        <div
          className={`flex justify-center items-center gap-1 sm:gap-2 md:gap-3 mb-10 md:mb-14 ${isVisible ? 'animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200' : 'opacity-0'}`}
          role="tablist"
          aria-label={isRtl ? 'قيم سلامتك' : 'SALAMATEK values'}
        >
          {SALAMATEK_VALUES.map((item, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={activeIndex === i}
              aria-controls={`value-panel-${i}`}
              id={`value-tab-${i}`}
              onClick={() => setActiveIndex(i)}
              className={`
                group relative flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark rounded-lg
              `}
            >
              {/* Letter Box */}
              <div
                className={`
                  relative w-9 h-10 sm:w-11 sm:h-12 md:w-14 md:h-16 rounded-xl flex items-center justify-center
                  font-serif font-bold text-xl sm:text-2xl md:text-3xl
                  transition-all duration-300 ease-out
                  ${activeIndex === i
                    ? 'bg-brand text-white shadow-[0_0_30px_rgba(30,122,86,0.5)] scale-110 -translate-y-1'
                    : 'bg-white/[0.06] text-white/40 hover:bg-white/[0.12] hover:text-white/70 hover:scale-105'
                  }
                `}
              >
                {item.letter}
                {/* Active indicator dot */}
                {activeIndex === i && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-light" />
                )}
              </div>

              {/* Value name below letter (hidden on small screens) */}
              <span
                className={`
                  hidden md:block text-[10px] font-semibold uppercase tracking-wider text-center leading-tight max-w-[56px]
                  transition-all duration-300
                  ${activeIndex === i ? 'text-brand-light' : 'text-white/25'}
                `}
              >
                {isRtl ? item.valueAr.split(' ')[0] : item.valueEn.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Active Value Detail Panel */}
        <div
          className={`${isVisible ? 'animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300' : 'opacity-0'}`}
        >
          <div
            key={activeIndex}
            id={`value-panel-${activeIndex}`}
            role="tabpanel"
            aria-labelledby={`value-tab-${activeIndex}`}
            className="relative mx-auto max-w-4xl"
            style={{ animation: 'valueReveal 0.4s ease-out forwards' }}
          >
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className={`grid grid-cols-1 md:grid-cols-[auto_1fr] gap-0`}>

                {/* Large letter display */}
                <div className="flex items-center justify-center bg-brand/20 border-b md:border-b-0 md:border-e border-white/10 px-10 py-8 md:py-12">
                  <div className="relative">
                    {/* Glow */}
                    <div className="absolute inset-0 blur-2xl bg-brand-light/30 rounded-full scale-150" />
                    <span className="relative font-serif font-bold text-[6rem] md:text-[8rem] text-white leading-none drop-shadow-lg select-none">
                      {active.letter}
                    </span>
                  </div>
                </div>

                {/* Value content */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  {/* Index & letter */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-bold text-brand-light/60 tabular-nums">
                      {String(activeIndex + 1).padStart(2, '0')} / {SALAMATEK_VALUES.length}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  {/* Value name */}
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2 leading-tight">
                    {isRtl ? active.valueAr : active.valueEn}
                  </h3>
                  {/* Arabic sub for EN, or English sub for AR */}
                  <p className="text-brand-light text-sm font-medium mb-6 tracking-wide">
                    {isRtl ? active.valueEn : active.valueAr}
                  </p>

                  {/* Description */}
                  <p className="text-white/60 text-base leading-relaxed mb-8">
                    {isRtl ? active.descAr : active.descEn}
                  </p>

                  {/* Navigation buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveIndex((i) => (i - 1 + SALAMATEK_VALUES.length) % SALAMATEK_VALUES.length)}
                      className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-200 cursor-pointer"
                      aria-label={isRtl ? 'القيمة السابقة' : 'Previous value'}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setActiveIndex((i) => (i + 1) % SALAMATEK_VALUES.length)}
                      className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-200 cursor-pointer"
                      aria-label={isRtl ? 'القيمة التالية' : 'Next value'}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
                      </svg>
                    </button>

                    {/* Progress dots */}
                    <div className="flex items-center gap-1.5 ms-2">
                      {SALAMATEK_VALUES.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveIndex(i)}
                          className={`transition-all duration-300 rounded-full cursor-pointer ${
                            activeIndex === i
                              ? 'w-5 h-1.5 bg-brand-light'
                              : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                          }`}
                          aria-label={`Go to value ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: all 9 values summary grid */}
        <div className={`mt-12 md:mt-16 ${isVisible ? 'animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500' : 'opacity-0'}`}>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2">
            {SALAMATEK_VALUES.map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`
                  group flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer transition-all duration-200
                  ${activeIndex === i
                    ? 'bg-brand/30 border border-brand-light/30'
                    : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-white/10'
                  }
                `}
              >
                <span className={`font-serif font-bold text-lg transition-colors ${activeIndex === i ? 'text-brand-light' : 'text-white/50 group-hover:text-white/80'}`}>
                  {item.letter}
                </span>
                <span className={`text-[9px] font-semibold uppercase tracking-wide leading-tight text-center transition-colors line-clamp-2 ${activeIndex === i ? 'text-white/80' : 'text-white/25 group-hover:text-white/50'}`}>
                  {isRtl ? item.valueAr : item.valueEn}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes valueReveal {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      ` }} />
    </section>
  );
}
