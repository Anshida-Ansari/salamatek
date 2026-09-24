import GalleryImageForm from '@/components/admin/GalleryImageForm';

export const metadata = {
  title: 'Edit Gallery Image | Admin',
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditGalleryImagePage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">Edit Image</h1>
        <p className="text-sm text-text-muted mt-1">Update details or replace the gallery image.</p>
      </div>
      <GalleryImageForm imageId={id} />
    </div>
  );
}
