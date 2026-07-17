// ============================================================
//  نظام التخزين الموحد — MUSTAPHA IMMOBILIER
//
//  يعمل بطريقتين:
//  1. localStorage — كذاكرة مؤقتة/احتياطية (يعمل دون اتصال)
//  2. GitHub Sync — عند الإعداد، تُرفع التغييرات إلى data.json
//     في المستودع → إعادة بناء تلقائية → تظهر لكل الزوار
//
//  عند تحديث البيانات: تُحفظ في localStorage فورًا (استجابة فورية)
//  ثم تُزامن مع GitHub (لتظهر للجميع بعد إعادة البناء).
// ============================================================

import propertiesDefault, { propertyTypes, budgetRanges } from '@/data/properties';
import lotissementsDefault from '@/data/lotissements';
import manatiqDefault from '@/data/manatiq';
import videosDefault from '@/data/videos';
import { defaultConfig as configDefault } from '@/config/_defaults_config';
import {
  syncDataToRepo,
  fetchDataFromRepo,
  getSyncSettings,
  isSyncConfigured,
  setCachedToken,
} from '@/lib/github-sync';

const STORAGE_KEYS = {
  properties: 'mus_properties',
  lotissements: 'mus_lotissements',
  manatiq: 'mus_manatiq',
  videos: 'mus_videos',
  config: 'mus_config',
  auth: 'mus_auth',
  adminPassword: 'mus_admin_password',
  dataVersion: 'mus_data_version',
};

// كلمة السر الافتراضية (تُقرأ من data.json عند البناء، ولكن هنا
// نحتاج قيمة افتراضية للعميل)
const DEFAULT_ADMIN_PASSWORD = 'mustapha2026';

const isClient = typeof window !== 'undefined';

// ---- دوال قراءة/كتابة عامة ----
function read(key, fallback) {
  if (!isClient) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- كلمة السر ----
export function getAdminPassword() {
  return read(STORAGE_KEYS.adminPassword, DEFAULT_ADMIN_PASSWORD);
}

export function setAdminPassword(newPassword) {
  write(STORAGE_KEYS.adminPassword, newPassword);
}

// ============================================================
//  العقارات
// ============================================================
export function getProperties() {
  return read(STORAGE_KEYS.properties, propertiesDefault);
}

export function getPropertyById(id) {
  return getProperties().find((p) => p.id === id) || null;
}

export function getFeaturedProperties() {
  return getProperties().filter((p) => p.featured);
}

export function saveProperties(list) {
  write(STORAGE_KEYS.properties, list);
}

export function addProperty(item) {
  const list = getProperties();
  const id = item.id || `MUS-${Date.now().toString(36).toUpperCase()}`;
  const newItem = { ...item, id };
  saveProperties([newItem, ...list]);
  return newItem;
}

export function updateProperty(id, updates) {
  const list = getProperties();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  saveProperties(list);
  return list[idx];
}

export function deleteProperty(id) {
  saveProperties(getProperties().filter((p) => p.id !== id));
}

export function resetProperties() {
  if (isClient) localStorage.removeItem(STORAGE_KEYS.properties);
}

// ============================================================
//  التجزئات
// ============================================================
export function getLotissements() {
  return read(STORAGE_KEYS.lotissements, lotissementsDefault);
}

export function getLotissementBySlug(slug) {
  return getLotissements().find((l) => l.slug === slug) || null;
}

export function saveLotissements(list) {
  write(STORAGE_KEYS.lotissements, list);
}

export function addLotissement(item) {
  const list = getLotissements();
  const slug = item.slug || `lotissement-${Date.now().toString(36)}`;
  saveLotissements([{ ...item, slug }, ...list]);
}

export function updateLotissement(slug, updates) {
  const list = getLotissements();
  const idx = list.findIndex((l) => l.slug === slug);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  saveLotissements(list);
  return list[idx];
}

export function deleteLotissement(slug) {
  saveLotissements(getLotissements().filter((l) => l.slug !== slug));
}

// ============================================================
//  المناطق
// ============================================================
export function getManatiq() {
  return read(STORAGE_KEYS.manatiq, manatiqDefault);
}

export function getManatiqBySlug(slug) {
  return getManatiq().find((m) => m.slug === slug) || null;
}

export function saveManatiq(list) {
  write(STORAGE_KEYS.manatiq, list);
}

export function addManatiq(item) {
  const list = getManatiq();
  const slug = item.slug || `manatiq-${Date.now().toString(36)}`;
  saveManatiq([{ ...item, slug }, ...list]);
}

export function updateManatiq(slug, updates) {
  const list = getManatiq();
  const idx = list.findIndex((m) => m.slug === slug);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  saveManatiq(list);
  return list[idx];
}

export function deleteManatiq(slug) {
  saveManatiq(getManatiq().filter((m) => m.slug !== slug));
}

// ============================================================
//  الفيديوهات
// ============================================================
export function getVideos() {
  return read(STORAGE_KEYS.videos, videosDefault);
}

export function getVideoById(id) {
  return getVideos().find((v) => v.id === id) || null;
}

export function saveVideos(list) {
  write(STORAGE_KEYS.videos, list);
}

export function addVideo(item) {
  const list = getVideos();
  const id = item.id || `video-${Date.now().toString(36)}`;
  saveVideos([{ ...item, id }, ...list]);
}

export function updateVideo(id, updates) {
  const list = getVideos();
  const idx = list.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  saveVideos(list);
  return list[idx];
}

export function deleteVideo(id) {
  saveVideos(getVideos().filter((v) => v.id !== id));
}

// ============================================================
//  الإعدادات (العلامة + التواصل)
// ============================================================
export function getConfig() {
  return read(STORAGE_KEYS.config, configDefault);
}

export function saveConfig(newConfig) {
  const merged = { ...configDefault, ...newConfig };
  write(STORAGE_KEYS.config, merged);
  return merged;
}

export function resetConfig() {
  if (isClient) localStorage.removeItem(STORAGE_KEYS.config);
}

// ============================================================
//  المصادقة (لوحة التحكم)
// ============================================================
export function isAuthenticated() {
  return read(STORAGE_KEYS.auth, false) === true;
}

export function login(password) {
  if (password === getAdminPassword()) {
    write(STORAGE_KEYS.auth, true);
    return true;
  }
  return false;
}

export function logout() {
  if (isClient) localStorage.removeItem(STORAGE_KEYS.auth);
}

export function resetAll() {
  if (!isClient) return;
  Object.values(STORAGE_KEYS).forEach((k) => {
    if (k !== STORAGE_KEYS.auth) localStorage.removeItem(k);
  });
}

// ============================================================
//  المزامنة مع GitHub — يجمع كل البيانات في كائن واحد
// ============================================================
export function getAllData() {
  return {
    properties: getProperties(),
    lotissements: getLotissements(),
    manatiq: getManatiq(),
    videos: getVideos(),
    config: getConfig(),
    // adminPassword مُستبعَد من المزامنة لأسباب أمنية (يبقى في localStorage فقط)
  };
}

// مزامنة جميع البيانات الحالية مع GitHub
export async function syncAllToGitHub(onProgress) {
  if (!isSyncConfigured()) {
    throw new Error("لم يتم إعداد GitHub. اذهب إلى الإعدادات.");
  }
  const data = getAllData();
  const syncSettings = getSyncSettings();
  if (syncSettings.token) {
    data.githubToken = syncSettings.token;
  }
  return syncDataToRepo(data, onProgress);
}

// تحميل البيانات من GitHub واستبدال localStorage
export async function pullFromGitHub() {
  if (!isSyncConfigured()) {
    throw new Error('لم يتم إعداد GitHub. اذهب إلى الإعدادات.');
  }
  const data = await fetchDataFromRepo();
  if (data.properties) saveProperties(data.properties);
  if (data.lotissements) saveLotissements(data.lotissements);
  if (data.manatiq) saveManatiq(data.manatiq);
  if (data.videos) saveVideos(data.videos);
  if (data.config) saveConfig(data.config);
  if (data.adminPassword) setAdminPassword(data.adminPassword);
  if (isClient) {
    write(STORAGE_KEYS.dataVersion, data.updatedAt || Date.now());
  }
  return data;
}

// التحقق مما إذا كانت هناك نسخة أحدث في GitHub
export async function checkForUpdates() {
  if (!isSyncConfigured()) return false;
  try {
    const data = await fetchDataFromRepo();
    const localVersion = read(STORAGE_KEYS.dataVersion, null);
    const remoteVersion = data.updatedAt || null;
    if (!localVersion || (remoteVersion && remoteVersion !== localVersion)) {
      return { hasUpdate: true, remoteData: data };
    }
    return { hasUpdate: false };
  } catch {
    return { hasUpdate: false };
  }
}

// ============================================================
//  تحميل التوكن من data.json عند بدء التطبيق
// ============================================================
export async function initializeTokenFromData() {
  if (!isClient) return;
  try {
    const data = await fetchDataFromRepo();
    if (data.githubToken) {
      setCachedToken(data.githubToken);
    }
  } catch {
    // تجاهل الأخطاء — قد لا يكون هناك اتصال بالإنترنت
  }
}

export function getDataVersion() {
  return read(STORAGE_KEYS.dataVersion, null);
}

// دالة لحفظ التوكن في data.json عند تحديثه
export async function saveTokenToData(token) {
  setCachedToken(token);
  const data = getAllData();
  data.githubToken = token;
  await syncDataToRepo(data);
}

export { propertyTypes, budgetRanges, DEFAULT_ADMIN_PASSWORD, isSyncConfigured, getSyncSettings };
export default {
  getProperties, getPropertyById, getFeaturedProperties,
  addProperty, updateProperty, deleteProperty, resetProperties,
  getLotissements, getLotissementBySlug, addLotissement, updateLotissement, deleteLotissement,
  getManatiq, getManatiqBySlug, addManatiq, updateManatiq, deleteManatiq,
  getVideos, getVideoById, addVideo, updateVideo, deleteVideo,
  getConfig, saveConfig, resetConfig,
  isAuthenticated, login, logout, resetAll,
  getAdminPassword, setAdminPassword,
  getAllData, syncAllToGitHub, pullFromGitHub, checkForUpdates, getDataVersion, initializeTokenFromData,
  isSyncConfigured, getSyncSettings,
  propertyTypes, budgetRanges, DEFAULT_ADMIN_PASSWORD,
};
