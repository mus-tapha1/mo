// ============================================================
//  بيانات التجزئات — تُقرأ من المصدر المركزي site-data/data.json
//  عند البناء.
// ============================================================

import { getCentralLotissements } from '@/lib/data-loader';

export const lotissements = getCentralLotissements();

export function getLotissementBySlug(slug) {
  return lotissements.find((l) => l.slug === slug);
}

export default lotissements;
