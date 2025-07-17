import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ToasterService } from '../../common/services/toaster.service';
import { ConfirmationService } from '../../common/services/confirmation.service';
import { AuthService } from '../../common/services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavItem } from '../../common/models/navigation.model';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  toaster = inject(ToasterService);
  confirmation = inject(ConfirmationService);
  authService = inject(AuthService);
  router = inject(Router);

  // Template references
  @ViewChild('navbarTemplate', { static: true })
  navbarTemplate!: TemplateRef<any>;
  @ViewChild('sidebarTemplate', { static: true })
  sidebarTemplate!: TemplateRef<any>;
  @ViewChild('toasterTemplate', { static: true })
  toasterTemplate!: TemplateRef<any>;
  @ViewChild('confirmationTemplate', { static: true })
  confirmationTemplate!: TemplateRef<any>;

  // Sidebar states
  isMobileSidebarOpen = signal(false);
  isDesktopSidebarCollapsed = signal(false);

  navItems = signal<NavItem[]>([
    { name: 'Home', path: '/home', icon: 'home' },
    { name: 'Products', path: '/products', icon: 'shopping-bag' },
    { name: 'Orders', path: '/orders', icon: 'package' },
    { name: 'Account', path: '/account', icon: 'user' },
  ]);

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update((open) => !open);
  }

  toggleDesktopSidebar() {
    this.isDesktopSidebarCollapsed.update((collapsed) => !collapsed);
  }

  async logout() {
    const confirmed = await this.confirmation.confirm({
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      this.authService.logout();
      this.toaster.show('Successfully logged out', 'success');
      this.router.navigate(['/signin']);
    }
  }

  // Template getter methods for external access
  getNavbarTemplate(): TemplateRef<any> {
    return this.navbarTemplate;
  }

  getSidebarTemplate(): TemplateRef<any> {
    return this.sidebarTemplate;
  }

  getToasterTemplate(): TemplateRef<any> {
    return this.toasterTemplate;
  }

  getConfirmationTemplate(): TemplateRef<any> {
    return this.confirmationTemplate;
  }
}
