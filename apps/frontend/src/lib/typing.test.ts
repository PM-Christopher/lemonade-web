import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { clearTyping, markTyping, useIsTyping, useTypingSignal } from "./typing";

const sendTyping = vi.hoisted(() => vi.fn());

describe("typing", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sendTyping.mockReset();
    sendTyping.mockResolvedValue({});
  });

  afterEach(() => {
    clearTyping("ada");
    clearTyping("bob");
    vi.useRealTimers();
  });

  it("shows someone as typing, then stops a few seconds after the last signal", () => {
    const { result } = renderHook(() => useIsTyping("ada"));
    expect(result.current).toBe(false);

    act(() => markTyping("ada"));
    expect(result.current).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
      markTyping("ada");
      vi.advanceTimersByTime(3000);
    });
    expect(result.current).toBe(true);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe(false);
  });

  it("only shows the person who is typing", () => {
    const ada = renderHook(() => useIsTyping("ada"));
    const bob = renderHook(() => useIsTyping("bob"));

    act(() => markTyping("ada"));

    expect(ada.result.current).toBe(true);
    expect(bob.result.current).toBe(false);
  });

  it("stops at once when their message arrives", () => {
    const { result } = renderHook(() => useIsTyping("ada"));
    act(() => markTyping("ada"));

    act(() => clearTyping("ada"));

    expect(result.current).toBe(false);
  });

  it("sends the typing signal at most once every few seconds", () => {
    const { result } = renderHook(() => useTypingSignal("ada", sendTyping));

    result.current();
    result.current();
    expect(sendTyping).toHaveBeenCalledTimes(1);
    expect(sendTyping).toHaveBeenCalledWith("ada");

    vi.advanceTimersByTime(2600);
    result.current();
    expect(sendTyping).toHaveBeenCalledTimes(2);
  });

  it("sends nothing when there is no one to send it to", () => {
    const { result } = renderHook(() => useTypingSignal(undefined, sendTyping));

    result.current();

    expect(sendTyping).not.toHaveBeenCalled();
  });
});
