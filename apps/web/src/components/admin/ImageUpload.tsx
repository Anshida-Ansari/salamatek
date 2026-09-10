'use client';

import { useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export default function ImageUpload({ value, onChange, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError('Cloudinary is not configured. Please add keys to .env.local');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      onChange(data.secure_url);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input value to allow uploading the same file again if needed
      e.target.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {value ? (
        <div className="relative w-full max-w-sm aspect-video bg-gray-50 border border-gray-200 rounded-xl overflow-hidden group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-sm">
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <label className="relative flex flex-col items-center justify-center w-full max-w-sm aspect-video bg-surface-light border-2 border-dashed border-border rounded-2xl hover:bg-surface-mint hover:border-brand-medium transition cursor-pointer overflow-hidden">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center text-brand-medium gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-semibold">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-text-muted gap-2 p-6 text-center">
              <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center mb-1 text-brand-medium">
                <UploadCloud className="w-5 h-5 text-brand-medium" />
              </div>
              <p className="text-sm font-medium">Click to upload an image</p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP up to 5MB</p>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
