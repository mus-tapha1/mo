'use client';

// ============================================================
//  Hook لجلب البيانات الحيّة — MUSTAPHA IMMOBILIER
//
//  useLiveData() يعيد:
//  - data: البيانات الحالية (تبدأ بالافتراضية ثم تُحدّث من GitHub)
//  - loading: هل الجلب جارٍ
//  - refresh(): دالة لتحديث البيانات يدوياً
//
//  الاستخدام:
//  const { data, loading } = useLiveData();
//  const properties = data.properties;
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { fetchLiveData, refreshLiveData, getLiveDataSync, getFallbackData } from '@/lib/live-data';

export function useLiveData() {
  // نبدأ بالبيانات الافتراضية فوراً (من البناء أو الذاكرة المؤقتة)
  const [data, setData] = useState(() => {
    if (typeof window === 'undefined') return getFallbackData();
    return getLiveDataSync();
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const liveData = await fetchLiveData();
        if (mounted) {
          setData(liveData);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    const fresh = await refreshLiveData();
    setData(fresh);
    return fresh;
  }, []);

  return { data, loading, refresh };
}

// Hooks متخصصة لكل نوع بيانات
export function useLiveProperties() {
  const { data, loading, refresh } = useLiveData();
  return { properties: data.properties || [], loading, refresh };
}

export function useLiveLotissements() {
  const { data, loading, refresh } = useLiveData();
  return { lotissements: data.lotissements || [], loading, refresh };
}

export function useLiveManatiq() {
  const { data, loading, refresh } = useLiveData();
  return { manatiq: data.manatiq || [], loading, refresh };
}

export function useLiveVideos() {
  const { data, loading, refresh } = useLiveData();
  return { videos: data.videos || [], loading, refresh };
}

export function useLiveConfig() {
  const { data, loading, refresh } = useLiveData();
  return { config: data.config || {}, loading, refresh };
}

export default useLiveData;
