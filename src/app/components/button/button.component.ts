import {
  Component,
  input,
  output,
  TemplateRef,
  ContentChild,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

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
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  customClass = input<string>('');
  size = input<ButtonSize>('md');
  shape = input<'default' | 'circle'>('default');

  text = input<string>('');
  textAlign = input<TextAlign>('center');

  iconSrc = input<string>('');
  iconPosition = input<IconPosition>('left');
  iconClass = input<string>('w-5 h-5');

  secondaryIconSrc = input<string>('');
  secondaryIconClass = input<string>('w-5 h-5');

  loadingIconSrc = input<string>('');
  loadingIconClass = input<string>('w-5 h-5 animate-spin');

  badge = input<string | number>('');
  badgeClass = input<string>(
    'absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center'
  );

  clicked = output<Event>();

  @ContentChild('customContent') customContent?: TemplateRef<any>;

  baseClasses = computed(() => {
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm',
      md: 'px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm',
      lg: 'px-4 py-2 text-sm md:px-6 md:py-3 md:text-base',
      xl: 'px-6 py-3 text-base md:px-8 md:py-4 md:text-lg',
    };

    const textAlignClasses = {
      left: 'text-left justify-start',
      center: 'text-center justify-center',
      right: 'text-right justify-end',
    };

    const baseClass =
      'inline-flex items-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative';

    const shapeClass =
      this.shape() === 'circle'
        ? 'rounded-full w-8 h-8 justify-center items-center p-0'
        : 'rounded-lg ' + sizeClasses[this.size()];

    return `${baseClass} ${shapeClass} ${
      textAlignClasses[this.textAlign()]
    } ${this.customClass()}`;
  });

  shouldShowText = computed(() => !!this.text() && !this.loading());
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
    if (!this.shouldShowText()) return '';

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

  onClick(event: Event): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
