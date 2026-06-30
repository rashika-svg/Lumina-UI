import type { Meta, StoryObj } from '@storybook/angular';
import { Tree, type TreeNode } from './tree';

const nodes: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'app',
        label: 'app',
        children: [
          { id: 'app.ts', label: 'app.ts' },
          { id: 'app.html', label: 'app.html' },
        ],
      },
      { id: 'styles', label: 'styles.css' },
      { id: 'main', label: 'main.ts' },
    ],
  },
  {
    id: 'libs',
    label: 'libs',
    children: [
      { id: 'ui', label: 'ui' },
      { id: 'tokens', label: 'tokens' },
    ],
  },
  { id: 'readme', label: 'README.md' },
];

const meta: Meta<Tree> = {
  title: 'Components/Tree',
  component: Tree,
  tags: ['autodocs'],
  argTypes: { selectable: { control: 'boolean' } },
  args: { nodes, selectable: true },
  render: (args) => ({
    props: args,
    template: `<lui-tree [nodes]="nodes" [selectable]="selectable" />`,
  }),
};
export default meta;

type Story = StoryObj<Tree>;

export const Playground: Story = {};
export const DarkTheme: Story = { globals: { theme: 'dark' } };
