'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import { Building2, Stethoscope, Briefcase, Ambulance, ShieldCheck, HeartPulse, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function SarcPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const isRtl = locale === 'ar';

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    serviceRequired: 'On-site Clinic',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/sarc-enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit enquiry');
      setIsSuccess(true);
      setFormData({ companyName: '', contactPerson: '', email: '', phone: '', serviceRequired: 'On-site Clinic', message: '' });
    } catch (err) {
      setError('An error occurred while sending your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const services = [
    {
      title: isRtl ? 'أطباء' : 'Doctors',
      desc: isRtl ? 'أطباء مؤهلون يقدمون الرعاية الطبية والعلاج في الموقع للإصابات والأمراض المرتبطة بالعمل.' : 'Qualified physicians providing on-site medical care and treatment for work related injuries and illnesses.',
      icon: Stethoscope,
    },
    {
      title: isRtl ? 'ممرضون' : 'Nurses',
      desc: isRtl ? 'ممرضون مسجلون يدعمون العيادات في الموقع برعاية المرضى والمراقبة والاستجابة للطوارئ.' : 'Registered nurses supporting on-site clinics with patient care, monitoring, and emergency response.',
      icon: HeartPulse,
    },
    {
      title: isRtl ? 'مسعفون' : 'Paramedics',
      desc: isRtl ? 'مسعفون مدربون يقدمون الإسعافات الأولية الفورية والاستجابة الطبية الطارئة في مواقع العمل.' : 'Trained paramedics providing immediate first aid and emergency medical response at work sites.',
      icon: ShieldCheck,
    },
    {
      title: isRtl ? 'دعم سيارات الإسعاف' : 'Ambulance Support',
      desc: isRtl ? 'سيارات إسعاف متاحة للإيجار (قصير أو طويل الأمد) في جميع أنحاء المملكة، مع مسعفين وسائقين مؤهلين ومعدات الإسعافات الأولية للطوارئ.' : 'Ambulances provided on a rental basis (short-term or long-term) across the Kingdom, with qualified medics, drivers, and emergency first aid equipment.',
      icon: Ambulance,
    },
    {
      title: isRtl ? 'الدعم الطبي في الموقع' : 'On-site Medical Support',
      desc: isRtl ? 'عيادات طبية عن بعد يتم إعدادها في مواقع العمل مزودة بالمعدات الطبية الأساسية، وتقدم العلاج الفوري للإصابات والأمراض الطفيفة لتقليل الإحالات الخارجية.' : 'Remote medical clinics set up at work sites with essential medical equipment, providing immediate treatment for injuries and minor illnesses to minimize external referrals.',
      icon: MapPin,
    },
    {
      title: isRtl ? 'حلول القوى العاملة' : 'Workforce/Staffing Solutions',
      desc: isRtl ? 'طاقم طبي مؤهل (أطباء، مسعفون، ممرضون مسجلون) مصمم خصيصاً لتلبية احتياجات الرعاية الصحية لشركات العملاء في مواقع العمل.' : 'Qualified medical staffing (physicians, paramedics, registered nurses) tailored to client companies\' work-site healthcare needs.',
      icon: Briefcase,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative bg-[#8E2829] text-white overflow-hidden py-24 lg:py-32 mt-20">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/sarc-hero.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#8E2829] via-[#8E2829]/90 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/90 font-medium text-sm tracking-wider mb-6 border border-white/20 uppercase">
              {isRtl ? 'سارك' : 'SARC'}
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              {isRtl ? 'حلول الرعاية الصحية في مواقع العمل' : 'Work Site Healthcare Solutions'}
            </h1>
            <p className="text-lg lg:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
              {isRtl 
                ? 'سارك هي قسم من مركز سلامتك الطبي. في سارك، نقوم بتبسيط خدمات الرعاية الصحية في مواقع العمل بأحدث الأدوات واللوازم الطبية من خلال أطباء وممرضين ومسعفين مؤهلين وغيرهم من أعضاء الفريق الطبي ذوي الكفاءة العالية لتوفير بيئة رعاية صحية طبية فعالة في مواقع العمل تلبي احتياجات الشركات.' 
                : 'SARC is the division of Salamatek Medical Center. At SARC, we simplify healthcare services at work sites with the latest medical tools and supplies through qualified doctors, nurses, paramedical staff, and other high-quality medical team members providing an effective medical healthcare environment at work sites that meets the needs of our client companies.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#proposal" className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#8E2829] font-bold rounded-lg hover:bg-slate-100 transition shadow-lg">
                {isRtl ? 'طلب عرض سعر' : 'Request a Proposal'}
              </a>
              <a href="#services" className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 border border-white/20 transition">
                {isRtl ? 'استكشف خدماتنا' : 'Explore Services'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Overview & Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {isRtl ? 'العملية / سير العمل' : 'Process / Workflow'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {isRtl 
                  ? 'تقوم سارك بإعداد عيادات طبية عن بعد في مواقع العمل وفقاً لاحتياجات العملاء، باستخدام أحدث المعدات الطبية واللوازم المناسبة. يدير فريقنا الطبي المؤهل والمتخصص العيادات بالكامل، ويقدم رعاية طبية متخصصة وفقاً للمعايير الدولية.'
                  : 'SARC sets up remote medical clinics at work sites according to client needs, using the latest appropriate medical equipment and supplies. Our qualified and specialized medical team fully manages and operates the clinics, providing specialized medical care according to international standards.'}
              </p>
              
              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#8E2829]/10 flex items-center justify-center flex-shrink-0 text-[#8E2829] font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{isRtl ? 'الخدمات في الموقع' : 'On-Site Services'}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {isRtl 
                        ? 'تُحضر عياداتنا في الموقع الخبرة الطبية مباشرة إلى موقع البناء. مزودة بالمعدات الطبية الأساسية وطاقم من المحترفين ذوي الخبرة، توفر عياداتنا علاجاً فورياً للإصابات والأمراض الطفيفة، مما يقلل الحاجة إلى الإحالات الخارجية.'
                        : 'Our on-site clinics bring medical expertise directly to the construction site. Equipped with essential medical equipment and staffed by experienced professionals, our clinics provide immediate treatment for injuries and minor illnesses, minimizing the need for external referrals.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#8E2829]/10 flex items-center justify-center flex-shrink-0 text-[#8E2829] font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{isRtl ? 'الخدمات الطبية المتنقلة' : 'Mobile Medical Services'}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {isRtl 
                        ? 'بالإضافة إلى العيادات في الموقع، تقدم سارك خدمات طبية متنقلة للمشاريع التي تتطلب مرونة وتكيفاً. وحداتنا المتنقلة مجهزة لتقديم الخدمات الطبية الأساسية أينما كان موقع البناء.'
                        : 'In addition to on-site clinics, SARC offers mobile medical services for projects that require flexibility and adaptability. Our mobile units are equipped to provide essential medical services wherever the construction site is located.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#8E2829]/10 flex items-center justify-center flex-shrink-0 text-[#8E2829] font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{isRtl ? 'رعاية متابعة فعالة وإدارة الحالات' : 'Efficient Follow-Up Care & Case Management'}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {isRtl 
                        ? 'في حالة حدوث إصابة تتطلب دخول المستشفى أو فترة نقاهة، يدير فريق الرعاية الصحية لدينا الرعاية من خلال العمل عن كثب مع الطاقم الطبي خارج الموقع والموظف المصاب، لضمان توفير العلاج المناسب وجدولة مواعيد المتابعة وحضورها.'
                        : 'In the event of an injury requiring hospitalization or recuperation, our healthcare team manages the care by working closely with off-site medical staff and the injured employee, ensuring appropriate treatment is provided and follow up appointments are scheduled and attended.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#8E2829]/10 flex items-center justify-center flex-shrink-0 text-[#8E2829] font-bold">4</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{isRtl ? 'خدمة الإسعاف' : 'Ambulance Service'}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {isRtl 
                        ? 'توفر سارك سيارات إسعاف على أساس التأجير للشركات في جميع أنحاء المملكة، وتقدم حلولاً مصممة خصيصاً تشمل مسعفين مؤهلين وسائقين ومعدات الإسعافات الأولية للطوارئ سواء للتأجير قصير الأمد أو مركبات مخصصة طويلة الأمد.'
                        : 'SARC provides ambulances on a rental basis to companies across the Kingdom, offering tailor-made solutions including qualified medics, drivers, and emergency first-aid equipment whether short-term hire or long-term dedicated vehicles.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop" alt="Industrial Healthcare" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{isRtl ? 'خدماتنا الشاملة للشركات' : 'Comprehensive Corporate Services'}</h2>
            <p className="text-gray-600">
              {isRtl ? 'طاقم طبي وحلول عيادات مصممة لضمان سلامة وصحة القوى العاملة لديك.' : 'Medical staffing and clinic solutions tailored to ensure the safety and health of your workforce.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="w-14 h-14 rounded-xl bg-[#8E2829]/10 text-[#8E2829] flex items-center justify-center mb-6">
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proposal Form Section */}
      <section id="proposal" className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                {isRtl ? 'اطلب عرض سعر لمشروعك' : 'Request a Proposal for Your Project'}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {isRtl 
                  ? 'سواء كنت بحاجة إلى طاقم طبي مؤقت أو عيادة كاملة في الموقع، املأ النموذج أدناه وسيقوم فريق الخبراء لدينا بالتواصل معك لتقديم حل مخصص.'
                  : 'Whether you need temporary medical staffing or a full on-site clinic, fill out the form below and our corporate team will contact you with a tailored solution.'}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><Building2 className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-white">{isRtl ? 'حلول مخصصة' : 'Tailored Solutions'}</h4>
                    <p className="text-sm">{isRtl ? 'مصممة خصيصاً لحجم مشروعك وموقعك.' : 'Customized for your project size and location.'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><ShieldCheck className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-white">{isRtl ? 'معايير أرامكو' : 'Aramco Standards'}</h4>
                    <p className="text-sm">{isRtl ? 'متوافق تماماً مع متطلبات الصحة المهنية.' : 'Fully compliant with occupational health requirements.'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl text-gray-900">
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isRtl ? 'تم إرسال الطلب بنجاح!' : 'Request Sent Successfully!'}
                  </h3>
                  <p className="text-gray-600">
                    {isRtl 
                      ? 'شكراً لك. سيقوم فريق سارك بمراجعة متطلباتك والتواصل معك قريباً.'
                      : 'Thank you. The SARC team will review your requirements and get in touch with you shortly.'}
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 text-[#8E2829] font-semibold hover:underline"
                  >
                    {isRtl ? 'إرسال طلب آخر' : 'Submit another request'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-2xl font-bold mb-6">{isRtl ? 'تفاصيل الطلب' : 'Enquiry Details'}</h3>
                  
                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'اسم الشركة' : 'Company Name'} *</label>
                      <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E2829] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'الشخص المسؤول' : 'Contact Person'} *</label>
                      <input required type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E2829] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'البريد الإلكتروني' : 'Email Address'} *</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E2829] focus:outline-none" dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'رقم الهاتف' : 'Phone Number'} *</label>
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E2829] focus:outline-none" dir="ltr" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'الخدمة المطلوبة' : 'Service Required'}</label>
                    <select name="serviceRequired" value={formData.serviceRequired} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E2829] focus:outline-none">
                      <option value="On-site Clinic">{isRtl ? 'عيادة في الموقع' : 'On-site Clinic'}</option>
                      <option value="Medical Staffing">{isRtl ? 'طاقم طبي' : 'Medical Staffing'}</option>
                      <option value="Ambulance Support">{isRtl ? 'دعم سيارات الإسعاف' : 'Ambulance Support'}</option>
                      <option value="Other">{isRtl ? 'أخرى' : 'Other'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'رسالة / تفاصيل المشروع' : 'Message / Project Details'}</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E2829] focus:outline-none resize-none"></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#8E2829] hover:bg-[#732021] text-white font-bold rounded-lg transition disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {isLoading ? (isRtl ? 'جاري الإرسال...' : 'Sending...') : (isRtl ? 'إرسال الطلب' : 'Submit Enquiry')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
