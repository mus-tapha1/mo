import { config } from '@/config/site';

export const metadata = {
  title: 'من نحن',
  description: `${config.brand.nameAr} — منصة عقارية في ${config.city} نقرأ العقار قبل أن نقترحه. نركّز على تنظيم المعطيات وتوضيح السعر والموقع والمساحة لمساعدتك على اتخاذ قرار أكثر وعياً.`,
  alternates: { canonical: '/about' },
  openGraph: {
    title: `من نحن — ${config.brand.nameAr} للعقارات`,
    description: `منصة عقارية في ${config.city} نقرأ العقار قبل أن نقترحه.`,
    url: 'https://mus-tapha1.github.io/mo/about',
  },
};

export default function AboutLayout({ children }) {
  return children;
}
