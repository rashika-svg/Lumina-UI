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

export type InputSize = 'sm' | 'md' | 'lg';

let nextId = 0;

/**
 * Lumina Input — an accessible text field with a floating label, animated focus
 * ring, helper / error messaging and an optional character counter. Implements
 * {@link ControlValueAccessor} for template-driven and reactive forms.
 *
 * @example
 * ```html
 * <lui-input label="Email" type="email" [(ngModel)]="email" [error]="emailError()" />
 * ```
 */
@Component({
  selector: 'lui-input',
  exportAs: 'luiInput',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputField),
      multi: true,
    },
  ],
  template: `
    <div
      class="lui-input__control"
      [class.lui-input__control--floated]="floated()"
      [class.lui-input__control--focused]="focused()"
      [class.lui-input__control--invalid]="invalid()"
      [class.lui-input__control--disabled]="isDisabled()"
    >
      <input
        class="lui-input__field"
        [id]="id"
        [type]="type()"
        [value]="value()"
        placeholder=" "
        [attr.placeholder]="floated() ? placeholder() : ' '"
        [disabled]="isDisabled()"
        [readonly]="readonly()"
        [required]="required()"
        [attr.maxlength]="maxLength() ?? null"
        [attr.aria-invalid]="invalid() ? 'true' : null"
        [attr.aria-describedby]="describedBy()"
        (input)="onInput($event)"
        (focus)="focused.set(true)"
        (blur)="onBlur()"
      />
      @if (label()) {
        <label class="lui-input__label" [for]="id">
          {{ label() }}
          @if (required()) {
            <span class="lui-input__required" aria-hidden="true">*</span>
          }
        </label>
      }
    </div>

    @if (invalid() || hint() || maxLength()) {
      <div class="lui-input__footer">
        <div class="lui-input__messages">
          @if (invalid()) {
            <p
              class="lui-input__message lui-input__message--error"
              [id]="errorId"
              role="alert"
            >
              {{ error() }}
            </p>
          } @else if (hint()) {
            <p
              class="lui-input__message lui-input__message--hint"
              [id]="hintId"
            >
              {{ hint() }}
            </p>
          }
        </div>
        @if (maxLength()) {
          <span
            class="lui-input__counter"
            [class.lui-input__counter--over]="value().length > maxLength()!"
          >
            {{ value().length }}/{{ maxLength() }}
          </span>
        }
      </div>
    }
  `,
  styleUrl: './input.css',
  host: {
    class: 'lui-input',
    '[attr.data-size]': 'size()',
    '[class.lui-input--invalid]': 'invalid()',
    '[class.lui-input--disabled]': 'isDisabled()',
  },
})
export class InputField implements ControlValueAccessor {
  protected readonly id = `lui-input-${nextId++}`;
  protected readonly hintId = `${this.id}-hint`;
  protected readonly errorId = `${this.id}-error`;

  readonly label = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly type = input('text');
  readonly placeholder = input('');
  readonly size = input<InputSize>('md');
  readonly maxLength = input<number | null>(null);
  readonly required = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Two-way bindable value (also drives the CVA bridge). */
  readonly value = model('');

  protected readonly focused = signal(false);
  private readonly disabledByForm = signal(false);

  protected readonly isDisabled = computed(
    () => this.disabled() || this.disabledByForm(),
  );
  protected readonly invalid = computed(() => this.error().length > 0);
  /** The label floats up when the field is focused, filled, or has a placeholder. */
  protected readonly floated = computed(
    () =>
      this.focused() ||
      this.value().length > 0 ||
      this.placeholder().length > 0,
  );
  protected readonly describedBy = computed(() => {
    if (this.invalid()) return this.errorId;
    if (this.hint()) return this.hintId;
    return null;
  });

  private onChange: (value: string) => void = () => {
    /* replaced by registerOnChange */
  };
  private onTouched: () => void = () => {
    /* replaced by registerOnTouched */
  };

  protected onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  // ── ControlValueAccessor ───────────────────────────────────────────────────
  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }
}
