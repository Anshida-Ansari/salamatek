import DepartmentForm from '@/components/admin/DepartmentForm';

export const metadata = {
  title: 'Add Department',
};

export default function NewDepartmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Department</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Enter department details in both English and Arabic.
        </p>
      </div>
      <DepartmentForm />
    </div>
  );
}
