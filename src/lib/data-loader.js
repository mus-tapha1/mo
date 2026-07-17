// ============================================================
//  محمّل البيانات المركزية — MUSTAPHA IMMOBILIER
//
//  هذا الملف آمن للعميل (لا يستخدم fs).
//  يقرأ البيانات من _generated.js (مُولَّد من data.json
//  بواسطة scripts/prebuild.js قبل البناء)، مع fallback
//  إلى ملفات _defaults/ إذا لم تتوفر بيانات مولّدة.
// ============================================================

import { generatedData } from '@/data/_generated';
import { properties as _defaultProperties, propertyTypes, budgetRanges } from '@/data/_defaults/properties';
import { lotissements as _defaultLotissements } from '@/data/_defaults/lotissements';
import { manatiq as _defaultManatiq } from '@/data/_defaults/manatiq';
import { videos as _defaultVideos } from '@/data/_defaults/videos';

const _data = generatedData || {};

export function getCentralProperties() {
  const props = _data.properties;
  return Array.isArray(props) && props.length ? props : _defaultProperties;
}

export function getCentralLotissements() {
  const lots = _data.lotissements;
  return Array.isArray(lots) && lots.length ? lots : _defaultLotissements;
}

export function getCentralManatiq() {
  const mana = _data.manatiq;
  return Array.isArray(mana) && mana.length ? mana : _defaultManatiq;
}

export function getCentralVideos() {
  const vids = _data.videos;
  return Array.isArray(vids) && vids.length ? vids : _defaultVideos;
}

export function getCentralConfig() {
  return _data.config || {};
}

export function getCentralAdminPassword() {
  return _data.adminPassword || 'mustapha2026';
}

export { propertyTypes, budgetRanges };

export default {
  properties: getCentralProperties(),
  lotissements: getCentralLotissements(),
  manatiq: getCentralManatiq(),
  videos: getCentralVideos(),
  config: getCentralConfig(),
  adminPassword: getCentralAdminPassword(),
};
