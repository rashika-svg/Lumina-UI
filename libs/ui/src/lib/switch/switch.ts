import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type SwitchSize = 'sm' | 'md';

let nextId = 0;

/**
 * Lumina Switch — an accessible on/off toggle built on the WAI-ARIA `switch`
 * role. Implements {@link ControlValueAccessor} for Angular forms.
 *
 * @example
 * ```html
 * <lui-switch label="Email notifications" [(ngModel)]="enabled" />
 * ```
 */
@Component({
  selector: 'lui-switch',
  exportAs: 'luiSwitch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Switch),
      multi: true,
    },
  ],
  template: `
    <button
      type="button"
      role="switch"
      class="lui-switch__track"
      [id]="id"
      [attr.aria-checked]="checked()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-labelledby]="label() ? labelId : null"
      [disabled]="isDisabled()"
      (click)="toggle()"
      (blur)="onTouched()"
    >
      <span class="lui-switch__thumb"></span>
    </button>
    @if (label()) {
      <label class="lui-switch__label" [id]="labelId" [attr.for]="id">{{
        label()
      }}</label>
    }
  `,
  styleUrl: './switch.css',
  host: {
    class: 'lui-switch',
    '[attr.data-size]': 'size()',
    '[class.lui-switch--checked]': 'checked()',
    '[class.lui-switch--disabled]': 'isDisabled()',
  },
})
export class Switch implements ControlValueAccessor {
  protected readonly id = `lui-switch-${nextId++}`;
  protected readonly labelId = `${this.id}-label`;

  readonly label = input('');
  readonly ariaLabel = input('');
  readonly size = input<SwitchSize>('md');
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Two-way bindable checked state. */
  readonly checked = model(false);

  private readonly disabledByForm = signal(false);
  protected readonly isDisabled = computed(
    () => this.disabled() || this.disabledByForm(),
  );

  protected onTouched: () => void = () => {
    /* replaced by registerOnTouched */
  };
  private onChange: (value: boolean) => void = () => {
    /* replaced by registerOnChange */
  };

  toggle(): void {
    if (this.isDisabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
  }

  // ── ControlValueAccessor ───────────────────────────────────────────────────
  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }
}
