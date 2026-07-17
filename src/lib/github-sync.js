// ============================================================
//  نظام المزامنة مع GitHub API — MUSTAPHA IMMOBILIER
// ============================================================

const DATA_FILE_PATH = 'site-data/data.json';
const UPLOADS_DIR = 'public/uploads';
const REPO_OWNER = 'mus-tapha1';
const REPO_NAME = 'mo';
const TOKEN_STORAGE_KEY = 'mus_github_token';

let cachedTokenFromData = null;

function getToken() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (stored && stored.trim()) return stored.trim();
    } catch { /* ignore */ }
  }
  if (cachedTokenFromData) return cachedTokenFromData;
  return process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.SITE_GITHUB_TOKEN || '';
}

export function setCachedToken(token) {
  if (token && token.trim()) {
    cachedTokenFromData = token.trim();
  }
}

export function getSyncSettings() {
  return { token: getToken(), owner: REPO_OWNER, repo: REPO_NAME };
}

export function saveSyncSettings(token) {
  if (typeof window === 'undefined') return;
  if (token && token.trim()) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token.trim());
    cachedTokenFromData = token.trim();
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    cachedTokenFromData = null;
  }
}

export function clearSyncSettings() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function isSyncConfigured() {
  return !!getToken();
}

async function getFileSha(token, owner, repo, path, branch = 'main') {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}&_t=${Date.now()}`;
    try {
      const res = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Cache-Control': 'no-cache, no-store',
          'User-Agent': 'Mustapha-Immobilier-CMS',
        },
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`فشل الحصول على معلومات الملف: ${res.status}`);
      const data = await res.json();
      return data.sha;
    } catch (err) {
      throw err;
    }
}

async function uploadFileToRepo(token, owner, repo, path, content, message, branch = 'main') {
  if (!token || !token.trim()) {
    throw new Error('التوكن غير صحيح. يرجى التحقق من إعدادات المزامنة.');
  }

  const sha = await getFileSha(token, owner, repo, path, branch);
  const body = {
    message,
    content, 
    branch,
  };
  if (sha) body.sha = sha;

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mustapha-Immobilier-CMS',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let errMsg = `فشل الرفع: ${res.status}`;
      try {
        const err = await res.json();
        if (err.message) errMsg = err.message;
      } catch { /* ignore */ }
      throw new Error(errMsg);
    }
    return res.json();
  } catch (err) {
    throw err;
  }
}

export async function syncDataToRepo(data) {
  const token = getToken();
  if (!token) throw new Error('المزامنة غير مفعلة. يرجى إدخال التوكن في الإعدادات.');
  
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
  return await uploadFileToRepo(token, REPO_OWNER, REPO_NAME, DATA_FILE_PATH, content, `Update data.json [CMS] ${new Date().toISOString()}`);
}

export async function fetchDataFromRepo() {
  const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${DATA_FILE_PATH}?v=${Date.now()}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function checkActionsStatus() {
  const token = getToken();
  if (!token) return null;
  
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs?per_page=1`;
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.workflow_runs[0] || null;
  } catch {
    return null;
  }
}
