import DoctorForm from '@/components/admin/DoctorForm';

export const metadata = {
  title: 'Add Doctor',
};

export default function NewDoctorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Doctor</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Fill in the doctor&apos;s details in both English and Arabic.
        </p>
      </div>
      <DoctorForm />
    </div>
  );
}
