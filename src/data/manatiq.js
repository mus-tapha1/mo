// ============================================================
//  بيانات المناطق/الأحياء — تُقرأ من المصدر المركزي site-data/data.json
//  عند البناء.
// ============================================================

import { getCentralManatiq } from '@/lib/data-loader';

export const manatiq = getCentralManatiq();

export function getManatiqBySlug(slug) {
  return manatiq.find((m) => m.slug === slug);
}

export default manatiq;
