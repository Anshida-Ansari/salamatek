import ServiceForm from '@/components/admin/ServiceForm';

export const metadata = {
  title: 'Edit Service',
};

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Update service details.
        </p>
      </div>
      <ServiceForm serviceId={id} />
    </div>
  );
}
