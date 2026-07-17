'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { useLiveData } from '@/lib/use-live-data';
import { getFallbackLotissements } from '@/lib/live-data';

export default function LotissementsPage() {
  // جلب البيانات الحيّة من GitHub — تظهر التغييرات فوراً بدون بناء
  const { data: liveData } = useLiveData();
  const lotissements = liveData.lotissements || getFallbackLotissements();

  return (
    <>
      <Header />

      <main id="main-content">

      <section className="pt-32 pb-12 px-4 sm:px-6 bg-noir-50/30 border-b border-gold">
        <div className="max-w-7xl mx-auto text-center">
          <Reveal>
            <span className="text-or/60 text-xs tracking-[0.4em] font-light">PROJETS</span>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="text-creme">التجزئات</span> <span className="text-gold">الفاخرة</span>
            </h1>
            <div className="gold-divider w-32 mx-auto mt-4" />
          </Reveal>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lotissements.map((lot, i) => (
            <Reveal key={lot.id || lot.slug} delay={i * 100}>
              <Link href={`/lotissements/${lot.slug}`} className="glass-card rounded-2xl overflow-hidden group block">
                <div className="relative h-64 overflow-hidden">
                  <img src={lot.image} alt={lot.title} className="w-full h-full object-cover luxury-image" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <span className="text-or-clair text-xs">{lot.city}</span>
                    <h3 className="text-creme font-bold text-lg group-hover:text-gold transition-colors">{lot.title}</h3>
                    <p className="text-creme/60 text-xs mt-1 line-clamp-2">{lot.description}</p>
                  </div>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {(lot.features || []).map((f, j) => (
                    <span key={j} className="badge-gold px-2.5 py-1 rounded-full text-[10px]">{f}</span>
                  ))}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      </main>

      <Footer />
    </>
  );
}
