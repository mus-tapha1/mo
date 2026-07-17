'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import Reveal from '@/components/Reveal';
import { videos as videosDefault, getVideoById } from '@/data/videos';

export default function MediaPage() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <>
      <Header />

      <main id="main-content">

      <section className="pt-32 pb-12 px-4 sm:px-6 bg-noir-50/30 border-b border-gold">
        <div className="max-w-7xl mx-auto text-center">
          <Reveal>
            <span className="text-or/60 text-xs tracking-[0.4em] font-light">MÉDIAS</span>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="text-gold">الميادين</span>
            </h1>
            <p className="text-creme/60 text-sm mt-4 max-w-xl mx-auto">
              محتوى ميداني يساعدك تفهم السوق العقاري وتقرر بثقة
            </p>
            <div className="gold-divider w-32 mx-auto mt-4" />
          </Reveal>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videosDefault.map((v, i) => (
            <Reveal key={v.id} delay={(i % 6) * 80}>
              <div className="glass-card rounded-2xl p-4">
                <VideoPlayer video={v} compact />
                <h3 className="text-creme font-bold text-sm mt-4 mb-1 line-clamp-2">{v.title}</h3>
                <p className="text-creme/50 text-xs line-clamp-2">{v.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      </main>

      <Footer />
    </>
  );
}
