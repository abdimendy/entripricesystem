import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCamera, FaSpinner } from 'react-icons/fa';
import { uploadApi } from '../api/uploadApi';
import { resolveImageUrl } from '../utils/images';

export default function ImageUpload({ value, onChange, name = 'Business' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [cloudinaryReady, setCloudinaryReady] = useState(null);

  useEffect(() => {
    uploadApi
      .status()
      .then(({ data }) => setCloudinaryReady(!!data.cloudinary))
      .catch(() => setCloudinaryReady(false));
  }, []);

  const preview = resolveImageUrl(value, name);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }

    setUploading(true);
    try {
      const { data } = await uploadApi.uploadBusinessImage(file);
      onChange(data.url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Upload failed — sign in as admin first');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 dark:border-amber-600/50 dark:bg-slate-800">
        <img src={preview} alt="" className="h-full w-full object-cover" />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
            <FaSpinner className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="btn-secondary mx-auto w-full max-w-xs justify-center"
      >
        <FaCamera /> {uploading ? 'Uploading...' : 'Upload business photo'}
      </button>
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        {cloudinaryReady === true && (
          <span className="mb-1 block font-semibold text-emerald-600 dark:text-emerald-400">
            Cloudinary connected — uploads go to your account
          </span>
        )}
        {cloudinaryReady === false && (
          <span className="mb-1 block text-amber-600 dark:text-amber-400">
            Local storage — run .\scripts\setup-cloudinary.ps1 for Cloudinary
          </span>
        )}
        Or paste image URL below (JPG, PNG, max 5MB)
      </p>
    </div>
  );
}
