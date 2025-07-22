import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '../../../components/button/button.component';
import { ToasterService } from '../../../common/services/toaster.service';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../../../common/services/auth.service';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.css',
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  private authService = inject(AuthService);

  otpForm!: FormGroup;
  timer = signal(30);
  isTimerActive = signal(true);
  isSubmitting = signal(false);
  timerSubscription?: Subscription;

  // Computed properties
  isTimerExpired = computed(() => this.timer() === 0);
  canSubmit = computed(() => this.isTimerActive() && !this.isTimerExpired());

  userEmail = this.authService.currentUser?.email || '';

  ngOnInit(): void {
    this.initializeForm();
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private initializeForm(): void {
    this.otpForm = this.fb.group({
      otpDigits: this.fb.array(
        Array.from({ length: 6 }, () =>
          this.fb.control('', [Validators.required, Validators.pattern(/^\d$/)])
        )
      ),
    });
  }

  get otpDigits(): FormArray {
    return this.otpForm.get('otpDigits') as FormArray;
  }

  private startTimer(): void {
    this.timer.set(30);
    this.isTimerActive.set(true);

    this.timerSubscription = interval(1000)
      .pipe(take(30))
      .subscribe({
        next: (count) => {
          const remaining = 30 - count - 1;
          this.timer.set(remaining);

          if (remaining === 0) {
            this.isTimerActive.set(false);
          }
        },
        complete: () => {
          this.isTimerActive.set(false);
        },
      });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Only allow single digit
    if (value.length > 1) {
      input.value = value.slice(-1);
      this.otpDigits.at(index).setValue(input.value);
    }

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onDigitKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Handle backspace
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = document.getElementById(
        `otp-${index - 1}`
      ) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }

    // Handle paste
    if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      navigator.clipboard.readText().then((text) => {
        this.handlePaste(text, index);
      });
    }
  }

  onPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    this.handlePaste(pastedText, index);
  }

  private handlePaste(text: string, startIndex: number): void {
    const digits = text.replace(/\D/g, '').slice(0, 6 - startIndex);

    for (let i = 0; i < digits.length && startIndex + i < 6; i++) {
      this.otpDigits.at(startIndex + i).setValue(digits[i]);

      // Focus the input after setting value
      setTimeout(() => {
        const input = document.getElementById(
          `otp-${startIndex + i}`
        ) as HTMLInputElement;
        if (input) {
          input.value = digits[i];
        }
      }, 0);
    }

    // Focus the next empty input or the last filled input
    const nextIndex = Math.min(startIndex + digits.length, 5);
    setTimeout(() => {
      const nextInput = document.getElementById(
        `otp-${nextIndex}`
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }, 0);
  }

  resetTimer(): void {
    this.stopTimer();
    this.startTimer();
    this.toaster.show('New OTP sent successfully!', 'success');

    // Clear the form
    this.otpDigits.controls.forEach((control) => control.setValue(''));

    // Focus first input
    setTimeout(() => {
      const firstInput = document.getElementById('otp-0') as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
      }
    }, 0);
  }

  onSubmit(): void {
    if (!this.canSubmit()) {
      this.toaster.show('Timer expired! Please request a new OTP.', 'error');
      return;
    }

    if (this.otpForm.invalid) {
      this.toaster.show('Please enter all 6 digits', 'warning');
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    // Get the complete OTP
    const otp = this.otpDigits.controls
      .map((control) => control.value)
      .join('');

    // Simulate API call delay
    setTimeout(() => {
      // Mock validation - in real app, this would be an API call
      if (otp === '123456') {
        this.toaster.show('OTP verified successfully!', 'success');
        this.router.navigate(['/home']);
      } else {
        this.toaster.show('Invalid OTP. Please try again.', 'error');
      }
      this.isSubmitting.set(false);
    }, 1500);
  }

  goBackToSignin(): void {
    this.router.navigate(['/signin']);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
