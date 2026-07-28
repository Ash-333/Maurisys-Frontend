import { useRef, useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../services/api';

/**
 * Reusable image uploader backed by Cloudinary.
 * Uploads the file to the backend (/api/upload), which streams it to
 * Cloudinary, and hands the resulting secure URL back via onChange.
 *
 * Props:
 *  - value: current image URL (string)
 *  - onChange: (url) => void
 *  - folder: cloudinary subfolder, e.g. "products"
 *  - label: field label
 */
const ImageUpload = ({ value, onChange, folder = 'uploads', label = 'Image' }) => {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be under 5MB');
            return;
        }

        setUploading(true);
        try {
            const { data } = await uploadImage(file, folder);
            onChange(data.data.url);
            toast.success('Image uploaded');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>

            {value ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200 group">
                    <img src={value} alt="Preview" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute top-2 right-2 bg-white/90 text-slate-700 p-1.5 rounded-full hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs py-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Replace image
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-40 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors disabled:opacity-60"
                >
                    {uploading ? (
                        <>
                            <Loader2 size={22} className="animate-spin" />
                            <span className="text-xs font-medium">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <UploadCloud size={22} />
                            <span className="text-xs font-medium">Click to upload an image</span>
                            <span className="text-[11px] text-slate-400">PNG, JPG up to 5MB</span>
                        </>
                    )}
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />
        </div>
    );
};

export default ImageUpload;
