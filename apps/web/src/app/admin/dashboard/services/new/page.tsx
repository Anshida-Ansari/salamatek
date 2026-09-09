import ServiceForm from '@/components/admin/ServiceForm';

export const metadata = {
  title: 'Add Service',
};

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Service</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Enter service details in both English and Arabic.
        </p>
      </div>
      <ServiceForm />
    </div>
  );
}
