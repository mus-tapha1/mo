'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  getProperties, addProperty, updateProperty, deleteProperty,
  getLotissements, addLotissement, updateLotissement, deleteLotissement,
  getManatiq, addManatiq, updateManatiq, deleteManatiq,
  getVideos, addVideo, updateVideo, deleteVideo,
  getConfig, saveConfig,
  getAdminPassword, setAdminPassword,
  isAuthenticated, login, logout, resetAll,
  getAllData, syncAllToGitHub, pullFromGitHub,
  initializeTokenFromData, saveTokenToData,
} from '@/lib/store';
import { checkActionsStatus, isSyncConfigured, saveSyncSettings, clearSyncSettings, getSyncSettings } from '@/lib/github-sync';
import { propertyTypes } from '@/data/properties';
import ImageUploader from '@/components/ImageUploader';

// ============================================================
//  استخراج معرف يوتيوب
// ============================================================
function extractYTId(url) {
  if (!url) return '';
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  if (/^[\w-]{11}$/.test(url)) return url;
  return '';
}

// ============================================================
//  شاشة الدخول
// ============================================================
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-noir flex items-center justify-center px-4">
      <div className="absolute inset-0 dot-pattern opacity-10" />
      <div className="relative w-full max-w-md">
        <div className="glass-card p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 text-gold font-bold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>M</div>
            <h1 className="text-2xl font-bold text-gold mb-2">لوحة التحكم</h1>
            <p className="text-creme/50 text-sm">MUSTAPHA IMMOBILIER — لوحة الإدارة</p>
            <div className="gold-divider mx-auto mt-4" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-creme/70 text-sm mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className="w-full bg-noir-100 border border-or/20 rounded-lg px-4 py-3 text-creme focus:border-or focus:outline-none transition-colors"
                placeholder="••••••••••"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm mt-2">كلمة المرور غير صحيحة</p>}
            </div>
            <button type="submit" className="btn-gold w-full py-3 text-lg">دخول</button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-creme/40 text-sm hover:text-or transition-colors">← العودة للموقع</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  مكوّنات واجهة قابلة لإعادة الاستخدام
// ============================================================
function TabButton({ active, onClick, icon, label, count }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-right ${active ? 'bg-or/15 text-or border border-or/30' : 'text-creme/60 hover:bg-or/5 hover:text-creme border border-transparent'}`}>
      <span className="text-xl">{icon}</span>
      <span className="flex-1 font-medium">{label}</span>
      {count !== undefined && <span className="text-xs bg-or/20 text-or px-2 py-0.5 rounded-full">{count}</span>}
    </button>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder = '', textarea = false }) {
  const baseClass = 'w-full bg-noir-100 border border-or/20 rounded-lg px-4 py-2.5 text-creme focus:border-or focus:outline-none transition-colors text-sm';
  return (
    <div>
      <label className="block text-creme/60 text-xs mb-1.5">{label}</label>
      {textarea ? (
        <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} className={baseClass + ' min-h-[80px] resize-y'} placeholder={placeholder} />
      ) : (
        <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} className={baseClass} placeholder={placeholder} />
      )}
    </div>
  );
}

function ActionButton({ onClick, variant = 'gold', children, disabled = false }) {
  const styles = {
    gold: 'btn-gold px-4 py-2 text-sm',
    outline: 'btn-outline-gold px-4 py-2 text-sm',
    danger: 'px-4 py-2 text-sm rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors',
  };
  return <button onClick={onClick} disabled={disabled} className={`${styles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>{children}</button>;
}

function Modal({ open, onClose, title, children, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(10,10,10,0.85)' }}>
      <div className={`glass-card my-8 ${wide ? 'max-w-3xl' : 'max-w-xl'} w-full p-6 md:p-8`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gold">{title}</h3>
          <button onClick={onClose} className="text-creme/40 hover:text-or text-2xl transition-colors">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ConfirmDialog({ open, onClose, onConfirm, message }) {
  return (
    <Modal open={open} onClose={onClose} title="تأكيد الحذف">
      <p className="text-creme/70 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <ActionButton onClick={onClose} variant="outline">إلغاء</ActionButton>
        <ActionButton onClick={() => { onConfirm(); onClose(); }} variant="danger">نعم، احذف</ActionButton>
      </div>
    </Modal>
  );
}

function Toast({ message, show, isError = false }) {
  if (!show) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-lg shadow-2xl font-bold animate-fade-up ${isError ? 'bg-red-600 text-white' : 'bg-or text-noir'}`}>
      {isError ? '⚠' : '✓'} {message}
    </div>
  );
}

// ============================================================
//  مؤشر حالة المزامنة — النشر فوري بدون بناء
// ============================================================
function SyncStatus({ onSync, onPull, lastSync }) {
  const [actionsStatus, setActionsStatus] = useState(null);

  const pollActions = async () => {
    try {
      const run = await checkActionsStatus();
      setActionsStatus(run);
      if (run && (run.status === 'in_progress' || run.status === 'queued')) {
        setTimeout(pollActions, 8000);
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    pollActions();
  }, [lastSync]); // eslint-disable-line

  const statusInfo = actionsStatus
    ? actionsStatus.status === 'completed' && actionsStatus.conclusion === 'success'
      ? { text: 'الموقع محدّث ✓', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' }
      : actionsStatus.status === 'in_progress' || actionsStatus.status === 'queued'
      ? { text: 'جاري تحديث الموقع... ⏳', color: 'text-or', bg: 'bg-or/10 border-or/20' }
      : { text: 'البيانات منشورة ✓', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' }
    : { text: 'البيانات محدثة ✓', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' };

  return (
    <div className={`rounded-lg p-3 text-xs ${statusInfo.bg} border ${statusInfo.color}`}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span>🔄 المزامنة: {statusInfo.text}</span>
        <div className="flex gap-2">
          <button onClick={onPull} className="underline hover:no-underline opacity-80">تحميل</button>
          <button onClick={onSync} className="underline hover:no-underline opacity-80">نشر</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  مدير العقارات
// ============================================================
function PropertiesManager({ showToast, onSync }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filter, setFilter] = useState('');

  const refresh = () => setItems(getProperties());
  useEffect(() => { refresh(); }, []);

  const emptyProp = {
    type: '', typeKey: '', title: '', price: '', priceLabel: '',
    city: 'القنيطرة', area: '', surface: '', image: '', gallery: [],
    basics: [], lecture: [], note: '', featured: false,
  };

  const openAdd = () => { setEditing({ ...emptyProp }); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing({ ...item, basics: item.basics || [], lecture: item.lecture || [], gallery: item.gallery || [] });
    setModalOpen(true);
  };

  const handleSave = () => {
    const data = {
      ...editing,
      price: Number(editing.price) || 0,
      surface: Number(editing.surface) || 0,
      priceLabel: editing.priceLabel || `${Number(editing.price).toLocaleString()} درهم`,
    };
    if (editing.id && items.find((p) => p.id === editing.id)) {
      updateProperty(editing.id, data);
      showToast('تم تحديث العقار ونشره');
    } else {
      addProperty(data);
      showToast('تمت إضافة العقار ونشره');
    }
    setModalOpen(false);
    refresh();
    onSync();
  };

  const handleDelete = () => {
    deleteProperty(deleteTarget.id);
    showToast('تم حذف العقار وتحديث الموقع');
    refresh();
    onSync();
  };

  const filtered = items.filter((p) =>
    p.title?.toLowerCase().includes(filter.toLowerCase()) ||
    p.type?.includes(filter) || p.city?.includes(filter)
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gold">إدارة العقارات</h2>
        <div className="flex gap-3">
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="بحث..."
            className="bg-noir-100 border border-or/20 rounded-lg px-4 py-2 text-creme text-sm focus:border-or focus:outline-none" />
          <ActionButton onClick={openAdd}>+ إضافة عقار</ActionButton>
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map((prop) => (
          <div key={prop.id} className="glass-card p-4 flex flex-wrap items-center gap-4">
            <img src={prop.image} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-creme font-bold">{prop.title}</h3>
                {prop.featured && <span className="badge-gold text-xs px-2 py-0.5">مميّز</span>}
              </div>
              <p className="text-creme/50 text-sm">{prop.type} · {prop.city} · {prop.surface}م² · {prop.priceLabel}</p>
              <p className="text-creme/30 text-xs mt-1">ID: {prop.id}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/properties/${prop.id}`} target="_blank"><ActionButton variant="outline">عرض</ActionButton></Link>
              <ActionButton onClick={() => openEdit(prop)} variant="outline">تعديل</ActionButton>
              <ActionButton onClick={() => setDeleteTarget(prop)} variant="danger">حذف</ActionButton>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-creme/40 text-center py-12">لا توجد عقارات. اضغط «إضافة عقار» للبدء.</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing?.id ? 'تعديل عقار' : 'إضافة عقار جديد'} wide>
        {editing && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-4">
              <Input label="عنوان العقار" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="بقعة فيلا فاخرة · 320م²" />
              <div>
                <label className="block text-creme/60 text-xs mb-1.5">نوع العقار</label>
                <select value={editing.type} onChange={(e) => {
                  const pt = propertyTypes.find((p) => p.label === e.target.value);
                  setEditing({ ...editing, type: e.target.value, typeKey: pt?.key || '' });
                }} className="w-full bg-noir-100 border border-or/20 rounded-lg px-4 py-2.5 text-creme focus:border-or focus:outline-none text-sm">
                  <option value="">اختر النوع...</option>
                  {propertyTypes.filter((p) => p.key).map((p) => <option key={p.key} value={p.label}>{p.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="السعر (رقم)" value={editing.price} onChange={(v) => setEditing({ ...editing, price: v })} type="number" placeholder="1300000" />
              <Input label="تسمية السعر" value={editing.priceLabel} onChange={(v) => setEditing({ ...editing, priceLabel: v })} placeholder="1.300.000 درهم" />
              <Input label="المساحة (م²)" value={editing.surface} onChange={(v) => setEditing({ ...editing, surface: v })} type="number" placeholder="320" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="المدينة" value={editing.city} onChange={(v) => setEditing({ ...editing, city: v })} />
              <Input label="الحي/المنطقة" value={editing.area} onChange={(v) => setEditing({ ...editing, area: v })} placeholder="حي راقٍ" />
            </div>
            <ImageUploader label="الصورة الرئيسية" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} />
            <ImageUploader label="معرض الصور (متعدد)" multiple value={editing.gallery} onChange={(v) => setEditing({ ...editing, gallery: v })} />
            <div className="flex items-center gap-3 py-2">
              <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="w-4 h-4 accent-or" id="feat" />
              <label htmlFor="feat" className="text-creme text-sm cursor-pointer">عقار مميز (يظهر في الصفحة الرئيسية)</label>
            </div>
            <Input label="ملاحظة إضافية" value={editing.note} onChange={(v) => setEditing({ ...editing, note: v })} textarea placeholder="قراءة أولية فقط..." />
            <div className="flex gap-3 justify-end pt-4 border-t border-or/10">
              <ActionButton onClick={() => setModalOpen(false)} variant="outline">إلغاء</ActionButton>
              <ActionButton onClick={handleSave}>حفظ ونشر</ActionButton>
            </div>
          </div>
        )}
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} message={`هل تريد حذف «${deleteTarget?.title}»؟`} />
    </div>
  );
}

// ============================================================
//  مدير التجزئات والمناطق
// ============================================================
function SlugsManager({ type, showToast, onSync }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isLot = type === 'lotissements';
  const refresh = () => setItems(isLot ? getLotissements() : getManatiq());
  useEffect(() => { refresh(); }, [type]);

  const openAdd = () => { setEditing({ title: '', city: 'القنيطرة', slug: '', image: '', description: '' }); setModalOpen(true); };
  const openEdit = (item) => { setEditing({ ...item }); setModalOpen(true); };

  const handleSave = () => {
    if (isLot) {
      editing.slug ? updateLotissement(editing.slug, editing) : addLotissement(editing);
    } else {
      editing.slug ? updateManatiq(editing.slug, editing) : addManatiq(editing);
    }
    showToast(`تم حفظ ${isLot ? 'التجزئة' : 'المنطقة'} ونشرها`);
    setModalOpen(false);
    refresh();
    onSync();
  };

  const handleDelete = () => {
    isLot ? deleteLotissement(deleteTarget.slug) : deleteManatiq(deleteTarget.slug);
    showToast(`تم حذف ${isLot ? 'التجزئة' : 'المنطقة'} وتحديث الموقع`);
    refresh();
    onSync();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gold">{isLot ? 'إدارة التجزئات' : 'إدارة المناطق'}</h2>
        <ActionButton onClick={openAdd}>+ إضافة جديد</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.slug} className="glass-card p-4 flex items-center gap-4">
            <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-creme font-bold">{item.title}</h3>
              <p className="text-creme/50 text-xs">{item.city} · {item.slug}</p>
            </div>
            <div className="flex gap-2">
              <ActionButton onClick={() => openEdit(item)} variant="outline">تعديل</ActionButton>
              <ActionButton onClick={() => setDeleteTarget(item)} variant="danger">حذف</ActionButton>
            </div>
          </div>
        ))}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isLot ? 'إدارة التجزئة' : 'إدارة المنطقة'} wide>
        {editing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="العنوان" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="وسط المدينة" />
              <Input label="المدينة" value={editing.city} onChange={(v) => setEditing({ ...editing, city: v })} />
            </div>
            <Input label="الرابط (slug)" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} placeholder="centre-ville" />
            <ImageUploader label="الصورة" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} />
            <Input label="الوصف" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea />
            <div className="flex gap-3 justify-end pt-4 border-t border-or/10">
              <ActionButton onClick={() => setModalOpen(false)} variant="outline">إلغاء</ActionButton>
              <ActionButton onClick={handleSave}>حفظ ونشر</ActionButton>
            </div>
          </div>
        )}
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} message={`هل تريد حذف «${deleteTarget?.title}»؟`} />
    </div>
  );
}

// ============================================================
//  مدير الفيديوهات
// ============================================================
function VideosManager({ showToast, onSync }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const refresh = () => setItems(getVideos());
  useEffect(() => { refresh(); }, []);

  const emptyItem = { title: '', description: '', youtubeUrl: '', youtubeId: '', duration: '' };

  const openAdd = () => { setEditing({ ...emptyItem }); setModalOpen(true); };
  const openEdit = (item) => { setEditing({ ...item }); setModalOpen(true); };

  const handleSave = () => {
    const ytId = editing.youtubeId || extractYTId(editing.youtubeUrl);
    const data = {
      ...editing,
      youtubeId: ytId,
      youtubeUrl: editing.youtubeUrl || (ytId ? `https://www.youtube.com/watch?v=${ytId}` : ''),
      thumbnail: ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : '',
    };
    if (editing.id && items.find((v) => v.id === editing.id)) {
      updateVideo(editing.id, data);
      showToast('تم تحديث الفيديو ونشره');
    } else {
      addVideo(data);
      showToast('تمت إضافة الفيديو ونشره');
    }
    setModalOpen(false);
    refresh();
    onSync();
  };

  const handleDelete = () => {
    deleteVideo(deleteTarget.id);
    showToast('تم حذف الفيديو وتحديث الموقع');
    refresh();
    onSync();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gold">إدارة الفيديوهات</h2>
          <p className="text-creme/40 text-sm mt-1">أضف رابط يوتيوب وسيُعرض داخل الموقع</p>
        </div>
        <ActionButton onClick={openAdd}>+ إضافة فيديو</ActionButton>
      </div>
      <div className="space-y-3">
        {items.map((v) => (
          <div key={v.id} className="glass-card p-4 flex flex-wrap items-center gap-4">
            <img src={v.thumbnail} alt="" className="w-24 h-16 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-[200px]">
              <h3 className="text-creme font-bold">{v.title}</h3>
              <p className="text-creme/50 text-sm">{v.duration || '—'} · ID: {v.youtubeId}</p>
              <a href={v.youtubeUrl} target="_blank" rel="noreferrer" className="text-or/60 text-xs hover:text-or transition-colors">{v.youtubeUrl}</a>
            </div>
            <div className="flex gap-2">
              <ActionButton onClick={() => openEdit(v)} variant="outline">تعديل</ActionButton>
              <ActionButton onClick={() => setDeleteTarget(v)} variant="danger">حذف</ActionButton>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-creme/40 text-center py-12">لا توجد فيديوهات.</p>}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing?.id ? 'تعديل فيديو' : 'إضافة فيديو'} wide>
        {editing && (
          <div className="space-y-4">
            <Input label="عنوان الفيديو" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="اكتشف المدينة..." />
            <Input label="رابط يوتيوب" value={editing.youtubeUrl} onChange={(v) => setEditing({ ...editing, youtubeUrl: v })} placeholder="https://www.youtube.com/watch?v=..." />
            <div className="flex items-center gap-3 text-sm text-creme/50">
              <span>أو أدخل ID مباشرة:</span>
              <input value={editing.youtubeId} onChange={(e) => setEditing({ ...editing, youtubeId: e.target.value })}
                className="flex-1 bg-noir-100 border border-or/20 rounded-lg px-4 py-2 text-creme focus:border-or focus:outline-none text-sm" placeholder="LXb3EKWsInQ" />
            </div>
            {editing.youtubeId && (
              <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img src={`https://img.youtube.com/vi/${editing.youtubeId}/maxresdefault.jpg`} alt="preview" className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = `https://img.youtube.com/vi/${editing.youtubeId}/hqdefault.jpg`; }} />
                <div className="absolute inset-0 flex items-center justify-center bg-noir/40">
                  <span className="text-2xl text-or">▶ معاينة</span>
                </div>
              </div>
            )}
            <Input label="الوصف" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea />
            <Input label="المدة (اختياري)" value={editing.duration} onChange={(v) => setEditing({ ...editing, duration: v })} placeholder="04:12" />
            <div className="flex gap-3 justify-end pt-4 border-t border-or/10">
              <ActionButton onClick={() => setModalOpen(false)} variant="outline">إلغاء</ActionButton>
              <ActionButton onClick={handleSave}>حفظ ونشر</ActionButton>
            </div>
          </div>
        )}
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} message={`هل تريد حذف «${deleteTarget?.title}»؟`} />
    </div>
  );
}

// ============================================================
//  مدير الإعدادات — العلامة + التواصل + كلمة المرور
// ============================================================
function ConfigManager({ showToast, onSync }) {
  const [cfg, setCfg] = useState(null);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [githubToken, setGithubToken] = useState('');

  useEffect(() => {
    setCfg(getConfig());
    const settings = getSyncSettings();
    if (settings && settings.token) setGithubToken(settings.token);
  }, []);

  if (!cfg) return <p className="text-creme/40">جارٍ التحميل...</p>;

  const handleSaveConfig = async () => {
    saveConfig(cfg);
    saveSyncSettings(githubToken);
    await saveTokenToData(githubToken);
    showToast('تم حفظ الإعدادات وتحديث الموقع');
    onSync();
  };

  const handleChangePassword = () => {
    setPwError('');
    setPwSuccess(false);
    if (pwForm.current !== getAdminPassword()) {
      setPwError('كلمة المرور الحالية غير صحيحة');
      return;
    }
    if (pwForm.next.length < 6) {
      setPwError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('كلمة المرور الجديدة وتأكيدها غير متطابقتين');
      return;
    }
    setAdminPassword(pwForm.next);
    setPwForm({ current: '', next: '', confirm: '' });
    setPwSuccess(true);
    showToast('تم تغيير كلمة المرور وتحديث الموقع');
    onSync();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gold">الإعدادات</h2>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-or font-bold mb-4 flex items-center gap-2">🔑 تغيير كلمة المرور</h3>
        <div className="space-y-4">
          <Input label="كلمة المرور الحالية" value={pwForm.current} onChange={(v) => { setPwForm({ ...pwForm, current: v }); setPwError(''); setPwSuccess(false); }} type="password" placeholder="••••••••" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="كلمة المرور الجديدة" value={pwForm.next} onChange={(v) => { setPwForm({ ...pwForm, next: v }); setPwError(''); setPwSuccess(false); }} type="password" placeholder="6 أحرف على الأقل" />
            <Input label="تأكيد كلمة المرور" value={pwForm.confirm} onChange={(v) => { setPwForm({ ...pwForm, confirm: v }); setPwError(''); setPwSuccess(false); }} type="password" placeholder="••••••••" />
          </div>
          {pwError && <p className="text-red-400 text-sm">⚠ {pwError}</p>}
          {pwSuccess && <p className="text-green-400 text-sm">✓ تم تغيير كلمة المرور بنجاح</p>}
          <ActionButton onClick={handleChangePassword}>تغيير كلمة المرور</ActionButton>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-or font-bold mb-4 flex items-center gap-2">◆ معلومات العلامة</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="الاسم (لاتيني)" value={cfg.brand?.name || ''} onChange={(v) => setCfg({ ...cfg, brand: { ...cfg.brand, name: v } })} />
          <Input label="الاسم (عربي)" value={cfg.brand?.nameAr || ''} onChange={(v) => setCfg({ ...cfg, brand: { ...cfg.brand, nameAr: v } })} />
          <Input label="الشعار (لاتيني)" value={cfg.brand?.tagline || ''} onChange={(v) => setCfg({ ...cfg, brand: { ...cfg.brand, tagline: v } })} />
          <Input label="الشعار (عربي)" value={cfg.brand?.taglineAr || ''} onChange={(v) => setCfg({ ...cfg, brand: { ...cfg.brand, taglineAr: v } })} />
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-or font-bold mb-4 flex items-center gap-2">📱 أرقام التواصل والشبكات</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="الهاتف" value={cfg.contact?.phone || ''} onChange={(v) => setCfg({ ...cfg, contact: { ...cfg.contact, phone: v, phoneHref: v.replace(/\s/g, '') } })} />
          <Input label="واتساب" value={cfg.contact?.whatsapp || ''} onChange={(v) => setCfg({ ...cfg, contact: { ...cfg.contact, whatsapp: v } })} />
          <Input label="البريد الإلكتروني" value={cfg.contact?.email || ''} onChange={(v) => setCfg({ ...cfg, contact: { ...cfg.contact, email: v } })} />
          <Input label="إنستغرام" value={cfg.social?.instagram || ''} onChange={(v) => setCfg({ ...cfg, social: { ...cfg.social, instagram: v } })} />
        </div>
        <div className="mt-6 flex justify-end">
          <ActionButton onClick={handleSaveConfig}>حفظ الإعدادات وتحديث الموقع</ActionButton>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-or font-bold mb-4 flex items-center gap-2">🐙 إعدادات GitHub</h3>
        <Input
          label="GitHub Personal Access Token"
          value={githubToken}
          onChange={(v) => setGithubToken(v)}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          type="password"
        />
        <p className="text-creme/50 text-xs mt-2">
          هذا التوكن ضروري لرفع الصور وتحديث البيانات. سيتم حفظه بشكل آمن.
          <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token" target="_blank" rel="noopener noreferrer" className="text-or hover:underline">
            كيف أحصل على توكن؟
          </a>
        </p>
        <div className="mt-6 flex justify-end">
          <ActionButton onClick={handleSaveConfig}>حفظ إعدادات GitHub</ActionButton>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [auth, setAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const [toast, setToast] = useState({ show: false, message: '', isError: false });
  const [lastSync, setLastSync] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 4000);
  };

  const handleSync = async () => {
    try {
      await syncAllToGitHub();
      setLastSync(Date.now());
    } catch (err) {
      showToast('فشل النشر التلقائي: ' + err.message, true);
    }
  };

  const handlePull = async () => {
    try {
      await pullFromGitHub();
      showToast('تم تحميل أحدث البيانات من الموقع');
      window.location.reload();
    } catch (err) {
      showToast('فشل التحميل: ' + err.message, true);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        setAuth(true);
        try {
          await initializeTokenFromData();
        } catch { /* ignore */ }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return null;
  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />;

  return (
    <div className="min-h-screen bg-noir text-creme pb-20">
      <header className="sticky top-0 z-40 bg-noir/80 backdrop-blur-md border-b border-or/10 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl text-gold font-bold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>M</div>
            <div>
              <h1 className="text-lg font-bold text-creme leading-none">لوحة التحكم</h1>
              <p className="text-[10px] text-or/60 uppercase tracking-widest mt-1">Mustapha Immobilier</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SyncStatus onSync={handleSync} onPull={handlePull} lastSync={lastSync} />
            <button onClick={() => { logout(); setAuth(false); }} className="text-creme/40 hover:text-red-400 text-sm transition-colors">خروج</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        <aside className="space-y-2">
          <TabButton active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} icon="🏠" label="العقارات" />
          <TabButton active={activeTab === 'lotissements'} onClick={() => setActiveTab('lotissements')} icon="🏗" label="التجزئات" />
          <TabButton active={activeTab === 'manatiq'} onClick={() => setActiveTab('manatiq')} icon="📍" label="المناطق" />
          <TabButton active={activeTab === 'videos'} onClick={() => setActiveTab('videos')} icon="🎬" label="الفيديوهات" />
          <div className="my-4 border-t border-or/10 pt-4" />
          <TabButton active={activeTab === 'config'} onClick={() => setActiveTab('config')} icon="⚙" label="الإعدادات" />
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-creme/40 hover:text-or transition-colors text-sm mt-4">
            <span>🌐 عرض الموقع</span>
          </Link>
        </aside>

        <section className="min-h-[60vh]">
          {activeTab === 'properties' && <PropertiesManager showToast={showToast} onSync={handleSync} />}
          {activeTab === 'lotissements' && <SlugsManager type="lotissements" showToast={showToast} onSync={handleSync} />}
          {activeTab === 'manatiq' && <SlugsManager type="manatiq" showToast={showToast} onSync={handleSync} />}
          {activeTab === 'videos' && <VideosManager showToast={showToast} onSync={handleSync} />}
          {activeTab === 'config' && <ConfigManager showToast={showToast} onSync={handleSync} />}
        </section>
      </main>

      <Toast {...toast} />
    </div>
  );
}
