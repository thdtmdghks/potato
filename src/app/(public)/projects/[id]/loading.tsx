export default function Loading() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="bg-gray-light h-8 w-48 animate-pulse rounded dark:bg-gray-800" />
      <div className="bg-gray-light mt-3 h-7 w-20 animate-pulse rounded-full dark:bg-gray-800" />
      <div className="bg-gray-light mt-4 h-16 w-full animate-pulse rounded dark:bg-gray-800" />
      <section className="mt-8">
        <ul className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i}>
              <div className="bg-gray-light aspect-[4/3] animate-pulse rounded-lg dark:bg-gray-800" />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
