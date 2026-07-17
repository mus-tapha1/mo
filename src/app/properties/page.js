'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import Reveal from '@/components/Reveal';
import { properties as propertiesDefault, propertyTypes, budgetRanges } from '@/data/properties';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [typeFilter, setTypeFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [search, setSearch] = useState('');
  const [initialized, setInitialized] = useState(false);

  // قراءة معاملات URL عند التحميل (من نموذج البحث في الهيرو)
  useEffect(() => {
    if (!initialized) {
      const type = searchParams.get('type');
      const budget = searchParams.get('budget');
      const q = searchParams.get('q');
      if (type) setTypeFilter(type);
      if (budget) setBudgetFilter(budget);
      if (q) setSearch(q);
      setInitialized(true);
    }
  }, [searchParams, initialized]);

  const filtered = useMemo(() => {
    return propertiesDefault.filter((p) => {
      if (typeFilter && p.typeKey !== typeFilter) return false;
      const range = budgetRanges.find((r) => r.key === budgetFilter);
      if (range && (p.price < range.min || p.price > range.max)) return false;
      if (search) {
        const query = search.toLowerCase();
        const text = `${p.title} ${p.city} ${p.area} ${p.type}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });
  }, [typeFilter, budgetFilter, search]);

  return (
    <>
      <Header />

      <main id="main-content">
      {/* رأس الصفحة */}
      <section className="pt-32 pb-12 px-4 sm:px-6 bg-noir-50/30 border-b border-gold">
        <div className="max-w-7xl mx-auto text-center">
          <Reveal>
            <span className="text-or/60 text-xs tracking-[0.4em] font-light">CATALOGUE</span>
            <h1 className="text-4xl sm:text-5xl font-bold mt-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="text-creme">كل</span> <span className="text-gold">العقارات</span>
            </h1>
            <div className="gold-divider w-32 mx-auto mt-4" />
          </Reveal>
        </div>
      </section>

      {/* الفلاتر */}
      <section className="sticky top-16 z-30 bg-noir/95 backdrop-blur-lg border-b border-gold py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="ابحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-noir-100 border border-gold rounded-full px-5 py-2.5 text-creme text-sm placeholder-creme/40 focus:outline-none focus:border-or-clair w-full sm:w-48"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-noir-100 border border-gold rounded-full px-5 py-2.5 text-creme text-sm focus:outline-none focus:border-or-clair"
          >
            {propertyTypes.map((t) => (
              <option key={t.key} value={t.key} className="bg-noir">{t.label}</option>
            ))}
          </select>

          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="bg-noir-100 border border-gold rounded-full px-5 py-2.5 text-creme text-sm focus:outline-none focus:border-or-clair"
          >
            {budgetRanges.map((b) => (
              <option key={b.key} value={b.key} className="bg-noir">{b.label}</option>
            ))}
          </select>

          {(typeFilter || budgetFilter || search) && (
            <button
              onClick={() => { setTypeFilter(''); setBudgetFilter(''); setSearch(''); }}
              className="text-creme/50 hover:text-or-clair text-xs transition-colors flex items-center gap-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" /></svg>
              مسح الفلاتر
            </button>
          )}

          <span className="text-creme/40 text-xs mr-auto">
            {filtered.length} عقار
          </span>
        </div>
      </section>

      {/* القائمة */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-creme/50 text-lg">لا توجد عقارات مطابقة لبحثك</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={(i % 6) * 80}>
                  <PropertyCard property={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
      </main>

      <Footer />
    </>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-creme/50">جاري التحميل...</p>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
