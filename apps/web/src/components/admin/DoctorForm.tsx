'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import { Loader2, ChevronLeft, Languages } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { translateText } from '@/lib/admin/translate';

interface Department {
  _id: string;
  name: { en: string };
}

interface FormState {
  nameEn: string;
  nameAr: string;
  slug: string;
  designationEn: string;
  designationAr: string;
  departmentId: string;
  specializationEn: string;
  specializationAr: string;
  qualificationEn: string;
  qualificationAr: string;
  experienceYears: string;
  languagesEn: string;
  languagesAr: string;
  bioEn: string;
  bioAr: string;
  image: string;
  active: boolean;
}

const emptyForm: FormState = {
  nameEn: '',
  nameAr: '',
  slug: '',
  designationEn: '',
  designationAr: '',
  departmentId: '',
  specializationEn: '',
  specializationAr: '',
  qualificationEn: '',
  qualificationAr: '',
  experienceYears: '',
  languagesEn: '',
  languagesAr: '',
  bioEn: '',
  bioAr: '',
  image: '',
  active: true,
};

export default function DoctorForm({ doctorId }: { doctorId?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!doctorId);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<FormState>(emptyForm);

  useEffect(() => {
    async function loadData() {
      try {
        const depsRes = await fetchApi('/api/departments?limit=100&active=true');
        setDepartments(depsRes.data ?? []);

        if (doctorId) {
          const docRes = await fetchApi(`/api/doctors/${doctorId}`);
          const d = docRes.data;
          setFormData({
            nameEn: d.name?.en ?? '',
            nameAr: d.name?.ar ?? '',
            slug: d.slug ?? '',
            designationEn: d.designation?.en ?? '',
            designationAr: d.designation?.ar ?? '',
            departmentId: d.departmentId?._id ?? d.departmentId ?? '',
            specializationEn: d.specialization?.en ?? '',
            specializationAr: d.specialization?.ar ?? '',
            qualificationEn: d.qualification?.en ?? '',
            qualificationAr: d.qualification?.ar ?? '',
            experienceYears: d.experienceYears?.toString() ?? '',
            languagesEn: d.languages?.en?.join(', ') ?? '',
            languagesAr: d.languages?.ar?.join(', ') ?? '',
            bioEn: d.bio?.en ?? '',
            bioAr: d.bio?.ar ?? '',
            image: d.image ?? '',
            active: d.active !== false,
          });
        }
      } catch {
        toast('Failed to load form data. Please refresh.', 'error');
      } finally {
        setIsFetching(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const [nameAr, designationAr, specializationAr, qualificationAr, bioAr, languagesAr] = await Promise.all([
        translateText(formData.nameEn),
        translateText(formData.designationEn),
        translateText(formData.specializationEn),
        translateText(formData.qualificationEn),
        translateText(formData.bioEn),
        translateText(formData.languagesEn)
      ]);

      setFormData(prev => ({
        ...prev,
        nameAr,
        designationAr,
        specializationAr,
        qualificationAr,
        bioAr,
        languagesAr
      }));
      toast('Translation completed successfully.', 'success');
    } catch (error) {
      toast('Failed to translate text.', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name: { en: formData.nameEn, ar: formData.nameAr },
      slug:
        formData.slug ||
        formData.nameEn
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      designation: { en: formData.designationEn, ar: formData.designationAr },
      departmentId: formData.departmentId || undefined,
      specialization: { en: formData.specializationEn, ar: formData.specializationAr },
      qualification: { en: formData.qualificationEn, ar: formData.qualificationAr },
      experienceYears: formData.experienceYears ? Number(formData.experienceYears) : undefined,
      languages: {
        en: formData.languagesEn
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        ar: formData.languagesAr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      },
      bio: { en: formData.bioEn, ar: formData.bioAr },
      image: formData.image || undefined,
      active: formData.active,
    };

    try {
      if (doctorId) {
        await fetchApi(`/api/doctors/${doctorId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        toast('Doctor updated successfully.', 'success');
      } else {
        await fetchApi('/api/doctors', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast('Doctor added successfully.', 'success');
      }
      router.push('/dashboard/doctors');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save doctor.';
      toast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-500">Loading doctor data...</span>
      </div>
    );
  }

  const inputClass =
    'block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';
  const sectionClass = 'bg-white rounded-xl border border-gray-200 p-6 space-y-5';

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleTranslate}
          disabled={isTranslating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 text-sm font-semibold rounded-lg transition"
        >
          {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
          Auto-Translate to Arabic
        </button>
      </div>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className={sectionClass}>
        <div className="flex items-center gap-3 pb-1 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
          <span className="text-xs text-red-500 font-medium">* Required</span>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              English Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              placeholder="e.g. Dr. Ahmed Al-Rashidi"
              className={inputClass}
            />
          </div>
          <div>
            <label className={`${labelClass} text-right`} dir="rtl">
              الاسم بالعربية <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="nameAr"
              value={formData.nameAr}
              onChange={handleChange}
              dir="rtl"
              placeholder="د. أحمد الرشيدي"
              className={`${inputClass} text-right`}
            />
          </div>

          <div>
            <label className={labelClass}>Department <span className="text-red-500">*</span></label>
            <select
              required
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">— Select Department —</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.name?.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Slug{' '}
              <span className="text-xs font-normal text-gray-400">(auto-generated if empty)</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g. ahmed-al-rashidi"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Professional Details */}
      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Professional Details</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>English Designation</label>
            <input
              type="text"
              name="designationEn"
              value={formData.designationEn}
              onChange={handleChange}
              placeholder="e.g. Consultant Cardiologist"
              className={inputClass}
            />
          </div>
          <div>
            <label className={`${labelClass} text-right`} dir="rtl">التخصص بالعربية</label>
            <input
              type="text"
              name="designationAr"
              value={formData.designationAr}
              onChange={handleChange}
              dir="rtl"
              placeholder="استشاري القلب"
              className={`${inputClass} text-right`}
            />
          </div>

          <div>
            <label className={labelClass}>English Specialization</label>
            <input
              type="text"
              name="specializationEn"
              value={formData.specializationEn}
              onChange={handleChange}
              placeholder="e.g. Interventional Cardiology"
              className={inputClass}
            />
          </div>
          <div>
            <label className={`${labelClass} text-right`} dir="rtl">التخصص الدقيق بالعربية</label>
            <input
              type="text"
              name="specializationAr"
              value={formData.specializationAr}
              onChange={handleChange}
              dir="rtl"
              className={`${inputClass} text-right`}
            />
          </div>

          <div>
            <label className={labelClass}>English Qualification</label>
            <input
              type="text"
              name="qualificationEn"
              value={formData.qualificationEn}
              onChange={handleChange}
              placeholder="e.g. MBBS, MD, FRCP"
              className={inputClass}
            />
          </div>
          <div>
            <label className={`${labelClass} text-right`} dir="rtl">المؤهلات بالعربية</label>
            <input
              type="text"
              name="qualificationAr"
              value={formData.qualificationAr}
              onChange={handleChange}
              dir="rtl"
              className={`${inputClass} text-right`}
            />
          </div>

          <div>
            <label className={labelClass}>Experience (Years)</label>
            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              min="0"
              max="60"
              placeholder="e.g. 15"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Bio & Languages */}
      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Biography & Languages</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>English Biography</label>
            <textarea
              name="bioEn"
              rows={5}
              value={formData.bioEn}
              onChange={handleChange}
              placeholder="Write a professional biography..."
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={`${labelClass} text-right`} dir="rtl">السيرة الذاتية بالعربية</label>
            <textarea
              name="bioAr"
              rows={5}
              value={formData.bioAr}
              onChange={handleChange}
              dir="rtl"
              className={`${inputClass} resize-none text-right`}
            />
          </div>

          <div>
            <label className={labelClass}>
              Languages (English){' '}
              <span className="text-xs font-normal text-gray-400">comma separated</span>
            </label>
            <input
              type="text"
              name="languagesEn"
              value={formData.languagesEn}
              onChange={handleChange}
              placeholder="Arabic, English, French"
              className={inputClass}
            />
          </div>
          <div>
            <label className={`${labelClass} text-right`} dir="rtl">
              اللغات (عربي)
            </label>
            <input
              type="text"
              name="languagesAr"
              value={formData.languagesAr}
              onChange={handleChange}
              dir="rtl"
              placeholder="العربية، الإنجليزية"
              className={`${inputClass} text-right`}
            />
          </div>
        </div>
      </div>

      {/* Media & Settings */}
      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Media & Settings</h3>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Doctor Photo</label>
            <ImageUpload 
              value={formData.image} 
              onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} 
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Enter an image URL. Cloud storage integration (Cloudinary/S3) will be added in a later phase.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="active"
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <label htmlFor="active" className="text-sm font-semibold text-gray-700 cursor-pointer">
                Active
              </label>
              <p className="text-xs text-gray-400">
                When active, this doctor is visible on the public website.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.push('/dashboard/doctors')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition shadow-sm"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? 'Saving...' : doctorId ? 'Update Doctor' : 'Add Doctor'}
        </button>
      </div>
    </form>
    </div>
  );
}
