import HealthPackageForm from '@/components/admin/HealthPackageForm';

export default function NewHealthPackagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Health Package</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new healthcare package or medical offer.</p>
      </div>
      <HealthPackageForm />
    </div>
  );
}
