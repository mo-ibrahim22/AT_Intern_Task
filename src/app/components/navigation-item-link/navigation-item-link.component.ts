import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation-item-link',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation-item-link.component.html',
  styleUrl: './navigation-item-link.component.css',
})
export class NavigationItemLinkComponent {
  // Navigation properties
  routerLink = input<string>('');
  text = input<string>('');
  iconSrc = input<string>('');

  // Style variants
  variant = input<'navbar' | 'sidebar'>('sidebar');
  fullWidth = input<boolean>(false);

  // Custom styling
  customClass = input<string>('');

  // Additional custom class for specific styling needs
  additionalClass = input<string>('');

  // Badge/counter
  badge = input<string | number>('');

  // Events
  clicked = output<void>();

  onClick(): void {
    this.clicked.emit();
  }

  get linkClasses(): string {
    const classes = ['btn', 'btn-ghost'];

    // Size based on variant
    if (this.variant() === 'navbar') {
      classes.push('btn-sm');
    } else {
      classes.push('btn-lg');
    }

    if (this.fullWidth()) {
      classes.push('btn-full-width');
    }

    if (this.customClass()) {
      classes.push(this.customClass());
    }

    if (this.additionalClass()) {
      classes.push(this.additionalClass());
    }

    return classes.join(' ');
  }

  get activeClasses(): string {
    return '!bg-primary-100 !text-primary-800 font-semibold';
  }

  get shouldShowIcon(): boolean {
    return !!this.iconSrc();
  }

  get shouldShowBadge(): boolean {
    return !!this.badge();
  }
}
