import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useOutsideClick } from './use-outside-click';

describe('useOutsideClick', () => {
  let container: HTMLElement;
  let outsideElement: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    outsideElement = document.createElement('div');
    document.body.appendChild(container);
    document.body.appendChild(outsideElement);
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(outsideElement);
  });

  it('should call handler when clicking outside the element', () => {
    const handler = vi.fn();
    renderHook(() => {
      const ref = useRef<HTMLElement>(container);
      useOutsideClick(ref, handler);
      return ref;
    });

    const clickEvent = new MouseEvent('click', { bubbles: true });
    outsideElement.dispatchEvent(clickEvent);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not call handler when clicking inside the element', () => {
    const handler = vi.fn();
    renderHook(() => {
      const ref = useRef<HTMLElement>(container);
      useOutsideClick(ref, handler);
      return ref;
    });

    const clickEvent = new MouseEvent('click', { bubbles: true });
    container.dispatchEvent(clickEvent);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should not call handler when element is not mounted', () => {
    const handler = vi.fn();
    renderHook(() => {
      const ref = useRef<HTMLElement>(null);
      useOutsideClick(ref, handler);
      return ref;
    });

    const clickEvent = new MouseEvent('click', { bubbles: true });
    outsideElement.dispatchEvent(clickEvent);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should cleanup event listener on unmount', () => {
    const handler = vi.fn();
    const removeEventListenerSpy = vi.spyOn(document.body, 'removeEventListener');

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLElement>(container);
      useOutsideClick(ref, handler);
      return ref;
    });

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();
    removeEventListenerSpy.mockRestore();
  });

  it('should handle disconnected elements', () => {
    const handler = vi.fn();
    const disconnectedElement = document.createElement('div');
    renderHook(() => {
      const ref = useRef<HTMLElement>(disconnectedElement);
      useOutsideClick(ref, handler);
      return ref;
    });

    const clickEvent = new MouseEvent('click', { bubbles: true });
    outsideElement.dispatchEvent(clickEvent);

    expect(handler).not.toHaveBeenCalled();
  });
});

