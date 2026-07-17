// ============================================================
//  نظام المزامنة النهائي والمستقر — MUSTAPHA IMMOBILIER
// ============================================================

const DATA_FILE_PATH = 'site-data/data.json';
const REPO_OWNER = 'mus-tapha1';
const REPO_NAME = 'mo';
const TOKEN_STORAGE_KEY = 'mus_github_token';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`;

function getToken() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored && stored.trim().startsWith('ghp_')) return stored.trim();
  }
  return '';
}

export function getSyncSettings() {
  return { token: getToken(), owner: REPO_OWNER, repo: REPO_NAME };
}

export function saveSyncSettings(token) {
  if (typeof window === 'undefined') return;
  if (token && token.trim()) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token.trim());
  }
}

async function getFileSha(token, path) {
  if (!token) return null;
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=main&_t=${Date.now()}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (res.status === 404) return null;
    const data = await res.json();
    return data.sha;
  } catch { return null; }
}

export async function syncDataToRepo(data) {
  const token = getToken();
  if (!token) throw new Error('يرجى إدخال التوكن في الإعدادات أولاً');

  const sha = await getFileSha(token, DATA_FILE_PATH);
  
  const body = {
    message: `Update data [CMS] ${new Date().toISOString()}`,
    content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
    branch: 'main',
  };
  if (sha) body.sha = sha;

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_FILE_PATH}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('فشل الحفظ في GitHub. تأكد من صحة التوكن.');
  return res.json();
}

export async function fetchDataFromRepo() {
  const url = `${RAW_BASE}/${DATA_FILE_PATH}?t=${Date.now()}`;
  try {
    const res = await fetch(url);
    return res.ok ? await res.json() : null;
  } catch { return null; }
}

// ============================================================
//  رفع الصورة إلى مجلد public/uploads/ في المستودع
//  يُرجع رابط raw.githubusercontent.com مباشرةً (يظهر فوراً بدون إعادة بناء)
// ============================================================
export async function uploadImage(file, onProgress) {
  const token = getToken();
  if (!token) throw new Error('يرجى إدخال GitHub Token في الإعدادات أولاً');

  // تحويل الملف إلى base64
  const base64Content = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // اسم ملف فريد
  const ext = file.name.split('.').pop().toLowerCase() || 'jpg';
  const rand = Math.random().toString(36).slice(2, 6);
  const ts = Date.now().toString(36);
  const fileName = `img-${ts}-${rand}.${ext}`;
  const filePath = `public/uploads/${fileName}`;

  if (onProgress) onProgress('جارٍ رفع الصورة إلى المستودع...');

  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `Upload image: ${fileName}`,
        content: base64Content,
        branch: 'main',
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'فشل رفع الصورة. تأكد من صلاحيات التوكن.');
  }

  if (onProgress) onProgress('تم الرفع بنجاح ✓');

  // الرابط المباشر عبر raw.githubusercontent.com — يعمل فوراً بدون إعادة بناء
  return `${RAW_BASE}/${filePath}`;
}
