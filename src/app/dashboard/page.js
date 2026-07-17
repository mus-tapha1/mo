'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

// استيراد آمن مع معالجة الأخطاء
import * as Store from '@/lib/store';
import * as Sync from '@/lib/github-sync';

// مكوّن عرض الأخطاء (Error Boundary fallback)
function ErrorFallback({ error }) {
  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-red-500 mb-4">عذراً، حدث خطأ تقني</h1>
      <p className="text-gray-400 mb-6 max-w-md">{error.message || 'حدث خطأ غير متوقع في لوحة التحكم.'}</p>
      <button onClick={() => window.location.reload()} className="bg-yellow-600 px-6 py-2 rounded font-bold">إعادة تحميل الصفحة</button>
    </div>
  );
}

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [auth, setAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [items, setItems] = useState([]);
  const [cfg, setCfg] = useState({});
  const [githubToken, setGithubToken] = useState('');

  // ضمان العمل فقط في العميل (Client-side only)
  useEffect(() => {
    setIsMounted(true);
    try {
      if (Store.isAuthenticated()) {
        setAuth(true);
        loadDashboardData();
      }
    } catch (e) {
      console.error("Auth check error:", e);
    }
    setLoading(false);
  }, []);

  const loadDashboardData = () => {
    try {
      setItems(Store.getProperties() || []);
      setCfg(Store.getConfig() || {});
      const settings = Sync.getSyncSettings();
      if (settings && settings.token) setGithubToken(settings.token);
    } catch (e) {
      console.error("Data loading error:", e);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      if (Store.login(password)) {
        setAuth(true);
        loadDashboardData();
      } else {
        setLoginError(true);
        setPassword('');
      }
    } catch (e) {
      alert("خطأ أثناء الدخول: " + e.message);
    }
  };

  const handleSync = async () => {
    try {
      await Store.syncAllToGitHub();
      alert('تم تحديث الموقع بنجاح ✓');
    } catch (err) {
      alert('فشل التحديث: ' + err.message);
    }
  };

  const handleSaveConfig = async () => {
    try {
      Store.saveConfig(cfg);
      Sync.saveSyncSettings(githubToken);
      await Store.saveTokenToData(githubToken);
      alert('تم حفظ الإعدادات بنجاح');
      handleSync();
    } catch (e) {
      alert("خطأ في الحفظ: " + e.message);
    }
  };

  if (!isMounted) return null;
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-500">جارٍ التحميل...</div>;

  if (!auth) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="p-8 border border-yellow-900/50 rounded-2xl w-full max-w-md bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-yellow-500 mb-2">M</div>
            <h1 className="text-xl font-bold">دخول الإدارة</h1>
          </div>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => { setPassword(e.target.value); setLoginError(false); }} 
            className="w-full p-4 bg-black/50 border border-zinc-800 rounded-xl mb-4 focus:border-yellow-600 outline-none transition-all" 
            placeholder="كلمة المرور" 
            autoFocus
          />
          {loginError && <p className="text-red-500 text-sm mb-4 text-center">كلمة المرور غير صحيحة</p>}
          <button className="w-full bg-yellow-600 hover:bg-yellow-500 p-4 rounded-xl font-bold text-black transition-all shadow-lg shadow-yellow-900/20">دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="p-4 border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-yellow-500">M</span>
          <h1 className="text-lg font-bold hidden md:block">لوحة تحكم العقارات</h1>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={handleSync} className="bg-yellow-600/10 text-yellow-500 border border-yellow-600/20 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-yellow-600 hover:text-black transition-all">نشر التعديلات</button>
          <button onClick={() => { Store.logout(); setAuth(false); }} className="text-zinc-500 hover:text-white text-sm">خروج</button>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-2">
          <button onClick={() => setActiveTab('properties')} className={`w-full text-right p-3 rounded-xl transition-all ${activeTab === 'properties' ? 'bg-yellow-600 text-black font-bold shadow-lg shadow-yellow-900/20' : 'hover:bg-zinc-900 text-zinc-400'}`}>🏠 إدارة العقارات</button>
          <button onClick={() => setActiveTab('config')} className={`w-full text-right p-3 rounded-xl transition-all ${activeTab === 'config' ? 'bg-yellow-600 text-black font-bold shadow-lg shadow-yellow-900/20' : 'hover:bg-zinc-900 text-zinc-400'}`}>⚙ الإعدادات العامة</button>
          <div className="pt-4 mt-4 border-t border-zinc-900">
             <Link href="/" target="_blank" className="block w-full text-right p-3 text-zinc-500 hover:text-yellow-500 text-sm">🌐 عرض الموقع العام</Link>
          </div>
        </aside>

        <main className="bg-zinc-900/30 rounded-3xl p-6 md:p-8 border border-zinc-900 min-h-[60vh]">
          {activeTab === 'properties' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">العقارات الحالية</h2>
                <span className="text-zinc-500 text-sm">{items.length} عقار</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map(item => (
                  <div key={item.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-4 hover:border-zinc-700 transition-all group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-all" onError={(e) => e.target.src='https://placehold.co/400x400/000/c9a14a?text=Property'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{item.title}</div>
                      <div className="text-sm text-yellow-500/80">{item.priceLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
              {items.length === 0 && <p className="text-center text-zinc-600 py-20">لا توجد عقارات حالياً.</p>}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
              <h2 className="text-2xl font-bold">الإعدادات</h2>
              
              <div className="space-y-6">
                <section className="space-y-4">
                  <h3 className="text-yellow-500 text-sm font-bold uppercase tracking-widest">المزامنة والأمان</h3>
                  <div className="p-6 bg-black/40 border border-zinc-800 rounded-2xl space-y-4">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-2 uppercase">GitHub Personal Access Token</label>
                      <input 
                        type="password" 
                        value={githubToken} 
                        onChange={(e) => setGithubToken(e.target.value)} 
                        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-yellow-600 outline-none" 
                        placeholder="ghp_xxxxxxxxxxxx"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-yellow-500 text-sm font-bold uppercase tracking-widest">معلومات المكتب</h3>
                  <div className="p-6 bg-black/40 border border-zinc-800 rounded-2xl space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-zinc-500 mb-2 uppercase">الاسم التجاري (عربي)</label>
                        <input 
                          value={cfg?.brand?.nameAr || ''} 
                          onChange={(e) => setCfg({...cfg, brand: {...(cfg.brand||{}), nameAr: e.target.value}})} 
                          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-yellow-600 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-2 uppercase">رقم الهاتف</label>
                        <input 
                          value={cfg?.contact?.phone || ''} 
                          onChange={(e) => setCfg({...cfg, contact: {...(cfg.contact||{}), phone: e.target.value}})} 
                          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-yellow-600 outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                </section>
                
                <div className="pt-4">
                  <button onClick={handleSaveConfig} className="w-full md:w-auto bg-yellow-600 hover:bg-yellow-500 px-10 py-4 rounded-2xl font-bold text-black transition-all shadow-xl shadow-yellow-900/10">حفظ كافة التغييرات</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
