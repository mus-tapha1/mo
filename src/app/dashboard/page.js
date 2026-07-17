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
  isAuthenticated, login, logout,
  syncAllToGitHub, pullFromGitHub,
  initializeTokenFromData, saveTokenToData,
} from '@/lib/store';
import { checkActionsStatus, saveSyncSettings, getSyncSettings } from '@/lib/github-sync';
import { propertyTypes } from '@/data/properties';
import ImageUploader from '@/components/ImageUploader';

// ============================================================
//  مكوّنات واجهة قابلة لإعادة الاستخدام
// ============================================================
function TabButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-right ${active ? 'bg-or/15 text-or border border-or/30' : 'text-creme/60 hover:bg-or/5 hover:text-creme border border-transparent'}`}>
      <span className="text-xl">{icon}</span>
      <span className="flex-1 font-medium">{label}</span>
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

function Toast({ message, show, isError = false }) {
  if (!show) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-lg shadow-2xl font-bold animate-fade-up ${isError ? 'bg-red-600 text-white' : 'bg-or text-noir'}`}>
      {isError ? '⚠' : '✓'} {message}
    </div>
  );
}

// ============================================================
//  شاشة الدخول
// ============================================================
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) onLogin(); else { setError(true); setPassword(''); }
  };
  return (
    <div className="min-h-screen bg-noir flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gold mb-6">لوحة التحكم</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-noir-100 border border-or/20 rounded-lg px-4 py-3 text-creme" placeholder="كلمة المرور" />
          {error && <p className="text-red-400 text-sm">كلمة المرور غير صحيحة</p>}
          <button type="submit" className="btn-gold w-full py-3">دخول</button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
//  إدارة الإعدادات
// ============================================================
function ConfigManager({ showToast, onSync }) {
  const [cfg, setCfg] = useState(null);
  const [githubToken, setGithubToken] = useState('');

  useEffect(() => {
    const currentCfg = getConfig();
    setCfg(currentCfg || {});
    const settings = getSyncSettings();
    if (settings && settings.token) setGithubToken(settings.token);
  }, []);

  if (!cfg) return <p className="text-creme/40">جارٍ التحميل...</p>;

  const handleSave = async () => {
    saveConfig(cfg);
    saveSyncSettings(githubToken);
    await saveTokenToData(githubToken);
    showToast('تم حفظ الإعدادات بنجاح');
    onSync();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gold">الإعدادات</h2>
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-or font-bold">🐙 إعدادات GitHub</h3>
        <Input label="GitHub Token" value={githubToken} onChange={setGithubToken} type="password" />
      </div>
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-or font-bold">📱 معلومات التواصل</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="الهاتف" value={cfg.contact?.phone} onChange={(v) => setCfg({...cfg, contact: {...cfg.contact, phone: v}})} />
          <Input label="واتساب" value={cfg.contact?.whatsapp} onChange={(v) => setCfg({...cfg, contact: {...cfg.contact, whatsapp: v}})} />
        </div>
      </div>
      <div className="flex justify-end">
        <ActionButton onClick={handleSave}>حفظ الكل ونشر التعديلات</ActionButton>
      </div>
    </div>
  );
}

// ============================================================
//  الصفحة الرئيسية للوحة التحكم
// ============================================================
export default function DashboardPage() {
  const [auth, setAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const [toast, setToast] = useState({ show: false, message: '', isError: false });
  const [loading, setLoading] = useState(true);

  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 4000);
  };

  const handleSync = async () => {
    try { await syncAllToGitHub(); } catch (err) { showToast('خطأ في المزامنة: ' + err.message, true); }
  };

  useEffect(() => {
    if (isAuthenticated()) setAuth(true);
    setLoading(false);
  }, []);

  if (loading) return null;
  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />;

  return (
    <div className="min-h-screen bg-noir text-creme">
      <header className="border-b border-or/10 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gold">Mustapha Immobilier CMS</h1>
        <div className="flex gap-4">
          <button onClick={handleSync} className="text-sm text-or underline">نشر الآن</button>
          <button onClick={() => { logout(); setAuth(false); }} className="text-sm text-creme/40">خروج</button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        <aside className="space-y-2">
          <TabButton active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} icon="🏠" label="العقارات" />
          <TabButton active={activeTab === 'config'} onClick={() => setActiveTab('config')} icon="⚙" label="الإعدادات" />
        </aside>
        <section>
          {activeTab === 'properties' && <div className="text-creme/40">قسم العقارات جاهز للإدارة.</div>}
          {activeTab === 'config' && <ConfigManager showToast={showToast} onSync={handleSync} />}
        </section>
      </main>
      <Toast {...toast} />
    </div>
  );
}
