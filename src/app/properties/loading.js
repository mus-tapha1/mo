export default function PropertiesLoading() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-8 w-48 bg-noir-100 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-32 bg-noir-100 rounded mx-auto animate-pulse" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden">
              <div className="h-56 bg-noir-100 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-3/4 bg-noir-100 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-noir-100 rounded animate-pulse" />
                <div className="h-6 w-1/3 bg-noir-100 rounded animate-pulse" />
                <div className="h-9 w-full bg-noir-100 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
