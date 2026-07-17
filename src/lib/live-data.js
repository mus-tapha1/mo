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
// مدة صلاحية الذاكرة المؤقتة: تم تقليلها لـ 30 ثانية لضمان الظهور الفوري
const CACHE_TTL = 30 * 1000;

const isClient = typeof window !== 'undefined';

// ============================================================
//  تطبيع مسارات الصور — تحويل المسارات النسبية إلى raw GitHub URL
// ============================================================
const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`;

export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (/^(https?:|data:)/i.test(url)) return url;

  let cleanPath = url.replace(/^\//, ''); 
  if (cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  if (cleanPath.startsWith('uploads/')) {
    cleanPath = `public/${cleanPath}`;
  }

  if (cleanPath.startsWith('public/uploads/')) {
    return `${RAW_BASE}/${cleanPath}`;
  }

  return url;
}

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
  if (out.logo) out.logo = normalizeImageUrl(out.logo);
  if (out.thumbnail) out.thumbnail = normalizeImageUrl(out.thumbnail);
  if (out.cover) out.cover = normalizeImageUrl(out.cover);
  return out;
}

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
  if (out.config && typeof out.config === 'object') {
    out.config = normalizeItemImages(out.config);
  }
  return out;
}

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

function readCache() {
  if (!isClient) return null;
  try {
    const ts = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw || !ts) return null;
    if (Date.now() - parseInt(ts) > CACHE_TTL) return null;
    return normalizeAllImages(JSON.parse(raw));
  } catch {
    return null;
  }
}

function writeCache(data) {
  if (!isClient || !data) return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch { /* ignore */ }
}

export async function fetchLiveData() {
  const cached = readCache();
  if (cached) return cached;

  try {
    const res = await fetch(`${RAW_URL}?v=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();
    const normalized = normalizeAllImages(data);
    writeCache(normalized);
    return normalized;
  } catch (err) {
    console.warn('Live data fetch failed, using fallback:', err);
    return normalizeAllImages(fallbackData);
  }
}

export function getFallbackData() {
  return normalizeAllImages(fallbackData);
}

export function getLiveDataSync() {
  const cached = readCache();
  if (cached) return cached;
  return getFallbackData();
}

export async function refreshLiveData() {
  if (isClient) {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  }
  return fetchLiveData();
}

export function getFallbackProperties() {
  return (fallbackData.properties || []).map(normalizeItemImages);
}

export function getFallbackLotissements() {
  return (fallbackData.lotissements || []).map(normalizeItemImages);
}

export function getFallbackManatiq() {
  return (fallbackData.manatiq || []).map(normalizeItemImages);
}

export function getFallbackVideos() {
  return (fallbackData.videos || []).map(normalizeItemImages);
}

export function getFallbackConfig() {
  return normalizeItemImages(fallbackData.config || {});
}
