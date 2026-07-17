import { config } from '@/config/site';

export const metadata = {
  title: 'تواصل معنا',
  description: `تواصل مع ${config.brand.nameAr} في ${config.city} — ابدأ بمعطيات واضحة عن مشروعك العقاري وسنبدأ من قراءة أوضح للسعر والموقع قبل القرار. هاتف: ${config.contact.phone}.`,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: `تواصل معنا — ${config.brand.nameAr} للعقارات`,
    description: `تواصل مع ${config.brand.nameAr} في ${config.city}.`,
    url: 'https://mus-tapha1.github.io/mo/contact',
  },
};

export default function ContactLayout({ children }) {
  return children;
}
