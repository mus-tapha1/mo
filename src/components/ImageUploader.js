'use client';

import { useRef, useState } from 'react';
import { uploadImage } from '@/lib/github-sync';

// ============================================================
//  مكوّن رفع الصور — يدعم الكاميرا والألبوم
//  يقوم بضغط الصور قبل الرفع لتقليل الحجم
//  يرفع الصور إلى public/uploads/ في المستودع عبر GitHub API
// ============================================================

// ضغط الصورة باستخدام Canvas
function compressImage(file, maxWidth = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            const compressed = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressed);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ value, onChange, label = 'الصورة', multiple = false, onMultipleChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const handleFiles = async (files) => {
    setError('');
    const fileArr = Array.from(files);
    if (fileArr.length === 0) return;

    setUploading(true);
    try {
      if (multiple) {
        const urls = [];
        for (let i = 0; i < fileArr.length; i++) {
          setProgress(`رفع الصورة ${i + 1} من ${fileArr.length}...`);
          const compressed = await compressImage(fileArr[i]);
          const url = await uploadImage(compressed, setProgress);
          urls.push(url);
        }
        const current = Array.isArray(value) ? value : [];
        onMultipleChange([...current, ...urls]);
      } else {
        setProgress('جارٍ تحضير الصورة...');
        const compressed = await compressImage(fileArr[0]);
        setProgress('جارٍ رفع الصورة إلى المستودع...');
        const url = await uploadImage(compressed, setProgress);
        onChange(url);
      }
    } catch (err) {
      setError(err.message || 'فشل رفع الصورة');
    } finally {
      setUploading(false);
      setProgress('');
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-creme/60 text-xs mb-1.5">{label}</label>

      {/* معاينة الصورة الحالية */}
      {value && !multiple && (
        <div className="mb-2 relative rounded-lg overflow-hidden" style={{ maxWidth: '200px' }}>
          <img src={value} alt="معاينة" className="w-full h-32 object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 left-1 bg-noir/80 text-red-400 rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-500/20"
          >
            ×
          </button>
        </div>
      )}

      {/* معرض الصور المتعددة */}
      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((url, idx) => (
            <div key={idx} className="relative rounded-lg overflow-hidden" style={{ width: '80px', height: '80px' }}>
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onMultipleChange(value.filter((_, i) => i !== idx))}
                className="absolute top-0 left-0 bg-noir/80 text-red-400 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500/20"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* أزرار الرفع */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-outline-gold px-3 py-2 text-xs disabled:opacity-50"
        >
          {uploading ? '⏳ جارٍ الرفع...' : '📷 رفع صورة'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* حقل الرابط اليدوي (بديل) */}
      {!multiple && (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-2 bg-noir-100 border border-or/20 rounded-lg px-4 py-2.5 text-creme focus:border-or focus:outline-none text-sm"
          placeholder="أو ألصق رابط الصورة: https://..."
        />
      )}

      {progress && (
        <p className="text-or/70 text-xs mt-2">{progress}</p>
      )}
      {error && (
        <p className="text-red-400 text-xs mt-2">⚠ {error}</p>
      )}
    </div>
  );
}
