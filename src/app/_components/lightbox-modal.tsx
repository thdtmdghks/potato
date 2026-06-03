"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/app/_components/carousel";

interface LightboxModalProps {
  url?: string;
  urls?: string[];
  initialIndex?: number;
  onClose: () => void;
}

export function LightboxModal({ url, urls, initialIndex = 0, onClose }: LightboxModalProps) {
  const images = urls && urls.length > 0 ? urls : url ? [url] : [];
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [api, setApi] = useState<CarouselApi>();
  const onCloseRef = useRef(onClose);

  // 최신 onClose 함수 유지
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // 사용자의 모달 닫기 요청 처리 (뒤로가기 유도 또는 직접 닫기)
  const triggerClose = () => {
    if (window.location.hash === "#lightbox") {
      window.history.back(); // 뒤로가기를 하면 hashchange 이벤트가 트리거되면서 onClose가 호출됩니다.
    } else {
      onCloseRef.current();
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    api?.scrollPrev();
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    api?.scrollNext();
  };

  // API 바인딩 후 초기 스크롤 설정 및 변경 이벤트 감지
  useEffect(() => {
    if (!api) return;

    api.scrollTo(initialIndex, true);

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, initialIndex]);

  // ESC 키 및 좌우 방향키 지원, 스크롤 고정, 브라우저 뒤로가기 대응
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerClose();
      } else if (e.key === "ArrowLeft") {
        api?.scrollPrev();
      } else if (e.key === "ArrowRight") {
        api?.scrollNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // 브라우저 뒤로가기(Back Button) 클릭 시 모달만 닫히도록 해시 추가
    const hasAlreadyHash = window.location.hash === "#lightbox";
    if (!hasAlreadyHash) {
      window.location.hash = "lightbox";
    }

    const handleHashChange = () => {
      // 뒤로가기를 눌러 해시가 사라지면 모달을 닫음
      if (window.location.hash !== "#lightbox") {
        onCloseRef.current();
      }
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("hashchange", handleHashChange);
      document.body.style.overflow = "";
      // StrictMode 대응: 이펙트 클린업(unmount) 시점에는 history.back()을 호출하지 않습니다.
    };
  }, [api]);

  if (images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-all duration-200 select-none"
      onClick={triggerClose}
    >
      {/* 상단 컨트롤 영역 (인덱스 표시 및 닫기 버튼) */}
      <div className="absolute top-4 right-0 left-0 z-10 flex items-center justify-between px-6">
        {images.length > 1 ? (
          <span className="rounded-full bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-gray-300 backdrop-blur-md">
            {activeIndex + 1} / {images.length}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerClose();
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95"
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      {/* 메인 이미지 및 좌우 네비게이션 버튼 영역 */}
      <div
        className="relative flex h-full max-h-[80vh] w-full max-w-5xl items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 이전 버튼 */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 md:left-4"
            aria-label="이전 이미지"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        {/* 캐러셀 컨테이너 */}
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg"
        >
          <CarouselContent className="h-full">
            {images.map((imgUrl, idx) => (
              <CarouselItem key={idx} className="flex h-full items-center justify-center">
                <div className="relative flex h-full max-h-[80vh] w-full items-center justify-center overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={`시공 사진 크게 보기 (${idx + 1}/${images.length})`}
                    width={1200}
                    height={900}
                    className="max-h-[80vh] w-auto max-w-full object-contain select-none"
                    priority
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* 다음 버튼 */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 md:right-4"
            aria-label="다음 이미지"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
