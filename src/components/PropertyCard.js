'use client';

import { useState } from 'react';
import Link from 'next/link';
import { whatsappShareLink, facebookShareLink, twitterShareLink } from '@/config/site';

/* أيقونات SVG */
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

export default function PropertyCard({ property }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const detailUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ''}/properties/${property.id}`
    : `/properties/${property.id}`;

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(detailUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden group relative">
      {/* الصورة — قابلة للنقر للذهاب لصفحة العقار */}
      <Link href={`/properties/${property.id}`} className="block relative h-56 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover luxury-image"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-transparent" />
        {property.featured && (
          <span className="absolute top-3 right-3 badge-gold px-3 py-1 rounded-full text-xs font-medium">
            مميّز
          </span>
        )}
        <span className="absolute top-3 left-3 bg-noir/70 backdrop-blur px-3 py-1 rounded-full text-creme/90 text-xs">
          {property.type}
        </span>
      </Link>

      {/* المحتوى */}
      <div className="p-5">
        <Link href={`/properties/${property.id}`}>
          <h3 className="text-creme font-bold text-base mb-1 group-hover:text-or-clair transition-colors line-clamp-1">
            {property.title}
          </h3>
        </Link>
        <p className="text-creme/50 text-xs mb-3 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>
          {property.city} — {property.area}
        </p>

        <div className="flex items-end justify-between mb-3">
          <span className="text-gold text-xl font-bold">{property.priceLabel}</span>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex items-center gap-2 pt-3 border-t border-gold/20">
          <a
            href={whatsappShareLink(property.title, detailUrl)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 rounded-lg px-3 py-2 text-xs font-medium transition-colors"
            aria-label="تواصل عبر واتساب"
          >
            <WhatsAppIcon />
            واتساب
          </a>

          <div className="relative">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShareOpen(!shareOpen); }}
              className="flex items-center justify-center gap-1.5 bg-or/10 hover:bg-or/20 text-or-clair border border-gold/30 rounded-lg px-3 py-2 text-xs font-medium transition-colors"
              aria-label="مشاركة العقار"
            >
              <ShareIcon />
              مشاركة
            </button>

            {shareOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShareOpen(false); }} />
                <div className="absolute bottom-full mb-2 left-0 z-40 bg-noir-100 border border-gold rounded-xl shadow-2xl p-2 min-w-[180px]">
                  <a
                    href={whatsappShareLink(property.title, detailUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { e.stopPropagation(); setShareOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-or/10 text-creme/80 text-xs transition-colors"
                  >
                    <WhatsAppIcon /> عبر واتساب
                  </a>
                  <a
                    href={facebookShareLink(detailUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { e.stopPropagation(); setShareOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-or/10 text-creme/80 text-xs transition-colors"
                  >
                    <FacebookIcon /> عبر فيسبوك
                  </a>
                  <a
                    href={twitterShareLink(detailUrl, property.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { e.stopPropagation(); setShareOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-or/10 text-creme/80 text-xs transition-colors"
                  >
                    <TwitterIcon /> عبر إكس
                  </a>
                  <button
                    onClick={handleCopy}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-or/10 text-creme/80 text-xs transition-colors"
                  >
                    <CopyIcon /> {copied ? 'تم النسخ ✓' : 'نسخ الرابط'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
