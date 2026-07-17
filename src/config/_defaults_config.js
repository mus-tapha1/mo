// ============================================================
//  الإعدادات الافتراضية — آمنة للعميل (لا تستخدم fs)
//  MUSTAPHA IMMOBILIER
//
//  هذا الملف يحتوي على الإعدادات الافتراضية والدوال المساعدة.
//  لا يستورد أي وحدة Node.js (مثل fs) لذا يمكن استخدامه
//  بأمان في مكونات العميل (client components).
//  ملف site.js يدمج هذه الإعدادات مع الإعدادات المركزية
//  من data.json عند البناء.
// ============================================================

export const defaultConfig = {
  // ---- العلامة التجارية ----
  brand: {
    name: 'MUSTAPHA IMMOBILIER',
    nameAr: 'مصطفى للعقارات',
    country: 'Morocco',
    countryAr: 'المغرب',
    tagline: 'VOTRE CLÉ VERS L’EXCEPTION',
    taglineAr: 'مفاتيحك نحو التميّز',
    suffix: '',
    suffixAr: '',
    fullAr: 'مصطفى للعقارات — المغرب',
  },

  // ---- الألوان ----
  colors: {
    noir: '#0a0a0a',
    or: '#c9a14a',
    orClair: '#e6c87a',
    creme: '#f5efe0',
  },

  // ---- المدينة المستهدفة ----
  city: 'القنيطرة',
  cityFr: 'Kénitra',

  // ---- معلومات التواصل ----
  contact: {
    phone: '+212 6 00 00 00 00',
    phoneHref: '+212600000000',
    email: 'contact@mustapha-immobilier.ma',
    whatsapp: '+212600000000',
  },

  // ---- روابط التواصل الاجتماعي ----
  social: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    youtube: 'https://www.youtube.com/',
    tiktok: 'https://www.tiktok.com/',
    twitter: 'https://x.com/',
    pinterest: 'https://pinterest.com/',
    linktree: 'https://linktr.ee/',
  },

  // ---- اللغة الافتراضية ----
  lang: 'ar',
  dir: 'rtl',
};

// دمج عميق للإعدادات المركزية مع الافتراضية
export function deepMerge(base, override) {
  if (!override) return base;
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key]) &&
      override[key] &&
      typeof override[key] === 'object'
    ) {
      result[key] = deepMerge(base[key], override[key]);
    } else if (override[key] !== undefined) {
      result[key] = override[key];
    }
  }
  return result;
}

// ============================================================
//  دوال مساعدة لروابط الواتساب والمشاركة الاجتماعية
//  تعمل مع أي كائن config (افتراضي أو مدمج)
// ============================================================

export function whatsappLink(cfg = defaultConfig, message = '') {
  const num = cfg.contact.whatsapp.replace(/[^0-9]/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${num}${text}`;
}

export function whatsappShareLink(cfg = defaultConfig, title, url) {
  return whatsappLink(cfg, `السلام عليكم، أريد الاستفسار عن هذا العقار: ${title}\n${url}`);
}

export function facebookShareLink(url) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function twitterShareLink(url, text = '') {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

export function pinterestShareLink(url, media, description = '') {
  return `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(description)}`;
}
