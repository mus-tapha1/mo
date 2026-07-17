'use client';

import { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────
//  ثوابت ومساعدات
// ─────────────────────────────────────────────
const REPO_OWNER = 'mus-tapha1';
const REPO_NAME  = 'mo';
const DATA_PATH  = 'site-data/data.json';
const RAW_BASE   = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`;
const API_BASE   = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

const TABS = [
  { key: 'properties',   label: 'العقارات',  icon: '🏠' },
  { key: 'lotissements', label: 'التجزئات',  icon: '🏘️' },
  { key: 'manatiq',      label: 'المناطق',   icon: '📍' },
  { key: 'videos',       label: 'الفيديوهات', icon: '🎬' },
  { key: 'settings',     label: 'الإعدادات', icon: '⚙️' },
];

const PROPERTY_TYPES = ['شقة','فيلا','بقعة فيلا','محل تجاري','مكتب','منزل','أرض','مستودع'];

function newItem(type) {
  const ts = Date.now();
  if (type === 'properties')
    return { id:`MUS-${ts}`, title:'', type:'شقة', typeKey:'apartment', price:0, priceLabel:'', city:'القنيطرة', surface:0, image:'', gallery:[], featured:false, description:'' };
  if (type === 'lotissements')
    return { id:`L-${ts}`, slug:'', title:'', city:'القنيطرة', image:'', description:'', features:[] };
  if (type === 'manatiq')
    return { slug:'', title:'', city:'القنيطرة', image:'', description:'' };
  if (type === 'videos')
    return { id:`V-${ts}`, title:'', description:'', youtubeUrl:'', youtubeId:'', thumbnail:'', duration:'' };
  return {};
}

// تحويل ملف إلى base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload  = () => resolve(r.result.split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// ضغط الصورة قبل الرفع
function compressImage(file, maxWidth = 1400, quality = 0.82) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) { height = Math.round(height * maxWidth / width); width = maxWidth; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
        }, 'image/jpeg', quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────
//  المكوّن الرئيسي
// ─────────────────────────────────────────────
export default function DashboardPage() {
  const [mounted,    setMounted]    = useState(false);
  const [auth,       setAuth]       = useState(false);
  const [password,   setPassword]   = useState('');
  const [token,      setToken]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [syncStatus, setSyncStatus] = useState(''); // 'ok' | 'error' | 'saving' | 'uploading'
  const [syncMsg,    setSyncMsg]    = useState('');
  const [activeTab,  setActiveTab]  = useState('properties');
  const [data,       setData]       = useState({ properties:[], lotissements:[], manatiq:[], videos:[], config:{} });
  const [modal,      setModal]      = useState(null);   // { type, item, index }
  const [uploadPct,  setUploadPct]  = useState('');

  const cameraRef  = useRef(null);
  const galleryRef = useRef(null);
  const multiRef   = useRef(null);

  // ── تهيئة ──────────────────────────────────
  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem('mus_auth') === 'true') {
      const t = localStorage.getItem('mus_github_token') || '';
      setAuth(true); setToken(t);
      loadData();
    }
  }, []);

  // ── تحميل البيانات ──────────────────────────
  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch(`${RAW_BASE}/${DATA_PATH}?t=${Date.now()}`);
      if (res.ok) setData(await res.json());
    } finally { setLoading(false); }
  }

  // ── تسجيل الدخول ────────────────────────────
  function handleLogin(e) {
    e.preventDefault();
    const stored = localStorage.getItem('mus_admin_password') || 'mustapha2026';
    if (password !== stored) { setSyncMsg('كلمة المرور غير صحيحة'); setSyncStatus('error'); return; }
    setAuth(true);
    localStorage.setItem('mus_auth', 'true');
    const t = localStorage.getItem('mus_github_token') || '';
    setToken(t);
    loadData();
  }

  // ── حفظ التوكن ──────────────────────────────
  function saveToken(val) {
    setToken(val);
    localStorage.setItem('mus_github_token', val);
  }

  // ── رفع ملف صورة إلى GitHub ─────────────────
  // ── توليد اسم فريد للصورة ───────────────────
  let _uploadCounter = 0;
  function uniqueImgName() {
    _uploadCounter += 1;
    const ts   = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 10); // 8 حروف عشوائية
    const seq  = _uploadCounter.toString(36).padStart(3, '0');
    return `img-${ts}-${seq}-${rand}.jpg`;
  }

  // ── رفع ملف واحد إلى GitHub مع إعادة المحاولة ─
  async function githubUploadFile(path, b64, name, retries = 3) {
    const tok = localStorage.getItem('mus_github_token') || token;
    if (!tok) throw new Error('يرجى إدخال GitHub Token في الإعدادات أولاً');
    for (let attempt = 1; attempt <= retries; attempt++) {
      const resp = await fetch(`${API_BASE}/contents/${path}`, {
        method: 'PUT',
        headers: { Authorization: `token ${tok}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Upload: ${name}`, content: b64, branch: 'main' }),
      });
      if (resp.ok) return resp;

      let reason = `HTTP ${resp.status}`;
      try { const j = await resp.json(); reason = j.message || reason; } catch {}

      // إذا كان خطأ معدل الطلبات — انتظر ثم أعد المحاولة
      if ((resp.status === 403 || resp.status === 429) && attempt < retries) {
        const wait = attempt * 2000; // 2 ث، 4 ث
        setUploadPct(`تجاوز حد GitHub — إعادة المحاولة بعد ${wait/1000}ث...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      throw new Error(reason);
    }
  }

  // ── رفع صورة واحدة ──────────────────────────
  async function uploadImageFile(file, field = 'image') {
    const tok = localStorage.getItem('mus_github_token') || token;
    if (!tok) { showStatus('error', 'أدخل GitHub Token في الإعدادات أولاً'); return; }
    setSyncStatus('uploading'); setUploadPct('جارٍ ضغط الصورة...');
    try {
      const compressed = await compressImage(file);
      const name = uniqueImgName();
      const path = `public/uploads/${name}`;
      const b64  = await fileToBase64(compressed);
      setUploadPct('جارٍ الرفع إلى GitHub...');
      await githubUploadFile(path, b64, name);
      const url = `${RAW_BASE}/${path}`;
      setModal(m => ({ ...m, item: { ...m.item, [field]: url } }));
      showStatus('ok', '✓ تم رفع الصورة — اضغط حفظ لإرسالها للموقع');
    } catch (err) {
      showStatus('error', `فشل الرفع: ${err.message}`);
    } finally {
      setUploadPct('');
    }
  }

  // ── رفع صور متعددة ──────────────────────────
  async function uploadMultiple(files) {
    const tok = localStorage.getItem('mus_github_token') || token;
    if (!tok) { showStatus('error', 'أدخل GitHub Token في الإعدادات أولاً'); return; }
    const urls = []; const errs = [];
    for (let i = 0; i < files.length; i++) {
      setSyncStatus('uploading');
      setUploadPct(`ضغط وإرسال ${i + 1} من ${files.length}...`);
      try {
        // انتظر ثانية بين كل رفع لتجنب حد معدل GitHub
        if (i > 0) await new Promise(r => setTimeout(r, 1200));
        const compressed = await compressImage(files[i]);
        const name = uniqueImgName();
        const path = `public/uploads/${name}`;
        const b64  = await fileToBase64(compressed);
        await githubUploadFile(path, b64, name);
        urls.push(`${RAW_BASE}/${path}`);
      } catch (err) { errs.push(err.message); }
    }
    setUploadPct('');
    if (urls.length) {
      setModal(m => ({ ...m, item: { ...m.item, gallery: [...(m.item.gallery || []), ...urls] } }));
      showStatus('ok', `✓ تم رفع ${urls.length} صورة${errs.length ? ` (فشل ${errs.length})` : ''}`);
    } else {
      showStatus('error', `فشل الرفع: ${errs[0] || 'خطأ غير معروف'}`);
    }
  }

  // ── نشر data.json إلى GitHub ─────────────────
  async function syncData(freshData) {
    const tok = localStorage.getItem('mus_github_token') || token;
    if (!tok) { showStatus('error', 'أدخل GitHub Token في الإعدادات'); return false; }
    setSyncStatus('saving'); setSyncMsg('جارٍ النشر على الموقع...');
    try {
      const finalData = { ...freshData, updatedAt: new Date().toISOString() };
      const shaRes = await fetch(`${API_BASE}/contents/${DATA_PATH}?ref=main`, {
        headers: { Authorization: `token ${tok}` },
      });
      let sha = null;
      if (shaRes.ok) { try { sha = (await shaRes.json()).sha; } catch {} }
      const pushRes = await fetch(`${API_BASE}/contents/${DATA_PATH}`, {
        method: 'PUT',
        headers: { Authorization: `token ${tok}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'CMS update',
          content: btoa(unescape(encodeURIComponent(JSON.stringify(finalData, null, 2)))),
          sha,
          branch: 'main',
        }),
      });
      if (pushRes.ok) {
        showStatus('ok', '✓ تم الحفظ والنشر — سيظهر على الموقع خلال دقيقة');
        return true;
      }
      let reason = `HTTP ${pushRes.status}`;
      try { const j = await pushRes.json(); reason = j.message || reason; } catch {}
      showStatus('error', `فشل النشر: ${reason}`);
      return false;
    } catch (e) {
      showStatus('error', `خطأ: ${e.message}`);
      return false;
    }
  }

  async function handleSync() {
    await syncData(data);
    loadData();
  }

  // ── مساعدات ─────────────────────────────────
  function showStatus(type, msg) {
    setSyncStatus(type); setSyncMsg(msg);
    setTimeout(() => setSyncStatus(''), 5000);
  }

  function openAdd(type)        { setModal({ type, item: newItem(type), index: -1 }); }
  function openEdit(type, index){ setModal({ type, item: JSON.parse(JSON.stringify(data[type][index])), index }); }

  // حفظ + نشر تلقائي بخطوة واحدة
  async function saveModal() {
    const { type, item, index } = modal;
    const list = [...(data[type] || [])];
    if (index === -1) list.unshift(item); else list[index] = item;
    const updatedData = { ...data, [type]: list };
    setData(updatedData);
    setModal(null);
    // نشر فوري — لا حاجة لزر "حفظ ونشر" منفصل
    await syncData(updatedData);
    loadData();
  }
  async function deleteItem(type, index) {
    if (!confirm('حذف هذا العنصر؟')) return;
    const list = [...data[type]]; list.splice(index, 1);
    const updatedData = { ...data, [type]: list };
    setData(updatedData);
    await syncData(updatedData);
  }
  function setField(key, val) {
    setModal(m => ({ ...m, item: { ...m.item, [key]: val } }));
  }
  function removeGalleryImg(idx) {
    setModal(m => ({ ...m, item: { ...m.item, gallery: m.item.gallery.filter((_,i)=>i!==idx) } }));
  }

  // ── ما قبل التحميل ───────────────────────────
  if (!mounted) return null;

  // ─────────────────────────────────────────────
  //  شاشة الدخول
  // ─────────────────────────────────────────────
  if (!auth) return (
    <div style={S.page}>
      <form onSubmit={handleLogin} style={S.loginBox}>
        <div style={{textAlign:'center', marginBottom:28}}>
          <div style={{fontSize:40, marginBottom:8}}>🏛️</div>
          <h2 style={{color:GOLD, margin:0, fontSize:22, letterSpacing:1}}>MUSTAPHA IMMOBILIER</h2>
          <p style={{color:'#666', fontSize:13, margin:'6px 0 0'}}>لوحة التحكم</p>
        </div>
        <label style={S.inputLabel}>كلمة المرور</label>
        <input
          type="password" autoComplete="current-password"
          value={password} onChange={e=>setPassword(e.target.value)}
          style={{...S.input, textAlign:'center', fontSize:20, letterSpacing:4}}
          placeholder="••••••••"
        />
        {syncStatus==='error' && <p style={{color:'#f55',fontSize:13,margin:'8px 0 0',textAlign:'center'}}>{syncMsg}</p>}
        <button type="submit" style={{...S.btn, background:GOLD, color:'#000', width:'100%', marginTop:20, fontSize:16, padding:'14px'}}>
          دخول
        </button>
      </form>
    </div>
  );

  // ─────────────────────────────────────────────
  //  اللوحة الرئيسية
  // ─────────────────────────────────────────────
  const activeType = TABS.find(t=>t.key===activeTab)?.key;
  const items = data[activeType] || [];

  return (
    <div style={{...S.page, padding:0}}>

      {/* ── شريط التوكن المفقود ─────────────── */}
      {!token && auth && (
        <div style={{background:'#1a0a00', borderBottom:'1px solid #f90', padding:'10px 20px', direction:'rtl', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap'}}>
          <span style={{color:'#f90',fontSize:13}}>⚠ لم يُضف GitHub Token — لن يمكن الحفظ أو رفع الصور.</span>
          <button onClick={()=>setActiveTab('settings')} style={{background:'#f90',color:'#000',border:'none',padding:'4px 12px',borderRadius:8,fontSize:12,cursor:'pointer',fontWeight:'bold'}}>إضافة الآن</button>
        </div>
      )}

      {/* ── رسالة الحالة ───────────────────── */}
      {syncStatus && (
        <div style={{
          position:'fixed', top:70, left:'50%', transform:'translateX(-50%)',
          background: syncStatus==='ok'?'#0a2a0a': syncStatus==='error'?'#2a0a0a':'#0a0a2a',
          border:`1px solid ${syncStatus==='ok'?'#4f4':syncStatus==='error'?'#f44':'#44f'}`,
          color:'#fff', padding:'10px 24px', borderRadius:40, fontSize:14,
          zIndex:9999, boxShadow:'0 4px 20px rgba(0,0,0,.6)', whiteSpace:'nowrap',
        }}>
          {syncMsg || (syncStatus==='saving'?'جارٍ النشر...': syncStatus==='uploading'?(`${uploadPct}`):'') }
        </div>
      )}

      {/* ── الهيدر ─────────────────────────── */}
      <header style={S.header}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:22}}>🏛️</span>
          <div>
            <div style={{color:GOLD,fontWeight:'bold',fontSize:15,lineHeight:1}}>MUSTAPHA IMMOBILIER</div>
            <div style={{color:'#555',fontSize:11}}>لوحة التحكم</div>
          </div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={handleSync} disabled={loading||syncStatus==='saving'} style={{
            ...S.btn,
            background: loading||syncStatus==='saving' ? '#333' : GOLD,
            color: loading||syncStatus==='saving' ? '#888' : '#000',
            padding:'9px 18px', fontSize:13, fontWeight:'bold',
          }}>
            {loading?'تحميل...': syncStatus==='saving'?'نشر...':'💾 حفظ ونشر'}
          </button>
          <button onClick={()=>{localStorage.removeItem('mus_auth');setAuth(false);}} style={{...S.btn,background:'#1a1a1a',color:'#888',padding:'9px 14px',fontSize:12}}>
            خروج
          </button>
        </div>
      </header>

      {/* ── التبويبات ──────────────────────── */}
      <nav style={S.tabBar}>
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setActiveTab(t.key)} style={{
            ...S.tab,
            background: activeTab===t.key ? GOLD : 'transparent',
            color:       activeTab===t.key ? '#000' : '#666',
            fontWeight:  activeTab===t.key ? 'bold' : 'normal',
          }}>
            <span style={{fontSize:16}}>{t.icon}</span>
            <span style={{fontSize:11}}>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* ── المحتوى ────────────────────────── */}
      <main style={{padding:'20px 16px', maxWidth:900, margin:'0 auto'}}>

        {/* ═══ الإعدادات ══════════════════════ */}
        {activeTab==='settings' && (
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            <h2 style={S.sectionTitle}>⚙️ الإعدادات</h2>

            <div style={S.card}>
              <h3 style={S.cardTitle}>🔑 GitHub Token</h3>
              <p style={{color:'#666',fontSize:12,marginBottom:12}}>
                مطلوب لرفع الصور وحفظ البيانات. يُحفظ في المتصفح فقط.
              </p>
              <input
                type="password"
                value={token}
                onChange={e=>saveToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxx"
                style={{...S.input, fontFamily:'monospace', letterSpacing:1}}
              />
              {token && <p style={{color:'#4f4',fontSize:12,marginTop:8}}>✓ التوكن محفوظ</p>}
            </div>

            <div style={S.card}>
              <h3 style={S.cardTitle}>🏢 معلومات الشركة</h3>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div>
                  <label style={S.inputLabel}>اسم الشركة</label>
                  <input value={data.config?.brand?.nameAr||''} onChange={e=>setData(d=>({...d,config:{...d.config,brand:{...d.config?.brand,nameAr:e.target.value}}}))} style={S.input} placeholder="MUSTAPHA IMMOBILIER" />
                </div>
                <div>
                  <label style={S.inputLabel}>رقم الهاتف</label>
                  <input value={data.config?.contact?.phone||''} onChange={e=>setData(d=>({...d,config:{...d.config,contact:{...d.config?.contact,phone:e.target.value}}}))} style={S.input} placeholder="+212 6XX XXX XXX" />
                </div>
                <div>
                  <label style={S.inputLabel}>البريد الإلكتروني</label>
                  <input value={data.config?.contact?.email||''} onChange={e=>setData(d=>({...d,config:{...d.config,contact:{...d.config?.contact,email:e.target.value}}}))} style={S.input} placeholder="contact@..." />
                </div>
                <div>
                  <label style={S.inputLabel}>عنوان المكتب</label>
                  <input value={data.config?.contact?.address||''} onChange={e=>setData(d=>({...d,config:{...d.config,contact:{...d.config?.contact,address:e.target.value}}}))} style={S.input} placeholder="القنيطرة، المغرب" />
                </div>
                <div>
                  <label style={S.inputLabel}>رقم واتساب (بصيغة دولية)</label>
                  <input value={data.config?.contact?.whatsapp||''} onChange={e=>setData(d=>({...d,config:{...d.config,contact:{...d.config?.contact,whatsapp:e.target.value}}}))} style={S.input} placeholder="+212600000000" />
                  <p style={{color:'#666',fontSize:11,marginTop:4}}>يُستخدم لزر واتساب العائم وأزرار التواصل — اكتبه بالصيغة الدولية بدون مسافات</p>
                </div>
                <div>
                  <label style={S.inputLabel}>رقم الهاتف (للرابط الدولي)</label>
                  <input value={data.config?.contact?.phoneHref||''} onChange={e=>setData(d=>({...d,config:{...d.config,contact:{...d.config?.contact,phoneHref:e.target.value}}}))} style={S.input} placeholder="+212600000000" />
                  <p style={{color:'#666',fontSize:11,marginTop:4}}>يُستخدم في روابط tel: — نفس صيغة واتساب عادةً</p>
                </div>
              </div>
            </div>

            <div style={S.card}>
              <h3 style={S.cardTitle}>📱 وسائل التواصل الاجتماعي</h3>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {[
                  {label:'فيسبوك',    icon:'📘', key:'facebook',  ph:'https://www.facebook.com/yourpage'},
                  {label:'إنستغرام',  icon:'📷', key:'instagram', ph:'https://www.instagram.com/yourpage'},
                  {label:'يوتيوب',    icon:'▶️', key:'youtube',   ph:'https://www.youtube.com/@yourchannel'},
                  {label:'تيك توك',   icon:'🎵', key:'tiktok',    ph:'https://www.tiktok.com/@yourpage'},
                  {label:'إكس (تويتر)',icon:'🐦',key:'twitter',   ph:'https://x.com/yourhandle'},
                  {label:'پينتيريست', icon:'📌', key:'pinterest', ph:'https://pinterest.com/yourpage'},
                  {label:'لينك تري',  icon:'🌳', key:'linktree',  ph:'https://linktr.ee/yourpage'},
                ].map(({label,icon,key,ph})=>(
                  <div key={key}>
                    <label style={S.inputLabel}>{icon} {label}</label>
                    <input
                      value={data.config?.social?.[key]||''}
                      onChange={e=>setData(d=>({...d,config:{...d.config,social:{...d.config?.social,[key]:e.target.value}}}))}
                      style={S.input}
                      placeholder={ph}
                      dir="ltr"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={S.card}>
              <h3 style={S.cardTitle}>🔐 تغيير كلمة المرور</h3>
              <ChangePassword />
            </div>

            <button onClick={handleSync} style={{...S.btn,background:GOLD,color:'#000',padding:'16px',fontSize:15,fontWeight:'bold',width:'100%'}}>
              💾 حفظ ونشر كل الإعدادات
            </button>
          </div>
        )}

        {/* ═══ قوائم العناصر ══════════════════ */}
        {activeTab !== 'settings' && (
          <>
            {/* شريط العنوان + إضافة */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h2 style={{...S.sectionTitle,margin:0}}>
                {TABS.find(t=>t.key===activeTab)?.icon} {TABS.find(t=>t.key===activeTab)?.label}
                <span style={{color:'#444',fontWeight:'normal',fontSize:14,marginRight:8}}>({items.length})</span>
              </h2>
              <button onClick={()=>openAdd(activeTab)} style={{...S.btn,background:GOLD,color:'#000',padding:'10px 18px',fontSize:13,fontWeight:'bold'}}>
                + إضافة
              </button>
            </div>

            {/* إحصائية سريعة */}
            {activeTab==='properties' && (
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
                {[
                  {label:'المجموع',    val: items.length},
                  {label:'مميزة',      val: items.filter(i=>i.featured).length},
                  {label:'بدون صورة', val: items.filter(i=>!i.image).length},
                ].map(s=>(
                  <div key={s.label} style={{background:'#0a0a0a',border:'1px solid #1a1a1a',borderRadius:14,padding:'14px 10px',textAlign:'center'}}>
                    <div style={{color:GOLD,fontSize:22,fontWeight:'bold'}}>{s.val}</div>
                    <div style={{color:'#555',fontSize:12,marginTop:2}}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* الشبكة */}
            {items.length === 0 ? (
              <div style={{textAlign:'center',padding:'60px 20px',color:'#333',border:'1px dashed #1a1a1a',borderRadius:20}}>
                <div style={{fontSize:48,marginBottom:12}}>📭</div>
                <p style={{fontSize:15}}>لا توجد عناصر — أضف أول عنصر الآن</p>
              </div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}}>
                {items.map((item,idx)=>(
                  <ItemCard
                    key={idx}
                    item={item}
                    type={activeTab}
                    onEdit={()=>openEdit(activeTab,idx)}
                    onDelete={()=>deleteItem(activeTab,idx)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ═══ نافذة التعديل/الإضافة ═══════════ */}
      {modal && (
        <div style={S.overlay} onClick={e=>{if(e.target===e.currentTarget)setModal(null)}}>
          <div style={S.modalBox}>
            {/* رأس النافذة */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:16,borderBottom:'1px solid #1f1f1f'}}>
              <h3 style={{margin:0,color:GOLD,fontSize:17}}>
                {modal.index===-1 ? '➕ إضافة ' : '✏️ تعديل '}
                {TABS.find(t=>t.key===modal.type)?.label}
              </h3>
              <button onClick={()=>setModal(null)} style={{background:'transparent',border:'none',color:'#666',fontSize:22,cursor:'pointer',lineHeight:1}}>×</button>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:18}}>

              {/* ─── قسم الصورة الرئيسية ─── */}
              {modal.item.hasOwnProperty('image') && (
                <div style={{background:'#060606',border:'1px dashed #2a2a2a',borderRadius:16,padding:16}}>
                  <label style={{...S.inputLabel,color:GOLD,fontSize:12}}>📷 الصورة الرئيسية</label>

                  {/* معاينة */}
                  {modal.item.image ? (
                    <div style={{position:'relative',marginBottom:12}}>
                      <img src={modal.item.image} alt="" style={{width:'100%',height:180,objectFit:'cover',borderRadius:12,display:'block'}} />
                      <button onClick={()=>setField('image','')} style={{position:'absolute',top:8,left:8,background:'rgba(0,0,0,.7)',border:'none',color:'#f55',borderRadius:'50%',width:28,height:28,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
                    </div>
                  ) : (
                    <div style={{height:120,background:'#0a0a0a',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,color:'#2a2a2a',fontSize:40}}>
                      🖼
                    </div>
                  )}

                  {/* أزرار الرفع — للهاتف */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    <button
                      onClick={()=>cameraRef.current.click()}
                      disabled={syncStatus==='uploading'}
                      style={{...S.uploadBtn, background:'#0f1f0f', borderColor:'#2a4a2a', color:'#6f6'}}
                    >
                      <span style={{fontSize:24}}>📷</span>
                      <span style={{fontSize:12, fontWeight:'bold'}}>التقاط صورة</span>
                      <span style={{fontSize:10, color:'#4a4a4a'}}>الكاميرا</span>
                    </button>
                    <button
                      onClick={()=>galleryRef.current.click()}
                      disabled={syncStatus==='uploading'}
                      style={{...S.uploadBtn, background:'#0f0f1f', borderColor:'#2a2a4a', color:'#88f'}}
                    >
                      <span style={{fontSize:24}}>🖼️</span>
                      <span style={{fontSize:12, fontWeight:'bold'}}>من الألبوم</span>
                      <span style={{fontSize:10, color:'#4a4a4a'}}>المعرض</span>
                    </button>
                  </div>

                  {/* مداخل الملفات المخفية */}
                  <input ref={cameraRef}  type="file" accept="image/*" capture="environment" hidden onChange={e=>{if(e.target.files[0])uploadImageFile(e.target.files[0],'image');}} />
                  <input ref={galleryRef} type="file" accept="image/*" hidden onChange={e=>{if(e.target.files[0])uploadImageFile(e.target.files[0],'image');}} />

                  {/* مؤشر الرفع */}
                  {syncStatus==='uploading' && (
                    <div style={{marginTop:10,textAlign:'center',color:GOLD,fontSize:13}}>
                      ⏳ {uploadPct || 'جارٍ الرفع...'}
                    </div>
                  )}
                </div>
              )}

              {/* ─── معرض الصور (للعقارات) ─── */}
              {modal.type==='properties' && (
                <div style={{background:'#060606',border:'1px dashed #2a2a2a',borderRadius:16,padding:16}}>
                  <label style={{...S.inputLabel,color:GOLD,fontSize:12}}>🗂️ معرض الصور ({(modal.item.gallery||[]).length})</label>

                  {(modal.item.gallery||[]).length > 0 && (
                    <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:12}}>
                      {(modal.item.gallery||[]).map((url,gi)=>(
                        <div key={gi} style={{position:'relative',width:70,height:70}}>
                          <img src={url} alt="" style={{width:70,height:70,objectFit:'cover',borderRadius:10,display:'block'}} />
                          <button onClick={()=>removeGalleryImg(gi)} style={{position:'absolute',top:-4,left:-4,background:'#f22',border:'none',color:'#fff',borderRadius:'50%',width:20,height:20,cursor:'pointer',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={()=>multiRef.current.click()}
                    disabled={syncStatus==='uploading'}
                    style={{...S.uploadBtn,gridColumn:'span 2',color:'#c9a14a',borderColor:'#2a2010',background:'#0f0a00'}}
                  >
                    <span style={{fontSize:20}}>➕</span>
                    <span style={{fontSize:12,fontWeight:'bold'}}>إضافة صور للمعرض</span>
                    <span style={{fontSize:10,color:'#4a4a4a'}}>يمكن اختيار عدة صور</span>
                  </button>
                  <input ref={multiRef} type="file" accept="image/*" multiple hidden onChange={e=>{if(e.target.files.length)uploadMultiple(Array.from(e.target.files));}} />
                </div>
              )}

              {/* ─── الحقول الديناميكية ─── */}
              <ModalFields type={modal.type} item={modal.item} setField={setField} />

            </div>

            {/* أزرار الحفظ */}
            <div style={{display:'flex',gap:10,marginTop:24,paddingTop:20,borderTop:'1px solid #1a1a1a'}}>
              <button onClick={saveModal} style={{...S.btn,flex:2,background:GOLD,color:'#000',padding:14,fontSize:15,fontWeight:'bold'}}>
                ✓ حفظ
              </button>
              <button onClick={()=>setModal(null)} style={{...S.btn,flex:1,background:'#111',color:'#888',padding:14,fontSize:14}}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  بطاقة العنصر
// ─────────────────────────────────────────────
function ItemCard({ item, type, onEdit, onDelete }) {
  const img = item.image || item.thumbnail || '';
  const title = item.title || item.id || '—';
  const sub = type==='properties'
    ? `${item.priceLabel||''} · ${item.surface||''}م²`
    : type==='videos' ? item.duration||''
    : item.city||'';

  return (
    <div style={{background:'#080808',borderRadius:16,border:'1px solid #161616',overflow:'hidden',transition:'border-color .2s'}}>
      {/* صورة */}
      <div style={{position:'relative',height:150,background:'#0a0a0a',overflow:'hidden'}}>
        {img ? (
          <img src={img} alt={title} style={{width:'100%',height:'100%',objectFit:'cover'}} />
        ) : (
          <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,color:'#1a1a1a'}}>🖼</div>
        )}
        {item.featured && (
          <span style={{position:'absolute',top:8,right:8,background:GOLD,color:'#000',fontSize:10,padding:'3px 8px',borderRadius:20,fontWeight:'bold'}}>⭐ مميز</span>
        )}
        {type==='properties' && (
          <span style={{position:'absolute',bottom:8,right:8,background:'rgba(0,0,0,.75)',color:'#fff',fontSize:11,padding:'4px 10px',borderRadius:20}}>
            {item.type||''}
          </span>
        )}
      </div>

      {/* نص */}
      <div style={{padding:'12px 14px'}}>
        <p style={{margin:'0 0 4px',fontSize:14,fontWeight:'bold',color:'#ddd',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{title}</p>
        {sub && <p style={{margin:0,fontSize:12,color:'#555'}}>{sub}</p>}

        {/* أزرار */}
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button onClick={onEdit} style={{...S.btn,flex:1,background:'#141414',color:'#bbb',padding:'8px 0',fontSize:12}}>
            ✏️ تعديل
          </button>
          <button onClick={onDelete} style={{...S.btn,background:'#180808',color:'#f44',padding:'8px 12px',fontSize:12}}>
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  حقول النموذج حسب النوع
// ─────────────────────────────────────────────
function ModalFields({ type, item, setField }) {
  const F = ({ label, k, placeholder='', multiline=false, number=false, select=null }) => (
    <div>
      <label style={S.inputLabel}>{label}</label>
      {select ? (
        <select value={item[k]||''} onChange={e=>setField(k,e.target.value)} style={S.input}>
          {select.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      ) : multiline ? (
        <textarea value={item[k]||''} onChange={e=>setField(k,e.target.value)} placeholder={placeholder} rows={3}
          style={{...S.input, resize:'vertical', minHeight:80}} />
      ) : (
        <input type={number?'number':'text'} value={item[k]??''} onChange={e=>setField(k,number?Number(e.target.value):e.target.value)}
          placeholder={placeholder} style={S.input} />
      )}
    </div>
  );

  if (type==='properties') return (
    <>
      <F label="عنوان العقار *"    k="title"      placeholder="مثال: شقة فاخرة 3 غرف — حي الرياض" />
      <F label="نوع العقار"        k="type"       select={PROPERTY_TYPES} />
      <F label="المدينة"           k="city"       placeholder="القنيطرة" />
      <F label="المنطقة / الحي"    k="area"       placeholder="حي الرياض" />
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <F label="السعر (درهم)" k="price"   number placeholder="1300000" />
        <F label="المساحة (م²)" k="surface" number placeholder="320" />
      </div>
      <F label="السعر (نص)"     k="priceLabel" placeholder="1.300.000 درهم" />
      <F label="الوصف"          k="description" multiline placeholder="وصف مختصر للعقار..." />
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <input type="checkbox" id="feat" checked={!!item.featured} onChange={e=>setField('featured',e.target.checked)} style={{width:18,height:18,accentColor:GOLD}} />
        <label htmlFor="feat" style={{color:'#bbb',fontSize:14,cursor:'pointer'}}>تثبيت في الواجهة (عقار مميز ⭐)</label>
      </div>
    </>
  );

  if (type==='lotissements') return (
    <>
      <F label="العنوان *"      k="title"       placeholder="تجزئة الورود" />
      <F label="المعرّف (slug)" k="slug"        placeholder="lotissement-el-warda" />
      <F label="المدينة"        k="city"        placeholder="القنيطرة" />
      <F label="الوصف"          k="description" multiline placeholder="وصف التجزئة..." />
    </>
  );

  if (type==='manatiq') return (
    <>
      <F label="اسم المنطقة *"  k="title"       placeholder="القنيطرة" />
      <F label="المعرّف (slug)" k="slug"        placeholder="kenitra" />
      <F label="المدينة"        k="city"        placeholder="القنيطرة" />
      <F label="الوصف"          k="description" multiline placeholder="وصف المنطقة..." />
    </>
  );

  if (type==='videos') return (
    <>
      <F label="العنوان *"      k="title"      placeholder="جولة في العقار..." />
      <F label="رابط YouTube"   k="youtubeUrl" placeholder="https://youtube.com/watch?v=..." />
      <F label="معرّف الفيديو"  k="youtubeId"  placeholder="dQw4w9WgXcQ" />
      <F label="المدة"          k="duration"   placeholder="3:45" />
      <F label="الوصف"          k="description" multiline />
    </>
  );

  return null;
}

// ─────────────────────────────────────────────
//  تغيير كلمة المرور
// ─────────────────────────────────────────────
function ChangePassword() {
  const [cur,  setCur]  = useState('');
  const [next, setNext] = useState('');
  const [msg,  setMsg]  = useState('');

  function save() {
    const stored = localStorage.getItem('mus_admin_password') || 'mustapha2026';
    if (cur !== stored) { setMsg('كلمة المرور الحالية غير صحيحة'); return; }
    if (next.length < 6) { setMsg('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل'); return; }
    localStorage.setItem('mus_admin_password', next);
    setCur(''); setNext('');
    setMsg('✓ تم تغيير كلمة المرور');
    setTimeout(()=>setMsg(''), 3000);
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <input type="password" value={cur}  onChange={e=>setCur(e.target.value)}  placeholder="كلمة المرور الحالية"  style={S.input} />
      <input type="password" value={next} onChange={e=>setNext(e.target.value)} placeholder="كلمة المرور الجديدة" style={S.input} />
      {msg && <p style={{fontSize:13,color: msg.startsWith('✓')?'#4f4':'#f44',margin:0}}>{msg}</p>}
      <button onClick={save} style={{...S.btn,background:'#1a1a1a',color:'#ddd',padding:'12px',fontSize:14}}>تأكيد التغيير</button>
    </div>
  );
}

// ─────────────────────────────────────────────
//  الألوان والأنماط
// ─────────────────────────────────────────────
const GOLD = '#c9a14a';

const S = {
  page: {
    minHeight:'100vh', background:'#000', color:'#fff',
    fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    direction:'rtl',
  },
  loginBox: {
    background:'#0a0a0a', padding:32, borderRadius:24,
    border:`1px solid ${GOLD}`, width:'100%', maxWidth:380,
    margin:'auto', position:'relative', top:'50%', transform:'translateY(-50%)',
  },
  header: {
    background:'#050505', borderBottom:'1px solid #1a1a1a',
    position:'sticky', top:0, zIndex:100,
    padding:'12px 16px',
    display:'flex', justifyContent:'space-between', alignItems:'center',
  },
  tabBar: {
    display:'flex', overflowX:'auto', gap:4,
    padding:'8px 12px', background:'#030303',
    borderBottom:'1px solid #111', scrollbarWidth:'none',
  },
  tab: {
    display:'flex', flexDirection:'column', alignItems:'center', gap:3,
    padding:'8px 14px', borderRadius:12, border:'none',
    cursor:'pointer', flexShrink:0, transition:'all .15s',
  },
  sectionTitle: {
    fontSize:18, fontWeight:'bold', color:'#ddd', margin:'0 0 16px',
  },
  card: {
    background:'#080808', border:'1px solid #181818',
    borderRadius:20, padding:20,
  },
  cardTitle: {
    color:GOLD, fontSize:15, fontWeight:'bold', margin:'0 0 14px',
  },
  input: {
    width:'100%', padding:'12px 14px',
    background:'#0a0a0a', border:'1px solid #222',
    borderRadius:12, color:'#fff', fontSize:14,
    outline:'none', boxSizing:'border-box',
    transition:'border-color .15s',
  },
  inputLabel: {
    display:'block', color:'#666', fontSize:12, marginBottom:6,
  },
  btn: {
    border:'none', borderRadius:12, cursor:'pointer',
    padding:'10px 16px', fontSize:13, transition:'opacity .15s',
  },
  uploadBtn: {
    border:'1px solid #333', borderRadius:14, cursor:'pointer',
    padding:'14px 10px', display:'flex', flexDirection:'column',
    alignItems:'center', gap:4, background:'#0a0a0a',
    transition:'opacity .15s', width:'100%',
  },
  overlay: {
    position:'fixed', inset:0, background:'rgba(0,0,0,.92)',
    zIndex:500, display:'flex', alignItems:'flex-end',
    justifyContent:'center', padding:'0',
  },
  modalBox: {
    background:'#0c0c0c', border:'1px solid #1f1f1f',
    borderRadius:'24px 24px 0 0', width:'100%', maxWidth:640,
    maxHeight:'92vh', overflowY:'auto', padding:'20px 18px 32px',
  },
};
