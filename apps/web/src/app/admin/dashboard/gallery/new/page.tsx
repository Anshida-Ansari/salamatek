import GalleryImageForm from '@/components/admin/GalleryImageForm';

export const metadata = {
  title: 'Add Gallery Image | Admin',
};

export default function NewGalleryImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">Add New Image</h1>
        <p className="text-sm text-text-muted mt-1">Upload a new image to the public gallery.</p>
      </div>
      <GalleryImageForm />
    </div>
  );
}
