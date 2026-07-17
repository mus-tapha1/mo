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
  const [items, setItems] = useState([]);
  const [cfg, setCfg] = useState({});
  const [githubToken, setGithubToken] = useState('');

  useEffect(() => {
    setMounted(true);
    if (Store.isAuthenticated()) {
      setAuth(true);
      setItems(Store.getProperties() || []);
      setCfg(Store.getConfig() || {});
      const settings = Sync.getSyncSettings();
      if (settings && settings.token) setGithubToken(settings.token);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (Store.login(password)) {
      setAuth(true);
      setItems(Store.getProperties() || []);
      setCfg(Store.getConfig() || {});
      const settings = Sync.getSyncSettings();
      if (settings && settings.token) setGithubToken(settings.token);
    } else {
      alert('كلمة المرور خطأ');
    }
  };

  if (!mounted) return null;

  if (!auth) {
    return (
      <div style={{padding:'50px', textAlign:'center', background:'#000', minHeight:'100vh', color:'#fff'}}>
        <form onSubmit={handleLogin} style={{maxWidth:'300px', margin:'0 auto', border:'1px solid #c9a14a', padding:'20px', borderRadius:'10px'}}>
          <h2 style={{color:'#c9a14a'}}>دخول الإدارة</h2>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} style={{width:'100%', padding:'10px', marginBottom:'10px', background:'#111', color:'#fff', border:'1px solid #333'}} placeholder="كلمة المرور" />
          <button style={{width:'100%', padding:'10px', background:'#c9a14a', border:'none', fontWeight:'bold'}}>دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{background:'#000', minHeight:'100vh', color:'#fff', fontFamily:'sans-serif', padding:'20px'}}>
      <div style={{maxWidth:'1000px', margin:'0 auto'}}>
        <header style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #222', paddingBottom:'10px', marginBottom:'20px'}}>
          <h1 style={{color:'#c9a14a', margin:0}}>MUSTAPHA IMMOBILIER</h1>
          <button onClick={()=>{Store.logout(); setAuth(false);}} style={{background:'none', color:'#666', border:'none', cursor:'pointer'}}>خروج</button>
        </header>

        <div style={{display:'flex', gap:'20px'}}>
          <nav style={{width:'200px', display:'flex', flexDirection:'column', gap:'10px'}}>
            <button onClick={()=>setActiveTab('properties')} style={{padding:'10px', background: activeTab==='properties' ? '#c9a14a' : '#111', color: activeTab==='properties' ? '#000' : '#fff', border:'none', cursor:'pointer', textAlign:'right'}}>🏠 العقارات</button>
            <button onClick={()=>setActiveTab('config')} style={{padding:'10px', background: activeTab==='config' ? '#c9a14a' : '#111', color: activeTab==='config' ? '#000' : '#fff', border:'none', cursor:'pointer', textAlign:'right'}}>⚙ الإعدادات</button>
          </nav>

          <main style={{flex:1, background:'#050505', padding:'20px', borderRadius:'10px', border:'1px solid #111'}}>
            {activeTab === 'properties' ? (
              <div>
                <h3>قائمة العقارات ({items.length})</h3>
                <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  {items.map(item => (
                    <div key={item.id} style={{padding:'10px', background:'#111', border:'1px solid #222', display:'flex', gap:'10px', alignItems:'center'}}>
                      <img src={item.image} style={{width:'40px', height:'40px', objectFit:'cover'}} />
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3>الإعدادات</h3>
                <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                  <input type="password" value={githubToken} onChange={(e)=>setGithubToken(e.target.value)} style={{padding:'10px', background:'#000', color:'#fff', border:'1px solid #333'}} placeholder="GitHub Token" />
                  <input value={cfg?.contact?.phone || ''} onChange={(e)=>setCfg({...cfg, contact:{...(cfg.contact||{}), phone:e.target.value}})} style={{padding:'10px', background:'#000', color:'#fff', border:'1px solid #333'}} placeholder="الهاتف" />
                  <button onClick={async ()=>{
                    Store.saveConfig(cfg);
                    Sync.saveSyncSettings(githubToken);
                    await Store.saveTokenToData(githubToken);
                    await Store.syncAllToGitHub();
                    alert('تم الحفظ والتحديث ✓');
                  }} style={{padding:'15px', background:'#c9a14a', border:'none', fontWeight:'bold', cursor:'pointer'}}>حفظ التعديلات</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
