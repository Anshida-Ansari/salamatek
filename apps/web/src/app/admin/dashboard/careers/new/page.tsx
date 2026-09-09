import CareerForm from '@/components/admin/CareerForm';

export default function NewCareerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Job Vacancy</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new career opportunity for Salamatek.</p>
      </div>
      <CareerForm />
    </div>
  );
}
