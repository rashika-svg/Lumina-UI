import type { Preview } from '@storybook/angular';
// Token stylesheet is registered as a global style via the Storybook target's
// `styles` option (see libs/ui/project.json) so Angular's CSS pipeline handles it.

/** Apply the selected Lumina theme to the document for every story. */
function applyTheme(theme: string): void {
  document.documentElement.setAttribute('data-theme', theme);
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: {
      // Surface accessibility violations in the a11y addon panel.
      test: 'todo',
    },
    options: {
      storySort: { order: ['Introduction', 'Foundations', 'Components'] },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  globalTypes: {
    theme: {
      description: 'Lumina theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'hc', title: 'High contrast' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      applyTheme((context.globals['theme'] as string) ?? 'light');
      return story();
    },
  ],
};

export default preview;
