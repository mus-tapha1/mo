import { config } from '@/config/site';

export const metadata = {
  title: 'كل العقارات',
  description: `تصفّح جميع العقارات المعروضة في ${config.city} — فلل، شقق، بقعة فيلا، محلات تجارية وأراضي فلاحية. ${config.brand.nameAr} ينظّم المعطيات ويوضّح السعر والموقع والمساحة لمساعدتك على القرار.`,
  alternates: { canonical: '/properties' },
  openGraph: {
    title: `كل العقارات — ${config.brand.nameAr} للعقارات`,
    description: `فلل، شقق، بقعة فيلا، محلات تجارية وأراضي فلاحية في ${config.city}.`,
    url: 'https://mus-tapha1.github.io/mo/properties',
  },
};

export default function PropertiesLayout({ children }) {
  return children;
}
