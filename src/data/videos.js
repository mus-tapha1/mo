// ============================================================
//  بيانات الفيديوهات — تُقرأ من المصدر المركزي site-data/data.json
//  عند البناء. دوال المساعدة (extractYoutubeId, getThumbnail)
//  ثابتة.
// ============================================================

import { getCentralVideos } from '@/lib/data-loader';

export const videos = getCentralVideos();

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
