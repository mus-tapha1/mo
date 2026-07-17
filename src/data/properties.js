// ============================================================
//  بيانات العقارات — تُقرأ من المصدر المركزي site-data/data.json
//  عند البناء. أي تعديل من لوحة التحكم يُحدّث data.json ثم
//  يُعاد البناء → تظهر التغييرات لكل الزوار.
//  propertyTypes و budgetRanges ثابتة (ثوابت واجهة).
// ============================================================

import { getCentralProperties, propertyTypes, budgetRanges } from '@/lib/data-loader';

export const properties = getCentralProperties();
export { propertyTypes, budgetRanges };

export function getPropertyById(id) {
  return properties.find((p) => p.id === id);
}

export function getFeaturedProperties() {
  return properties.filter((p) => p.featured);
}

export default properties;
