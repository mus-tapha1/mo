import { config } from '@/config/site';

export const metadata = {
  title: 'الميديات',
  description: `محتوى ميدياتي يساعدك على فهم السوق العقاري في ${config.city} وقرر بثقة — فيديوهات تشرح كيف تشتري أرضك، موازين السكن، التجزئات الراقية والمزيد.`,
  alternates: { canonical: '/media' },
  openGraph: {
    title: `الميديات — ${config.brand.nameAr} للعقارات`,
    description: `محتوى ميدياتي يساعدك على فهم السوق العقاري في ${config.city}.`,
    url: 'https://mus-tapha1.github.io/mo/media',
  },
};

export default function MediaLayout({ children }) {
  return children;
}
