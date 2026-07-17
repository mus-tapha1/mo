'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getProperties, addProperty, updateProperty, deleteProperty,
  getConfig, saveConfig,
  getAdminPassword, setAdminPassword,
  isAuthenticated, login, logout,
  syncAllToGitHub, pullFromGitHub,
  initializeTokenFromData, saveTokenToData,
} from '@/lib/store';
import { saveSyncSettings, getSyncSettings } from '@/lib/github-sync';

export default function DashboardPage() {
  const [auth, setAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [items, setItems] = useState([]);
  const [cfg, setCfg] = useState(null);
  const [githubToken, setGithubToken] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      setAuth(true);
      setItems(getProperties());
      setCfg(getConfig());
      const settings = getSyncSettings();
      if (settings && settings.token) setGithubToken(settings.token);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(password)) {
      setAuth(true);
      setItems(getProperties());
      setCfg(getConfig());
      const settings = getSyncSettings();
      if (settings && settings.token) setGithubToken(settings.token);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleSync = async () => {
    try {
      await syncAllToGitHub();
      alert('تم تحديث الموقع بنجاح');
    } catch (err) {
      alert('خطأ: ' + err.message);
    }
  };

  const handleSaveConfig = async () => {
    saveConfig(cfg);
    saveSyncSettings(githubToken);
    await saveTokenToData(githubToken);
    alert('تم حفظ الإعدادات');
    handleSync();
  };

  if (loading) return null;

  if (!auth) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <form onSubmit={handleLogin} className="p-8 border border-yellow-600 rounded-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-yellow-500 text-center">دخول لوحة التحكم</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded mb-4" placeholder="كلمة المرور" />
          {error && <p className="text-red-500 mb-4">كلمة المرور خطأ</p>}
          <button className="w-full bg-yellow-600 p-3 rounded font-bold">دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4 border-b border-yellow-900/30 flex justify-between items-center">
        <h1 className="text-xl font-bold text-yellow-500">Mustapha Immobilier CMS</h1>
        <div className="flex gap-4">
          <button onClick={handleSync} className="text-yellow-500 underline">نشر التعديلات</button>
          <button onClick={() => { logout(); setAuth(false); }} className="text-gray-500">خروج</button>
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto p-8 flex gap-8">
        <aside className="w-48 space-y-4">
          <button onClick={() => setActiveTab('properties')} className={`w-full text-right p-2 rounded ${activeTab === 'properties' ? 'bg-yellow-900/20 text-yellow-500' : ''}`}>🏠 العقارات</button>
          <button onClick={() => setActiveTab('config')} className={`w-full text-right p-2 rounded ${activeTab === 'config' ? 'bg-yellow-900/20 text-yellow-500' : ''}`}>⚙ الإعدادات</button>
        </aside>

        <main className="flex-1">
          {activeTab === 'properties' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">إدارة العقارات</h2>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="p-4 border border-gray-800 rounded flex items-center gap-4">
                    <img src={item.image} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-bold">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.priceLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">الإعدادات</h2>
              <div className="p-6 border border-gray-800 rounded space-y-4">
                <label className="block text-sm text-gray-400">GitHub Token</label>
                <input type="password" value={githubToken} onChange={(e) => setGithubToken(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-700 rounded" />
                
                <label className="block text-sm text-gray-400 mt-4">اسم العلامة (عربي)</label>
                <input value={cfg?.brand?.nameAr || ''} onChange={(e) => setCfg({...cfg, brand: {...cfg.brand, nameAr: e.target.value}})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded" />
                
                <label className="block text-sm text-gray-400 mt-4">الهاتف</label>
                <input value={cfg?.contact?.phone || ''} onChange={(e) => setCfg({...cfg, contact: {...cfg.contact, phone: e.target.value}})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded" />
                
                <button onClick={handleSaveConfig} className="mt-6 bg-yellow-600 px-6 py-2 rounded font-bold">حفظ الإعدادات</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
