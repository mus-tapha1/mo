'use client';

import { useState, useEffect } from 'react';

// استيراد آمن جداً
import * as Store from '@/lib/store';
import * as Sync from '@/lib/github-sync';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [items, setItems] = useState([]);
  const [cfg, setCfg] = useState({});
  const [githubToken, setGithubToken] = useState('');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        if (Store.isAuthenticated()) {
          setAuth(true);
          setItems(Store.getProperties() || []);
          setCfg(Store.getConfig() || {});
          const settings = Sync.getSyncSettings();
          if (settings && settings.token) setGithubToken(settings.token);
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      if (Store.login(password)) {
        setAuth(true);
        setItems(Store.getProperties() || []);
        setCfg(Store.getConfig() || {});
        const settings = Sync.getSyncSettings();
        if (settings && settings.token) setGithubToken(settings.token);
      } else {
        setLoginError(true);
        setPassword('');
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleSync = async () => {
    try {
      await Store.syncAllToGitHub();
      alert('تم التحديث بنجاح ✓');
    } catch (err) {
      alert('فشل: ' + err.message);
    }
  };

  const handleSaveConfig = async () => {
    try {
      Store.saveConfig(cfg);
      Sync.saveSyncSettings(githubToken);
      await Store.saveTokenToData(githubToken);
      alert('تم الحفظ');
      handleSync();
    } catch (e) {
      alert("خطأ: " + e.message);
    }
  };

  if (!mounted) return null;

  if (!auth) {
    return (
      <div style={{minHeight:'100vh', background:'#000', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
        <form onSubmit={handleLogin} style={{padding:'40px', border:'1px solid #c9a14a', borderRadius:'20px', width:'100%', maxWidth:'400px', background:'#111'}}>
          <h1 style={{color:'#c9a14a', textAlign:'center', marginBottom:'30px'}}>دخول لوحة التحكم</h1>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #333', borderRadius:'8px', color:'#fff', marginBottom:'15px'}} 
            placeholder="كلمة المرور"
          />
          {loginError && <p style={{color:'red', textAlign:'center', fontSize:'14px'}}>خطأ في كلمة المرور</p>}
          <button style={{width:'100%', padding:'12px', background:'#c9a14a', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'#000', color:'#fff', fontFamily:'sans-serif'}}>
      <header style={{padding:'15px 30px', borderBottom:'1px solid #222', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#000', position:'sticky', top:0, zIndex:100}}>
        <h1 style={{color:'#c9a14a', margin:0, fontSize:'20px'}}>MUSTAPHA IMMOBILIER CMS</h1>
        <div style={{display:'flex', gap:'20px'}}>
          <button onClick={handleSync} style={{color:'#c9a14a', background:'none', border:'1px solid #c9a14a', padding:'5px 15px', borderRadius:'20px', cursor:'pointer'}}>نشر التعديلات</button>
          <button onClick={() => { Store.logout(); setAuth(false); }} style={{color:'#666', background:'none', border:'none', cursor:'pointer'}}>خروج</button>
        </div>
      </header>

      <div style={{maxWidth:'1200px', margin:'0 auto', padding:'40px 20px', display:'grid', gridTemplateColumns:'250px 1fr', gap:'40px'}}>
        <aside style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          <button onClick={() => setActiveTab('properties')} style={{textAlign:'right', padding:'12px', borderRadius:'10px', background: activeTab==='properties' ? '#c9a14a' : 'transparent', color: activeTab==='properties' ? '#000' : '#888', border:'none', cursor:'pointer', fontWeight:'bold'}}>🏠 العقارات</button>
          <button onClick={() => setActiveTab('config')} style={{textAlign:'right', padding:'12px', borderRadius:'10px', background: activeTab==='config' ? '#c9a14a' : 'transparent', color: activeTab==='config' ? '#000' : '#888', border:'none', cursor:'pointer', fontWeight:'bold'}}>⚙ الإعدادات</button>
          <a href="/mo/" target="_blank" style={{textAlign:'right', padding:'12px', color:'#555', textDecoration:'none', fontSize:'14px', marginTop:'20px'}}>🌐 عرض الموقع العام</a>
        </aside>

        <main style={{background:'#0a0a0a', padding:'30px', borderRadius:'20px', border:'1px solid #111'}}>
          {activeTab === 'properties' && (
            <div>
              <h2 style={{marginBottom:'30px'}}>العقارات ({items.length})</h2>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'20px'}}>
                {items.map(item => (
                  <div key={item.id} style={{padding:'15px', background:'#111', borderRadius:'15px', border:'1px solid #222', display:'flex', gap:'15px', alignItems:'center'}}>
                    <img src={item.image} style={{width:'50px', height:'50px', objectCover:'cover', borderRadius:'8px'}} onError={(e)=>e.target.src='https://placehold.co/100'} />
                    <div style={{overflow:'hidden'}}>
                      <div style={{fontWeight:'bold', whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden'}}>{item.title}</div>
                      <div style={{fontSize:'12px', color:'#c9a14a'}}>{item.priceLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div style={{maxWidth:'600px'}}>
              <h2 style={{marginBottom:'30px'}}>الإعدادات</h2>
              <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                <div>
                  <label style={{display:'block', fontSize:'12px', color:'#666', marginBottom:'8px'}}>GITHUB TOKEN</label>
                  <input type="password" value={githubToken} onChange={(e)=>setGithubToken(e.target.value)} style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} />
                </div>
                <div>
                  <label style={{display:'block', fontSize:'12px', color:'#666', marginBottom:'8px'}}>الاسم (عربي)</label>
                  <input value={cfg?.brand?.nameAr || ''} onChange={(e)=>setCfg({...cfg, brand:{...(cfg.brand||{}), nameAr:e.target.value}})} style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} />
                </div>
                <div>
                  <label style={{display:'block', fontSize:'12px', color:'#666', marginBottom:'8px'}}>الهاتف</label>
                  <input value={cfg?.contact?.phone || ''} onChange={(e)=>setCfg({...cfg, contact:{...(cfg.contact||{}), phone:e.target.value}})} style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} />
                </div>
                <button onClick={handleSaveConfig} style={{marginTop:'20px', padding:'15px', background:'#c9a14a', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>حفظ التعديلات</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
