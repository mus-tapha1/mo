'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { config } from '@/config/site';

export default function SellPropertyPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Header />

      <main id="main-content">

      <section className="pt-32 pb-12 px-4 sm:px-6 bg-noir-50/30 border-b border-gold">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <span className="text-or/60 text-xs tracking-[0.4em] font-light">VENTE</span>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="text-creme">أضف عقارك</span> <span className="text-gold">للبيع</span>
            </h1>
            <div className="gold-divider w-32 mx-auto mt-4" />
          </Reveal>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <Reveal>
              <div className="glass-card rounded-2xl p-12 text-center gold-glow">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-gradient flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#0a0a0a"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
                <h2 className="text-2xl text-gold font-bold mb-3">تم استلام طلبك</h2>
                <p className="text-creme/60 text-sm">سنتواصل معك قريباً لقراءة العقار وتنظيم المعاينة.</p>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <form
                className="glass-card rounded-2xl p-8 space-y-5"
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              >
                <div>
                  <label className="block text-creme/70 text-sm mb-2">نوع العقار</label>
                  <select className="w-full bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair">
                    <option className="bg-noir">بقعة فيلا</option>
                    <option className="bg-noir">شقة</option>
                    <option className="bg-noir">فيلا</option>
                    <option className="bg-noir">محل تجاري</option>
                    <option className="bg-noir">بقعة تجارية</option>
                    <option className="bg-noir">أرض فلاحية</option>
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-creme/70 text-sm mb-2">المدينة</label>
                    <input type="text" defaultValue={config.city} className="w-full bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair" />
                  </div>
                  <div>
                    <label className="block text-creme/70 text-sm mb-2">المنطقة</label>
                    <input type="text" placeholder="الحي / التجزئة" className="w-full bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-creme/70 text-sm mb-2">المساحة (م²)</label>
                    <input type="number" placeholder="مثال: 320" className="w-full bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair" />
                  </div>
                  <div>
                    <label className="block text-creme/70 text-sm mb-2">السعر (درهم)</label>
                    <input type="number" placeholder="مثال: 1300000" className="w-full bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair" />
                  </div>
                </div>

                <div>
                  <label className="block text-creme/70 text-sm mb-2">معلومات إضافية</label>
                  <textarea rows={4} placeholder="التوجيه، الوضع القانوني، ملاحظات..." className="w-full bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair resize-none" />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-creme/70 text-sm mb-2">الاسم</label>
                    <input type="text" required className="w-full bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair" />
                  </div>
                  <div>
                    <label className="block text-creme/70 text-sm mb-2">الهاتف</label>
                    <input type="tel" required dir="ltr" placeholder="+212 6 00 00 00 00" className="w-full bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair" />
                  </div>
                </div>

                <button type="submit" className="btn-gold w-full px-6 py-4 rounded-full text-base">
                  إرسال الطلب
                </button>
              </form>
            </Reveal>
          )}
        </div>
      </section>
      </main>

      <Footer />
    </>
  );
}
