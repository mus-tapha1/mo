// Service Worker — لوحة تحكم مصطفى للعقارات
// يخزن صفحة لوحة التحكم فقط للعمل دون اتصال

const CACHE_NAME = 'mustapha-dashboard-v1';
const DASHBOARD_PATH = '/mo/dashboard/';

// الملفات الأساسية للوحة التحكم التي يجب تخزينها
const CORE_ASSETS = [
  '/mo/dashboard/',
  '/mo/manifest.json',
  '/mo/icons/icon-192.png',
  '/mo/icons/icon-512.png',
];

// تثبيت Service Worker — تخزين الأصول الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // نخزن الأصول الأساسية، ونتجاهل الأخطاء لبعض الملفات
      return Promise.allSettled(
        CORE_ASSETS.map((url) =>
          fetch(url, { cache: 'no-store' })
            .then((resp) => {
              if (resp.ok) return cache.put(url, resp);
            })
            .catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// تفعيل Service Worker — تنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// اعتراض الطلبات — استراتيجية: الشبكة أولاً ثم الكاش للوحة التحكم
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // نتدخل فقط في طلبات لوحة التحكم
  const isDashboard = url.pathname.startsWith('/mo/dashboard');

  // طلبات API من GitHub — لا نخزنها
  if (url.hostname === 'api.github.com' || url.hostname === 'raw.githubusercontent.com') {
    return;
  }

  // طلبات GET فقط
  if (event.request.method !== 'GET') return;

  // لطلبات لوحة التحكم: الشبكة أولاً ثم الكاش كاحتياطي
  if (isDashboard) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // نسخ الاستجابة إلى الكاش
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone).catch(() => {});
          });
          return response;
        })
        .catch(() => {
          // عند فشل الشبكة، نستخدم الكاش
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            // محاولة إرجاع صفحة لوحة التحكم الأساسية
            return caches.match(DASHBOARD_PATH).then((fallback) => {
              return fallback || new Response('غير متصل', { status: 503 });
            });
          });
        })
    );
    return;
  }

  // لباقي الطلبات (CSS, JS, الخطوط): الكاش أولاً ثم الشبكة
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // نرجع الكاش فوراً، ونحدث في الخلفية
        fetch(event.request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clone).catch(() => {});
              });
            }
          })
          .catch(() => {});
        return cached;
      }
      // غير موجود في الكاش — نجلبه من الشبكة
      return fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone).catch(() => {});
            });
          }
          return response;
        })
        .catch(() => {
          // الصور: نرجع صورة شفافة فارغة لتجنب الأخطاء
          if (event.request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
          return new Response('', { status: 503 });
        });
    })
  );
});

// استقبال رسائل من الصفحة — لتحديث الكاش عند الطلب
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
