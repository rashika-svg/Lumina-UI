import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Accordion } from './accordion';
import { AccordionItem } from './accordion-item';

const meta: Meta<Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [AccordionItem] })],
  argTypes: { multiple: { control: 'boolean' } },
  args: { multiple: false },
  render: (args) => ({
    props: args,
    template: `
      <lui-accordion [multiple]="multiple">
        <lui-accordion-item heading="What is Lumina UI?">
          An enterprise-grade Angular design system platform.
        </lui-accordion-item>
        <lui-accordion-item heading="How is theming handled?">
          Via design tokens compiled to CSS variables, switched at runtime.
        </lui-accordion-item>
        <lui-accordion-item heading="Is it accessible?" [disabled]="false">
          Yes — WCAG 2.2 AA is the baseline for every component.
        </lui-accordion-item>
      </lui-accordion>`,
  }),
};
export default meta;

type Story = StoryObj<Accordion>;

export const Playground: Story = {};
export const MultipleOpen: Story = { args: { multiple: true } };
export const DarkTheme: Story = { globals: { theme: 'dark' } };
