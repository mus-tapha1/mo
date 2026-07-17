'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import VideoPlayer from '@/components/VideoPlayer';
import Reveal from '@/components/Reveal';
import { config } from '@/config/site';
import { properties as propertiesDefault, getFeaturedProperties, propertyTypes, budgetRanges } from '@/data/properties';
import { lotissements as lotissementsDefault } from '@/data/lotissements';
import { manatiq as manatiqDefault } from '@/data/manatiq';
import { videos as videosDefault } from '@/data/videos';

export default function HomePage() {
  const router = useRouter();
  const [searchType, setSearchType] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [searchArea, setSearchArea] = useState('');

  const featured = useMemo(() => propertiesDefault.filter((p) => p.featured), []);
  const topVideos = useMemo(() => videosDefault.slice(0, 3), []);
  const topLotissements = useMemo(() => lotissementsDefault.slice(0, 3), []);

  // إحصائيات ديناميكية من البيانات
  const stats = useMemo(() => [
    { value: propertiesDefault.length, label: 'عقار متوفّر' },
    { value: lotissementsDefault.length, label: 'تجزئة فاخرة' },
    { value: manatiqDefault.length, label: 'منطقة مغطّاة' },
    { value: videosDefault.length, label: 'فيديو ميدياتي' },
  ], []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchType) params.set('type', searchType);
    if (searchBudget) params.set('budget', searchBudget);
    if (searchArea) params.set('q', searchArea);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <>
      <Header />

      <main id="main-content">

      {/* ===== البطل (Hero) ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* خلفية */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596357905-23c75a4a8d92?w=1920&q=80"
            alt="عقارات فاخرة"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-noir/80 via-noir/70 to-noir" />
          <div className="absolute inset-0 dot-pattern opacity-40" />
        </div>

        {/* المحتوى */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <Reveal>
            <div className="inline-block mb-6">
              <span className="badge-gold px-5 py-2 rounded-full text-xs tracking-[0.3em] font-light">
                IMMOBILIER DE PRESTIGE
              </span>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="text-gold">مصطفى</span> <span className="text-creme">للعقارات</span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-or-clair text-lg sm:text-xl tracking-[0.2em] font-light mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              VOTRE CLÉ VERS L'EXCEPTION
            </p>
          </Reveal>

          <Reveal delay={400}>
            <p className="text-creme/70 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              منصة عقارية فاخرة في {config.city}. نقرأ العقار قبل أن نقترحه —
              ننظّم المعطيات، نوضّح السعر والموقع والمساحة، ونطرح نقاط الانتباه لقرار أكثر وعياً.
            </p>
          </Reveal>

          <Reveal delay={550}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/properties" className="btn-gold px-8 py-4 rounded-full text-base inline-flex items-center justify-center gap-2">
                تصفّح العقارات
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M19 12H5M12 5l-7 7 7 7" /></svg>
              </Link>
              <Link href="/sell-property" className="btn-outline-gold px-8 py-4 rounded-full text-base">
                أضف عقارك للبيع
              </Link>
              <Link href="/contact" className="btn-outline-gold px-8 py-4 rounded-full text-base">
                طلب شراء عقار
              </Link>
            </div>
          </Reveal>

          {/* ===== نموذج البحث السريع ===== */}
          <Reveal delay={700}>
            <form
              onSubmit={handleSearch}
              className="glass-card rounded-2xl p-4 sm:p-5 max-w-3xl mx-auto border-gold-bright"
            >
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair flex-1"
                  aria-label="نوع العقار"
                >
                  {propertyTypes.map((t) => (
                    <option key={t.key} value={t.key} className="bg-noir">{t.label}</option>
                  ))}
                </select>

                <select
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                  className="bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair flex-1"
                  aria-label="الميزانية"
                >
                  {budgetRanges.map((b) => (
                    <option key={b.key} value={b.key} className="bg-noir">{b.label}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="المنطقة أو الحي..."
                  value={searchArea}
                  onChange={(e) => setSearchArea(e.target.value)}
                  className="bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm placeholder-creme/40 focus:outline-none focus:border-or-clair flex-1"
                  aria-label="المنطقة"
                />

                <button
                  type="submit"
                  className="btn-gold px-6 py-3 rounded-xl text-sm whitespace-nowrap inline-flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
                  بحث
                </button>
              </div>
            </form>
          </Reveal>
        </div>

        {/* مؤشر التمرير */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-or to-transparent animate-pulse" />
        </div>
      </section>

      {/* ===== لماذا مصطفى؟ (المنهجية) ===== */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-or/60 text-xs tracking-[0.4em] font-light">LA MÉTHODE</span>
              <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                <span className="text-gold">لماذا</span> <span className="text-creme">مصطفى؟</span>
              </h2>
              <div className="gold-divider w-32 mx-auto" />
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Reveal>
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-creme/90 text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-or-clair">①</span> العرض التقليدي
                </h3>
                <ul className="space-y-3 text-creme/60 text-sm leading-relaxed">
                  <li className="flex gap-2"><span className="text-or/40">—</span> يقدّم لك العقار ويربطك بصاحب العرض</li>
                  <li className="flex gap-2"><span className="text-or/40">—</span> يعتمد على الخبرة الميدانية ومعرفة السوق</li>
                  <li className="flex gap-2"><span className="text-or/40">—</span> يمنحك فكرة أولية عن الثمن والموقع</li>
                  <li className="flex gap-2"><span className="text-or/40">—</span> قد تحتاج بعدها إلى مقارنة أوسع وقراءة أكثر تنظيماً</li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="glass-card rounded-2xl p-8 border-gold-bright gold-glow">
                <h3 className="text-gold text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-or-clair">②</span> منهجية مصطفى
                </h3>
                <ul className="space-y-3 text-creme/80 text-sm leading-relaxed">
                  <li className="flex gap-2"><span className="text-or">✦</span> نبدأ من فهم العقار قبل الحكم عليه</li>
                  <li className="flex gap-2"><span className="text-or">✦</span> ننظّم السعر، المساحة، الموقع، التوجيه، والوثائق</li>
                  <li className="flex gap-2"><span className="text-or">✦</span> نقارن العرض بسياقه المحلي كلما توفرت المعطيات</li>
                  <li className="flex gap-2"><span className="text-or">✦</span> نوضّح نقاط القوة ونقاط الانتباه بلغة بسيطة</li>
                  <li className="flex gap-2"><span className="text-or">✦</span> نساعدك على طرح الأسئلة الصحيحة قبل القرار</li>
                </ul>
              </div>
            </Reveal>
          </div>

          {/* خطوات العمل */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: '01', t: 'نستقبل طلبك', d: 'تحدد نوع العقار والميزانية والمنطقة' },
              { n: '02', t: 'نقرأ المعطيات', d: 'نقارن السعر والطلب والخدمات القريبة' },
              { n: '03', t: 'نقدّم خلاصة', d: 'نخصّص ما هو واضح وما يستحق انتباهاً' },
              { n: '04', t: 'نرافق الخطوة', d: 'نفسّر الخطوة التالية ببساطة' },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 100}>
                <div className="text-center p-6">
                  <div className="display-number text-gold text-5xl mb-3">{step.n}</div>
                  <h4 className="text-creme font-bold text-sm mb-2">{step.t}</h4>
                  <p className="text-creme/50 text-xs leading-relaxed">{step.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== إحصائيات المنصة ===== */}
      <section className="py-16 px-4 sm:px-6 border-y border-gold">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <div className="text-center">
                  <div className="display-number text-gold text-4xl sm:text-5xl mb-2">
                    {stat.value}
                  </div>
                  <p className="text-creme/60 text-xs sm:text-sm tracking-wide">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== عقارات مميّزة ===== */}
      <section className="py-24 px-4 sm:px-6 bg-noir-50/50 border-y border-gold">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col sm:flex-row items-end justify-between mb-12">
              <div>
                <span className="text-or/60 text-xs tracking-[0.4em] font-light">SÉLECTION</span>
                <h2 className="text-4xl sm:text-5xl font-bold mt-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  <span className="text-creme">عقارات</span> <span className="text-gold">مميّزة</span>
                </h2>
              </div>
              <Link href="/properties" className="text-or-clair hover:text-creme text-sm transition-colors mt-4 sm:mt-0 flex items-center gap-2">
                تصفّح الكل
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M19 12H5M12 5l-7 7 7 7" /></svg>
              </Link>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== الميادين (الفيديوهات) ===== */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-or/60 text-xs tracking-[0.4em] font-light">MÉDIAS</span>
              <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                <span className="text-gold">الميادين</span>
              </h2>
              <p className="text-creme/60 text-sm max-w-xl mx-auto">
                محتوى ميداني يساعدك تفهم السوق العقاري وتقرر بثقة
              </p>
              <div className="gold-divider w-32 mx-auto mt-4" />
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {topVideos.map((v, i) => (
              <Reveal key={v.id} delay={i * 100}>
                <div className="glass-card rounded-2xl p-4">
                  <VideoPlayer video={v} compact />
                  <h3 className="text-creme font-bold text-sm mt-4 mb-1 line-clamp-2">{v.title}</h3>
                  <p className="text-creme/50 text-xs line-clamp-2">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="text-center mt-10">
              <Link href="/media" className="btn-outline-gold px-8 py-3 rounded-full text-sm inline-block">
                شاهد كل الميادين
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== التجزئات ===== */}
      <section className="py-24 px-4 sm:px-6 bg-noir-50/50 border-y border-gold">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-or/60 text-xs tracking-[0.4em] font-light">PROJETS</span>
              <h2 className="text-4xl sm:text-5xl font-bold mt-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                <span className="text-creme">التجزئات</span> <span className="text-gold">الفاخرة</span>
              </h2>
              <div className="gold-divider w-32 mx-auto mt-4" />
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {topLotissements.map((lot, i) => (
              <Reveal key={lot.id} delay={i * 100}>
                <Link href={`/lotissements/${lot.slug}`} className="glass-card rounded-2xl overflow-hidden group block">
                  <div className="relative h-64 overflow-hidden">
                    <img src={lot.image} alt={lot.title} className="w-full h-full object-cover luxury-image" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir to-transparent" />
                    <div className="absolute bottom-0 p-5">
                      <span className="text-or-clair text-xs">{lot.city}</span>
                      <h3 className="text-creme font-bold text-lg group-hover:text-gold transition-colors">{lot.title}</h3>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== دعوة للتواصل ===== */}
      <section className="py-24 px-4 sm:px-6">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center glass-card rounded-3xl p-12 gold-glow">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-gradient flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#0a0a0a"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="text-creme">ابدأ بمعطيات</span> <span className="text-gold">واضحة</span>
            </h2>
            <p className="text-creme/60 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
              أخبرنا عن مشروعك العقاري، ونبدأ من قراءة أوضح للسعر والموقع قبل القرار.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-gold px-8 py-4 rounded-full text-base">تواصل معنا</Link>
              <Link href="/sell-property" className="btn-outline-gold px-8 py-4 rounded-full text-base">أضف عقارك للبيع</Link>
            </div>
          </div>
        </Reveal>
      </section>

      </main>

      <Footer />
    </>
  );
}
