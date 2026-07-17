import './globals.css';
import { config } from '@/config/site';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const SITE_URL = 'https://mus-tapha1.github.io/mo';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${config.brand.nameAr} للعقارات — ${config.brand.taglineAr}`,
    template: `%s | ${config.brand.nameAr} للعقارات`,
  },
  description: `${config.brand.nameAr} للعقارات — منصة عقارية فاخرة في ${config.city}، ${config.brand.countryAr}. نقرأ العقار قبل أن نقترحه. عقارات، تجزئات، فلل، شقق وأراضي فلاحية. ${config.brand.taglineAr}`,
  keywords: [
    'عقارات', 'عقارات القنيطرة', 'القنيطرة', 'المغرب',
    'بيع عقار', 'شراء عقار', 'فيلا', 'شقة', 'بقعة فيلا', 'أرض فلاحية', 'محل تجاري', 'تجزئة',
    'حدائق حلولة', 'تجزئة الرياض', 'وسط المدينة', 'الميموزة', 'فال فلوري',
    'MUSTAPHA IMMOBILIER', 'Kénitra real estate', 'Morocco real estate',
  ],
  authors: [{ name: config.brand.name }],
  creator: config.brand.name,
  publisher: config.brand.name,
  alternates: {
    canonical: '/',
    languages: { 'ar-MA': '/' },
  },
  openGraph: {
    title: `${config.brand.nameAr} للعقارات — ${config.brand.taglineAr}`,
    description: `منصة عقارية فاخرة في ${config.city}. نقرأ العقار قبل أن نقترحه — عقارات، تجزئات وفلل في القنيطرة، المغرب.`,
    type: 'website',
    locale: 'ar_MA',
    siteName: `${config.brand.nameAr} للعقارات`,
    url: SITE_URL,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600596357905-23c75a4a8d92?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: `${config.brand.nameAr} للعقارات — ${config.brand.taglineAr}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.brand.nameAr} للعقارات`,
    description: `منصة عقارية فاخرة في ${config.city}. نقرأ العقار قبل أن نقترحه.`,
    images: ['https://images.unsplash.com/photo-1600596357905-23c75a4a8d92?w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'real estate',
};

export const viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="luxury-texture min-h-screen">
        <a href="#main-content" className="skip-link">تخطّي إلى المحتوى</a>
        {children}
        <ScrollToTop />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
