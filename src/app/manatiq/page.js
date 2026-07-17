'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { useLiveData } from '@/lib/use-live-data';
import { getFallbackManatiq } from '@/lib/live-data';

export default function ManatiqPage() {
  // جلب البيانات الحيّة من GitHub — تظهر التغييرات فوراً بدون بناء
  const { data: liveData } = useLiveData();
  const manatiq = liveData.manatiq || getFallbackManatiq();

  return (
    <>
      <Header />

      <main id="main-content">

      <section className="pt-32 pb-12 px-4 sm:px-6 bg-noir-50/30 border-b border-gold">
        <div className="max-w-7xl mx-auto text-center">
          <Reveal>
            <span className="text-or/60 text-xs tracking-[0.4em] font-light">ZONES</span>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="text-gold">المناطق</span>
            </h1>
            <div className="gold-divider w-32 mx-auto mt-4" />
            <p className="text-creme/60 text-sm sm:text-base max-w-2xl mx-auto mt-6 leading-relaxed">
              تعرّف على أبرز مناطق القنيطرة العقارية. لكل منطقة طابعها وخدماتها وقربها
              من المرافق — فهم المنطقة خطوة أساسية قبل اتخاذ قرار الشراء أو الاستثمار.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <span className="text-creme/50 text-sm">
              {manatiq.length} مناطق مغطّاة
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manatiq.map((m, i) => (
              <Reveal key={m.slug} delay={i * 100}>
                <Link href={`/manatiq/${m.slug}`} className="glass-card rounded-2xl overflow-hidden group block">
                  <div className="relative h-56 overflow-hidden">
                    <img src={m.image} alt={m.title} className="w-full h-full object-cover luxury-image" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir to-transparent" />
                    <div className="absolute bottom-0 p-5">
                      <span className="text-or-clair text-xs">{m.city}</span>
                      <h3 className="text-creme font-bold text-lg group-hover:text-gold transition-colors">{m.title}</h3>
                      <p className="text-creme/60 text-xs mt-1 line-clamp-2">{m.description}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </>
  );
}
