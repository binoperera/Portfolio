export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-24">
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-40 bg-line" />
        <div className="h-14 w-3/4 bg-line" />
        <div className="h-6 w-1/2 bg-line" />
        <div className="h-24 w-full max-w-2xl bg-line mt-8" />
      </div>
    </main>
  );
}