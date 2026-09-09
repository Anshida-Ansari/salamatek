import React from 'react';
import NewsForm from '@/components/admin/NewsForm';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
        <p className="text-sm text-gray-500 mt-1">Update article content, status, and media.</p>
      </div>
      <NewsForm articleId={id} />
    </div>
  );
}
