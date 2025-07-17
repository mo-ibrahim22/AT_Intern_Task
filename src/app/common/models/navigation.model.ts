export interface NavItem {
  name: string;
  path: string;
  icon?: string; // Optional icon class
  children?: NavItem[]; // For dropdown menus
}
