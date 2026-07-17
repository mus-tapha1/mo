// ============================================================
//  بيانات المناطق/الأحياء المغطاة
// ============================================================

export const manatiq = [
  {
    slug: 'centre-ville-kenitra',
    title: 'وسط المدينة',
    city: 'القنيطرة',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80',
    description: 'قلب القنيطرة النابض: خدمات، نقل، تجارة، وقرب من الإدارات.',
  },
  {
    slug: 'mimouza-kenitra',
    title: 'حي الميموزة',
    city: 'القنيطرة',
    image: 'https://images.unsplash.com/photo-1564013799919-ab6000bffc1e?w=1200&q=80',
    description: 'حي سكني راقٍ معروف بهدوئه وقربه من المرافق التعليمية والتجارية.',
  },
  {
    slug: 'val-fleuri-kenitra',
    title: 'فال فلوري',
    city: 'القنيطرة',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db54?w=1200&q=80',
    description: 'منطقة راقية تجمع بين الفلل الفاخرة والمساحات الخضراء الواسعة.',
  },
];

export function getManatiqBySlug(slug) {
  return manatiq.find((m) => m.slug === slug);
}

export default manatiq;
