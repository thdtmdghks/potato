"use client";

import { useState } from "react";
import Image from "next/image";

interface ReviewAvatarProps {
  name?: string | null;
  image?: string | null;
}

export function ReviewAvatar({ name, image }: ReviewAvatarProps) {
  const [avatarError, setAvatarError] = useState(false);
  const avatarUrl = !avatarError && image ? image : null;

  return (
    <div className="mb-6 flex items-center space-x-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt=""
          width={40}
          height={40}
          className="rounded-full bg-gray-200 object-cover"
          onError={() => setAvatarError(true)}
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-400 dark:bg-gray-700">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{name ?? "고객님"}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          후기 작성자로 매핑되는 카카오 프로필입니다.
        </p>
      </div>
    </div>
  );
}
