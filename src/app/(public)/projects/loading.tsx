export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="bg-gray-light h-8 w-32 animate-pulse rounded dark:bg-gray-800" />
      <div className="bg-gray-light mt-2 h-5 w-56 animate-pulse rounded dark:bg-gray-800" />
      <div className="mt-6 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-light h-9 w-20 animate-pulse rounded-full dark:bg-gray-800"
          />
        ))}
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i}>
            <div className="bg-gray-light aspect-[4/3] animate-pulse rounded-lg dark:bg-gray-800" />
            <div className="bg-gray-light mt-2 h-4 w-16 animate-pulse rounded dark:bg-gray-800" />
            <div className="bg-gray-light mt-1 h-4 w-24 animate-pulse rounded dark:bg-gray-800" />
          </li>
        ))}
      </ul>
    </div>
  );
}
