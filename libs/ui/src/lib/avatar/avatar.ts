import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | null;

/**
 * Lumina Avatar — represents a user or entity with an image, gracefully falling
 * back to monogram initials derived from the name when no image is available.
 *
 * @example
 * ```html
 * <lui-avatar name="Ada Lovelace" src="/ada.jpg" status="online" />
 * ```
 */
@Component({
  selector: 'lui-avatar',
  exportAs: 'luiAvatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showImage()) {
      <img
        class="lui-avatar__img"
        [src]="src()"
        [alt]="name() || 'avatar'"
        (error)="onError()"
        (load)="onLoad()"
      />
    } @else {
      <span class="lui-avatar__fallback" aria-hidden="true">{{
        initials()
      }}</span>
      <span class="lui-avatar__sr">{{ name() }}</span>
    }
    @if (status()) {
      <span
        class="lui-avatar__status"
        [attr.data-status]="status()"
        role="img"
        [attr.aria-label]="status()"
      ></span>
    }
  `,
  styleUrl: './avatar.css',
  host: {
    class: 'lui-avatar',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
  },
})
export class Avatar {
  readonly name = input('');
  readonly src = input<string | null>(null);
  readonly size = input<AvatarSize>('md');
  readonly shape = input<AvatarShape>('circle');
  readonly status = input<AvatarStatus>(null);

  private readonly imageFailed = signal(false);

  protected readonly showImage = computed(
    () => !!this.src() && !this.imageFailed(),
  );

  /** Up to two initials from the supplied name (first + last word). */
  protected readonly initials = computed(() => {
    const parts = this.name().trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    const first = parts[0] ?? '';
    if (parts.length === 1) return first.charAt(0).toUpperCase();
    const last = parts[parts.length - 1] ?? '';
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  });

  protected onError(): void {
    this.imageFailed.set(true);
  }

  protected onLoad(): void {
    this.imageFailed.set(false);
  }
}
