import {
  Component,
  input,
  output,
  TemplateRef,
  ContentChild,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconPosition = 'left' | 'right' | 'center' | 'between';
export type TextAlign = 'left' | 'center' | 'right';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  // Basic button properties
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  shape = input<'default' | 'circle' | 'rounded'>('default');
  fullWidth = input<boolean>(false);

  // Custom styling
  customClass = input<string>('');

  // Text properties
  text = input<string>('');
  textAlign = input<TextAlign>('center');

  // Icon properties
  iconSrc = input<string>('');
  iconPosition = input<IconPosition>('left');
  iconClass = input<string>('w-5 h-5');
  iconOnly = input<boolean>(false);

  // Secondary icon (for between layout)
  secondaryIconSrc = input<string>('');
  secondaryIconClass = input<string>('w-5 h-5');

  // Loading state
  loadingIconSrc = input<string>('');
  loadingIconClass = input<string>('w-5 h-5 animate-spin');
  loadingText = input<string>('Loading...');

  // Badge/counter
  badge = input<string | number>('');
  badgeClass = input<string>(
    'absolute -top-1 -right-1 bg-danger-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center'
  );

  // Events
  clicked = output<Event>();

  @ContentChild('customContent') customContent?: TemplateRef<any>;

  // Computed styles
  baseClasses = computed(() => {
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm',
      md: 'px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm',
      lg: 'px-4 py-2 text-sm md:px-6 md:py-3 md:text-base',
      xl: 'px-6 py-3 text-base md:px-8 md:py-4 md:text-lg',
    };

    const variantClasses = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 border-transparent',
      secondary:
        'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 border-transparent',
      success:
        'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 border-transparent',
      danger:
        'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500 border-transparent',
      warning:
        'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500 border-transparent',
      info: 'bg-info-500 text-white hover:bg-info-600 focus:ring-info-500 border-transparent',
      outline:
        'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
      ghost:
        'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-500 border-transparent',
      link: 'bg-transparent text-primary-600 hover:text-primary-700 underline focus:ring-primary-500 border-transparent p-0',
    };

    const textAlignClasses = {
      left: 'text-left justify-start',
      center: 'text-center justify-center',
      right: 'text-right justify-end',
    };

    const shapeClasses = {
      default: 'rounded-lg',
      circle: 'rounded-full',
      rounded: 'rounded-xl',
    };

    const baseClass = `
      inline-flex items-center font-medium transition-all duration-200 
      disabled:opacity-50 disabled:cursor-not-allowed relative border
      focus:outline-none focus:ring-2 focus:ring-offset-2
    `
      .replace(/\s+/g, ' ')
      .trim();

    const sizeClass =
      this.iconOnly() && this.shape() === 'circle'
        ? 'w-8 h-8 p-0 justify-center items-center'
        : sizeClasses[this.size()];

    const widthClass = this.fullWidth() ? 'w-full' : '';

    return `${baseClass} ${sizeClass} ${variantClasses[this.variant()]} ${
      shapeClasses[this.shape()]
    } ${
      textAlignClasses[this.textAlign()]
    } ${widthClass} ${this.customClass()}`;
  });

  // Computed display logic
  shouldShowText = computed(
    () =>
      !this.iconOnly() &&
      (this.loading() ? !!this.loadingText() : !!this.text())
  );
  shouldShowIcon = computed(() => !!this.iconSrc() && !this.loading());
  shouldShowSecondaryIcon = computed(
    () =>
      !!this.secondaryIconSrc() &&
      this.iconPosition() === 'between' &&
      !this.loading()
  );
  shouldShowBadge = computed(() => !!this.badge());
  shouldShowLoading = computed(() => this.loading());

  iconGap = computed(() => {
    if (this.iconOnly() || !this.shouldShowText()) return '';

    switch (this.iconPosition()) {
      case 'left':
        return 'gap-1 md:gap-2';
      case 'right':
        return 'gap-1 md:gap-2 flex-row-reverse';
      case 'between':
        return 'gap-1 md:gap-2';
      case 'center':
        return '';
      default:
        return 'gap-1 md:gap-2';
    }
  });

  displayText = computed(() => {
    if (this.loading() && this.loadingText()) {
      return this.loadingText();
    }
    return this.text();
  });

  onClick(event: Event): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
