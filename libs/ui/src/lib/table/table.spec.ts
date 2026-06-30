import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Table, type TableColumn } from './table';

interface User {
  id: number;
  name: string;
  age: number;
}

@Component({
  imports: [Table],
  template: `
    <lui-table
      [columns]="columns"
      [data]="data()"
      [selectable]="selectable()"
      [loading]="loading()"
      [(selection)]="selection"
      [rowKey]="byId"
    />
  `,
})
class Host {
  readonly columns: TableColumn<User>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'age', header: 'Age', sortable: true, align: 'end' },
  ];
  readonly data = signal<User[]>([
    { id: 1, name: 'Charlie', age: 30 },
    { id: 2, name: 'Alice', age: 25 },
    { id: 3, name: 'Bob', age: 35 },
  ]);
  readonly selectable = signal(false);
  readonly loading = signal(false);
  readonly selection = signal<User[]>([]);
  readonly byId = (u: User) => u.id;
}

describe('Table', () => {
  let fixture: ComponentFixture<Host>;
  const rows = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('tbody tr'),
    ) as HTMLElement[];
  const firstColCells = () =>
    rows().map((r) => r.querySelector('td')?.textContent?.trim());
  const headers = () =>
    Array.from(fixture.nativeElement.querySelectorAll('th')) as HTMLElement[];

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('renders a row per data item in original order', () => {
    expect(firstColCells()).toEqual(['Charlie', 'Alice', 'Bob']);
  });

  it('sorts ascending then descending on header click, updating aria-sort', () => {
    const nameHeader = headers()[0];
    nameHeader.querySelector('button')!.click();
    fixture.detectChanges();
    expect(firstColCells()).toEqual(['Alice', 'Bob', 'Charlie']);
    expect(nameHeader.getAttribute('aria-sort')).toBe('ascending');

    nameHeader.querySelector('button')!.click();
    fixture.detectChanges();
    expect(firstColCells()).toEqual(['Charlie', 'Bob', 'Alice']);
    expect(nameHeader.getAttribute('aria-sort')).toBe('descending');
  });

  it('sorts numerically by a numeric column', () => {
    headers()[1].querySelector('button')!.click();
    fixture.detectChanges();
    expect(firstColCells()).toEqual(['Alice', 'Charlie', 'Bob']); // 25, 30, 35
  });

  it('shows an empty state when there is no data', () => {
    fixture.componentInstance.data.set([]);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.lui-table__status')?.textContent,
    ).toContain('No data');
  });

  it('shows a loading state', () => {
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.lui-table__status')?.textContent,
    ).toContain('Loading');
  });

  describe('selection', () => {
    beforeEach(() => {
      fixture.componentInstance.selectable.set(true);
      fixture.detectChanges();
    });

    it('selects an individual row', () => {
      const checkbox = rows()[0].querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement;
      checkbox.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.selection().map((u) => u.id)).toEqual([
        1,
      ]);
    });

    it('select-all toggles every row and clears again', () => {
      const headerCheckbox = headers()[0].querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement;
      headerCheckbox.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.selection().length).toBe(3);

      headerCheckbox.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.selection().length).toBe(0);
    });
  });
});
