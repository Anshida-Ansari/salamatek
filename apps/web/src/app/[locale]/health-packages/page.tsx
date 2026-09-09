import { Metadata } from 'next';
import Image from 'next/image';
import { Package, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Health Packages & Offers | Salamatek Medical Center',
  description: 'Explore our comprehensive health screening packages and medical offers tailored for your wellbeing.',
};

async function getHealthPackages() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/health-packages?active=true&limit=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HealthPackagesPage({ params }: Props) {
  const { locale } = await params;
  const isRtl = locale === 'ar';
  const packages = await getHealthPackages();

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-24" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-4">
            {isRtl ? 'باقات وعروض' : 'Packages & Offers'}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {isRtl ? 'باقات الرعاية الصحية الشاملة' : 'Comprehensive Health Packages'}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {isRtl 
              ? 'اختر من بين باقات الفحص الطبي المتنوعة لدينا المصممة لضمان صحتك ورفاهيتك بأفضل الأسعار.' 
              : 'Choose from our variety of medical screening packages designed to ensure your health and wellbeing at the best value.'}
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {isRtl ? 'لا توجد باقات متاحة حالياً' : 'No packages currently available'}
            </h3>
            <p className="text-gray-500">
              {isRtl ? 'يرجى التحقق مرة أخرى لاحقاً للحصول على العروض الجديدة.' : 'Please check back later for new offers and packages.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg: any) => (
              <div key={pkg._id} className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden flex flex-col border border-gray-100 transition-transform hover:-translate-y-1">
                {pkg.image ? (
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image src={pkg.image} alt={pkg.title[locale] || pkg.title.en} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-blue-600/5 flex items-center justify-center">
                    <Package className="w-12 h-12 text-blue-300" />
                  </div>
                )}
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{pkg.title[locale] || pkg.title.en}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {pkg.description[locale] || pkg.description.en}
                    </p>

                    {pkg.includedItems?.[locale]?.length > 0 && (
                      <div className="space-y-3 mb-8">
                        <p className="font-semibold text-gray-900 text-sm">{isRtl ? 'يشمل:' : 'Includes:'}</p>
                        <ul className="space-y-2">
                          {pkg.includedItems[locale].map((item: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{isRtl ? 'السعر' : 'Price'}</p>
                        <p className="text-2xl font-bold text-blue-600">{pkg.price || (isRtl ? 'اتصل بنا' : 'Contact Us')}</p>
                      </div>
                      {pkg.validity?.[locale] && (
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-medium">{isRtl ? 'الصلاحية' : 'Validity'}</p>
                          <p className="text-sm font-semibold text-gray-700">{pkg.validity[locale]}</p>
                        </div>
                      )}
                    </div>

                    <a 
                      href="https://wa.me/966553504004" 
                      target="_blank" 
                      rel="noreferrer"
                      className="block w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-center rounded-xl transition"
                    >
                      {isRtl ? 'احجز الآن' : 'Book Now'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
