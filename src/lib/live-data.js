// ============================================================
//  نظام البيانات الحيّة — MUSTAPHA IMMOBILIER
//
//  يجلب البيانات مباشرة من raw.githubusercontent.com (data.json)
//  بدون الحاجة لإعادة بناء الموقع. التغييرات تظهر فوراً.
//
//  آلية العمل:
//  1. عند تحميل أي صفحة، نحاول جلب data.json من GitHub
//  2. نحفظها في localStorage كذاكرة مؤقتة
//  3. نعيد البيانات للصفحة لتعرضها
//  4. إذا فشل الجلب، نستخدم البيانات الافتراضية (من البناء)
// ============================================================

import { generatedData } from '@/data/_generated';
import { properties as _defaultProperties, propertyTypes, budgetRanges } from '@/data/_defaults/properties';
import { lotissements as _defaultLotissements } from '@/data/_defaults/lotissements';
import { manatiq as _defaultManatiq } from '@/data/_defaults/manatiq';
import { videos as _defaultVideos } from '@/data/_defaults/videos';
import { defaultConfig as _defaultConfig } from '@/config/_defaults_config';

const REPO_OWNER = 'mus-tapha1';
const REPO_NAME = 'mo';
const RAW_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/site-data/data.json`;

const CACHE_KEY = 'mus_live_data';
const CACHE_TIMESTAMP_KEY = 'mus_live_data_ts';
// مدة صلاحية الذاكرة المؤقتة: 5 دقائق
const CACHE_TTL = 5 * 60 * 1000;

const isClient = typeof window !== 'undefined';

// ============================================================
//  تطبيع مسارات الصور — تحويل المسارات النسبية إلى raw GitHub URL
//
//  الصور المرفوعة من لوحة التحكم تُخزَّن كمسار نسبي مثل:
//    /public/uploads/img-xxx.jpg
//  على الموقع المنشور (بدون بناء) لا يمكن الوصول لهذا المسار،
//  لذا نحوّله إلى raw GitHub URL الذي يعمل دائماً:
//    https://raw.githubusercontent.com/mus-tapha1/mo/main/public/uploads/img-xxx.jpg
// ============================================================
const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`;

export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return url;
  // إذا كان رابطاً كاملاً (http/https/data:) نعيده كما هو
  if (/^(https?:|data:)/i.test(url)) return url;

  let cleanPath = url.replace(/^\//, ''); // إزالة الشرطة المائلة الأمامية إن وجدت

  // إذا كان المسار يبدأ بـ uploads/ (بدون public/)
  if (cleanPath.startsWith('uploads/')) {
    cleanPath = `public/${cleanPath}`;
  }

  // إذا كان المسار يبدأ بـ public/uploads/
  if (cleanPath.startsWith('public/uploads/')) {
    return `${RAW_BASE}/${cleanPath}`;
  }

  return url;
}

// تطبيع جميع الصور في عنصر واحد (image + gallery)
function normalizeItemImages(item) {
  if (!item || typeof item !== 'object') return item;
  const out = { ...item };
  if (out.image) out.image = normalizeImageUrl(out.image);
  if (Array.isArray(out.gallery)) {
    out.gallery = out.gallery.map(normalizeImageUrl);
  }
  if (out.images && Array.isArray(out.images)) {
    out.images = out.images.map(normalizeImageUrl);
  }
  // حقول إضافية محتملة
  if (out.logo) out.logo = normalizeImageUrl(out.logo);
  if (out.thumbnail) out.thumbnail = normalizeImageUrl(out.thumbnail);
  if (out.cover) out.cover = normalizeImageUrl(out.cover);
  return out;
}

// تطبيع جميع الصور في البيانات الكاملة
function normalizeAllImages(data) {
  if (!data || typeof data !== 'object') return data;
  const out = { ...data };
  if (Array.isArray(out.properties)) {
    out.properties = out.properties.map(normalizeItemImages);
  }
  if (Array.isArray(out.lotissements)) {
    out.lotissements = out.lotissements.map(normalizeItemImages);
  }
  if (Array.isArray(out.manatiq)) {
    out.manatiq = out.manatiq.map(normalizeItemImages);
  }
  if (Array.isArray(out.videos)) {
    out.videos = out.videos.map(normalizeItemImages);
  }
  // تطبيع صور الإعدادات
  if (out.config && typeof out.config === 'object') {
    out.config = normalizeItemImages(out.config);
  }
  return out;
}

// البيانات الافتراضية (من البناء)
const fallbackData = {
  properties: (generatedData && Array.isArray(generatedData.properties) && generatedData.properties.length)
    ? generatedData.properties : _defaultProperties,
  lotissements: (generatedData && Array.isArray(generatedData.lotissements) && generatedData.lotissements.length)
    ? generatedData.lotissements : _defaultLotissements,
  manatiq: (generatedData && Array.isArray(generatedData.manatiq) && generatedData.manatiq.length)
    ? generatedData.manatiq : _defaultManatiq,
  videos: (generatedData && Array.isArray(generatedData.videos) && generatedData.videos.length)
    ? generatedData.videos : _defaultVideos,
  config: (generatedData && generatedData.config) ? generatedData.config : _defaultConfig,
};

// قراءة الذاكرة المؤقتة من localStorage
function readCache() {
  if (!isClient) return null;
  try {
    const ts = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw || !ts) return null;
    const age = Date.now() - parseInt(ts, 10);
    if (age > CACHE_TTL) return null; // انتهت صلاحيتها
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// حفظ الذاكرة المؤقتة
function writeCache(data) {
  if (!isClient) return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch {
    // تجاهل أخطاء التخزين
  }
}

// جلب البيانات من GitHub (مع cache-busting)
let _fetchPromise = null;

export async function fetchLiveData() {
  // إذا كان هناك طلب جارٍ، نعيد نفس الوعد
  if (_fetchPromise) return _fetchPromise;

  _fetchPromise = (async () => {
    // 1. تحقق من الذاكرة المؤقتة أولاً
    const cached = readCache();
    if (cached) {
      // اطلب البيانات في الخلفية لتحديث الذاكرة (stale-while-revalidate)
      _backgroundRefresh();
      return cached;
    }

    // 2. جلب من GitHub
    try {
      const res = await fetch(`${RAW_URL}?_t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const normalized = normalizeAllImages(data);
      writeCache(normalized);
      return normalized;
    } catch (err) {
      // 3. fallback للبيانات الافتراضية
      return fallbackData;
    } finally {
      _fetchPromise = null;
    }
  })();

  return _fetchPromise;
}

// تحديث الذاكرة في الخلفية (بدون انتظار)
let _bgRefreshing = false;
function _backgroundRefresh() {
  if (_bgRefreshing) return;
  _bgRefreshing = true;
  fetch(`${RAW_URL}?_t=${Date.now()}`, { cache: 'no-store' })
    .then((r) => r.json())
    .then((data) => {
      writeCache(normalizeAllImages(data));
    })
    .catch(() => {})
    .finally(() => {
      _bgRefreshing = false;
    });
}

// إجبار التحديث (عند الحاجة)
export async function refreshLiveData() {
  if (!isClient) return fallbackData;
  try {
    const res = await fetch(`${RAW_URL}?_t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const normalized = normalizeAllImages(data);
    writeCache(normalized);
    return normalized;
  } catch {
    return readCache() || fallbackData;
  }
}

// الحصول على البيانات الافتراضية فوراً (متزامن)
export function getLiveDataSync() {
  const cached = readCache();
  if (cached) return cached;
  return normalizeAllImages(fallbackData);
}

export function getFallbackData() {
  return fallbackData;
}

// دوال مساعدة للوصول السريع
export function getFallbackProperties() {
  return fallbackData.properties;
}
export function getFallbackLotissements() {
  return fallbackData.lotissements;
}
export function getFallbackManatiq() {
  return fallbackData.manatiq;
}
export function getFallbackVideos() {
  return fallbackData.videos;
}
export function getFallbackConfig() {
  return fallbackData.config;
}

export { propertyTypes, budgetRanges, RAW_URL };

export default {
  fetchLiveData,
  refreshLiveData,
  getLiveDataSync,
  getFallbackData,
  getFallbackProperties,
  getFallbackLotissements,
  getFallbackManatiq,
  getFallbackVideos,
  getFallbackConfig,
  propertyTypes,
  budgetRanges,
  RAW_URL,
  normalizeImageUrl,
  normalizeAllImages,
};
