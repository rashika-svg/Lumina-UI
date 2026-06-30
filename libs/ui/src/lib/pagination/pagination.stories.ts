import type { Meta, StoryObj } from '@storybook/angular';
import { Pagination } from './pagination';

const meta: Meta<Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    total: { control: { type: 'number', min: 1 } },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
  },
  args: { total: 20, page: 6, siblingCount: 1 },
  render: (args) => ({
    props: args,
    template: `<lui-pagination [total]="total" [page]="page" [siblingCount]="siblingCount" />`,
  }),
};
export default meta;

type Story = StoryObj<Pagination>;

export const Playground: Story = {};
export const FewPages: Story = { args: { total: 4, page: 2 } };
export const DarkTheme: Story = { globals: { theme: 'dark' } };
