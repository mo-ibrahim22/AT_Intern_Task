import { Component, inject, signal } from '@angular/core';
import { ToasterService } from '../../common/services/toaster.service';
import { ConfirmationService } from '../../common/services/confirmation.service';
import { RouterModule } from '@angular/router';
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

  // Sidebar states
  isMobileSidebarOpen = signal(false);
  isDesktopSidebarCollapsed = signal(false);

  navItems = signal<NavItem[]>([
    { name: 'Home', path: '/', icon: 'home' },
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

  // Add this method to your LayoutComponent class
  getIconPath(iconName?: string): string {
    const icons: Record<string, string> = {
      home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      'shopping-bag': 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      package:
        'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    };
    return icons[iconName || 'home'] || icons['home'];
  }
}
