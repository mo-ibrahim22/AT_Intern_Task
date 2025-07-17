import {
  Component,
  OnInit,
  inject,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputFieldComponent } from '../../../components/input-field/input-field.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { AuthService } from '../../../common/services/auth.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { ConfirmationService } from '../../../common/services/confirmation.service';
import { SignupRequest } from '../../../common/models/user.model';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputFieldComponent,
    ButtonComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  isSubmitting = false;
  formTouched = false;
  errorMessage = '';

  @ViewChild('customConfirmTemplate', { static: true })
  customConfirmTemplate!: TemplateRef<any>;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toaster = inject(ToasterService);
  private confirmation = inject(ConfirmationService);

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        rePassword: ['', [Validators.required, Validators.minLength(8)]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const rePassword = control.get('rePassword')?.value;

    if (password && rePassword && password !== rePassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    this.formTouched = true;
    this.errorMessage = '';

    if (this.signupForm.valid) {
      this.handleSignup();
    } else {
      this.signupForm.markAllAsTouched();
      this.toaster.show(
        'Please fill in all required fields correctly',
        'warning'
      );
    }
  }

  private handleSignup(): void {
    // Example using custom template
    const userData = {
      name: this.signupForm.get('name')?.value,
      email: this.signupForm.get('email')?.value,
    };

    this.confirmation.confirmWithTemplate(
      'Create Account',
      this.customConfirmTemplate,
      (confirmed: boolean) => {
        if (confirmed) {
          this.isSubmitting = true;
          const signupData: SignupRequest = this.signupForm.value;

          this.authService.signup(signupData).subscribe({
            next: (response) => {
              console.log('signup successful:', response);
              this.toaster.show(
                'Account created successfully! Please sign in.',
                'success'
              );
              this.router.navigate(['/signin']);
            },
            error: (error) => {
              console.error('signup error:', error);
              this.errorMessage =
                error.error?.message || 'signup failed. Please try again.';
              this.toaster.show(this.errorMessage, 'error');
              this.isSubmitting = false;
            },
            complete: () => {
              this.isSubmitting = false;
            },
          });
        }
      },
      {
        confirmText: 'Create Account',
        cancelText: 'Cancel',
        data: userData,
      }
    );
  }

  navigateToSignin(): void {
    this.router.navigate(['/signin']);
  }
}
