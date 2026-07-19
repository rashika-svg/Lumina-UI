import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { Avatar, Badge, Button, Card, InputField, Switch } from '@lumina/ui';
import { LAB, type ControlValue } from './lab-registry';

type Viewport = 'full' | 'tablet' | 'mobile';

/**
 * Component Lab — a Storybook/shadcn-style laboratory: pick a component, tweak
 * its props live, preview it at any viewport, and copy the generated code.
 */
@Component({
  selector: 'lpg-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    Button,
    InputField,
    Badge,
    Avatar,
    Card,
    Switch,
  ],
  templateUrl: './lab.html',
  styleUrl: './lab.css',
})
export class LabPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly items = LAB;
  protected readonly slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('slug') ?? 'button')),
    { initialValue: 'button' },
  );
  protected readonly def = computed(
    () => LAB.find((d) => d.slug === this.slug()) ?? LAB[0]!,
  );

  protected readonly values = signal<Record<string, ControlValue>>({});
  protected readonly code = computed(() => this.def().code(this.values()));

  protected readonly viewport = signal<Viewport>('full');
  protected readonly viewports = [
    { id: 'full', label: 'Desktop', width: '100%' },
    { id: 'tablet', label: 'Tablet', width: '48rem' },
    { id: 'mobile', label: 'Mobile', width: '23.5rem' },
  ] as const;
  protected readonly copied = signal(false);

  constructor() {
    // Reset controls to defaults whenever the selected component changes.
    effect(() => {
      const def = this.def();
      const next: Record<string, ControlValue> = {};
      for (const control of def.controls) next[control.name] = control.default;
      untracked(() => this.values.set(next));
    });
  }

  protected val(name: string): string {
    const value = this.values()[name];
    return value === undefined ? '' : String(value);
  }

  protected bool(name: string): boolean {
    return this.values()[name] === true;
  }

  protected setValue(name: string, value: ControlValue): void {
    this.values.update((v) => ({ ...v, [name]: value }));
  }

  protected frameWidth(): string {
    return (
      this.viewports.find((v) => v.id === this.viewport())?.width ?? '100%'
    );
  }

  protected copy(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    }
  }
}
