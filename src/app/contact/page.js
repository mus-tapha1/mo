'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { config } from '@/config/site';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Header />

      <main id="main-content">

      <section className="pt-32 pb-12 px-4 sm:px-6 bg-noir-50/30 border-b border-gold">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <span className="text-or/60 text-xs tracking-[0.4em] font-light">CONTACT</span>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="text-creme">تواصل</span> <span className="text-gold">معنا</span>
            </h1>
            <div className="gold-divider w-32 mx-auto mt-4" />
          </Reveal>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
          {/* معلومات */}
          <Reveal>
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-gold font-bold text-lg mb-3">ابدأ بمعطيات واضحة</h3>
                <p className="text-creme/60 text-sm leading-relaxed">
                  أخبرنا عن مشروعك العقاري، ونبدأ من قراءة أوضح للسعر والموقع قبل القرار.
                </p>
              </div>

              <a href={`tel:${config.contact.phoneHref}`} className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-gold-bright transition-colors block">
                <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0a0a"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.58l2.2-2.21c.28-.27.36-.66.25-1.01C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/></svg>
                </div>
                <div>
                  <p className="text-creme/50 text-xs">الهاتف</p>
                  <p className="text-creme font-medium" dir="ltr">{config.contact.phone}</p>
                </div>
              </a>

              <a href={`mailto:${config.contact.email}`} className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-gold-bright transition-colors block">
                <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0a0a"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </div>
                <div>
                  <p className="text-creme/50 text-xs">البريد</p>
                  <p className="text-creme font-medium" dir="ltr">{config.contact.email}</p>
                </div>
              </a>
            </div>
          </Reveal>

          {/* النموذج */}
          <Reveal delay={150}>
            {submitted ? (
              <div className="glass-card rounded-2xl p-12 text-center gold-glow">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-gradient flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#0a0a0a"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
                <h2 className="text-2xl text-gold font-bold mb-3">تم استلام طلبك</h2>
                <p className="text-creme/60 text-sm">سنتواصل معك قريباً.</p>
              </div>
            ) : (
              <form className="glass-card rounded-2xl p-8 space-y-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <div>
                  <label className="block text-creme/70 text-sm mb-2">سبب التواصل</label>
                  <select className="w-full bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair">
                    <option className="bg-noir">شراء عقار</option>
                    <option className="bg-noir">بيع عقار</option>
                    <option className="bg-noir">طلب تحليل</option>
                    <option className="bg-noir">استفسار</option>
                  </select>
                </div>
                <div>
                  <label className="block text-creme/70 text-sm mb-2">الاسم</label>
                  <input type="text" required className="w-full bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair" />
                </div>
                <div>
                  <label className="block text-creme/70 text-sm mb-2">الهاتف</label>
                  <input type="tel" required dir="ltr" placeholder="+212 6 00 00 00 00" className="w-full bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair" />
                </div>
                <div>
                  <label className="block text-creme/70 text-sm mb-2">رسالتك</label>
                  <textarea rows={4} placeholder="اكتب تفاصيل مشروعك..." className="w-full bg-noir-100 border border-gold rounded-xl px-4 py-3 text-creme text-sm focus:outline-none focus:border-or-clair resize-none" />
                </div>
                <button type="submit" className="btn-gold w-full px-6 py-4 rounded-full text-base">إرسال</button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
      </main>

      <Footer />
    </>
  );
}
