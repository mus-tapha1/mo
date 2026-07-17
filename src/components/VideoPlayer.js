'use client';

import { useState } from 'react';

export default function VideoPlayer({ video, compact = false }) {
  const [playing, setPlaying] = useState(false);
  const ytId = video.youtubeId || video.youtubeUrl?.match(/(?:watch\?v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1];

  if (compact) {
    // وضع مدمج: صورة مصغّرة + زر تشغيل
    return (
      <div className="relative rounded-xl overflow-hidden group cursor-pointer" onClick={() => setPlaying(true)}>
        {!playing ? (
          <>
            <img
              src={video.thumbnail || `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
              alt={video.title}
              className="w-full h-48 object-cover"
              loading="lazy"
              onError={(e) => { e.target.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`; }}
            />
            <div className="absolute inset-0 bg-noir/40 flex items-center justify-center group-hover:bg-noir/20 transition-colors">
              <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#0a0a0a"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
            {video.duration && (
              <span className="absolute bottom-2 left-2 bg-noir/80 text-creme text-xs px-2 py-0.5 rounded">
                {video.duration}
              </span>
            )}
          </>
        ) : (
          <div className="w-full h-48 bg-noir">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              title={video.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    );
  }

  // وضع كامل
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-noir gold-glow">
      {!playing ? (
        <div className="relative w-full h-full cursor-pointer group" onClick={() => setPlaying(true)}>
          <img
            src={video.thumbnail || `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-noir/20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-transform gold-glow">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#0a0a0a"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <p className="text-creme/70 text-sm">{video.duration || 'شاهد الآن'}</p>
            </div>
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
          title={video.title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}
