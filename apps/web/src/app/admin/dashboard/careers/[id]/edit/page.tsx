import React from 'react';
import CareerForm from '@/components/admin/CareerForm';

export default function EditCareerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Job Vacancy</h1>
        <p className="text-sm text-gray-500 mt-1">Update job details, requirements, and active status.</p>
      </div>
      <CareerForm careerId={id} />
    </div>
  );
}
