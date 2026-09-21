import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';

type Props = {
  locale: Locale;
  t: Translations;
};

const VALUES = [
  { letter: 'S', en: 'Service',        ar: 'الخدمة'          },
  { letter: 'A', en: 'Accountability', ar: 'المسئولية'        },
  { letter: 'L', en: 'Loyalty',        ar: 'الاخلاص'          },
  { letter: 'A', en: 'Accuracy',       ar: 'الدقة'            },
  { letter: 'M', en: 'Motivation',     ar: 'التحفيز'          },
  { letter: 'A', en: 'Awareness',      ar: 'الوعي'            },
  { letter: 'T', en: 'Team Work',      ar: 'العمل الجماعي'   },
  { letter: 'E', en: 'Efficiency',     ar: 'الكفاءة'          },
  { letter: 'K', en: 'Knowledge',      ar: 'المعرفة'           },
];

export function CoreValuesSection({ locale }: Props) {
  const isRtl = locale === 'ar';

  return (
    <section
      className="bg-brand-dark py-16 md:py-24 overflow-hidden"
      aria-labelledby="core-values-heading"
      id="core-values"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(45,158,114,0.12) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Centered heading ───────────────────────────────────── */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-light mb-3">
            {isRtl ? 'سلامتك' : 'Salamatek'}
          </p>
          <h2
            id="core-values-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight"
          >
            {isRtl ? 'القيم الجوهرية' : 'Core Values'}
          </h2>
        </div>

        {/* ── Horizontal SALAMATEK row ────────────────────────────── */}
        {/*
          On large screens: 9 equal columns side-by-side.
          On small/medium screens: horizontal scroll so all 9 remain in one row.
        */}
        <div
          className="overflow-x-auto -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 no-scrollbar"
          role="list"
          aria-label={isRtl ? 'قيم سلامتك' : 'SALAMATEK core values'}
        >
          <div className="flex min-w-max lg:min-w-0 lg:grid lg:grid-cols-9 border border-white/[0.08] rounded-2xl overflow-hidden">
            {VALUES.map((item, i) => (
              <div
                key={i}
                role="listitem"
                className={`
                  flex flex-col items-center text-center px-4 py-8 md:py-10
                  w-32 sm:w-36 lg:w-auto
                  ${i < VALUES.length - 1 ? 'border-e border-white/[0.08]' : ''}
                  group hover:bg-white/[0.04] transition-colors duration-200
                `}
              >
                {/* Large letter */}
                <span className="font-serif font-bold text-4xl md:text-5xl text-white leading-none mb-5 group-hover:text-brand-light transition-colors duration-200">
                  {item.letter}
                </span>

                {/* Connector line */}
                <div className="w-px h-8 bg-gradient-to-b from-brand-light/40 to-transparent mb-5" aria-hidden="true" />

                {/* English value name */}
                <p className="text-xs md:text-sm font-semibold text-white leading-snug mb-1.5 px-1">
                  {isRtl ? item.ar : item.en}
                </p>

                {/* Arabic / secondary name */}
                <p className="text-[10px] md:text-xs text-white/40 leading-snug px-1">
                  {isRtl ? item.en : item.ar}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
