// ============================================================
//  سكريبت prebuild — يولّد ملف بيانات آمن للعميل من data.json
//  MUSTAPHA IMMOBILIER
//
//  يقرأ site-data/data.json وينشئ src/data/_generated.js
//  الذي يحتوي على البيانات كثوابت JS (بدون fs).
//  هذا يسمح لمكونات العميل باستيراد البيانات المركزية
//  بدون الحاجة إلى وحدة fs.
// ============================================================

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'site-data', 'data.json');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', '_generated.js');

function main() {
  let data;
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    data = JSON.parse(raw);
  } catch (e) {
    console.warn('[prebuild] تعذر قراءة site-data/data.json، سيتم استخدام الـ defaults:', e.message);
    // إنشاء ملف فارغ يشير إلى استخدام الـ defaults
    const emptyContent = `// تم إنشاؤه تلقائياً — لا توجد بيانات مركزية، استخدم الـ defaults
export const generatedData = null;
export default generatedData;
`;
    fs.writeFileSync(OUTPUT_FILE, emptyContent, 'utf-8');
    console.log('[prebuild] تم إنشاء _generated.js (فارغ — سيتم استخدام defaults)');
    return;
  }

  // إنشاء ملف JS يحتوي على البيانات كثابت
  const content = `// ============================================================
//  ملف مُولَّد تلقائياً بواسطة scripts/prebuild.js
//  لا تقم بتعديله يدوياً — سيتم الكتابة فوقه عند كل بناء.
//  يحتوي على البيانات المركزية من site-data/data.json
//  كثوابت JS آمنة للعميل (بدون وحدة fs).
// ============================================================

export const generatedData = ${JSON.stringify(data, null, 2)};

export default generatedData;
`;

  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  console.log('[prebuild] تم إنشاء src/data/_generated.js بنجاح');
  console.log(`[prebuild] العقارات: ${(data.properties || []).length}, التجزئات: ${(data.lotissements || []).length}, المناطق: ${(data.manatiq || []).length}, الفيديوهات: ${(data.videos || []).length}`);
}

main();
