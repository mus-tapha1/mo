import Link from 'next/link';
import { config } from '@/config/site';

export const metadata = {
  title: 'الصفحة غير موجودة',
  description: 'عذراً، الصفحة التي تبحث عنها غير موجودة. عد إلى الرئيسية أو تصفّح عقاراتنا.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-lg mx-auto">
        <div
          className="text-gold text-8xl sm:text-9xl font-bold mb-4"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          404
        </div>
        <div className="gold-divider w-24 mx-auto mb-6" />
        <h1 className="text-creme text-2xl sm:text-3xl font-bold mb-4">
          الصفحة غير موجودة
        </h1>
        <p className="text-creme/60 text-sm sm:text-base leading-relaxed mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة إلى الصفحة
          الرئيسية أو تصفّح عقاراتنا المتوفرة في {config.city}.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-gold px-8 py-3.5 rounded-full text-sm inline-flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            الصفحة الرئيسية
          </Link>
          <Link href="/properties" className="btn-outline-gold px-8 py-3.5 rounded-full text-sm">
            تصفّح العقارات
          </Link>
        </div>
      </div>
    </div>
  );
}
