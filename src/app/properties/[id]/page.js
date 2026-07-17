'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { config, whatsappShareLink, facebookShareLink, twitterShareLink } from '@/config/site';
import { useLiveData } from '@/lib/use-live-data';
import { getFallbackProperties } from '@/lib/live-data';

/* ===== أيقونات SVG ===== */
const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);

const MarketIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
  </svg>
);

/* أيقونات لمعلومات العقار الأساسية */
const BasicIcon = ({ label }) => {
  const text = label.toLowerCase();
  if (text.includes('مساحة') || text.includes('surface')) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/></svg>;
  if (text.includes('موقع') || text.includes('location')) return <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>;
  if (text.includes('توجيه') || text.includes('orientation')) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><path d="M12 8l4 4-4 4-4-4z" fill="currentColor"/></svg>;
  if (text.includes('واجه') || text.includes('façade')) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>;
  if (text.includes('قانون') || text.includes('juridique') || text.includes('وضع')) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6l18 0M3 12l18 0M3 18l18 0"/></svg>;
  if (text.includes('طريق') || text.includes('route') || text.includes('عرض')) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h18M3 12c0-3 2-6 4-6s4 3 4 6-2 6-4 6-4-3-4-6zM17 12c0-3 2-6 4-6"/></svg>;
  if (text.includes('نوع') || text.includes('type')) return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 22h20M4 22V10l8-6 8 6v12M9 22v-6h6v6"/></svg>;
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>;
};

export default function PropertyDetailPage({ params }) {
  const { id } = params;
  const [activeImage, setActiveImage] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [property, setProperty] = useState(null);
  const [mounted, setMounted] = useState(false);

  // جلب البيانات الحيّة من GitHub — تظهر التغييرات فوراً بدون بناء
  const { data: liveData } = useLiveData();
  const properties = liveData.properties || getFallbackProperties();

  // دمج البيانات الحيّة مع fallback
  useEffect(() => {
    const fromLive = properties.find((p) => p.id === id);
    setProperty(fromLive || null);
    setMounted(true);
  }, [id, properties]);

  const detailUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ''}/properties/${id}`
    : `/properties/${id}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(detailUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!property) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-3xl text-creme mb-4">العقار غير موجود</h1>
            <Link href="/properties" className="btn-gold px-6 py-3 rounded-full">العودة للعقارات</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const gallery = property.gallery && property.gallery.length > 0 ? property.gallery : [property.image];

  return (
    <>
      <Header />

      {/* ===== معرض الصور التفاعلي ===== */}
      <section className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/properties" className="text-or-clair hover:text-creme text-sm mb-4 inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M5 12h14M12 19l7-7-7-7" /></svg>
            العودة للعقارات
          </Link>

          {/* الصورة الكبيرة */}
          <div className="relative rounded-2xl overflow-hidden mb-4 group">
            <img
              src={gallery[activeImage]}
              alt={`${property.title} - صورة ${activeImage + 1}`}
              className="w-full h-[400px] sm:h-[500px] object-cover luxury-image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/60 via-transparent to-transparent" />
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="badge-gold px-4 py-1.5 rounded-full text-xs">{property.type}</span>
            </div>
            <div className="absolute bottom-4 left-4 bg-noir/70 backdrop-blur px-4 py-2 rounded-xl">
              <span className="text-creme/60 text-xs">صورة {activeImage + 1} من {gallery.length}</span>
            </div>
          </div>

          {/* الصور المصغرة */}
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative rounded-lg overflow-hidden h-20 transition-all ${activeImage === i ? 'ring-2 ring-or border-2 border-or-clair' : 'ring-1 ring-gold/30 opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`صورة مصغرة ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== العنوان والمعلومات الأساسية ===== */}
      <section className="px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                <span className="text-creme">{property.title}</span>
              </h1>
              <p className="text-creme/70 text-sm flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/></svg>
                {property.city} — {property.area}
              </p>
            </div>

            {/* أزرار المشاركة */}
            <div className="flex gap-2 shrink-0">
              <a
                href={whatsappShareLink(property.title, detailUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 rounded-full px-4 py-2.5 text-sm font-medium transition-colors"
              >
                <WhatsAppIcon /> واتساب
              </a>
              <div className="relative">
                <button
                  onClick={() => setShareOpen(!shareOpen)}
                  className="flex items-center gap-1.5 bg-or/10 hover:bg-or/20 text-or-clair border border-gold/30 rounded-full px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  <ShareIcon /> مشاركة
                </button>
                {shareOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShareOpen(false)} />
                    <div className="absolute top-full mt-2 left-0 z-40 bg-noir-100 border border-gold rounded-xl shadow-2xl p-2 min-w-[180px]">
                      <a href={whatsappShareLink(property.title, detailUrl)} target="_blank" rel="noopener noreferrer" onClick={() => setShareOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-or/10 text-creme/80 text-xs transition-colors">
                        <WhatsAppIcon /> عبر واتساب
                      </a>
                      <a href={facebookShareLink(detailUrl)} target="_blank" rel="noopener noreferrer" onClick={() => setShareOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-or/10 text-creme/80 text-xs transition-colors">
                        <FacebookIcon /> عبر فيسبوك
                      </a>
                      <a href={twitterShareLink(detailUrl, property.title)} target="_blank" rel="noopener noreferrer" onClick={() => setShareOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-or/10 text-creme/80 text-xs transition-colors">
                        <TwitterIcon /> عبر إكس
                      </a>
                      <button onClick={handleCopy} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-or/10 text-creme/80 text-xs transition-colors">
                        <CopyIcon /> {copied ? 'تم النسخ ✓' : 'نسخ الرابط'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== المحتوى ===== */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* العمود الرئيسي */}
          <div className="lg:col-span-2 space-y-10">
            {/* السعر والمساحة */}
            <Reveal>
              <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <span className="text-creme/50 text-xs">السعر</span>
                  <p className="text-gold text-3xl font-bold">{property.priceLabel}</p>
                </div>
                <div className="text-left">
                  <span className="text-creme/50 text-xs block">المساحة</span>
                  <p className="text-creme text-2xl font-bold">{property.surface}م²</p>
                </div>
              </div>
            </Reveal>

            {/* ===== المعطيات الأساسية — بطاقات بصرية ===== */}
            <Reveal>
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  <span className="w-8 h-px bg-gold-gradient" />
                  <span className="text-creme">المعطيات الأساسية</span>
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {property.basics.map((b, i) => (
                    <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-or-clair transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-or/10 flex items-center justify-center text-or-clair shrink-0">
                        <BasicIcon label={b.label} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-creme/50 text-xs mb-0.5">{b.label}</p>
                        <p className="text-creme text-sm font-medium truncate">{b.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* ===== زر فهم السوق (تحليل السوق) ===== */}
            <Reveal>
              <div className="glass-card rounded-2xl p-6 border-gold-bright">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gold-gradient flex items-center justify-center text-noir shrink-0">
                      <MarketIcon />
                    </div>
                    <div>
                      <h3 className="text-gold font-bold text-lg">فهم السوق</h3>
                      <p className="text-creme/60 text-xs">تحليل مقارن لسعر العقار بسياق السوق المحلي</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMarketOpen(!marketOpen)}
                    className="btn-gold px-6 py-2.5 rounded-full text-sm whitespace-nowrap"
                  >
                    {marketOpen ? 'إخفاء التحليل' : 'عرض التحليل'}
                  </button>
                </div>

                {marketOpen && (
                  <div className="mt-6 pt-6 border-t border-gold space-y-4">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-xl bg-noir-100 border border-gold/20">
                        <p className="text-creme/50 text-xs mb-1">السعر للمتر</p>
                        <p className="text-gold text-xl font-bold">
                          {mounted && property.price && property.surface
                            ? Math.round(property.price / property.surface).toLocaleString() + ' د/م²'
                            : '—'}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-noir-100 border border-gold/20">
                        <p className="text-creme/50 text-xs mb-1">المنطقة</p>
                        <p className="text-creme text-lg font-bold">{property.area}</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-noir-100 border border-gold/20">
                        <p className="text-creme/50 text-xs mb-1">نوع العقار</p>
                        <p className="text-creme text-lg font-bold">{property.type}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-creme/70 text-sm leading-relaxed">
                      <p className="flex gap-2"><span className="text-or shrink-0">—</span>
                        هذا التحليل أولي ويعتمد على المعطيات المتاحة. السعر النهائي يخضع للتفاوض وظروف السوق الفعلية.
                      </p>
                      <p className="flex gap-2"><span className="text-or shrink-0">—</span>
                        للمقارنة الدقيقة مع عقارات مشابهة في {property.city}، ننصح بتنظيم معاينة ميدانية ومناقشة المعطيات القانونية.
                      </p>
                      <p className="flex gap-2"><span className="text-or shrink-0">—</span>
                        السوق العقاري في {config.city} متغير؛ ننصح بمتابعة العروض المقارنة قبل اتخاذ القرار النهائي.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <a
                        href={`https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`أريد تحليلاً مفصلاً لهذا العقار: ${property.title} (${property.id})`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline-gold px-5 py-2.5 rounded-full text-sm text-center"
                      >
                        طلب تحليل مفصّل
                      </a>
                      <Link href="/media" className="btn-outline-gold px-5 py-2.5 rounded-full text-sm text-center">
                        شاهد ميادين السوق
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            {/* قراءة مصطفى — القلب */}
            <Reveal>
              <div className="glass-card rounded-2xl p-8 border-gold-bright gold-glow">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  <span className="text-gold">✦</span>
                  <span className="text-gold">قراءة مصطفى</span>
                </h2>
                <p className="text-or/50 text-xs mb-6">تحليل أولي للعقار قبل القرار</p>

                <div className="space-y-4">
                  {property.lecture.map((line, i) => (
                    <div key={i} className="flex gap-3 text-creme/80 text-sm leading-relaxed">
                      <span className="text-or shrink-0 mt-1">—</span>
                      <p>{line}</p>
                    </div>
                  ))}
                </div>

                {property.note && (
                  <div className="mt-6 pt-6 border-t border-gold">
                    <p className="text-creme/50 text-xs italic flex gap-2">
                      <span className="text-or">⚠</span>
                      {property.note}
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* العمود الجانبي — التواصل */}
          <div className="space-y-6">
            <Reveal>
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <h3 className="text-gold font-bold text-lg mb-4">مهتم بهذا العقار؟</h3>
                <p className="text-creme/60 text-sm mb-6 leading-relaxed">
                  تواصل معنا للحصول على قراءة أعمق أو لتنظيم معاينة ميدانية.
                </p>

                <a href={`tel:${config.contact.phoneHref}`} className="btn-gold w-full px-6 py-3 rounded-full text-sm block text-center mb-3" dir="ltr">
                  📞 {config.contact.phone}
                </a>
                <a
                  href={whatsappShareLink(property.title, detailUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-gold w-full px-6 py-3 rounded-full text-sm block text-center mb-3"
                >
                  تواصل عبر واتساب
                </a>
                <Link href="/contact" className="btn-outline-gold w-full px-6 py-3 rounded-full text-sm block text-center">
                  طلب استفسار
                </Link>

                <div className="gold-divider my-6" />
                <p className="text-creme/40 text-xs text-center leading-relaxed">
                  القراءة الأولية لا تغني عن المعاينة الميدانية والتوثيق القانوني.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
