import { config } from '@/config/site';

export const metadata = {
  title: 'المناطق',
  description: `تعرّف على أبرز مناطق ${config.city} العقارية — وسط المدينة، حي الميموزة، فال فلوري وغيرها. دليل منطقة شامل من ${config.brand.nameAr} لاتخاذ قرار عقاري واعٍ.`,
  alternates: { canonical: '/manatiq' },
  openGraph: {
    title: `المناطق — ${config.brand.nameAr} للعقارات`,
    description: `أبرز مناطق ${config.city} العقارية — دليل منطقة شامل.`,
    url: 'https://mus-tapha1.github.io/mo/manatiq',
  },
};

export default function ManatiqLayout({ children }) {
  return children;
}
