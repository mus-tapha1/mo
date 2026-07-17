'use client';

import { useState, useEffect } from 'react';

// ============================================================
//  نسخة الصفحة الواحدة المضمونة (One-Page Bulletproof) — MUSTAPHA IMMOBILIER
// ============================================================

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [items, setItems] = useState([]);
  const [cfg, setCfg] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isAuthed = localStorage.getItem('mus_auth') === 'true';
    if (isAuthed) {
      setAuth(true);
      const savedToken = localStorage.getItem('mus_github_token');
      if (savedToken) setGithubToken(savedToken);
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
      }
    } catch(e) {}
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'mustapha2026') {
      setAuth(true);
      localStorage.setItem('mus_auth', 'true');
      loadFromGitHub();
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const handleSync = async () => {
    if (!githubToken) return alert('يرجى إدخال GitHub Token في قسم الإعدادات بالأسفل');
    setLoading(true);
    try {
      const data = { properties: items, config: cfg };
      const getUrl = `https://api.github.com/repos/mus-tapha1/mo/contents/site-data/data.json?ref=main`;
      const getRes = await fetch(getUrl, { headers: { 'Authorization': `token ${githubToken}` } });
      let sha = null;
      if (getRes.ok) { sha = (await getRes.json()).sha; }

      const pushRes = await fetch(`https://api.github.com/repos/mus-tapha1/mo/contents/site-data/data.json`, {
        method: 'PUT',
        headers: { 'Authorization': `token ${githubToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Update from One-Page CMS',
          content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
          sha: sha,
          branch: 'main'
        })
      });

      if (pushRes.ok) { alert('تم الحفظ والنشر بنجاح ✓'); } 
      else { alert('فشل الحفظ. تأكد من التوكن.'); }
    } catch (err) { alert('خطأ: ' + err.message); } 
    finally { setLoading(false); }
  };

  if (!mounted) return null;

  if (!auth) {
    return (
      <div style={{minHeight:'100vh', background:'#000', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif'}}>
        <form onSubmit={handleLogin} style={{background:'#111', padding:'40px', borderRadius:'20px', border:'1px solid #c9a14a', width:'100%', maxWidth:'350px'}}>
          <h2 style={{color:'#c9a14a', textAlign:'center', marginBottom:'30px'}}>دخول الإدارة</h2>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="كلمة المرور" style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #333', borderRadius:'8px', color:'#fff', marginBottom:'20px'}} />
          <button style={{width:'100%', padding:'12px', background:'#c9a14a', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'#000', color:'#fff', fontFamily:'sans-serif', paddingBottom:'100px'}}>
      <header style={{padding:'15px 30px', background:'#050505', borderBottom:'1px solid #222', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:100}}>
        <h1 style={{margin:0, fontSize:'18px', color:'#c9a14a'}}>لوحة التحكم الموحدة</h1>
        <div style={{display:'flex', gap:'15px'}}>
          <button onClick={handleSync} disabled={loading} style={{background:loading?'#444':'#c9a14a', color:'#000', border:'none', padding:'8px 20px', borderRadius:'20px', fontWeight:'bold', cursor:'pointer'}}>{loading ? 'جاري الحفظ...' : 'حفظ ونشر التعديلات'}</button>
          <button onClick={()=>{localStorage.removeItem('mus_auth'); setAuth(false);}} style={{background:'none', color:'#666', border:'none', cursor:'pointer'}}>خروج</button>
        </div>
      </header>

      <div style={{maxWidth:'1000px', margin:'0 auto', padding:'30px'}}>
        
        {/* قسم العقارات */}
        <section style={{marginBottom:'60px'}}>
          <h2 style={{borderBottom:'2px solid #c9a14a', paddingBottom:'10px', marginBottom:'30px'}}>🏠 إدارة العقارات ({items.length})</h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'20px'}}>
            {items.map((item, idx) => (
              <div key={idx} style={{background:'#111', borderRadius:'15px', overflow:'hidden', border:'1px solid #222'}}>
                <img src={item.image} style={{width:'100%', height:'150px', objectFit:'cover'}} />
                <div style={{padding:'15px'}}>
                  <div style={{fontWeight:'bold', marginBottom:'5px'}}>{item.title}</div>
                  <div style={{color:'#c9a14a', fontSize:'14px'}}>{item.priceLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* قسم الإعدادات */}
        <section style={{background:'#0a0a0a', padding:'30px', borderRadius:'20px', border:'1px solid #222'}}>
          <h2 style={{borderBottom:'2px solid #c9a14a', paddingBottom:'10px', marginBottom:'30px'}}>⚙ إعدادات الموقع والاتصال</h2>
          <div style={{display:'flex', flexDirection:'column', gap:'25px'}}>
            <div>
              <label style={{display:'block', fontSize:'13px', color:'#c9a14a', marginBottom:'8px'}}>GITHUB TOKEN (مطلوب لتفعيل الحفظ)</label>
              <input type="password" value={githubToken} onChange={(e)=>{setGithubToken(e.target.value); localStorage.setItem('mus_github_token', e.target.value);}} style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #333', borderRadius:'10px', color:'#fff'}} placeholder="ضع التوكن هنا..." />
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
              <div>
                <label style={{display:'block', fontSize:'13px', color:'#888', marginBottom:'8px'}}>اسم العلامة (عربي)</label>
                <input value={cfg?.brand?.nameAr || ''} onChange={(e)=>setCfg({...cfg, brand:{...(cfg.brand||{}), nameAr:e.target.value}})} style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #333', borderRadius:'10px', color:'#fff'}} />
              </div>
              <div>
                <label style={{display:'block', fontSize:'13px', color:'#888', marginBottom:'8px'}}>رقم الهاتف</label>
                <input value={cfg?.contact?.phone || ''} onChange={(e)=>setCfg({...cfg, contact:{...(cfg.contact||{}), phone:e.target.value}})} style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #333', borderRadius:'10px', color:'#fff'}} />
              </div>
            </div>
            <button onClick={handleSync} style={{marginTop:'20px', padding:'18px', background:'#c9a14a', color:'#000', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer', fontSize:'16px'}}>تحديث كافة البيانات الآن</button>
          </div>
        </section>

        <p style={{textAlign:'center', marginTop:'40px', color:'#444', fontSize:'12px'}}>تم دمج كافة الأقسام في صفحة واحدة لضمان أقصى درجات الاستقرار.</p>
      </div>
    </div>
  );
}
