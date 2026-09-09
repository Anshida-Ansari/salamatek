import DoctorForm from '@/components/admin/DoctorForm';

export const metadata = {
  title: 'Edit Doctor',
};

export default async function EditDoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Doctor</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Update the doctor&apos;s profile details.
        </p>
      </div>
      <DoctorForm doctorId={id} />
    </div>
  );
}
