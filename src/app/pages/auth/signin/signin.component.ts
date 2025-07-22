import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputFieldComponent } from '../../../components/input-field/input-field.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { AuthService } from '../../../common/services/auth.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { SigninRequest } from '../../../common/models/user.model';

@Component({
  selector: 'app-signin',
  imports: [
    InputFieldComponent,
    ButtonComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent implements OnInit {
  signinForm!: FormGroup;
  isSubmitting = false;
  formTouched = false;
  errorMessage = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    this.formTouched = true;
    this.errorMessage = '';

    if (this.signinForm.valid) {
      this.isSubmitting = true;

      const signinData: SigninRequest = this.signinForm.value;

      this.authService.signin(signinData).subscribe({
        next: (response) => {
          this.toaster.show(
            'Sign in successful! Please verify your account.',
            'success'
          );
          this.router.navigate(['/otp-verification']);
        },
        error: (error) => {
          console.error('Signin error:', error);
          // Use the processed error message from error interceptor
          this.errorMessage =
            error?.userMessage || 'Signin failed. Please try again.';
          // Error interceptor already handles the toast for non-auth endpoints
          // But for auth endpoints, we handle it manually
          this.toaster.show(this.errorMessage, 'error');
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      this.signinForm.markAllAsTouched();
      this.toaster.show(
        'Please fill in all required fields correctly',
        'warning'
      );
    }
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
