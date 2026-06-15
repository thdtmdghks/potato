"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project } from "@/shared/types";
import { projectSchema, type ProjectFormData } from "@/shared/schemas";
import { useImageUpload } from "@/client/use-image-upload";
import { createProject, updateProject, generateAiDescription } from "../_actions";
import { FORM_KEYS } from "../_constants";
import { fileToBase64 } from "../_utils";
import { compressImageForAi } from "@/client/image";
import { REGION_CONFIG, PROJECT_CONFIG, BUSINESS } from "@/shared/constants";
import { ROUTES } from "@/shared/routes";

// 단계별 서브 컴포넌트 임포트
import { StepImages } from "./form-steps/step-images";
import { StepLocation } from "./form-steps/step-location";
import { StepBuildingCategory } from "./form-steps/step-building-category";
import { StepDetails } from "./form-steps/step-details";
import { StepReview } from "./form-steps/step-review";
import { FormProgress } from "./form-steps/form-progress";
import { LoadingOverlay } from "@/app/_components/loading-overlay";

interface Props {
  project?: Project;
}

export function ProjectForm({ project }: Props) {
  const isEdit = !!project;
  const router = useRouter();

  // Wizard Flow Step 관리 (1 ~ 5)
  const [step, setStep] = useState(1);

  // step 상태 변화 감지하여 history pushState 기록 및 스크롤 최상단 이동
  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentHistoryState = window.history.state;
    const currentHistoryStep = currentHistoryState?.step;

    if (step > 1 && currentHistoryStep !== step) {
      window.history.pushState({ step }, "");
    }

    // 단계가 이동하면 스크롤을 맨 위로 올려 상단 경고/안내 배너와 새 입력 폼이 즉각 인지되도록 함
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      categories: project?.categories ?? [],
      region: project?.region ?? null,
      building_type: project?.building_type ?? null,
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { isSubmitting },
  } = form;

  const [serverError, setServerError] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // AI 생성 중 및 현재 단계를 popstate에서 동기 리슨하기 위한 Ref
  const isGeneratingAiRef = useRef(isGeneratingAi);
  const stepRef = useRef(step);

  useEffect(() => {
    isGeneratingAiRef.current = isGeneratingAi;
    stepRef.current = step;
  }, [isGeneratingAi, step]);

  // 브라우저 뒤로가기(popstate) 연동을 통한 단계 이동 UX 최적화
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = (e: PopStateEvent) => {
      // AI 생성 중에는 뒤로가기를 차단하고 현재 히스토리 상태를 강제 유지
      if (isGeneratingAiRef.current) {
        window.history.pushState({ step: stepRef.current }, "");
        return;
      }

      if (e.state && typeof e.state.step === "number") {
        setStep(e.state.step);
      } else {
        setStep(1);
      }
    };

    // AI 생성 중에 페이지 새로고침/탭 닫기 방지 경고 팝업 추가
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isGeneratingAiRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // 시공 지역 시/구 & 동/리 상태 관리 (동네 추천 퀵 칩 등을 5단계 미리보기에 반영하기 위함)
  const initialRegion = project?.region ?? "";
  const initialCity = initialRegion
    ? initialRegion.startsWith(REGION_CONFIG.CITIES[1]) // 대구
      ? REGION_CONFIG.CITIES[1]
      : initialRegion.startsWith(REGION_CONFIG.CITIES[0]) // 경산
        ? REGION_CONFIG.CITIES[0]
        : "기타"
    : REGION_CONFIG.DEFAULT_CITY;

  const initialTown = initialRegion
    ? initialCity === "기타"
      ? initialRegion
      : initialRegion.replace(REGION_CONFIG.CLEAN_REGEXP, "")
    : "";

  const [city, setCity] = useState(initialCity);
  const [town, setTown] = useState(initialTown);

  // 기존 설명 파싱하여 자동 생성 여부 및 특이사항 초기값 설정
  const parsed = useMemo(() => {
    if (!project) return { isAuto: true, details: "" };

    const desc = project.description.trim();
    const lines = desc
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const prefix =
      `${project.region || ""} ${project.building_type || ""}에 ${project.categories.join(", ")} 시공.`.trim();

    // 신 버전 포맷 (- BUSINESS.name) 매칭 시도
    if (
      lines.length >= 2 &&
      lines[0] === prefix &&
      lines[lines.length - 1] === `- ${BUSINESS.name}`
    ) {
      if (lines.length === 3) {
        let cleanDetails = lines[1];
        if (cleanDetails.endsWith(".")) {
          cleanDetails = cleanDetails.substring(0, cleanDetails.length - 1).trim();
        }
        return { isAuto: true, details: cleanDetails };
      } else if (lines.length === 2) {
        return { isAuto: true, details: "" };
      }
    }

    // 과도기 줄바꿈 포맷 (BUSINESS.name 시공.) 매칭 시도
    if (
      lines.length >= 2 &&
      lines[0] === prefix &&
      lines[lines.length - 1] === `${BUSINESS.name} 시공.`
    ) {
      if (lines.length === 3) {
        let cleanDetails = lines[1];
        if (cleanDetails.endsWith(".")) {
          cleanDetails = cleanDetails.substring(0, cleanDetails.length - 1).trim();
        }
        return { isAuto: true, details: cleanDetails };
      } else if (lines.length === 2) {
        return { isAuto: true, details: "" };
      }
    }

    // 구 버전 (한 줄 포맷) 호환성 유지
    const singleLinePrefix =
      `${project.region || ""} ${project.building_type || ""}에 ${project.categories.join(", ")} 시공.`.trim();
    const singleLineSuffix = ` ${BUSINESS.name} 시공.`;
    if (desc.startsWith(singleLinePrefix) && desc.endsWith(singleLineSuffix)) {
      const extracted = desc
        .substring(singleLinePrefix.length, desc.length - singleLineSuffix.length)
        .trim();
      let cleanDetails = extracted;
      if (cleanDetails.startsWith(".")) {
        cleanDetails = cleanDetails.substring(1).trim();
      }
      if (cleanDetails.endsWith(".")) {
        cleanDetails = cleanDetails.substring(0, cleanDetails.length - 1).trim();
      }
      return { isAuto: true, details: cleanDetails };
    }

    return { isAuto: false, details: "" };
  }, [project]);

  const [isAutoDescription, setIsAutoDescription] = useState(parsed.isAuto);
  const [details, setDetails] = useState(parsed.details);

  const watchedBuildingType = watch("building_type") || "";
  const watchedCategories = watch("categories") || [];

  // 자동 생성 설명 계산 (각 라인별 줄바꿈 적용 및 - BUSINESS.name 서명 적용)
  const autoGeneratedDescription = useMemo(() => {
    const fullRegion = city === "기타" ? town.trim() : `${city} ${town}`.trim();
    const lines = [];

    // 1라인: 지역, 건물유형, 시공 품목
    if (fullRegion || watchedBuildingType || (watchedCategories && watchedCategories.length > 0)) {
      const target = `${fullRegion} ${watchedBuildingType}`.trim();
      const categoriesArray = watchedCategories || [];
      const cats = categoriesArray.join(", ");
      if (target && cats) {
        lines.push(`${target}에 ${cats} 시공.`);
      } else if (target) {
        lines.push(`${target} 시공.`);
      } else if (cats) {
        lines.push(`${cats} 시공.`);
      }
    }

    // 2라인: 특이사항
    if (details.trim()) {
      lines.push(`${details.trim()}.`);
    }

    // 3라인: 서명 문구
    lines.push(`- ${BUSINESS.name}`);

    return lines.join("\n");
  }, [city, town, watchedBuildingType, watchedCategories, details]);

  // 자동 생성 모드일 때 설명 폼 필드 갱신
  useEffect(() => {
    if (isAutoDescription) {
      setValue("description", autoGeneratedDescription);
    }
  }, [isAutoDescription, autoGeneratedDescription, setValue]);

  const {
    existingImages,
    compressedFiles,
    previews,
    compressing,
    handleFiles,
    removeExisting,
    removeNew,
  } = useImageUpload({
    initialImages: project?.images ?? [],
    maxCount: PROJECT_CONFIG.MAX_IMAGES,
    onError: (msg) => setServerError(msg),
  });

  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(
    project?.primary_image ?? project?.images[0] ?? null,
  );

  const primaryImageUrl = useMemo(() => {
    const allImages = [...existingImages, ...previews];
    if (allImages.length === 0) return null;
    if (selectedPrimary && allImages.includes(selectedPrimary)) return selectedPrimary;
    return allImages[0];
  }, [existingImages, previews, selectedPrimary]);

  // 이미지 총 개수
  const totalImageCount = existingImages.length + previews.length;

  const handleGenerateAi = async (currentDetails: string, feedback?: string) => {
    setIsGeneratingAi(true);
    setServerError("");
    setWarningMessage("");
    setDetails(currentDetails);
    try {
      const imagesToSend: string[] = [];
      let isImageSkipped = false;
      const meta: Record<string, unknown> = {
        primaryImageUrl,
        isExistingImage: false,
        originalSizeKB: 0,
        compressedSizeKB: 0,
        compressionRatioPercent: 0,
        errorMsg: "",
      };

      if (primaryImageUrl) {
        if (existingImages.includes(primaryImageUrl)) {
          meta.isExistingImage = true;
          try {
            // 기존 고해상도 이미지를 fetch하여 신규 이미지와 동일하게 40KB 이하로 압축 전송
            const response = await fetch(primaryImageUrl);
            if (response.ok) {
              const blob = await response.blob();
              meta.originalSizeKB = Math.round(blob.size / 1024);
              const file = new File([blob], "existing-primary.webp", { type: blob.type });
              const aiCompressed = await compressImageForAi(file);
              meta.compressedSizeKB = Math.round(aiCompressed.size / 1024);
              meta.compressionRatioPercent = Math.round(
                ((blob.size - aiCompressed.size) / blob.size) * 100,
              );
              const base64 = await fileToBase64(aiCompressed);
              imagesToSend.push(base64);
            } else {
              isImageSkipped = true;
              meta.errorMsg = `Fetch response not OK (Status: ${response.status})`;
            }
          } catch (e) {
            console.error("Failed to fetch and compress existing primary image for AI", e);
            // fetch 실패나 CORS 방해 등이 발생할 경우, 이미지 없이 텍스트 기반으로만 분석이 안전하게 진행되도록 예외 처리
            isImageSkipped = true;
            meta.errorMsg = e instanceof Error ? e.message : String(e);
          }
        } else {
          const previewIdx = previews.indexOf(primaryImageUrl);
          if (previewIdx !== -1 && compressedFiles[previewIdx]) {
            const originalFile = compressedFiles[previewIdx];
            meta.originalSizeKB = Math.round(originalFile.size / 1024);
            const aiCompressed = await compressImageForAi(originalFile);
            meta.compressedSizeKB = Math.round(aiCompressed.size / 1024);
            meta.compressionRatioPercent = Math.round(
              ((originalFile.size - aiCompressed.size) / originalFile.size) * 100,
            );
            const base64 = await fileToBase64(aiCompressed);
            imagesToSend.push(base64);
          }
        }
      }

      const finalDetailsForAi = feedback
        ? `${currentDetails} (추가 수정요구사항: ${feedback})`
        : currentDetails;

      const result = await generateAiDescription({
        region: city && town ? (city === "기타" ? town.trim() : `${city} ${town}`.trim()) : city,
        buildingType: watchedBuildingType,
        categories: watchedCategories || [],
        details: finalDetailsForAi,
        images: imagesToSend,
        metadata: meta,
      });

      if (result.success) {
        let warningText = "";
        if (isImageSkipped || result.isImageSkipped) {
          warningText =
            "대표 사진 용량이 너무 크거나 다운로드에 문제(네트워크/CORS 보안 제한)가 생겨 사진을 제외하고 시공 텍스트 정보를 기반으로 AI 완성을 완료했습니다.";
        }

        if (result.isFallback) {
          const proceed = confirm(
            "AI 분석 서버에 일시적인 장애(과부하)가 발생했습니다.\n\n입력하신 정보 기반의 기본 조립 텍스트로 대체하여 진행하시겠습니까?\n('취소'를 누르시면 현재 단계에 머무르며 잠시 후 다시 시도하실 수 있습니다.)",
          );
          if (!proceed) {
            setServerError("AI 서비스가 일시적으로 원활하지 않습니다. 잠시 후 다시 시도해 주세요.");
            return;
          }
          warningText =
            "AI 분석 서버의 일시적인 장애로 인해 기본 팩트 기반 조립 문구로 대체되었습니다.";
        }

        if (warningText) {
          setWarningMessage(warningText);
        }

        setIsAutoDescription(false); // AI추천을 받고 나면 인라인 편집할 수 있도록 전환

        setValue("description", result.description);
        if (result.suggestedTitle) {
          setValue("title", result.suggestedTitle);
        }
        // AI 생성에 성공하면 자동으로 검토 및 완료 단계(Step 5)로 보냅니다.
        setStep(5);
      } else {
        setServerError("AI 설명 생성에 실패했습니다.");
      }
    } catch {
      setServerError("AI 서비스 호출 중 오류가 발생했습니다.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    setServerError("");
    const fd = new FormData();
    fd.set(FORM_KEYS.title, data.title);
    fd.set(FORM_KEYS.description, data.description);

    for (const cat of data.categories) {
      fd.append(FORM_KEYS.categories, cat);
    }
    if (data.region) {
      fd.set(FORM_KEYS.region, data.region);
    }
    if (data.building_type) {
      fd.set(FORM_KEYS.buildingType, data.building_type);
    }

    for (const file of compressedFiles) {
      fd.append(FORM_KEYS.images, file);
    }
    for (const url of existingImages) {
      fd.append(FORM_KEYS.existingImages, url);
    }

    if (primaryImageUrl) {
      if (existingImages.includes(primaryImageUrl)) {
        fd.set(FORM_KEYS.primaryImage, primaryImageUrl);
      } else {
        const idx = previews.indexOf(primaryImageUrl);
        if (idx !== -1) {
          fd.set(FORM_KEYS.primaryImageIndex, String(idx));
        }
      }
    }

    const result = isEdit ? await updateProject(project.id, fd) : await createProject(fd);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    router.push(ROUTES.admin.projects);
  };

  // Wizard Steps 설정
  const steps = [
    { id: 1, label: "사진" },
    { id: 2, label: "위치" },
    { id: 3, label: "건물/품목" },
    { id: 4, label: "자재스펙" },
    { id: 5, label: "AI 완성" },
  ];

  // 각 단계별 유효성 검사 및 다음 단계 이동 헬퍼
  const handleNextStep = async () => {
    if (step === 1) {
      if (totalImageCount === 0) {
        setServerError("시공 사진을 최소 1장 이상 등록해야 합니다.");
        return;
      }
      setServerError("");
      setStep(2);
    } else if (step === 3) {
      const isValid = await trigger(["building_type", "categories"]);
      if (!isValid || !watchedBuildingType || watchedCategories.length === 0) {
        setServerError("건물 유형과 시공 품목(최소 1개)을 입력해 주세요.");
        return;
      }
      setServerError("");
      setStep(4);
    }
  };

  // 브라우저 history.back() 또는 직접 클릭으로 이전 단계 이동 제어
  const handlePrevStep = () => {
    if (step > 1) {
      setServerError("");
      window.history.back(); // popstate를 통해 자동으로 setStep(step - 1) 처리
    }
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-2 md:px-0">
      {/* AI 생성 중 전체화면 딤 오버레이 (조작 원천 차단) */}
      <LoadingOverlay
        isVisible={isGeneratingAi}
        title="🤖 AI 포트폴리오 생성 중..."
        description="인공지능이 현장 사진과 자재 사양을 분석하여 검색 최적화(SEO) 본문과 최적의 제목을 도출하고 있습니다. 잠시만 기다려 주세요."
      />

      <div className="flex items-center justify-between">
        <Link
          href={ROUTES.admin.projects}
          className="text-navy hover:text-navy-light inline-flex items-center gap-1.5 text-sm font-semibold transition-colors dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← 관리 목록으로
        </Link>
      </div>

      {/* 상단 프로그레스 네비게이션 */}
      <FormProgress
        steps={steps}
        currentStep={step}
        onStepClick={(stepId) => {
          const gap = step - stepId;
          setServerError("");
          window.history.go(-gap);
        }}
      />

      {/* 폼 메인 카드 영역 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="rounded-xl border border-red-200/50 bg-red-50 p-3.5 text-xs font-bold text-red-600 dark:border-red-900/30 dark:bg-red-950/20">
            ⚠️ 알림: {serverError}
          </div>
        )}

        {warningMessage && (
          <div className="rounded-xl border border-amber-200/50 bg-amber-50/50 p-3.5 text-xs font-bold text-amber-600 dark:border-amber-900/30 dark:bg-amber-950/20">
            ⚠️ 안내: {warningMessage}
          </div>
        )}

        {/* 1단계: 사진 등록 */}
        {step === 1 && (
          <StepImages
            existingImages={existingImages}
            previews={previews}
            compressing={compressing}
            handleFiles={handleFiles}
            removeExisting={removeExisting}
            removeNew={removeNew}
            primaryImageUrl={primaryImageUrl}
            setSelectedPrimary={setSelectedPrimary}
            compressedFiles={compressedFiles}
            onNext={handleNextStep}
          />
        )}

        {/* 2단계: 시공 위치 */}
        {step === 2 && (
          <StepLocation
            initialRegion={initialRegion}
            onNext={async (fullRegion, c, t) => {
              setCity(c);
              setTown(t);
              setValue("region", fullRegion);
              const isValid = await trigger("region");
              if (!isValid || !t.trim()) {
                setServerError("시공 위치(상세 지역)를 작성해 주세요.");
                return;
              }
              setServerError("");
              setStep(3);
            }}
            onPrev={handlePrevStep}
          />
        )}

        {/* 3단계: 건물 유형 및 시공 품목 */}
        {step === 3 && (
          <StepBuildingCategory form={form} onNext={handleNextStep} onPrev={handlePrevStep} />
        )}

        {/* 4단계: 자재 스펙 및 상세 특이사항 */}
        {step === 4 && (
          <StepDetails
            initialDetails={details}
            onGenerateAi={handleGenerateAi}
            onNext={(currentDetails) => {
              setDetails(currentDetails);
              setStep(5);
              setServerError("");
            }}
            onPrev={handlePrevStep}
            isGeneratingAi={isGeneratingAi}
            compressing={compressing}
          />
        )}

        {/* 5단계: AI 생성 결과 최종 검토 및 저장 */}
        {step === 5 && (
          <StepReview
            form={form}
            isAutoDescription={isAutoDescription}
            setIsAutoDescription={setIsAutoDescription}
            autoGeneratedDescription={autoGeneratedDescription}
            primaryImageUrl={primaryImageUrl}
            previews={previews}
            existingImages={existingImages}
            city={city}
            town={town}
            onPrev={handlePrevStep}
            isSubmitting={isSubmitting}
            compressing={compressing}
            onGenerateAi={handleGenerateAi}
            isGeneratingAi={isGeneratingAi}
            details={details}
          />
        )}
      </form>
    </main>
  );
}
