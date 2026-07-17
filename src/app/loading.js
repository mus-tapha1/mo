export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-creme/60 text-sm tracking-widest" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          جارٍ التحميل...
        </p>
      </div>
    </div>
  );
}
