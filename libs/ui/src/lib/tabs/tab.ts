import {
  booleanAttribute,
  Component,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';

let nextTabId = 0;

/**
 * A single tab within {@link Tabs}. Its projected content is captured in a
 * template and rendered by the parent into the active tab panel.
 *
 * @example
 * ```html
 * <lui-tabs>
 *   <lui-tab label="Account">…</lui-tab>
 *   <lui-tab label="Security" [disabled]="true">…</lui-tab>
 * </lui-tabs>
 * ```
 */
@Component({
  selector: 'lui-tab',
  template: `<ng-template><ng-content /></ng-template>`,
})
export class Tab {
  /** Stable id used to wire `aria-controls` / `aria-labelledby`. */
  readonly uid = `lui-tab-${nextTabId++}`;
  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  /** The captured content, rendered by the parent into the panel. */
  readonly content = viewChild.required(TemplateRef);
}
