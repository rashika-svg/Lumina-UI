import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CommandPalette, type Command } from './command-palette';

@Component({
  imports: [CommandPalette],
  template: `
    <lui-command-palette
      [(open)]="open"
      [commands]="commands"
      (run)="ran.set($event.id)"
    />
  `,
})
class Host {
  readonly open = signal(false);
  readonly ran = signal('');
  readonly commands: Command[] = [
    { id: 'new', label: 'New file', keywords: ['create'] },
    { id: 'open', label: 'Open file', hint: '⌘O' },
    { id: 'settings', label: 'Preferences', group: 'App' },
  ];
}

describe('CommandPalette', () => {
  let fixture: ComponentFixture<Host>;
  const input = () =>
    document.querySelector('.lui-cmdk__input') as HTMLInputElement | null;
  const options = () =>
    Array.from(document.querySelectorAll('[role="option"]')) as HTMLElement[];

  const type = (value: string) => {
    const el = input()!;
    el.value = value;
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  const key = (k: string) => {
    input()!.dispatchEvent(
      new KeyboardEvent('keydown', { key: k, bubbles: true }),
    );
    fixture.detectChanges();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('is hidden until opened', () => {
    expect(input()).toBeNull();
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    expect(input()).toBeTruthy();
    expect(options().length).toBe(3);
  });

  it('filters commands by label and keywords', () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    type('create');
    expect(options().length).toBe(1);
    expect(options()[0].textContent).toContain('New file');
  });

  it('shows an empty state when nothing matches', () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    type('zzz');
    expect(options().length).toBe(0);
    expect(document.querySelector('.lui-cmdk__empty')?.textContent).toContain(
      'No results',
    );
  });

  it('navigates with arrows and runs the active command on Enter', () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    key('ArrowDown'); // active index 1
    key('Enter');
    expect(fixture.componentInstance.ran()).toBe('open');
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('closes on Escape', () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    key('Escape');
    expect(fixture.componentInstance.open()).toBe(false);
  });
});
