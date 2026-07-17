'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export default function TermsPage() {
  const [openSection, setOpenSection] = useState(0);

  const sections = [
    {
      title: '1. قبول الشروط',
      content:
        'باستخدامك لموقع MUSTAPHA IMMOBILIER فإنك توافق على الالتزام بهذه الشروط والأحكام كاملةً. إن لم تكن موافقاً على أي بند منها، يرجى التوقف عن استخدام الموقع فوراً. يُعدّ تصفّحك للموقع أو تقديمك لأي معلومات عبره قبولاً صريحاً بهذه الشروط.',
    },
    {
      title: '2. طبيعة الخدمة',
      content:
        'يقدّم MUSTAPHA IMMOBILIER منصةً لعرض العقارات والتجزئات والمناطق العقارية في القنيطرة والمغرب. نعمل كوسيط بين البائعين والمشترين، ولا نضمن صحة كل المعلومات المعروضة إذ تعتمد على ما يقدّمه أصحاب العقارات. تُمثّل «قراءة مصطفى» تحليلاً استراتيجياً لكل عقار وهي رأيٌ توجيهي وليست ضماناً قانونياً أو تقنياً.',
    },
    {
      title: '3. مسؤولية المستخدم',
      content:
        'يتعهّد المستخدم بتقديم معلومات صحيحة ودقيقة عند تعبئة نماذج التواصل أو طلب بيع عقار. يُمنع استخدام الموقع لأغراض غير قانونية أو مضلّلة أو إعلانية غير مرخّص بها. أي إساءة استخدام قد تؤدي إلى حظر الحساب ومنع الوصول.',
    },
    {
      title: '4. الملكية الفكرية',
      content:
        'جميع العناصر المرئية والنصوص والشعار والتصاميم على هذا الموقع مملوكة لـ MUSTAPHA IMMOBILIER أو مرخّصة لها. لا يجوز نسخها أو إعادة استخدامها أو توزيعها دون إذن كتابي مسبق. الصور العقارية المعروضة قد تكون افتراضية أو توضيحية وقد لا تطابق الواقع تماماً.',
    },
    {
      title: '5. دقة المعلومات',
      content:
        'نبذل قصارى جهدنا لضمان دقة الأسعار والمساحات والمواصفات المعروضة، لكنها قد تتغير دون إشعار مسبق. يُوصى دائماً بالتواصل المباشر مع فريقنا للتأكد من التفاصيل النهائية قبل اتخاذ أي قرار شراء أو بيع.',
    },
    {
      title: '6. الروابط الخارجية',
      content:
        'قد يحتوي الموقع على روابط لمواقع خارجية (فيديوهات يوتيوب، شبكات التواصل الاجتماعي). لسنا مسؤولين عن محتوى تلك المواقع أو سياساتها، ووصولك إليها يتم على مسؤوليتك الخاصة.',
    },
    {
      title: '7. تحديد المسؤولية',
      content:
        'لا يتحمّل MUSTAPHA IMMOBILIER أي مسؤولية عن خسائر مباشرة أو غير مباشرة ناتجة عن استخدام الموقع أو الاعتماد على المعلومات المعروضة فيه. الخدمة مقدّمة «كما هي» دون ضمانات صريحة أو ضمنية.',
    },
    {
      title: '8. التعديلات على الشروط',
      content:
        'نحتفظ بحق تعديل هذه الشروط في أي وقت دون إشعار مسبق. استمرارك في استخدام الموقع بعد أي تعديل يُعدّ قبولاً للنسخة المحدّثة. ننصح بمراجعة هذه الصفحة دورياً.',
    },
    {
      title: '9. القانون المُطبَّق',
      content:
        'تخضع هذه الشروط للقوانين المعمول بها في المملكة المغربية. أي نزاع ينشأ عن استخدام الموقع يُحلّ أمام المحاكم المغربية المختصة.',
    },
    {
      title: '10. التواصل',
      content:
        'لأي استفسار بخصوص هذه الشروط، يمكنك التواصل معنا عبر صفحة «تواصل معنا» أو البريد الإلكتروني المُدرَج في الموقع.',
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
              <p className="text-or text-sm tracking-[0.3em] mb-4 font-light">LEGAL</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gold">شروط الاستخدام</h1>
              <div className="gold-divider mx-auto" />
              <p className="text-creme/60 mt-6 max-w-2xl mx-auto leading-relaxed">
                مرحباً بك في منصة MUSTAPHA IMMOBILIER. قبل استخدام خدماتنا، يرجى الاطلاع على شروط
                الاستخدام التالية بعناية. توضّح هذه الشروط الحقوق والواجبات المتبادلة بينك وبين منصتنا.
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
