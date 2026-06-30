import type { Meta, StoryObj } from '@storybook/angular';
import { Table, type TableColumn } from './table';

interface Person {
  id: number;
  name: string;
  role: string;
  age: number;
  status: string;
}

const columns: TableColumn<Person>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'age', header: 'Age', sortable: true, align: 'end', width: '6rem' },
  { key: 'status', header: 'Status', align: 'center' },
];

const data: Person[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer', age: 36, status: 'Active' },
  { id: 2, name: 'Grace Hopper', role: 'Admiral', age: 85, status: 'Active' },
  { id: 3, name: 'Alan Turing', role: 'Researcher', age: 41, status: 'Away' },
  {
    id: 4,
    name: 'Margaret Hamilton',
    role: 'Director',
    age: 88,
    status: 'Active',
  },
];

const meta: Meta<Table<Person>> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    selectable: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: { columns, data, selectable: true, stickyHeader: true, loading: false },
  render: (args) => ({
    props: { ...args, byId: (p: Person) => p.id },
    template: `
      <lui-table
        [columns]="columns" [data]="data"
        [selectable]="selectable" [stickyHeader]="stickyHeader" [loading]="loading"
        [rowKey]="byId" />`,
  }),
};
export default meta;

type Story = StoryObj<Table<Person>>;

export const Playground: Story = {};
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { data: [] } };
export const DarkTheme: Story = { globals: { theme: 'dark' } };
