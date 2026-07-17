// ============================================================
//  نظام التخزين الموحد — MUSTAPHA IMMOBILIER
// ============================================================

const STORAGE_KEYS = {
  properties: 'mus_properties',
  lotissements: 'mus_lotissements',
  manatiq: 'mus_manatiq',
  videos: 'mus_videos',
  config: 'mus_config',
  auth: 'mus_auth',
  adminPassword: 'mus_admin_password',
};

const DEFAULT_ADMIN_PASSWORD = 'mustapha2026';
const isClient = typeof window !== 'undefined';

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

export function getAdminPassword() {
  return read(STORAGE_KEYS.adminPassword, DEFAULT_ADMIN_PASSWORD);
}

export function setAdminPassword(newPassword) {
  write(STORAGE_KEYS.adminPassword, newPassword);
}

export function getProperties() {
  return read(STORAGE_KEYS.properties, []);
}

export function saveProperties(list) {
  write(STORAGE_KEYS.properties, list);
}

export function getConfig() {
  return read(STORAGE_KEYS.config, {});
}

export function saveConfig(cfg) {
  write(STORAGE_KEYS.config, cfg);
}

export function isAuthenticated() {
  return read(STORAGE_KEYS.auth, false);
}

export function login(password) {
  if (password === getAdminPassword()) {
    write(STORAGE_KEYS.auth, true);
    return true;
  }
  return false;
}

export function logout() {
  write(STORAGE_KEYS.auth, false);
}

// استيراد آمن للمزامنة لتجنب الحلقات التكرارية
import * as Sync from './github-sync';

export async function syncAllToGitHub() {
  const data = {
    properties: getProperties(),
    config: getConfig(),
    adminPassword: getAdminPassword(),
  };
  return await Sync.syncDataToRepo(data);
}

export async function saveTokenToData(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mus_github_token', token);
  }
}
