'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { getManatiqBySlug, getProperties } from '@/lib/store';

export default function ManatiqDetailPage({ params }) {
  const { slug } = params;
  const manatiq = getManatiqBySlug(slug);

  if (!manatiq) {
    return (
      <>
        <Header />
        <main className="pt-24 min-h-screen bg-noir text-creme flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl text-or mb-6">404</p>
            <h1 className="text-2xl mb-4">المنطقة غير موجودة</h1>
            <Link href="/manatiq" className="btn-gold inline-block px-6 py-3">
              العودة إلى المناطق
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Find properties in this area (by city match or title contains)
  const relatedProperties = getProperties().filter(
    (p) => p.city === manatiq.city || p.title.includes(manatiq.title)
  );

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-noir text-creme">
        {/* Hero */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img
            src={manatiq.image}
            alt={manatiq.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/70 to-noir/30" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-6xl mx-auto px-4 pb-12 w-full">
              <Reveal>
                <Link href="/manatiq" className="text-or/70 text-sm hover:text-or transition-colors mb-4 inline-block">
                  ← كل المناطق
                </Link>
                <p className="text-or text-sm tracking-[0.2em] mb-2">{manatiq.city}</p>
                <h1 className="text-4xl md:text-6xl font-bold text-gold mb-4">{manatiq.title}</h1>
                <div className="gold-divider" />
              </Reveal>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <h2 className="text-2xl font-bold text-creme mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-or rounded-full"></span>
                نظرة عامة
              </h2>
              <p className="text-creme/70 leading-loose text-lg text-justify mb-8">
                {manatiq.description}
              </p>

              <div className="glass-card p-8 mt-8">
                <h3 className="text-or font-bold text-lg mb-4">لماذا الاستثمار في {manatiq.title}؟</h3>
                <ul className="space-y-3 text-creme/70">
                  {[
                    'موقع استراتيجي يربط بين مناطق الحياة العصرية والخدمات الأساسية',
                    'تنوّع عقاري يشمل الفلل والشقق والمساحات التجارية',
                    'بنية تحتية متطورة مع شبكة طرق ومواصلات مريحة',
                    'ارتفاع مستمر في القيمة العقارية وفرص استثمار واعدة',
                    'قرب من المرافق التعليمية والصحية والترفيهية',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-or mt-1">◆</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <section className="py-16 px-4 bg-noir-50">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="text-center mb-12">
                  <p className="text-or text-sm tracking-[0.2em] mb-2">عقارات في هذه المنطقة</p>
                  <h2 className="text-3xl font-bold text-gold">عقارات متاحة في {manatiq.title}</h2>
                  <div className="gold-divider mx-auto mt-4" />
                </div>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProperties.slice(0, 6).map((prop, i) => (
                  <Reveal key={prop.id} delay={i * 100}>
                    <Link href={`/properties/${prop.id}`} className="group block">
                      <div className="glass-card overflow-hidden hover:ring-or/40 transition-all">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={prop.image}
                            alt={prop.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {prop.featured && (
                            <span className="absolute top-3 right-3 badge-gold text-xs px-3 py-1">
                              مميّز
                            </span>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="text-creme font-bold mb-2 group-hover:text-or transition-colors">
                            {prop.title}
                          </h3>
                          <p className="text-or font-bold text-lg">{prop.priceLabel}</p>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <h2 className="text-3xl font-bold text-gold mb-4">هل تبحث عن عقار في {manatiq.title}؟</h2>
              <p className="text-creme/60 mb-8">تواصل معنا وسنرشدك إلى أفضل الفرص في هذه المنطقة</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/properties" className="btn-gold px-8 py-3">
                  تصفّح العقارات
                </Link>
                <Link href="/contact" className="btn-outline-gold px-8 py-3">
                  تواصل معنا
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
