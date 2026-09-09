import DepartmentForm from '@/components/admin/DepartmentForm';

export const metadata = {
  title: 'Edit Department',
};

export default async function EditDepartmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Department</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Update department information.
        </p>
      </div>
      <DepartmentForm departmentId={id} />
    </div>
  );
}
