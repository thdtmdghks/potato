export function ReviewWriteSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50/50 px-4 py-12 dark:bg-black">
      <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="bg-gray-light h-7 w-48 animate-pulse rounded dark:bg-gray-800" />
        <div className="bg-gray-light h-4 w-full animate-pulse rounded dark:bg-gray-800" />
        <div className="bg-gray-light h-32 w-full animate-pulse rounded-xl dark:bg-gray-800" />
        <div className="bg-gray-light h-10 w-full animate-pulse rounded-lg dark:bg-gray-800" />
      </div>
    </main>
  );
}
