import { config } from '@/config/site';

export const metadata = {
  title: 'التجزئات الفاخرة',
  description: `اكتشف أرقى التجزئات العقارية في ${config.city} — حدائق حلولة، تجزئة الرياض والمزيد. ${config.brand.nameAr} يرشدك نحو أفضل المناطق للاستثمار العقاري.`,
  alternates: { canonical: '/lotissements' },
  openGraph: {
    title: `التجزئات الفاخرة — ${config.brand.nameAr} للعقارات`,
    description: `أرقى التجزئات العقارية في ${config.city}.`,
    url: 'https://mus-tapha1.github.io/mo/lotissements',
  },
};

export default function LotissementsLayout({ children }) {
  return children;
}
