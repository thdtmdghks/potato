export function EditProjectSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-2 md:px-0">
      <div className="bg-gray-light h-5 w-32 animate-pulse rounded dark:bg-gray-800" />
      <div className="animate-pulse rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#121824]">
        <div className="bg-gray-light h-6 w-48 rounded dark:bg-gray-800" />
        <div className="bg-gray-light mt-4 h-40 w-full rounded-xl dark:bg-gray-800" />
        <div className="bg-gray-light mt-4 h-10 w-full rounded-lg dark:bg-gray-800" />
      </div>
    </div>
  );
}
