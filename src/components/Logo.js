'use client';

import Link from 'next/link';

export default function Logo({ size = 'md', withText = true }) {
  const sizes = {
    sm: { box: 'h-12 w-12', icon: 28 },
    md: { box: 'h-16 w-16', icon: 38 },
    lg: { box: 'h-24 w-24', icon: 56 },
    xl: { box: 'h-32 w-32', icon: 72 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <Link href="/" className="flex items-center gap-3 group" aria-label="MUSTAPHA IMMOBILIER">
      {/* شعار المفتاح + الحرف M */}
      <div className={`${s.box} relative flex items-center justify-center shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full key-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0e0b0" />
              <stop offset="40%" stopColor="#e6c87a" />
              <stop offset="60%" stopColor="#c9a14a" />
              <stop offset="100%" stopColor="#a67c30" />
            </linearGradient>
            <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e6c87a" />
              <stop offset="100%" stopColor="#a67c30" />
            </linearGradient>
          </defs>
          {/* حرف M */}
          <path d="M20 75 L20 30 L35 30 L50 55 L65 30 L80 30 L80 75 L70 75 L70 45 L55 65 L45 65 L30 45 L30 75 Z" fill="url(#goldGrad)" />
          {/* المنزل الصغير في الوسط */}
          <rect x="42" y="38" width="16" height="12" fill="#0a0a0a" opacity="0.4" rx="1" />
          <path d="M40 38 L50 30 L60 38 Z" fill="url(#goldGrad2)" />
          {/* النافذة المضيئة */}
          <rect x="46" y="42" width="8" height="5" fill="#f0e0b0" rx="0.5" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.5;0.9" dur="3s" repeatCount="indefinite" />
          </rect>
          {/* المفتاح في الأسفل */}
          <circle cx="50" cy="88" r="4" fill="url(#goldGrad)" />
          <rect x="49" y="88" width="2" height="8" fill="url(#goldGrad)" />
          <rect x="50" y="92" width="3" height="1.5" fill="url(#goldGrad)" />
          <rect x="50" y="95" width="2" height="1.5" fill="url(#goldGrad)" />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col leading-none">
          <span className="text-gold text-lg font-bold tracking-[0.2em]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            MUSTAPHA
          </span>
          <span className="text-creme/80 text-[10px] tracking-[0.35em] font-light mt-0.5">
            IMMOBILIER · MAROC
          </span>
          <span className="text-or/60 text-[9px] tracking-widest mt-1 font-light">
            VOTRE CLÉ VERS L'EXCEPTION
          </span>
        </div>
      )}
    </Link>
  );
}
