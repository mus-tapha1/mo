// هذا الـ layout خاص بصفحة /dashboard فقط
// يضيف وسوم PWA (manifest, apple-touch-icon, theme-color) هنا فقط
// وليس في الـ layout الجذري — حتى لا يصبح الموقع كله تطبيقاً

export const metadata = {
  title: 'لوحة التحكم | مصطفى للعقارات',
  description: 'لوحة إدارة عقارات مصطفى — إدارة العقارات والتجزئات والمناطق والفيديوهات',
  manifest: '/mo/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'لوحة التحكم',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/mo/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/mo/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/mo/icons/icon-192.png',
  },
};

export const viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function DashboardLayout({ children }) {
  return (
    <>
      {children}
      {/* تسجيل Service Worker للوحة التحكم فقط */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/mo/sw-dashboard.js', { scope: '/mo/dashboard/' })
                  .then(function(reg) {
                    console.log('[PWA] Service Worker مسجل بنجاح:', reg.scope);
                  })
                  .catch(function(err) {
                    console.warn('[PWA] فشل تسجيل Service Worker:', err);
                  });
              });
            }
          `,
        }}
      />
    </>
  );
}
