import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css',
})
export class InputFieldComponent {
  formGroup = input.required<FormGroup>();
  controlName = input.required<string>();
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');

  hasError(): boolean {
    const control = this.formGroup().get(this.controlName());
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(): string {
    const control = this.formGroup().get(this.controlName());
    if (!control || !control.errors) return '';

    const errors = control.errors;
    const label = this.label();

    switch (true) {
      case !!errors['required']:
        return `${label} is required`;
      case !!errors['minlength']:
        return `${label} must be at least ${errors['minlength'].requiredLength} characters`;
      case !!errors['email']:
        return 'Please enter a valid email address';
      case !!errors['pattern']:
        return `${label} contains invalid characters`;
      case !!errors['match']:
        return `${label} does not match`;
      default:
        return 'Invalid input';
    }
  }
}
