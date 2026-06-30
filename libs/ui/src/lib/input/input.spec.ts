import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { beforeEach, describe, expect, it } from 'vitest';
import { InputField } from './input';

describe('InputField', () => {
  it('associates label, hint and aria-describedby for accessibility', () => {
    @Component({
      imports: [InputField],
      template: `<lui-input label="Email" hint="No spam" />`,
    })
    class Host {}
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input')!;
    const label = el.querySelector('label')!;
    const hint = el.querySelector('.lui-input__message--hint')!;

    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('switches to an alert error message and marks the field invalid', () => {
    @Component({
      imports: [InputField],
      template: `<lui-input label="Email" [error]="err" hint="hi" />`,
    })
    class Host {
      err = 'Required';
    }
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input')!;
    const error = el.querySelector('.lui-input__message--error')!;

    expect(error.getAttribute('role')).toBe('alert');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
  });

  describe('with reactive forms', () => {
    @Component({
      imports: [InputField, ReactiveFormsModule],
      template: `<lui-input label="Name" [formControl]="ctrl" />`,
    })
    class FormHost {
      readonly ctrl = new FormControl('');
    }
    let fixture: ComponentFixture<FormHost>;
    const input = () =>
      fixture.nativeElement.querySelector('input') as HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(FormHost);
      fixture.detectChanges();
    });

    it('writes user input back to the form control', () => {
      input().value = 'Ada';
      input().dispatchEvent(new Event('input'));
      expect(fixture.componentInstance.ctrl.value).toBe('Ada');
    });

    it('reflects programmatic value and disabled state', () => {
      fixture.componentInstance.ctrl.setValue('Grace');
      fixture.componentInstance.ctrl.disable();
      fixture.detectChanges();
      expect(input().value).toBe('Grace');
      expect(input().disabled).toBe(true);
    });
  });
});
