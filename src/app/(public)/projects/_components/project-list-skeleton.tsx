const SKELETON_COUNT = 6;

export function ProjectListSkeleton() {
  return (
    <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <li key={i}>
          <div className="bg-gray-light aspect-[4/3] animate-pulse rounded-lg dark:bg-gray-800" />
          <div className="bg-gray-light mt-2 h-4 w-16 animate-pulse rounded dark:bg-gray-800" />
          <div className="bg-gray-light mt-1 h-4 w-24 animate-pulse rounded dark:bg-gray-800" />
        </li>
      ))}
    </ul>
  );
}
