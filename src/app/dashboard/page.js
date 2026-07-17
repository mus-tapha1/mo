'use client';

import { useState, useEffect } from 'react';

// ============================================================
//  نسخة الاستقرار المطلق (Ultimate Stability) — MUSTAPHA IMMOBILIER
// ============================================================

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const [password, setPassword] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [items, setItems] = useState([]);
  const [cfg, setCfg] = useState({});
  const [loading, setLoading] = useState(false);

  // مفاتيح التخزين
  const K = {
    auth: 'mus_auth',
    token: 'mus_github_token',
    data: 'mus_local_data'
  };

  useEffect(() => {
    setMounted(true);
    const isAuthed = localStorage.getItem(K.auth) === 'true';
    if (isAuthed) {
      setAuth(true);
      const savedToken = localStorage.getItem(K.token);
      if (savedToken) setGithubToken(savedToken);
      
      // تحميل البيانات المحلية إن وجدت
      const localData = localStorage.getItem(K.data);
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          setItems(parsed.properties || []);
          setCfg(parsed.config || {});
        } catch(e) {}
      }
      loadFromGitHub();
    }
  }, []);

  async function loadFromGitHub() {
    try {
      const url = `https://raw.githubusercontent.com/mus-tapha1/mo/main/site-data/data.json?t=${Date.now()}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItems(data.properties || []);
        setCfg(data.config || {});
        localStorage.setItem(K.data, JSON.stringify(data));
      }
    } catch(e) {}
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'mustapha2026') {
      setAuth(true);
      localStorage.setItem(K.auth, 'true');
      loadFromGitHub();
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const handleSync = async () => {
    if (!githubToken) return alert('يرجى إدخال GitHub Token في الإعدادات أولاً');
    setLoading(true);
    try {
      const data = { properties: items, config: cfg };
      
      // 1. Get SHA
      const getUrl = `https://api.github.com/repos/mus-tapha1/mo/contents/site-data/data.json?ref=main`;
      const getRes = await fetch(getUrl, {
        headers: { 'Authorization': `token ${githubToken}` }
      });
      let sha = null;
      if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
      }

      // 2. Push Update
      const pushUrl = `https://api.github.com/repos/mus-tapha1/mo/contents/site-data/data.json`;
      const pushRes = await fetch(pushUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update from CMS',
          content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
          sha: sha,
          branch: 'main'
        })
      });

      if (pushRes.ok) {
        alert('تم الحفظ والنشر بنجاح ✓');
        localStorage.setItem(K.data, JSON.stringify(data));
      } else {
        const err = await pushRes.json();
        alert('فشل الحفظ: ' + (err.message || 'خطأ غير معروف'));
      }
    } catch (err) {
      alert('خطأ في الاتصال: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (!auth) {
    return (
      <div style={{minHeight:'100vh', background:'#000', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif'}}>
        <form onSubmit={handleLogin} style={{background:'#111', padding:'40px', borderRadius:'20px', border:'1px solid #c9a14a', width:'100%', maxWidth:'350px'}}>
          <h2 style={{color:'#c9a14a', textAlign:'center', marginBottom:'30px'}}>تسجيل الدخول</h2>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="كلمة المرور" style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #333', borderRadius:'8px', color:'#fff', marginBottom:'20px'}} />
          <button style={{width:'100%', padding:'12px', background:'#c9a14a', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'#000', color:'#fff', fontFamily:'sans-serif'}}>
      <header style={{padding:'15px 30px', background:'#050505', borderBottom:'1px solid #222', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <span style={{fontSize:'24px', color:'#c9a14a', fontWeight:'bold'}}>M</span>
          <h1 style={{margin:0, fontSize:'18px'}}>لوحة التحكم</h1>
        </div>
        <div style={{display:'flex', gap:'15px'}}>
          <button onClick={handleSync} disabled={loading} style={{background:loading?'#444':'#c9a14a', color:'#000', border:'none', padding:'8px 20px', borderRadius:'20px', fontWeight:'bold', cursor:'pointer'}}>{loading ? 'جاري الحفظ...' : 'نشر التعديلات'}</button>
          <button onClick={()=>{localStorage.removeItem(K.auth); setAuth(false);}} style={{background:'none', color:'#666', border:'none', cursor:'pointer'}}>خروج</button>
        </div>
      </header>

      <div style={{maxWidth:'1200px', margin:'0 auto', padding:'30px', display:'grid', gridTemplateColumns:'200px 1fr', gap:'40px'}}>
        <nav style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          <button onClick={()=>setActiveTab('properties')} style={{padding:'12px', textAlign:'right', background:activeTab==='properties'?'#c9a14a':'#111', color:activeTab==='properties'?'#000':'#888', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'bold'}}>🏠 العقارات</button>
          <button onClick={()=>setActiveTab('config')} style={{padding:'12px', textAlign:'right', background:activeTab==='config'?'#c9a14a':'#111', color:activeTab==='config'?'#000':'#888', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'bold'}}>⚙ الإعدادات</button>
          <a href="/mo/" target="_blank" style={{marginTop:'20px', color:'#555', textDecoration:'none', fontSize:'13px', textAlign:'center'}}>🌐 عرض الموقع</a>
        </nav>

        <main style={{background:'#0a0a0a', padding:'30px', borderRadius:'20px', border:'1px solid #111'}}>
          {activeTab === 'properties' ? (
            <div>
              <h2 style={{marginBottom:'20px'}}>إدارة العقارات ({items.length})</h2>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'20px'}}>
                {items.map((item, idx) => (
                  <div key={idx} style={{background:'#111', borderRadius:'15px', overflow:'hidden', border:'1px solid #222'}}>
                    <img src={item.image} style={{width:'100%', height:'150px', objectFit:'cover'}} onError={(e)=>e.target.src='https://placehold.co/400x200?text=No+Image'} />
                    <div style={{padding:'15px'}}>
                      <div style={{fontWeight:'bold', marginBottom:'5px'}}>{item.title}</div>
                      <div style={{color:'#c9a14a', fontSize:'14px'}}>{item.priceLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{maxWidth:'500px'}}>
              <h2 style={{marginBottom:'30px'}}>إعدادات الموقع</h2>
              <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                <div>
                  <label style={{display:'block', fontSize:'12px', color:'#666', marginBottom:'8px'}}>GITHUB TOKEN (مطلوب للحفظ)</label>
                  <input type="password" value={githubToken} onChange={(e)=>{setGithubToken(e.target.value); localStorage.setItem(K.token, e.target.value);}} style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} />
                </div>
                <div>
                  <label style={{display:'block', fontSize:'12px', color:'#666', marginBottom:'8px'}}>اسم العلامة (عربي)</label>
                  <input value={cfg?.brand?.nameAr || ''} onChange={(e)=>setCfg({...cfg, brand:{...(cfg.brand||{}), nameAr:e.target.value}})} style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} />
                </div>
                <div>
                  <label style={{display:'block', fontSize:'12px', color:'#666', marginBottom:'8px'}}>رقم الهاتف</label>
                  <input value={cfg?.contact?.phone || ''} onChange={(e)=>setCfg({...cfg, contact:{...(cfg.contact||{}), phone:e.target.value}})} style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} />
                </div>
                <button onClick={handleSync} style={{marginTop:'20px', padding:'15px', background:'#c9a14a', color:'#000', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>حفظ جميع الإعدادات</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
