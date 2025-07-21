import {
  Component,
  inject,
  signal,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { ToasterService } from '../../common/services/toaster.service';
import { ConfirmationService } from '../../common/services/confirmation.service';
import { AuthService } from '../../common/services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavItem } from '../../common/models/navigation.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ToasterComponent } from '../../components/toaster/toaster.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-layout',
  imports: [
    RouterModule,
    CommonModule,
    NavbarComponent,
    SidebarComponent,
    ToasterComponent,
    ConfirmationModalComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  @ViewChild('logoutConfirmTemplate', { static: true })
  logoutConfirmTemplate!: TemplateRef<any>;

  toaster = inject(ToasterService);
  confirmation = inject(ConfirmationService);
  authService = inject(AuthService);
  router = inject(Router);

  // Sidebar states
  isMobileSidebarOpen = signal(false);
  isDesktopSidebarCollapsed = signal(false);

  navItems = signal<NavItem[]>([
    { name: 'Home', path: '/home', icon: 'home' },
    { name: 'Products', path: '/products', icon: 'shopping-bag' },
    { name: 'Orders', path: '/orders', icon: 'package' },
    { name: 'Account', path: '/account', icon: 'user' },
    { name: 'Cart', path: '/cart', icon: 'cart' },
  ]);

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen.update((open) => !open);
  }

  toggleDesktopSidebar(): void {
    this.isDesktopSidebarCollapsed.update((collapsed) => !collapsed);
  }

  logout(): void {
    const userData = {
      name: this.authService.user()?.name,
      email: this.authService.user()?.email,
    };

    this.confirmation.confirmWithTemplate(
      'Confirm Logout',
      this.logoutConfirmTemplate,
      (confirmed: boolean) => {
        if (confirmed) {
          this.authService.logout();
          this.toaster.show('Successfully logged out', 'success');
          this.router.navigate(['/signin']);
        }
      },
      {
        confirmText: 'Logout',
        cancelText: 'Stay Logged In',
        data: userData,
      }
    );
  }

  onToasterDismiss(id: number): void {
    this.toaster.dismiss(id);
  }

  onConfirmationResponse(confirmed: boolean): void {
    this.confirmation.handleResponse(confirmed);
  }
}
