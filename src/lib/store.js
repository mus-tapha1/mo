// ============================================================
//  نظام التخزين الموحد — MUSTAPHA IMMOBILIER
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
  return read(STORAGE_KEYS.properties, propertiesDefault);
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

export function getLotissements() {
  return read(STORAGE_KEYS.lotissements, lotissementsDefault);
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

export function getManatiq() {
  return read(STORAGE_KEYS.manatiq, manatiqDefault);
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

export function getVideos() {
  return read(STORAGE_KEYS.videos, videosDefault);
}

export function saveVideos(list) {
  write(STORAGE_KEYS.videos, list);
}

export function addVideo(item) {
  const list = getVideos();
  const id = `vid-${Date.now()}`;
  saveVideos([{ ...item, id }, ...list]);
}

export function updateVideo(id, updates) {
  const list = getVideos();
  const idx = list.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  saveVideos(list);
}

export function deleteVideo(id) {
  saveVideos(getVideos().filter((v) => v.id !== id));
}

export function getConfig() {
  return read(STORAGE_KEYS.config, configDefault);
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

export function getAllData() {
  return {
    properties: getProperties(),
    lotissements: getLotissements(),
    manatiq: getManatiq(),
    videos: getVideos(),
    config: getConfig(),
    adminPassword: getAdminPassword(),
  };
}

export async function syncAllToGitHub() {
  const data = getAllData();
  const result = await syncDataToRepo(data);
  return result;
}

export async function pullFromGitHub() {
  const data = await fetchDataFromRepo();
  if (data) {
    if (data.properties) saveProperties(data.properties);
    if (data.lotissements) saveLotissements(data.lotissements);
    if (data.manatiq) saveManatiq(data.manatiq);
    if (data.videos) saveVideos(data.videos);
    if (data.config) saveConfig(data.config);
    if (data.adminPassword) setAdminPassword(data.adminPassword);
    if (data.githubToken) setCachedToken(data.githubToken);
  }
  return data;
}

export async function initializeTokenFromData() {
  const data = await fetchDataFromRepo();
  if (data && data.githubToken) {
    setCachedToken(data.githubToken);
    return data.githubToken;
  }
  return null;
}

export async function saveTokenToData(token) {
  const data = getAllData();
  data.githubToken = token;
  await syncDataToRepo(data);
}
