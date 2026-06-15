"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * 브라우저 뒤로가기(popstate) 시 페이지가 뒤로 이동하지 않고
 * 띄워진 모달/라이트박스만 닫히도록 히스토리를 제어하는 범용 커스텀 훅입니다.
 *
 * @param stateKey 브라우저 history.state에 주입할 유니크 키 식별자
 */
export function useHistoryModal<T>(stateKey: string = "modalOpen") {
  const [isOpenValue, setIsOpenValue] = useState<T | null>(null);

  // 모달 열기: 브라우저 history에 가상 스택 추가
  const open = useCallback(
    (value: T) => {
      setIsOpenValue(value);
      window.history.pushState({ [stateKey]: true }, "");
    },
    [stateKey],
  );

  // 모달 닫기: 사용자가 수동으로 닫은 경우, 강제로 쌓았던 히스토리 롤백(back)
  const close = useCallback(() => {
    setIsOpenValue(null);
    if (window.history.state?.[stateKey]) {
      window.history.back();
    }
  }, [stateKey]);

  // 브라우저 뒤로가기(popstate) 감지 시 모달 상태만 안전하게 해제
  useEffect(() => {
    const handlePopState = () => {
      if (isOpenValue !== null) {
        setIsOpenValue(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpenValue]);

  return {
    isOpen: isOpenValue !== null,
    value: isOpenValue,
    open,
    close,
  };
}
