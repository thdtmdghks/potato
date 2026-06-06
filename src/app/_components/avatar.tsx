import Image from "next/image";

interface AvatarProps {
  src: string | null | undefined;
  size?: number;
  className?: string;
}

export function Avatar({ src, size = 32, className = "" }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="text-gray-400" style={{ fontSize: size * 0.4 }}>
        👤
      </span>
    </div>
  );
}
