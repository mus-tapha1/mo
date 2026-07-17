'use client';

import { useState, useEffect, useRef } from 'react';

// ============================================================
//  لوحة التحكم المتجاورة والشاملة (Responsive CMS Dashboard)
//  MUSTAPHA IMMOBILIER — 2026
// ============================================================

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const fileInputRef = useRef(null);

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
          message: 'Update from Mobile-Friendly Dashboard',
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

  // وظيفة رفع الصور
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !githubToken) return alert('يرجى التأكد من اختيار صورة وإدخال التوكن');
    
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Content = reader.result.split(',')[1];
        const fileName = `img-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const path = `public/uploads/${fileName}`;
        
        const res = await fetch(`https://api.github.com/repos/mus-tapha1/mo/contents/${path}`, {
          method: 'PUT',
          headers: { 'Authorization': `token ${githubToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Upload image: ${fileName}`,
            content: base64Content,
            branch: 'main'
          })
        });

        if (res.ok) {
          const imageUrl = `/mo/${path}`;
          setEditingItem({ ...editingItem, image: imageUrl });
          alert('تم رفع الصورة بنجاح ✓');
        } else {
          alert('فشل رفع الصورة. تأكد من التوكن.');
        }
        setUploading(false);
      };
    } catch (err) {
      alert('خطأ في الرفع: ' + err.message);
      setUploading(false);
    }
  };

  // وظائف التعديل
  const startEdit = (type, index) => {
    setEditIndex(index);
    setEditingItem(JSON.parse(JSON.stringify(data[type][index])));
  };

  const startAdd = (type) => {
    setEditIndex(-2);
    let newItem = {};
    if (type === 'properties') newItem = { id: 'MUS-' + Date.now(), title: '', type: 'شقة', price: 0, priceLabel: '', image: '', featured: false };
    else if (type === 'lotissements') newItem = { id: 'L-' + Date.now(), slug: '', title: '', city: 'القنيطرة', image: '', description: '' };
    else if (type === 'manatiq') newItem = { slug: '', title: '', city: 'القنيطرة', image: '', description: '' };
    else if (type === 'videos') newItem = { id: 'V-' + Date.now(), title: '', description: '', youtubeUrl: '', youtubeId: '', thumbnail: '', duration: '' };
    setEditingItem(newItem);
  };

  const saveEdit = (type) => {
    const newData = { ...data };
    if (editIndex === -2) newData[type].unshift(editingItem);
    else newData[type][editIndex] = editingItem;
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
      <div style={{minHeight:'100vh', background:'#000', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', direction:'rtl'}}>
        <form onSubmit={handleLogin} style={{background:'#111', padding:'30px', borderRadius:'20px', border:'1px solid #c9a14a', width:'100%', maxWidth:'400px'}}>
          <h2 style={{color:'#c9a14a', textAlign:'center', marginBottom:'30px'}}>دخول الإدارة</h2>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="كلمة المرور" style={{width:'100%', padding:'15px', background:'#000', border:'1px solid #333', borderRadius:'12px', color:'#fff', marginBottom:'20px', textAlign:'center', fontSize:'18px'}} />
          <button style={{width:'100%', padding:'15px', background:'#c9a14a', border:'none', borderRadius:'12px', fontWeight:'bold', cursor:'pointer', fontSize:'16px'}}>دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'#000', color:'#fff', fontFamily:'sans-serif', paddingBottom:'80px', direction:'rtl'}}>
      {/* هيدر متجاوب */}
      <header style={{background:'#050505', borderBottom:'1px solid #222', position:'sticky', top:0, zIndex:100}}>
        <div style={{padding:'15px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'15px'}}>
          <h1 style={{margin:0, fontSize:'18px', color:'#c9a14a'}}>لوحة التحكم</h1>
          <div style={{display:'flex', gap:'10px'}}>
            <button onClick={handleSync} disabled={loading} style={{background:loading?'#444':'#c9a14a', color:'#000', border:'none', padding:'8px 15px', borderRadius:'20px', fontWeight:'bold', cursor:'pointer', fontSize:'12px'}}>{loading ? 'جاري...' : 'حفظ ونشر'}</button>
            <button onClick={()=>{localStorage.removeItem('mus_auth'); setAuth(false);}} style={{background:'#222', color:'#888', border:'none', padding:'8px 15px', borderRadius:'20px', cursor:'pointer', fontSize:'12px'}}>خروج</button>
          </div>
        </div>
        {/* شريط التنقل المتجاوب */}
        <div style={{display:'flex', overflowX:'auto', padding:'0 10px 10px', gap:'5px', scrollbarWidth:'none'}}>
          {['properties', 'lotissements', 'manatiq', 'videos', 'config'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#c9a14a' : 'transparent',
                color: activeTab === tab ? '#000' : '#888',
                border: 'none', padding: '8px 15px', borderRadius: '15px', cursor: 'pointer', fontSize: '12px', whiteSpace:'nowrap', flexShrink:0
              }}
            >
              {tab === 'properties' ? 'العقارات' : tab === 'lotissements' ? 'التجزئات' : tab === 'manatiq' ? 'المناطق' : tab === 'videos' ? 'الفيديوهات' : 'الإعدادات'}
            </button>
          ))}
        </div>
      </header>

      <main style={{maxWidth:'1200px', margin:'0 auto', padding:'20px'}}>
        
        {/* نافذة التعديل - متجاوبة */}
        {editingItem && (
          <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'10px'}}>
            <div style={{background:'#111', border:'1px solid #c9a14a', borderRadius:'20px', width:'100%', maxWidth:'600px', maxHeight:'90vh', overflowY:'auto', padding:'20px'}}>
              <h3 style={{color:'#c9a14a', marginBottom:'20px', textAlign:'center'}}>{editIndex === -2 ? 'إضافة جديد' : 'تعديل'}</h3>
              
              <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                {/* حقل الصورة مع زر الرفع */}
                {(activeTab !== 'config' && editingItem.hasOwnProperty('image')) && (
                  <div style={{background:'#0a0a0a', padding:'15px', borderRadius:'15px', border:'1px dashed #333'}}>
                    <label style={{display:'block', fontSize:'12px', color:'#c9a14a', marginBottom:'10px'}}>الصورة الأساسية</label>
                    {editingItem.image && <img src={editingItem.image} style={{width:'100%', height:'150px', objectFit:'cover', borderRadius:'10px', marginBottom:'10px'}} />}
                    <div style={{display:'flex', gap:'10px'}}>
                      <input 
                        type="text" 
                        value={editingItem.image} 
                        onChange={(e)=>setEditingItem({...editingItem, image: e.target.value})}
                        placeholder="رابط الصورة..."
                        style={{flex:1, padding:'10px', background:'#000', border:'1px solid #222', borderRadius:'8px', color:'#fff', fontSize:'12px'}}
                      />
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        disabled={uploading}
                        style={{background:'#c9a14a', color:'#000', border:'none', padding:'0 15px', borderRadius:'8px', fontWeight:'bold', cursor:'pointer', fontSize:'12px'}}
                      >
                        {uploading ? '...' : 'رفع'}
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden accept="image/*" />
                    </div>
                  </div>
                )}

                {/* باقي الحقول */}
                {Object.keys(editingItem).map(key => {
                  if (key === 'image' || (typeof editingItem[key] === 'object' && !Array.isArray(editingItem[key]))) return null;
                  if (key === 'id' && editIndex !== -2) return null;
                  
                  return (
                    <div key={key}>
                      <label style={{display:'block', fontSize:'12px', color:'#888', marginBottom:'5px'}}>{key}</label>
                      {key === 'description' || key === 'note' ? (
                        <textarea 
                          value={editingItem[key]} 
                          onChange={(e)=>setEditingItem({...editingItem, [key]: e.target.value})}
                          style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #333', borderRadius:'10px', color:'#fff', minHeight:'80px', fontSize:'14px'}}
                        />
                      ) : typeof editingItem[key] === 'boolean' ? (
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          <input type="checkbox" checked={editingItem[key]} onChange={(e)=>setEditingItem({...editingItem, [key]: e.target.checked})} style={{width:'20px', height:'20px'}} />
                          <span>تثبيت في الواجهة</span>
                        </div>
                      ) : (
                        <input 
                          type={key === 'price' || key === 'surface' ? 'number' : 'text'}
                          value={editingItem[key]} 
                          onChange={(e)=>setEditingItem({...editingItem, [key]: key === 'price' || key === 'surface' ? Number(e.target.value) : e.target.value})}
                          style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #333', borderRadius:'10px', color:'#fff', fontSize:'14px'}}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{display:'flex', gap:'10px', marginTop:'30px'}}>
                <button onClick={() => saveEdit(activeTab)} style={{flex:2, padding:'15px', background:'#c9a14a', color:'#000', border:'none', borderRadius:'12px', fontWeight:'bold', cursor:'pointer'}}>حفظ</button>
                <button onClick={() => setEditingItem(null)} style={{flex:1, padding:'15px', background:'#222', color:'#fff', border:'none', borderRadius:'12px', cursor:'pointer'}}>إلغاء</button>
              </div>
            </div>
          </div>
        )}

        {/* عرض القوائم - متجاوب */}
        {activeTab !== 'config' && (
          <section>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h2 style={{margin:0, fontSize:'18px'}}>📋 {activeTab === 'properties' ? 'العقارات' : activeTab === 'lotissements' ? 'التجزئات' : activeTab === 'manatiq' ? 'المناطق' : 'الفيديوهات'}</h2>
              <button onClick={() => startAdd(activeTab)} style={{background:'#c9a14a', color:'#000', border:'none', padding:'8px 15px', borderRadius:'15px', fontWeight:'bold', cursor:'pointer', fontSize:'12px'}}>+ جديد</button>
            </div>
            
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'15px'}}>
              {data[activeTab]?.map((item, idx) => (
                <div key={idx} style={{background:'#0a0a0a', borderRadius:'15px', border:'1px solid #1a1a1a', overflow:'hidden'}}>
                  <img src={item.image || item.thumbnail} style={{width:'100%', height:'150px', objectFit:'cover'}} />
                  <div style={{padding:'15px'}}>
                    <h3 style={{fontSize:'14px', margin:'0 0 10px 0', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{item.title}</h3>
                    <div style={{display:'flex', justifyContent:'space-between', gap:'10px'}}>
                      <button onClick={() => startEdit(activeTab, idx)} style={{flex:1, background:'#1a1a1a', color:'#fff', border:'none', padding:'8px', borderRadius:'8px', fontSize:'12px', cursor:'pointer'}}>تعديل</button>
                      <button onClick={() => deleteItem(activeTab, idx)} style={{background:'#200', color:'#f55', border:'none', padding:'8px 12px', borderRadius:'8px', fontSize:'12px', cursor:'pointer'}}>حذف</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* إعدادات - متجاوبة */}
        {activeTab === 'config' && (
          <section style={{background:'#0a0a0a', padding:'20px', borderRadius:'20px', border:'1px solid #1a1a1a'}}>
            <h2 style={{color:'#c9a14a', marginBottom:'25px', fontSize:'18px'}}>⚙ الإعدادات</h2>
            
            <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
              <div style={{background:'#000', padding:'15px', borderRadius:'12px', border:'1px dashed #333'}}>
                <label style={{display:'block', fontSize:'11px', color:'#c9a14a', marginBottom:'8px'}}>GITHUB TOKEN</label>
                <input 
                  type="password" 
                  value={githubToken} 
                  onChange={(e)=>{setGithubToken(e.target.value); localStorage.setItem('mus_github_token', e.target.value);}} 
                  style={{width:'100%', padding:'10px', background:'#111', border:'1px solid #222', borderRadius:'8px', color:'#fff', fontSize:'14px'}} 
                />
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'15px'}}>
                <input value={data.config?.brand?.nameAr || ''} onChange={(e)=>setData({...data, config:{...data.config, brand:{...data.config.brand, nameAr:e.target.value}}})} placeholder="اسم العلامة" style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} />
                <input value={data.config?.contact?.phone || ''} onChange={(e)=>setData({...data, config:{...data.config, contact:{...data.config.contact, phone:e.target.value}}})} placeholder="رقم الهاتف" style={{width:'100%', padding:'12px', background:'#000', border:'1px solid #222', borderRadius:'10px', color:'#fff'}} />
              </div>
              
              <button onClick={handleSync} style={{padding:'15px', background:'#c9a14a', color:'#000', border:'none', borderRadius:'12px', fontWeight:'bold', cursor:'pointer', fontSize:'16px'}}>حفظ كافة الإعدادات</button>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
