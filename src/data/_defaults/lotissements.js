// ============================================================
//  بيانات التجزئات العقارية
// ============================================================

export const lotissements = [
  {
    id: 'hadaiq-hallala',
    slug: 'hadaiq-hallala-kenitra',
    title: 'حدائق حلولة',
    city: 'القنيطرة',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    description: 'مشروع عقاري راقٍ بضواحي القنيطرة، يضم بقع فيلا وشقق بتصميم عصري ومرافق متكاملة.',
    features: ['بقع فيلا', 'شقق سكنية', 'مرافق متكاملة', 'أمن 24/7'],
  },
  {
    id: 'hadika-2',
    slug: 'hadika-2-kenitra',
    title: 'حدائق حلولة 2',
    city: 'القنيطرة',
    image: 'https://images.unsplash.com/photo-1600596357905-23c75a4a8d92?w=1200&q=80',
    description: 'المرحلة الثانية من مشروع حدائق حلولة، بمساحات أكبر وتشطيبات فاخرة.',
    features: ['بقع فيلا واسعة', 'مساحات خضراء', 'قرب من المرافق'],
  },
  {
    id: 'riad-kenitra',
    slug: 'riad-kenitra',
    title: 'تجزئة الرياض',
    city: 'القنيطرة',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd841?w=1200&q=80',
    description: 'تجزئة سكنية تابعة للعمران بالقنيطرة، موجّهة للعائلات الباحثة عن هدوء وقرب من الخدمات.',
    features: ['بقع سكنية', 'هدوء', 'قرب المدارس'],
  },
];

export function getLotissementBySlug(slug) {
  return lotissements.find((l) => l.slug === slug);
}

export default lotissements;
