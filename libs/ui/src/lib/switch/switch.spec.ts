import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { beforeEach, describe, expect, it } from 'vitest';
import { Switch } from './switch';

describe('Switch', () => {
  it('renders as an ARIA switch and reflects checked state', () => {
    @Component({
      imports: [Switch],
      template: `<lui-switch label="Wifi" [checked]="on()" />`,
    })
    class Host {
      readonly on = signal(false);
    }
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const track = fixture.nativeElement.querySelector(
      '[role="switch"]',
    ) as HTMLButtonElement;
    expect(track.getAttribute('aria-checked')).toBe('false');

    fixture.componentInstance.on.set(true);
    fixture.detectChanges();
    expect(track.getAttribute('aria-checked')).toBe('true');
  });

  describe('with reactive forms', () => {
    @Component({
      imports: [Switch, ReactiveFormsModule],
      template: `<lui-switch [formControl]="ctrl" label="Notifications" />`,
    })
    class FormHost {
      readonly ctrl = new FormControl(false);
    }
    let fixture: ComponentFixture<FormHost>;
    const track = () =>
      fixture.nativeElement.querySelector(
        '[role="switch"]',
      ) as HTMLButtonElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(FormHost);
      fixture.detectChanges();
    });

    it('updates the form control when toggled', () => {
      track().click();
      fixture.detectChanges();
      expect(fixture.componentInstance.ctrl.value).toBe(true);
    });

    it('reflects programmatic form value changes (writeValue)', () => {
      fixture.componentInstance.ctrl.setValue(true);
      fixture.detectChanges();
      expect(track().getAttribute('aria-checked')).toBe('true');
    });

    it('honours disabled state from the form control', () => {
      fixture.componentInstance.ctrl.disable();
      fixture.detectChanges();
      expect(track().disabled).toBe(true);
    });
  });
});
