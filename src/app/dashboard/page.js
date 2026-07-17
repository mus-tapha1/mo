'use client';

import { useState, useEffect } from 'react';

// ============================================================
//  لوحة التحكم الشاملة (Full CMS Dashboard) — MUSTAPHA IMMOBILIER
// ============================================================

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');

  // البيانات
  const [data, setData] = useState({
    properties: [],
    lotissements: [],
    manatiq: [],
    videos: [],
    config: {}
  });

  // حالة التعديل
  const [editingItem, setEditingItem] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);

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
    setLoading(true);
    try {
      const url = `https://raw.githubusercontent.com/mus-tapha1/mo/main/site-data/data.json?t=${Date.now()}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch(e) {
      console.error('Failed to load data', e);
    } finally {
      setLoading(false);
    }
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
    if (!githubToken) return alert('يرجى إدخال GitHub Token في قسم الإعدادات');
    setLoading(true);
    try {
      const finalData = { ...data, updatedAt: new Date().toISOString() };
      const getUrl = `https://api.github.com/repos/mus-tapha1/mo/contents/site-data/data.json?ref=main`;
      const getRes = await fetch(getUrl, { headers: { 'Authorization': `token ${githubToken}` } });
      let sha = null;
      if (getRes.ok) { sha = (await getRes.json()).sha; }

      const pushRes = await fetch(`https://api.github.com/repos/mus-tapha1/mo/contents/site-data/data.json`, {
        method: 'PUT',
        headers: { 'Authorization': `token ${githubToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Update from Comprehensive Dashboard',
          content: btoa(unescape(encodeURIComponent(JSON.stringify(finalData, null, 2)))),
          sha: sha,
          branch: 'main'
        })
      });

      if (pushRes.ok) { 
        alert('تم الحفظ والنشر بنجاح ✓'); 
        loadFromGitHub();
      } else { 
        alert('فشل الحفظ. تأكد من صلاحيات التوكن.'); 
      }
    } catch (err) { 
      alert('خطأ: ' + err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  // وظائف التعديل
  const startEdit = (type, index) => {
    setEditIndex(index);
    setEditingItem(JSON.parse(JSON.stringify(data[type][index])));
  };

  const startAdd = (type) => {
    setEditIndex(-2); // -2 means adding new
    let newItem = {};
    if (type === 'properties') newItem = { id: 'NEW-' + Date.now(), title: '', type: 'شقة', price: 0, priceLabel: '', image: '', basics: [], lecture: [], featured: false };
    else if (type === 'lotissements') newItem = { id: 'L-' + Date.now(), slug: '', title: '', city: 'القنيطرة', image: '', description: '', features: [] };
    else if (type === 'manatiq') newItem = { slug: '', title: '', city: 'القنيطرة', image: '', description: '' };
    else if (type === 'videos') newItem = { id: 'V-' + Date.now(), title: '', description: '', youtubeUrl: '', youtubeId: '', thumbnail: '', duration: '' };
    setEditingItem(newItem);
  };

  const saveEdit = (type) => {
    const newData = { ...data };
    if (editIndex === -2) {
      newData[type].unshift(editingItem);
    } else {
      newData[type][editIndex] = editingItem;
    }
    setData(newData);
    setEditingItem(null);
    setEditIndex(-1);
  };

  const deleteItem = (type, index) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    const newData = { ...data };
    newData[type].splice(index, 1);
    setData(newData);
  };

  if (!mounted) return null;

  if (!auth) {
    return (
      <div style={{minHeight:'100vh', background:'#000', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif', direction:'rtl'}}>
        <form onSubmit={handleLogin} style={{background:'#111', padding:'40px', borderRadius:'20px', border:'1px solid #c9a14a', width:'100%', maxWidth:'350px'}}>
          <h2 style={{color:'#c9a14a', textAlign:'center', marginBottom:'30px'}}>دخول الإدارة</h2>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="كلمة المرور" style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #333', borderRadius:'8px', color:'#fff', marginBottom:'20px', textAlign:'center'}} />
          <button style={{width:'100%', padding:'12px', background:'#c9a14a', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'#000', color:'#fff', fontFamily:'sans-serif', paddingBottom:'100px', direction:'rtl'}}>
      {/* الهيدر */}
      <header style={{padding:'15px 30px', background:'#050505', borderBottom:'1px solid #222', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
          <h1 style={{margin:0, fontSize:'18px', color:'#c9a14a'}}>لوحة التحكم الكاملة</h1>
          <nav style={{display:'flex', gap:'10px'}}>
            {['properties', 'lotissements', 'manatiq', 'videos', 'config'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? '#c9a14a' : 'transparent',
                  color: activeTab === tab ? '#000' : '#888',
                  border: 'none', padding: '5px 15px', borderRadius: '15px', cursor: 'pointer', fontSize: '13px'
                }}
              >
                {tab === 'properties' ? 'العقارات' : tab === 'lotissements' ? 'التجزئات' : tab === 'manatiq' ? 'المناطق' : tab === 'videos' ? 'الفيديوهات' : 'الإعدادات'}
              </button>
            ))}
          </nav>
        </div>
        <div style={{display:'flex', gap:'15px'}}>
          <button onClick={handleSync} disabled={loading} style={{background:loading?'#444':'#c9a14a', color:'#000', border:'none', padding:'8px 20px', borderRadius:'20px', fontWeight:'bold', cursor:'pointer'}}>{loading ? 'جاري الحفظ...' : 'حفظ ونشر التعديلات'}</button>
          <button onClick={()=>{localStorage.removeItem('mus_auth'); setAuth(false);}} style={{background:'none', color:'#666', border:'none', cursor:'pointer'}}>خروج</button>
        </div>
      </header>

      <div style={{maxWidth:'1200px', margin:'0 auto', padding:'30px'}}>
        
        {/* نافذة التعديل المنبثقة */}
        {editingItem && (
          <div style={{fixed:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', position:'fixed', top:0, left:0, right:0, bottom:0}}>
            <div style={{background:'#111', border:'1px solid #c9a14a', borderRadius:'20px', width:'100%', maxWidth:'700px', maxHeight:'90vh', overflowY:'auto', padding:'30px'}}>
              <h3 style={{color:'#c9a14a', marginBottom:'20px'}}>{editIndex === -2 ? 'إضافة جديد' : 'تعديل'}</h3>
              
              <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                {Object.keys(editingItem).map(key => {
                  if (typeof editingItem[key] === 'object' && !Array.isArray(editingItem[key])) return null;
                  if (key === 'id' && editIndex !== -2) return <div key={key} style={{fontSize:'12px', color:'#444'}}>ID: {editingItem[key]}</div>;
                  
                  return (
                    <div key={key}>
                      <label style={{display:'block', fontSize:'12px', color:'#888', marginBottom:'5px'}}>{key}</label>
                      {key === 'description' || key === 'note' ? (
                        <textarea 
                          value={editingItem[key]} 
                          onChange={(e)=>setEditingItem({...editingItem, [key]: e.target.value})}
                          style={{width:'100%', padding:'10px', background:'#000', border:'1px solid #333', borderRadius:'8px', color:'#fff', minHeight:'80px'}}
                        />
                      ) : Array.isArray(editingItem[key]) ? (
                        <div style={{fontSize:'11px', color:'#555'}}>هذا الحقل (قائمة) سيتم الحفاظ عليه كما هو في هذه النسخة.</div>
                      ) : typeof editingItem[key] === 'boolean' ? (
                        <input type="checkbox" checked={editingItem[key]} onChange={(e)=>setEditingItem({...editingItem, [key]: e.target.checked})} />
                      ) : (
                        <input 
                          type={key === 'price' || key === 'surface' ? 'number' : 'text'}
                          value={editingItem[key]} 
                          onChange={(e)=>setEditingItem({...editingItem, [key]: key === 'price' || key === 'surface' ? Number(e.target.value) : e.target.value})}
                          style={{width:'100%', padding:'10px', background:'#000', border:'1px solid #333', borderRadius:'8px', color:'#fff'}}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{display:'flex', gap:'10px', marginTop:'30px'}}>
                <button onClick={() => saveEdit(activeTab)} style={{flex:1, padding:'12px', background:'#c9a14a', color:'#000', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>حفظ التغييرات</button>
                <button onClick={() => setEditingItem(null)} style={{flex:1, padding:'12px', background:'#222', color:'#fff', border:'none', borderRadius:'10px', cursor:'pointer'}}>إلغاء</button>
              </div>
            </div>
          </div>
        )}

        {/* عرض القوائم */}
        {activeTab !== 'config' && (
          <section>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
              <h2 style={{margin:0}}>📋 إدارة {activeTab === 'properties' ? 'العقارات' : activeTab === 'lotissements' ? 'التجزئات' : activeTab === 'manatiq' ? 'المناطق' : 'الفيديوهات'} ({data[activeTab]?.length})</h2>
              <button onClick={() => startAdd(activeTab)} style={{background:'#c9a14a', color:'#000', border:'none', padding:'10px 25px', borderRadius:'25px', fontWeight:'bold', cursor:'pointer'}}>+ إضافة جديد</button>
            </div>
            
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'20px'}}>
              {data[activeTab]?.map((item, idx) => (
                <div key={idx} style={{background:'#0a0a0a', borderRadius:'20px', border:'1px solid #1a1a1a', overflow:'hidden', transition:'transform 0.3s'}}>
                  <div style={{position:'relative'}}>
                    <img src={item.image || item.thumbnail} style={{width:'100%', height:'180px', objectFit:'cover'}} />
                    {item.featured && <span style={{position:'absolute', top:'10px', right:'10px', background:'#c9a14a', color:'#000', fontSize:'10px', padding:'3px 8px', borderRadius:'10px', fontWeight:'bold'}}>مميز</span>}
                  </div>
                  <div style={{padding:'20px'}}>
                    <h3 style={{fontSize:'16px', margin:'0 0 10px 0', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{item.title}</h3>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'15px'}}>
                      <span style={{color:'#c9a14a', fontWeight:'bold'}}>{item.priceLabel || item.city}</span>
                      <div style={{display:'flex', gap:'10px'}}>
                        <button onClick={() => startEdit(activeTab, idx)} style={{background:'#1a1a1a', color:'#fff', border:'none', padding:'5px 12px', borderRadius:'8px', fontSize:'12px', cursor:'pointer'}}>تعديل</button>
                        <button onClick={() => deleteItem(activeTab, idx)} style={{background:'#300', color:'#f55', border:'none', padding:'5px 12px', borderRadius:'8px', fontSize:'12px', cursor:'pointer'}}>حذف</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* قسم الإعدادات */}
        {activeTab === 'config' && (
          <section style={{background:'#0a0a0a', padding:'40px', borderRadius:'30px', border:'1px solid #1a1a1a'}}>
            <h2 style={{color:'#c9a14a', marginBottom:'40px', borderBottom:'1px solid #222', paddingBottom:'15px'}}>⚙ إعدادات المنصة والهوية</h2>
            
            <div style={{display:'flex', flexDirection:'column', gap:'30px'}}>
              {/* GitHub Token */}
              <div style={{background:'#000', padding:'20px', borderRadius:'15px', border:'1px dashed #333'}}>
                <label style={{display:'block', fontSize:'13px', color:'#c9a14a', marginBottom:'10px', fontWeight:'bold'}}>GITHUB PERSONAL ACCESS TOKEN</label>
                <input 
                  type="password" 
                  value={githubToken} 
                  onChange={(e)=>{setGithubToken(e.target.value); localStorage.setItem('mus_github_token', e.target.value);}} 
                  style={{width:'100%', padding:'12px', background:'#111', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} 
                  placeholder="ضع التوكن هنا لتتمكن من الحفظ..." 
                />
                <p style={{fontSize:'11px', color:'#555', marginTop:'8px'}}>يُحفظ التوكن في متصفحك فقط ولا يُرسل لأي خادم خارجي.</p>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'30px'}}>
                <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                  <h4 style={{margin:0, color:'#888', fontSize:'14px'}}>معلومات العلامة</h4>
                  <input value={data.config?.brand?.nameAr || ''} onChange={(e)=>setData({...data, config:{...data.config, brand:{...data.config.brand, nameAr:e.target.value}}})} placeholder="اسم العلامة (عربي)" style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} />
                  <input value={data.config?.brand?.taglineAr || ''} onChange={(e)=>setData({...data, config:{...data.config, brand:{...data.config.brand, taglineAr:e.target.value}}})} placeholder="شعار العلامة (عربي)" style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} />
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                  <h4 style={{margin:0, color:'#888', fontSize:'14px'}}>معلومات التواصل</h4>
                  <input value={data.config?.contact?.phone || ''} onChange={(e)=>setData({...data, config:{...data.config, contact:{...data.config.contact, phone:e.target.value}}})} placeholder="رقم الهاتف" style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} />
                  <input value={data.config?.contact?.email || ''} onChange={(e)=>setData({...data, config:{...data.config, contact:{...data.config.contact, email:e.target.value}}})} placeholder="البريد الإلكتروني" style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} />
                </div>
              </div>

              <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                <h4 style={{margin:0, color:'#888', fontSize:'14px'}}>روابط التواصل الاجتماعي</h4>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'15px'}}>
                  {['facebook', 'instagram', 'youtube', 'tiktok', 'twitter', 'whatsapp'].map(social => (
                    <input 
                      key={social}
                      value={data.config?.social?.[social] || (social === 'whatsapp' ? data.config?.contact?.whatsapp : '') || ''} 
                      onChange={(e)=>{
                        const newConfig = {...data.config};
                        if (social === 'whatsapp') {
                          newConfig.contact = {...newConfig.contact, whatsapp: e.target.value};
                        } else {
                          newConfig.social = {...newConfig.social, [social]: e.target.value};
                        }
                        setData({...data, config: newConfig});
                      }} 
                      placeholder={social.charAt(0).toUpperCase() + social.slice(1)} 
                      style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} 
                    />
                  ))}
                </div>
              </div>

              <button onClick={handleSync} style={{marginTop:'20px', padding:'20px', background:'#c9a14a', color:'#000', border:'none', borderRadius:'15px', fontWeight:'bold', cursor:'pointer', fontSize:'16px'}}>تحديث كافة إعدادات المنصة الآن</button>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
