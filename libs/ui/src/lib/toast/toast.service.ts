import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  /** Optional title shown in bold above the message. */
  readonly title?: string;
  /** The message body. */
  readonly message: string;
  /** Visual + semantic variant. Default `info`. */
  readonly variant?: ToastVariant;
  /** Auto-dismiss delay in ms; `0` keeps it until dismissed. Default `5000`. */
  readonly duration?: number;
}

export interface Toast extends Required<Omit<ToastOptions, 'title'>> {
  readonly id: number;
  readonly title?: string;
}

let nextId = 0;

/**
 * Lumina Toast service — enqueue transient notifications from anywhere.
 *
 * Render the queue once with `<lui-toast-outlet />` near your app root.
 *
 * @example
 * ```ts
 * const toast = inject(ToastService);
 * toast.success('Saved', 'Your changes are live.');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  /** The current toast queue (oldest first). */
  readonly toasts = this._toasts.asReadonly();

  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  /** Show a toast and return its id. */
  show(options: ToastOptions): number {
    const toast: Toast = {
      id: nextId++,
      message: options.message,
      title: options.title,
      variant: options.variant ?? 'info',
      duration: options.duration ?? 5000,
    };
    this._toasts.update((list) => [...list, toast]);

    if (toast.duration > 0 && typeof setTimeout !== 'undefined') {
      this.timers.set(
        toast.id,
        setTimeout(() => this.dismiss(toast.id), toast.duration),
      );
    }
    return toast.id;
  }

  success(message: string, title?: string, duration?: number): number {
    return this.show({ message, title, duration, variant: 'success' });
  }
  error(message: string, title?: string, duration?: number): number {
    return this.show({ message, title, duration, variant: 'danger' });
  }
  warning(message: string, title?: string, duration?: number): number {
    return this.show({ message, title, duration, variant: 'warning' });
  }
  info(message: string, title?: string, duration?: number): number {
    return this.show({ message, title, duration, variant: 'info' });
  }

  /** Dismiss a specific toast. */
  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  /** Dismiss every toast. */
  clear(): void {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers.clear();
    this._toasts.set([]);
  }
}
