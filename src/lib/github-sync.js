// ============================================================
//  نظام المزامنة مع GitHub API — MUSTAPHA IMMOBILIER
//  - رفع الصور إلى public/uploads/ في المستودع
//  - تحديث ملف البيانات المركزي site-data/data.json
// ============================================================

const DATA_FILE_PATH = 'site-data/data.json';
const UPLOADS_DIR = 'public/uploads';

// إعدادات المستودع الثابتة
const REPO_OWNER = 'mus-tapha1';
const REPO_NAME = 'mo';

// ---- الحصول على التوكن ----
const TOKEN_STORAGE_KEY = 'mus_github_token';


// متغير عام لتخزين التوكن المحمل من data.json
let cachedTokenFromData = null;

function getToken() {
  // 1. من localStorage (الأولوية — يدوياً ولا يُضمَّن في البناء)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (stored && stored.trim()) return stored.trim();
    } catch { /* تجاهل */ }
  }
  // 2. من التخزين المؤقت (محمل من data.json)
  if (cachedTokenFromData) return cachedTokenFromData;
  // 3. التوكن الآمن (المشفر) أو متغير البيئة
  return process.env.NEXT_PUBLIC_GITHUB_TOKEN || '';
}

// دالة لتحديث التوكن المخزن مؤقتاً من data.json
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
    // تحديث التخزين المؤقت أيضاً
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

// ---- استخراج معلومات التوكن ----
export function detectRepoFromToken(token) {
  return fetch('https://api.github.com/user', {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  })
    .then((r) => {
      if (!r.ok) throw new Error('رمز الوصول غير صالح');
      return r.json();
    })
    .then((data) => ({ login: data.login }));
}

// ---- الحصول على SHA ملف موجود (لازم للتحديث) ----
async function getFileSha(token, owner, repo, path, branch = 'main') {
    // كسر كاش المتصفح لضمان الحصول على SHA الأحدث دائماً
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}&_t=${Date.now()}`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Cache-Control': 'no-cache, no-store',
      },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`فشل الحصول على معلومات الملف: ${res.status}`);
    const data = await res.json();
    return data.sha;
    }

// ---- رفع/تحديث ملف في المستودع ----
async function uploadFileToRepo(token, owner, repo, path, content, message, branch = 'main') {
  const sha = await getFileSha(token, owner, repo, path, branch);
  const body = {
    message,
    content, // base64
    branch,
  };
  if (sha) body.sha = sha;

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `فشل الرفع: ${res.status}`);
  }
  return res.json();
}

// ---- تحويل ملف إلى base64 (للرفع) ----
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result.split(',')[1];
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---- توليد اسم فريد للصورة ----
function generateImageName(file) {
  const ext = file.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 6);
  return `img-${ts}-${rand}.${ext}`;
}

// ============================================================
//  رفع صورة واحدة إلى المستودع
// ============================================================
export async function uploadImage(file, onProgress) {
  const { token, owner, repo } = getSyncSettings();
  if (!token) {
    throw new Error('لم يتم إعداد GitHub.');
  }

  if (onProgress) onProgress('جاري تحضير الصورة...');

  const base64 = await fileToBase64(file);
  const fileName = generateImageName(file);
  const filePath = `${UPLOADS_DIR}/${fileName}`;

  if (onProgress) onProgress('جاري رفع الصورة إلى المستودع...');

  await uploadFileToRepo(
    token, owner, repo, filePath, base64,
    `chore: رفع صورة ${fileName}`
  );

  const relativeUrl = `/${filePath}`;
  return relativeUrl;
}

// ============================================================
//  رفع عدة صور (للمعرض)
// ============================================================
export async function uploadImages(files, onProgress) {
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    if (onProgress) onProgress(`رفع الصورة ${i + 1} من ${files.length}...`);
    const url = await uploadImage(files[i]);
    urls.push(url);
  }
  return urls;
}

// ============================================================
//  تحديث ملف البيانات المركزي (data.json)
// ============================================================
export async function syncDataToRepo(data, onProgress) {
  const { token, owner, repo } = getSyncSettings();
  if (!token) {
    throw new Error('لم يتم إعداد GitHub.');
  }

  if (onProgress) onProgress('جاري تحديث ملف البيانات...');

  const fullData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const jsonStr = JSON.stringify(fullData, null, 2);
  const base64 = btoa(unescape(encodeURIComponent(jsonStr)));

  const result = await uploadFileToRepo(
    token, owner, repo, DATA_FILE_PATH, base64,
    `data: تحديث البيانات المركزية (${new Date().toLocaleString('ar-MA')})`
  );

  return result;
}

// ============================================================
//  قراءة البيانات المركزية من المستودع
// ============================================================
export async function fetchDataFromRepo() {
  const { owner, repo } = getSyncSettings();
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${DATA_FILE_PATH}`;
  const res = await fetch(rawUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`فشل تحميل البيانات: ${res.status}`);
  return res.json();
}

// ============================================================
//  التحقق من حالة الـ Actions بعد التحديث
// ============================================================
export async function checkActionsStatus() {
  const { token, owner, repo } = getSyncSettings();
  if (!token) return null;
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.workflow_runs?.[0] || null;
}

export default {
  getSyncSettings,
  saveSyncSettings,
  clearSyncSettings,
  isSyncConfigured,
  detectRepoFromToken,
  uploadImage,
  uploadImages,
  syncDataToRepo,
  fetchDataFromRepo,
  checkActionsStatus,
};
