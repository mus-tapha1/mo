'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Logo from './Logo';
import { config } from '@/config/site';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/properties', label: 'العقارات' },
  { href: '/media', label: 'الميادين' },
  { href: '/lotissements', label: 'التجزئات' },
  { href: '/manatiq', label: 'المناطق' },
  { href: '/about', label: 'من نحن' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-noir/95 backdrop-blur-lg border-b border-gold py-2 shadow-lg shadow-black/50'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Logo size="sm" />

          {/* روابط سطح المكتب */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="القائمة الرئيسية">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    active ? 'text-or-clair' : 'text-creme/80 hover:text-or-clair'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-px bg-gold-gradient" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* أزرار يمين */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/sell-property"
              className="btn-outline-gold px-5 py-2.5 rounded-full text-sm font-medium"
            >
              أضف عقارك للبيع
            </Link>
            <Link
              href="/contact"
              className="btn-gold px-5 py-2.5 rounded-full text-sm"
            >
              تواصل معنا
            </Link>
          </div>

          {/* زر القائمة (موبايل) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-or-clair p-2"
            aria-label="القائمة"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* قائمة الموبايل */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-noir/95 backdrop-blur-xl" onClick={() => setMenuOpen(false)} />
          <nav className="relative flex flex-col items-center justify-center min-h-screen gap-6 pt-20" aria-label="قائمة الجوال">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-2xl font-medium transition-colors ${
                  pathname === link.href ? 'text-gold' : 'text-creme/90'
                }`}
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {link.label}
              </Link>
            ))}
            <div className="gold-divider w-32 my-2" />
            <Link href="/sell-property" className="btn-outline-gold px-8 py-3 rounded-full">
              أضف عقارك للبيع
            </Link>
            <Link href="/contact" className="btn-gold px-8 py-3 rounded-full">
              تواصل معنا
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
