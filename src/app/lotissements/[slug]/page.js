'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { useLiveData } from '@/lib/use-live-data';
import { getFallbackLotissements } from '@/lib/live-data';

export default function LotissementDetailPage({ params }) {
  const { slug } = params;
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);

  // جلب البيانات الحيّة من GitHub — تظهر التغييرات فوراً بدون بناء
  const { data: liveData } = useLiveData();
  const lotissements = liveData.lotissements || getFallbackLotissements();

  useEffect(() => {
    const found = lotissements.find((l) => l.slug === slug);
    setLot(found || null);
    setLoading(false);
  }, [slug, lotissements]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <p className="text-creme/50">جارٍ التحميل...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!lot) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-3xl text-creme mb-4">التجزئة غير موجودة</h1>
            <Link href="/lotissements" className="btn-gold px-6 py-3 rounded-full">العودة للتجزئات</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="relative h-[50vh] min-h-[350px] pt-16">
        <img src={lot.image} alt={lot.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/60 to-noir/30" />
        <div className="relative h-full flex items-end pb-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto w-full">
            <Link href="/lotissements" className="text-or-clair hover:text-creme text-sm mb-4 inline-flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M5 12h14M12 19l7-7-7-7" /></svg>
              العودة للتجزئات
            </Link>
            <span className="text-or-clair text-xs">{lot.city}</span>
            <h1 className="text-3xl sm:text-5xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="text-gold">{lot.title}</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-creme/70 text-base leading-relaxed mb-8">{lot.description}</p>
            <div className="flex flex-wrap gap-3 mb-8">
              {(lot.features || []).map((f, i) => (
                <span key={i} className="badge-gold px-4 py-2 rounded-full text-sm">{f}</span>
              ))}
            </div>
            <Link href="/properties" className="btn-gold px-8 py-3 rounded-full text-sm inline-block">
              عقارات في هذه التجزئة
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
