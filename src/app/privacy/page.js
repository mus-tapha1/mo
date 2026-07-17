'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export default function PrivacyPage() {
  const [openSection, setOpenSection] = useState(0);

  const sections = [
    {
      title: '1. جمع البيانات',
      content:
        'نقوم في MUSTAPHA IMMOBILIER بجمع البيانات التي تقدّمها طوعاً عبر نماذج التواصل وطلب بيع العقار، وتشمل: الاسم، رقم الهاتف، البريد الإلكتروني (اختياري)، ونوع العقار والمعلومات المرتبطة به. كما نجمع بياناتٍ تقنية تلقائية مثل عنوان IP ونوع المتصفح وصفحات الموقع التي زرتها، بهدف تحسين تجربة الاستخدام.',
    },
    {
      title: '2. استخدام البيانات',
      content:
        'نستخدم بياناتك لأغراض محدّدة فقط: التواصل معك بخصوص طلبك أو استفسارك، إعلامك بالعقارات الجديدة التي قد تهمّك، تحسين خدماتنا ومحتوى الموقع، والامتثال للالتزامات القانونية. لن نبيع بياناتك أو نشاركها مع أطراف ثالثة لأغراض تسويقية دون موافقتك الصريحة.',
    },
    {
      title: '3. ملفات تعريف الارتباط (Cookies)',
      content:
        'يستخدم موقعنا تقنيات تخزين محلية (localStorage) لحفظ تفضيلاتك وبيانات لوحة التحكم داخل متصفحك فقط. لا نستخدم ملفات تعريف ارتباط تتبّعية لأطراف خارجية. يمكنك في أي وقت مسح البيانات المخزّنة من خلال إعدادات متصفحك.',
    },
    {
      title: '4. حماية البيانات',
      content:
        'نتّخذ إجراءات تقنية وتنظيمية لحماية بياناتك من الوصول غير المصرّح به أو التعديل أو الإفصاح. تشمل هذه الإجراءات تشفير الاتصال (SSL/HTTPS) وتقييد الوصول الداخلي للبيانات. ومع ذلك، لا يمكن ضمان أمانٍ مطلق لأي نظام إلكتروني.',
    },
    {
      title: '5. حقوقك',
      content:
        'لديك الحق في: الوصول إلى بياناتك الشخصية المخزّنة، طلب تصحيحها أو حذفها، الاعتراض على معالجتها لأغراض معيّنة، وسحب موافقتك في أي وقت. لممارسة هذه الحقوق، يرجى التواصل معنا عبر صفحة «تواصل معنا».',
    },
    {
      title: '6. بيانات القاصرين',
      content:
        'خدماتنا موجّهة للأشخاص البالغين (18 سنة فأكثر). لا نقوم عن قصد بجمع بيانات من القاصرين. إذا اكتشفت أن طفلاً قدّم لنا بياناته، يرجى التواصل معنا فوراً لحذفها.',
    },
    {
      title: '7. الروابط لمواقع أخرى',
      content:
        'قد يحتوي موقعنا على روابط لمواقع خارجية (يوتيوب، فيسبوك، إنستغرام). هذه المواقع لها سياسات خصوصية خاصة بها لا نتحكم فيها. ننصح بمراجعة سياسات تلك المواقع قبل استخدامها.',
    },
    {
      title: '8. الاحتفاظ بالبيانات',
      content:
        'نحتفظ ببياناتك للمدة اللازمة لتقديم خدماتنا أو للامتثال للالتزامات القانونية. عند انتهاء الحاجة إليها، نقوم بحذفها أو إخفائها بشكل آمن. البيانات المُرسَلة عبر النماذج قد تُحفظ لمدة تصل إلى سنتين لأغراض المتابعة.',
    },
    {
      title: '9. التعديلات على السياسة',
      content:
        'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في ممارساتنا أو المتطلبات القانونية. سننشر النسخة المحدّثة على هذه الصفحة مع تاريخ آخر تحديث. ننصح بمراجعتها دورياً.',
    },
    {
      title: '10. التواصل بخصوص الخصوصية',
      content:
        'لأي استفسار يتعلق بسياسة الخصوصية أو بياناتك الشخصية، يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف المُدرَجين في صفحة «تواصل معنا». سنردّ على استفسارك في أقرب وقت ممكن.',
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-noir text-creme">
        {/* Hero */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <div className="relative max-w-4xl mx-auto text-center">
            <Reveal>
              <p className="text-or text-sm tracking-[0.3em] mb-4 font-light">PRIVACY</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gold">سياسة الخصوصية</h1>
              <div className="gold-divider mx-auto" />
              <p className="text-creme/60 mt-6 max-w-2xl mx-auto leading-relaxed">
                خصوصيتك تهمّنا. توضّح هذه السياسة كيف نجمع بياناتك ونستخدمها ونحميها عند زيارتك لموقع
                MUSTAPHA IMMOBILIER أو استخدامك لخدماتنا. نلتزم بأعلى معايير الشفافية في التعامل مع
                معلوماتك الشخصية.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Sections */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto space-y-3">
            {sections.map((sec, i) => (
              <Reveal key={i} delay={i * 50}>
                <div
                  className={`glass-card overflow-hidden transition-all duration-300 ${
                    openSection === i ? 'ring-1 ring-or/30' : ''
                  }`}
                >
                  <button
                    onClick={() => setOpenSection(openSection === i ? -1 : i)}
                    className="w-full text-right p-5 flex items-center justify-between hover:bg-or/5 transition-colors"
                  >
                    <span className="text-lg font-bold text-creme">{sec.title}</span>
                    <span
                      className={`text-or text-2xl transition-transform duration-300 ${
                        openSection === i ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSection === i ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <p className="p-5 pt-0 text-creme/70 leading-loose text-justify">{sec.content}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Last updated */}
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <p className="text-creme/40 text-sm">
              آخر تحديث: {new Date().toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
