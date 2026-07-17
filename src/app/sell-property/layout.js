import { config } from '@/config/site';

export const metadata = {
  title: 'أضف عقارك للبيع',
  description: `أضف عقارك للبيع في ${config.city} مع ${config.brand.nameAr}. ابدأ بمعطيات واضحة عن السعر والموقع والمساحة، وسنقرأ العقار وننظّم المعطيات قبل عرضه على المشترين.`,
  alternates: { canonical: '/sell-property' },
  openGraph: {
    title: `أضف عقارك للبيع — ${config.brand.nameAr} للعقارات`,
    description: `أضف عقارك للبيع في ${config.city}.`,
    url: 'https://mus-tapha1.github.io/mo/sell-property',
  },
};

export default function SellPropertyLayout({ children }) {
  return children;
}
