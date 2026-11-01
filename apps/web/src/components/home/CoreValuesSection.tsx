import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { cn } from '@/lib/utils';
import {
  HeartHandshake,
  ShieldCheck,
  Award,
  Target,
  Sparkles,
  Eye,
  Users,
  Activity,
  BookOpen,
} from 'lucide-react';

type Props = {
  locale: Locale;
  t?: Translations;
};

interface CoreValueItem {
  letter: string;
  en: string;
  ar: string;
  num: string;
  icon: typeof HeartHandshake;
  colorName: string;
  borderClass: string;
  glowClass: string;
  textAccent: string;
  bgTint: string;
  iconBg: string;
  letterBg: string;
  accentDot: string;
}

const VALUES: CoreValueItem[] = [
  {
    letter: 'S',
    en: 'Service',
    ar: 'الخدمة',
    num: '01',
    icon: HeartHandshake,
    colorName: 'Emerald',
    borderClass: 'border-emerald-500/25 hover:border-emerald-400/70',
    glowClass: 'hover:shadow-[0_16px_40px_rgba(16,185,129,0.22)]',
    textAccent: 'text-emerald-300',
    bgTint: 'from-emerald-950/50 via-emerald-900/15 to-transparent',
    iconBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
    letterBg: 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-[0_4px_16px_rgba(16,185,129,0.4)]',
    accentDot: 'bg-emerald-400',
  },
  {
    letter: 'A',
    en: 'Accountability',
    ar: 'المسئولية',
    num: '02',
    icon: ShieldCheck,
    colorName: 'Sapphire Blue',
    borderClass: 'border-blue-500/25 hover:border-blue-400/70',
    glowClass: 'hover:shadow-[0_16px_40px_rgba(59,130,246,0.22)]',
    textAccent: 'text-blue-300',
    bgTint: 'from-blue-950/50 via-blue-900/15 to-transparent',
    iconBg: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
    letterBg: 'bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-[0_4px_16px_rgba(59,130,246,0.4)]',
    accentDot: 'bg-blue-400',
  },
  {
    letter: 'L',
    en: 'Loyalty',
    ar: 'الاخلاص',
    num: '03',
    icon: Award,
    colorName: 'Warm Gold',
    borderClass: 'border-amber-500/25 hover:border-amber-400/70',
    glowClass: 'hover:shadow-[0_16px_40px_rgba(245,158,11,0.22)]',
    textAccent: 'text-amber-300',
    bgTint: 'from-amber-950/50 via-amber-900/15 to-transparent',
    iconBg: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    letterBg: 'bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-[0_4px_16px_rgba(245,158,11,0.4)]',
    accentDot: 'bg-amber-400',
  },
  {
    letter: 'A',
    en: 'Accuracy',
    ar: 'الدقة',
    num: '04',
    icon: Target,
    colorName: 'Clinical Teal',
    borderClass: 'border-teal-500/25 hover:border-teal-400/70',
    glowClass: 'hover:shadow-[0_16px_40px_rgba(20,184,166,0.22)]',
    textAccent: 'text-teal-300',
    bgTint: 'from-teal-950/50 via-teal-900/15 to-transparent',
    iconBg: 'bg-teal-500/10 text-teal-300 border-teal-500/25',
    letterBg: 'bg-gradient-to-br from-teal-400 to-cyan-600 text-white shadow-[0_4px_16px_rgba(20,184,166,0.4)]',
    accentDot: 'bg-teal-400',
  },
  {
    letter: 'M',
    en: 'Motivation',
    ar: 'التحفيز',
    num: '05',
    icon: Sparkles,
    colorName: 'Vital Crimson',
    borderClass: 'border-rose-500/25 hover:border-rose-400/70',
    glowClass: 'hover:shadow-[0_16px_40px_rgba(244,63,94,0.22)]',
    textAccent: 'text-rose-300',
    bgTint: 'from-rose-950/50 via-rose-900/15 to-transparent',
    iconBg: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
    letterBg: 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.4)]',
    accentDot: 'bg-rose-400',
  },
  {
    letter: 'A',
    en: 'Awareness',
    ar: 'الوعي',
    num: '06',
    icon: Eye,
    colorName: 'Visionary Violet',
    borderClass: 'border-violet-500/25 hover:border-violet-400/70',
    glowClass: 'hover:shadow-[0_16px_40px_rgba(139,92,246,0.22)]',
    textAccent: 'text-violet-300',
    bgTint: 'from-violet-950/50 via-violet-900/15 to-transparent',
    iconBg: 'bg-violet-500/10 text-violet-300 border-violet-500/25',
    letterBg: 'bg-gradient-to-br from-violet-400 to-purple-600 text-white shadow-[0_4px_16px_rgba(139,92,246,0.4)]',
    accentDot: 'bg-violet-400',
  },
  {
    letter: 'T',
    en: 'Team Work',
    ar: 'العمل الجماعي',
    num: '07',
    icon: Users,
    colorName: 'Harmonic Cyan',
    borderClass: 'border-cyan-500/25 hover:border-cyan-400/70',
    glowClass: 'hover:shadow-[0_16px_40px_rgba(6,182,212,0.22)]',
    textAccent: 'text-cyan-300',
    bgTint: 'from-cyan-950/50 via-cyan-900/15 to-transparent',
    iconBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
    letterBg: 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_4px_16px_rgba(6,182,212,0.4)]',
    accentDot: 'bg-cyan-400',
  },
  {
    letter: 'E',
    en: 'Efficiency',
    ar: 'الكفاءة',
    num: '08',
    icon: Activity,
    colorName: 'Dynamic Green',
    borderClass: 'border-green-500/25 hover:border-green-400/70',
    glowClass: 'hover:shadow-[0_16px_40px_rgba(34,197,94,0.22)]',
    textAccent: 'text-green-300',
    bgTint: 'from-green-950/50 via-green-900/15 to-transparent',
    iconBg: 'bg-green-500/10 text-green-300 border-green-500/25',
    letterBg: 'bg-gradient-to-br from-green-400 to-emerald-700 text-white shadow-[0_4px_16px_rgba(34,197,94,0.4)]',
    accentDot: 'bg-green-400',
  },
  {
    letter: 'K',
    en: 'Knowledge',
    ar: 'المعرفة',
    num: '09',
    icon: BookOpen,
    colorName: 'Medical Indigo',
    borderClass: 'border-indigo-500/25 hover:border-indigo-400/70',
    glowClass: 'hover:shadow-[0_16px_40px_rgba(99,102,241,0.22)]',
    textAccent: 'text-indigo-300',
    bgTint: 'from-indigo-950/50 via-indigo-900/15 to-transparent',
    iconBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
    letterBg: 'bg-gradient-to-br from-indigo-400 to-purple-700 text-white shadow-[0_4px_16px_rgba(99,102,241,0.4)]',
    accentDot: 'bg-indigo-400',
  },
];

export function CoreValuesSection({ locale }: Props) {
  const isRtl = locale === 'ar';

  return (
    <section
      className="bg-[#071F17] py-20 md:py-28 overflow-hidden relative"
      aria-labelledby="core-values-heading"
      id="core-values"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ── Ambient Background Lighting ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(45,158,114,0.18) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-emerald-600/[0.04] rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ───────────────────────────────────────── */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-pale text-xs font-semibold tracking-wider uppercase border border-white/15 mb-4 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-brand-light animate-pulse" />
            <span>{isRtl ? 'دستور قيم سلامتك' : 'Salamatek Code of Ethics'}</span>
          </div>

          <h2
            id="core-values-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight"
          >
            {isRtl ? 'القيم الجوهرية' : 'Core Values'}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-brand-pale/85 mt-4 max-w-2xl mx-auto leading-relaxed">
            {isRtl
              ? 'المبادئ التي تجسد التزامنا الراسخ بالتميز في الرعاية الصحية.'
              : 'Guided by our enduring commitment to Excellence in Healthcare.'}
          </p>

          {/* ── Acronym Visual Ribbon (S • A • L • A • M • A • T • E • K) ── */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {VALUES.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-200',
                  'bg-white/[0.06] backdrop-blur-sm hover:scale-105',
                  item.borderClass,
                  'text-white'
                )}
                title={`${item.letter} — ${isRtl ? item.ar : item.en}`}
              >
                <span className={cn('w-2 h-2 rounded-full', item.accentDot)} />
                <span className="font-serif font-black">{item.letter}</span>
                <span className="text-[11px] font-normal text-white/70 hidden sm:inline">
                  {isRtl ? item.ar : item.en}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 9 Vibrant Core Value Cards (3x3 Grid) ─────────────────── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7"
          role="list"
          aria-label={isRtl ? 'قيم سلامتك الجوهرية' : 'SALAMATEK core values'}
        >
          {VALUES.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                role="listitem"
                className={cn(
                  'group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300',
                  'bg-white/[0.04] hover:bg-white/[0.08]',
                  'backdrop-blur-md border shadow-lg',
                  item.borderClass,
                  item.glowClass,
                  'hover:-translate-y-1.5'
                )}
              >
                {/* Ambient tinted background glow on hover */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br',
                    item.bgTint
                  )}
                  aria-hidden="true"
                />

                {/* Top Row: Monogram Letter Badge + Order Number + Icon */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  {/* Jewel-toned Letter Monogram Badge */}
                  <div
                    className={cn(
                      'w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-serif font-black text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110',
                      item.letterBg
                    )}
                  >
                    {item.letter}
                  </div>

                  {/* Right Header: Value Index & Category Icon */}
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-white/35 tracking-widest">
                      {item.num}
                    </span>
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-300',
                        item.iconBg
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Value Content */}
                <div className="relative z-10">
                  {/* Primary Language Title */}
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight leading-snug group-hover:text-white transition-colors">
                    {isRtl ? item.ar : item.en}
                  </h3>

                  {/* Secondary Language Title */}
                  <p
                    className={cn(
                      'text-xs sm:text-sm font-medium mt-1 transition-colors tracking-wide',
                      item.textAccent
                    )}
                  >
                    {isRtl ? item.en : item.ar}
                  </p>

                  {/* Micro Footer Indicator */}
                  <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-widest text-white/40 uppercase">
                      {isRtl ? `المبدأ ${item.num}` : `Principle ${item.num}`}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={cn('w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-125', item.accentDot)} />
                      <span className="text-[10px] font-mono font-semibold text-white/50 group-hover:text-white/80 transition-colors">
                        SALAMATEK
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
