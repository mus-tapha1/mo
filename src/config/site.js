// ============================================================
//  الإعدادات العامة للموقع — MUSTAPHA IMMOBILIER
//  تُقرأ من المصدر المركزي site-data/data.json عند البناء،
//  مع دمج القيم الافتراضية. دوال المساعدة تعمل مع
//  الإعدادات المدمجة.
//
//  ملاحظة: هذا الملف يستورد data-loader (الذي يستخدم fs).
//  لذلك يمكن استخدامه فقط في مكونات الخادم (server components)
//  وملفات التخطيط (layout). لا تستورده في مكونات العميل.
//  مكونات العميل يجب أن تستورد من _defaults_config.js مباشرة.
// ============================================================

import { getCentralConfig } from '@/lib/data-loader';
import {
  defaultConfig,
  deepMerge,
  whatsappLink as _whatsappLink,
  whatsappShareLink as _whatsappShareLink,
  facebookShareLink as _facebookShareLink,
  twitterShareLink as _twitterShareLink,
  pinterestShareLink as _pinterestShareLink,
} from '@/config/_defaults_config';

// دمج الإعدادات المركزية (من data.json) مع الافتراضية
export const config = deepMerge(defaultConfig, getCentralConfig());

export default config;

// ============================================================
//  دوال مساعدة لروابط الواتساب والمشاركة الاجتماعية
//  تستخدم config المدمجة (المركزية + الافتراضية)
// ============================================================

export function whatsappLink(message = '') {
  return _whatsappLink(config, message);
}

export function whatsappShareLink(title, url) {
  return _whatsappShareLink(config, title, url);
}

export function facebookShareLink(url) {
  return _facebookShareLink(url);
}

export function twitterShareLink(url, text = '') {
  return _twitterShareLink(url, text);
}

export function pinterestShareLink(url, media, description = '') {
  return _pinterestShareLink(url, media, description);
}
