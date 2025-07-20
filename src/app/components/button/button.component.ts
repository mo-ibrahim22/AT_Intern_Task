import {
  Component,
  input,
  output,
  TemplateRef,
  ContentChild,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonVariant,
  ButtonSize,
  IconPosition,
} from '../../common/models/button.model';

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
  fullWidth = input<boolean>(false);

  // Custom styling
  customClass = input<string>('');

  // Text properties
  text = input<string>('');

  // Icon properties
  iconSrc = input<string>('');
  iconPosition = input<IconPosition>('left');
  iconOnly = input<boolean>(false);

  // Secondary icon (for between layout)
  secondaryIconSrc = input<string>('');

  // Loading state
  loadingText = input<string>('Loading...');

  // Badge/counter
  badge = input<string | number>('');

  // Events
  clicked = output<Event>();

  @ContentChild('customContent') customContent?: TemplateRef<any>;

  // Computed display logic
  shouldShowText = computed(
    () =>
      !this.iconOnly() &&
      (this.text() || (this.loading() && this.loadingText()))
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

  displayText = computed(() => {
    if (this.loading() && this.loadingText()) {
      return this.loadingText();
    }
    return this.text();
  });

  // CSS classes computed
  buttonClasses = computed(() => {
    const classes = ['btn', `btn-${this.variant()}`, `btn-${this.size()}`];

    if (this.fullWidth()) classes.push('btn-full-width');
    if (this.iconOnly()) classes.push('btn-icon-only');
    if (this.loading()) classes.push('btn-loading');
    if (this.disabled()) classes.push('btn-disabled');
    if (this.customClass()) classes.push(this.customClass());

    return classes.join(' ');
  });

  onClick(event: Event): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
