# @lumina/ui

Accessible, signal-first Angular components, fully driven by `@lumina/tokens` and themed by
`@lumina/theme`.

All components are standalone, `OnPush`, and use Angular signal inputs. They are token-driven (no
hard-coded visual values) and ship with light, dark and high-contrast support plus reduced-motion
handling.

## Components

| Component       | Selector                               | Notes                                                          |
| --------------- | -------------------------------------- | -------------------------------------------------------------- |
| Button          | `button[luiButton]`, `a[luiButton]`    | variants, sizes, loading & disabled, native semantics          |
| Badge           | `span[luiBadge]`, `div[luiBadge]`      | solid / subtle / outline appearances, status variants          |
| Avatar          | `lui-avatar`                           | image with initials fallback, sizes, status dot                |
| Input           | `lui-input`                            | label / hint / error, full ARIA wiring, `ControlValueAccessor` |
| Switch          | `lui-switch`                           | WAI-ARIA `switch`, `ControlValueAccessor`                      |
| Tabs            | `lui-tabs` + `lui-tab`                 | ARIA tablist, roving tabindex, arrow/Home/End keys             |
| Accordion       | `lui-accordion` + `lui-accordion-item` | disclosure pattern, single / multiple modes                    |
| Dialog          | `lui-dialog`                           | modal with focus trap, scrim, Escape, scroll lock              |
| Drawer          | `lui-drawer`                           | edge-anchored overlay panel (start/end/top/bottom)             |
| Menu            | `lui-menu` + `luiMenuTrigger` + item   | ARIA menu, keyboard nav, outside-click dismissal               |
| Toast           | `ToastService` + `lui-toast-outlet`    | injectable notifications in an ARIA live region                |
| Breadcrumb      | `lui-breadcrumb`                       | navigation trail, `aria-current` on the last item              |
| Pagination      | `lui-pagination`                       | page navigation with ellipsis truncation                       |
| Table           | `lui-table`                            | generic data table: sort, selection, sticky header, states     |
| Command Palette | `lui-command-palette`                  | ⌘K launcher: fuzzy search + keyboard navigation                |

## Examples

```html
<button luiButton variant="primary">Save</button>
<button luiButton variant="ghost" size="sm" [loading]="saving()">Saving…</button>

<span luiBadge variant="success" appearance="subtle">Active</span>

<lui-avatar name="Ada Lovelace" src="/ada.jpg" status="online" />

<lui-input label="Email" type="email" [(ngModel)]="email" [error]="emailError()" />

<lui-switch label="Notifications" [(ngModel)]="enabled" />
```

See [DESIGN_PRINCIPLES.md](../../docs/DESIGN_PRINCIPLES.md) for the rules every component follows.
