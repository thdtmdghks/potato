import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHistoryModal } from "./use-history-modal";

describe("useHistoryModal", () => {
  let originalPushState: any;
  let originalBack: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // 원래 메서드 백업
    originalPushState = window.history.pushState;
    originalBack = window.history.back;

    // mock 함수로 덮어쓰기
    window.history.pushState = vi.fn();
    window.history.back = vi.fn();

    // history.state Mocking
    Object.defineProperty(window.history, "state", {
      value: null,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // 원상복구
    window.history.pushState = originalPushState;
    window.history.back = originalBack;
  });

  it("초기 상태는 모달이 닫혀 있다 (null)", () => {
    const { result } = renderHook(() => useHistoryModal<string>("testKey"));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.value).toBeNull();
  });

  it("open 호출 시 상태를 설정하고 브라우저 history에 스택을 쌓는다", () => {
    const { result } = renderHook(() => useHistoryModal<string>("testKey"));

    act(() => {
      result.current.open("image-url-1");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.value).toBe("image-url-1");
    expect(window.history.pushState).toHaveBeenCalledWith({ testKey: true }, "");
  });

  it("close 호출 시 상태를 해제하고 history.back()을 호출해 스택을 롤백한다", () => {
    const { result } = renderHook(() => useHistoryModal<string>("testKey"));

    // 모달을 열었을 때 state 상태를 모의(Mocking)
    act(() => {
      result.current.open("image-url-2");
    });
    Object.defineProperty(window.history, "state", {
      value: { testKey: true },
      writable: true,
    });

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.value).toBeNull();
    expect(window.history.back).toHaveBeenCalled();
  });

  it("브라우저 popstate(뒤로가기) 감지 시 상태를 자동으로 해제한다", () => {
    const { result } = renderHook(() => useHistoryModal<string>("testKey"));

    act(() => {
      result.current.open("image-url-3");
    });
    expect(result.current.isOpen).toBe(true);

    // popstate 이벤트 발생 모의 (뒤로가기가 눌림)
    act(() => {
      window.dispatchEvent(new Event("popstate"));
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.value).toBeNull();
    // 뒤로가기는 이미 브라우저가 실행했으므로 추가적인 back()은 불필요하므로 호출되지 않아야 함
    expect(window.history.back).not.toHaveBeenCalled();
  });
});
