import NewsForm from '@/components/admin/NewsForm';

export default function NewArticlePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Article</h1>
        <p className="text-sm text-gray-500 mt-1">Publish news or a blog post to the website.</p>
      </div>
      <NewsForm />
    </div>
  );
}
