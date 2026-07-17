# Component Documentation Standard

This is the completion contract for every Lumina component page. It makes the documentation site
consistent, discoverable, and reliable across Angular, React, Next.js, Vue, and Tailwind users.

## Required front matter

Each component has a structured manifest with the following fields:

```yaml
title: Card
slug: card
status: stable # experimental | beta | stable | deprecated
category: layout
since: 0.1.0
adapters:
  angular: available
  react: planned
  next: planned
  vue: planned
  tailwind: available
accessibility:
  wcag: 2.2-AA
  keyboard: []
related: [button, avatar]
```

The manifest powers navigation, search, support badges, related-component links, and coverage
reporting. Never hard-code those values into a page layout.

## Required page sections

| Section             | Must answer                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| Overview            | What problem does this solve and when should it be used?                     |
| Preview             | Can a user see and interact with a real rendered component?                  |
| Installation        | Which package and styles are required for each released adapter?             |
| Usage               | What is the smallest correct implementation?                                 |
| Variants and states | What changes visually and semantically across all supported combinations?    |
| Accessibility       | What semantics, names, keyboard interactions, and pitfalls apply?            |
| API                 | What are the typed inputs/props, defaults, events, slots, and CSS variables? |
| Examples            | How do common compositions work in each released framework?                  |
| Do / don't          | Which product-design decisions should teams make or avoid?                   |
| Related             | What component should the reader use next?                                   |

## Example contract

Every live example must be a real framework component, not a static screenshot. It includes:

- a descriptive heading and concise explanation;
- a visual preview that works with all shipped themes;
- syntax-highlighted source and a copy action;
- a semantic test selector that is not used for styling;
- a unit/component test and an end-to-end documentation rendering test;
- an accessibility assertion appropriate to the example.

## Accessibility content requirements

Write component-specific guidance—not generic promises. Include semantic HTML, ARIA only when it
adds meaning, keyboard keys and outcomes, focus management, colour/contrast notes, error/validation
behaviour, and the reduced-motion effect. State when a component should not be interactive.

## Framework and Tailwind guidance

- Provide runnable code only for released adapters.
- Mark planned adapters as **Planned** with no fabricated installation or API instructions.
- Use the same named example across frameworks so readers can compare equivalent concepts.
- Tailwind examples use the generated Lumina preset/utilities and CSS variables; do not duplicate
  raw hex values or create a second visual token system.

## Documentation definition of done

- [ ] Manifest validates and contributes to navigation/search.
- [ ] All required sections are present and meaningful.
- [ ] Preview and every code sample render in CI.
- [ ] API information is generated or checked against the exported source types.
- [ ] A11y and keyboard instructions match the tested implementation.
- [ ] Light, dark, and high-contrast screenshots have been reviewed.
- [ ] Support status, related components, and changelog notes are current.
