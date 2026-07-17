// ============================================================
//  بيانات الميادين (الفيديوهات) — مع روابط يوتيوب فعلية
//  كل فيديو له رابط يوتيوب يُعرض داخل الموقع (مشغّل مدمج)
// ============================================================

export const videos = [
  {
    id: 'video-01',
    title: 'اكتشف المدينة واعرف وين تشري أرضك',
    description: 'نصيحة مختصرة تساعدك تفهم أحياء القنيطرة قبل اتخاذ القرار.',
    youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    youtubeId: 'LXb3EKWsInQ',
    thumbnail: 'https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg',
    duration: '04:12',
  },
  {
    id: 'video-02',
    title: 'ميزان السكن: عناوين تحتاج مراجعة قبل العرض',
    description: 'كيف تقرأ العنوان العقاري وتفهم الوضع القانوني قبل الشراء.',
    youtubeUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
    youtubeId: '2Vv-BfVoq4g',
    thumbnail: 'https://img.youtube.com/vi/2Vv-BfVoq4g/maxresdefault.jpg',
    duration: '06:30',
  },
  {
    id: 'video-03',
    title: 'شقة غادي تخليك تستقر بتجزئة راقية بالقنيطرة',
    description: 'تحليل شقة عصرية وتقييم جودة التشطيبات.',
    youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    youtubeId: 'ScMzIvxBSi4',
    thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg',
    duration: '08:15',
  },
  {
    id: 'video-04',
    title: 'السياحة القنيطرية: جولة ميدانية تساعدك تفهم المنطقة',
    description: 'جولة في المعالم والمرافق المحيطة بالمشاريع العقارية.',
    youtubeUrl: 'https://www.youtube.com/watch?v=tPEE9ZwTmy0',
    youtubeId: 'tPEE9ZwTmy0',
    thumbnail: 'https://img.youtube.com/vi/tPEE9ZwTmy0/maxresdefault.jpg',
    duration: '10:45',
  },
  {
    id: 'video-05',
    title: 'المدينة الجديدة للقنيطرة: خرائط ومرافق',
    description: 'تعرف على التوسعات العمرانية الجديدة وفرصها الاستثمارية.',
    youtubeUrl: 'https://www.youtube.com/watch?v=RE4i2bPbZ5I',
    youtubeId: 'RE4i2bPbZ5I',
    thumbnail: 'https://img.youtube.com/vi/RE4i2bPbZ5I/maxresdefault.jpg',
    duration: '07:20',
  },
  {
    id: 'video-06',
    title: 'تجزئة ومدينة جديدة بالقنيطرة: مقارنة شاملة',
    description: 'مقارنة بين التجزئات القديمة والجديدة من حيث السعر والخدمات.',
    youtubeUrl: 'https://www.youtube.com/watch?v=e8M6S8GzslI',
    youtubeId: 'e8M6S8GzslI',
    thumbnail: 'https://img.youtube.com/vi/e8M6S8GzslI/maxresdefault.jpg',
    duration: '12:00',
  },
];

export function getVideoById(id) {
  return videos.find((v) => v.id === id);
}

// استخراج معرّف يوتيوب من رابط كامل
export function extractYoutubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

export function getThumbnail(youtubeId, quality = 'maxresdefault') {
  return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
}

export default videos;
