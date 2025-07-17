import { Component, OnInit } from '@angular/core';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

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
          console.log('Signin successful:', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Signin error:', error);
          this.errorMessage =
            error.error?.message || 'Signin failed. Please try again.';
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      this.signinForm.markAllAsTouched();
    }
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
