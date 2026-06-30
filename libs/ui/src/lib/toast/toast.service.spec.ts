import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.useRealTimers();
    service.clear();
  });

  it('enqueues a toast with sensible defaults', () => {
    service.show({ message: 'Hello' });
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0]).toMatchObject({
      message: 'Hello',
      variant: 'info',
    });
  });

  it('exposes variant helpers', () => {
    service.success('Saved');
    service.error('Boom');
    const variants = service.toasts().map((t) => t.variant);
    expect(variants).toEqual(['success', 'danger']);
  });

  it('dismisses a toast by id', () => {
    const id = service.info('temp');
    service.dismiss(id);
    expect(service.toasts().length).toBe(0);
  });

  it('auto-dismisses after the duration elapses', () => {
    vi.useFakeTimers();
    service.show({ message: 'bye', duration: 1000 });
    expect(service.toasts().length).toBe(1);
    vi.advanceTimersByTime(1000);
    expect(service.toasts().length).toBe(0);
  });

  it('keeps sticky toasts (duration 0) until dismissed', () => {
    vi.useFakeTimers();
    service.show({ message: 'stay', duration: 0 });
    vi.advanceTimersByTime(100000);
    expect(service.toasts().length).toBe(1);
  });
});
