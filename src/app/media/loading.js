export default function MediaLoading() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-8 w-40 bg-noir-100 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-64 bg-noir-100 rounded mx-auto animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-4">
              <div className="h-40 bg-noir-100 rounded-xl animate-pulse mb-4" />
              <div className="h-4 w-3/4 bg-noir-100 rounded animate-pulse mb-2" />
              <div className="h-3 w-full bg-noir-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
