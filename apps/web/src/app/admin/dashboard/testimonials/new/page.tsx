import TestimonialForm from '@/components/admin/TestimonialForm';

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">
          Add Testimonial
        </h1>
        <p className="text-sm text-text-muted mt-1">Create a new patient review to display on the public website.</p>
      </div>
      <TestimonialForm />
    </div>
  );
}
