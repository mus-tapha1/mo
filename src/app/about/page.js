'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { config } from '@/config/site';

export default function AboutPage() {
  return (
    <>
      <Header />

      <main id="main-content">

      <section className="pt-32 pb-12 px-4 sm:px-6 bg-noir-50/30 border-b border-gold">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <span className="text-or/60 text-xs tracking-[0.4em] font-light">À PROPOS</span>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="text-creme">من</span> <span className="text-gold">نحن</span>
            </h1>
            <p className="text-or-clair text-sm tracking-widest mt-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {config.brand.tagline}
            </p>
            <div className="gold-divider w-32 mx-auto mt-4" />
          </Reveal>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <Reveal>
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                منصة عقارية — {config.city}
              </h2>
              <p className="text-creme/70 text-base leading-relaxed mb-4">
                نحن في <span className="text-or-clair font-bold">{config.brand.nameAr} للعقارات</span> نفهم العقار قبل أن نقترحه.
                نركّز على قراءة السعر والمنطقة والمعطيات حول العقار، خطوة بخطوة، قبل أن تقرر الشراء أو البيع.
              </p>
              <p className="text-creme/70 text-base leading-relaxed">
                العروض متوفرة، لكن فهمها هو التحدي. معلومات مشتّتة، أسعار متعددة ومصادر مختلفة، تصعّب المقارنة بين العقارات والمناطق.
                هنا يأتي دورنا: تنظيم المعطيات، توضيح السعر والموقع والمساحة، وطرح نقاط الانتباه التي تساعدك على اتخاذ قرار أكثر وعياً.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="text-2xl font-bold mb-6 text-creme" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                <span className="text-gold">✦</span> ما الفرق؟
              </h2>
              <p className="text-creme/70 text-base leading-relaxed mb-6">
                من عرض العقار إلى فهم القرار في السوق العقاري. المشكلة ليست دائماً في قلة العروض، بل في طريقة قراءتها.
                هنا يأتي دور <span className="text-or-clair">{config.brand.nameAr}</span>: تنظيم المعطيات، توضيح السعر والموقع والمساحة،
                وطرح نقاط الانتباه التي تساعدك على اتخاذ قرار أكثر وعياً.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-creme/90 text-lg font-bold mb-4">العرض التقليدي</h3>
                <ul className="space-y-3 text-creme/60 text-sm">
                  <li>— يقدّم لك العقار ويربطك بصاحب العرض</li>
                  <li>— يعتمد على الخبرة الميدانية ومعرفة السوق</li>
                  <li>— يمنحك فكرة أولية عن الثمن والموقع</li>
                  <li>— قد تحتاج بعدها إلى مقارنة أوسع وقراءة أكثر تنظيماً</li>
                </ul>
              </div>
              <div className="glass-card rounded-2xl p-8 border-gold-bright gold-glow">
                <h3 className="text-gold text-lg font-bold mb-4">منهجية {config.brand.nameAr}</h3>
                <ul className="space-y-3 text-creme/80 text-sm">
                  <li>✦ نبدأ من فهم العقار قبل الحكم عليه</li>
                  <li>✦ ننظّم السعر، المساحة، الموقع، التوجيه، والوثائق</li>
                  <li>✦ نقارن العرض بسياقه المحلي كلما توفرت المعطيات</li>
                  <li>✦ نوضّح نقاط القوة ونقاط الانتباه بلغة بسيطة</li>
                  <li>✦ نساعدك على طرح الأسئلة الصحيحة قبل القرار</li>
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h2 className="text-2xl font-bold mb-6 text-creme" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                <span className="text-gold">✦</span> منهجية العمل — كيف نعمل؟
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { n: '1', t: 'نستقبل طلبك', d: 'تحدد نوع العقار والميزانية والمنطقة' },
                  { n: '2', t: 'نقرأ المعطيات', d: 'نقارن السعر والطلب والخدمات القريبة' },
                  { n: '3', t: 'نقدّم خلاصة', d: 'نخصّص ما هو واضح وما يستحق انتباهاً' },
                  { n: '4', t: 'نرافق الخطوة', d: 'نفسّر الخطوة التالية ببساطة' },
                ].map((step) => (
                  <div key={step.n} className="text-center p-6 glass-card rounded-xl">
                    <div className="display-number text-gold text-4xl mb-3">{step.n}</div>
                    <h4 className="text-creme font-bold text-sm mb-2">{step.t}</h4>
                    <p className="text-creme/50 text-xs leading-relaxed">{step.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="text-center glass-card rounded-2xl p-10 gold-glow">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                <span className="text-creme">القرار العقاري يستحق</span> <span className="text-gold">أدوات أوضح</span>
              </h2>
              <p className="text-creme/60 text-sm mb-6 max-w-xl mx-auto">
                نقرأ السعر والمنطقة ونقاط الانتباه، خطوة بخطوة. نريد لقرارك العقاري أن يكون أوضح وأهدأ.
              </p>
              <Link href="/contact" className="btn-gold px-8 py-3 rounded-full text-sm">تواصل معنا</Link>
            </div>
          </Reveal>
        </div>
      </section>
      </main>

      <Footer />
    </>
  );
}
