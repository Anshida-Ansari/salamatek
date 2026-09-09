import React from 'react';
import HealthPackageForm from '@/components/admin/HealthPackageForm';

export default function EditHealthPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Health Package</h1>
        <p className="text-sm text-gray-500 mt-1">Update package details, pricing, and active status.</p>
      </div>
      <HealthPackageForm packageId={id} />
    </div>
  );
}
