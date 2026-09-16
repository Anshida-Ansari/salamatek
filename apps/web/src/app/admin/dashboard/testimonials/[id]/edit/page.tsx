import TestimonialForm from '@/components/admin/TestimonialForm';

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">
          Edit Testimonial
        </h1>
        <p className="text-sm text-text-muted mt-1">Update testimonial information.</p>
      </div>
      <TestimonialForm testimonialId={id} />
    </div>
  );
}
