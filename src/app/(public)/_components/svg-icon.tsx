export default function SvgIcon({ d }: { d: string }) {
  return (
    <svg
      className="mx-auto h-12 w-12 text-navy dark:text-accent"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
