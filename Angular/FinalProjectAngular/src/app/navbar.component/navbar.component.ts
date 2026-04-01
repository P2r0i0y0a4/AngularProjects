import { Component, computed, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  menuOpen = false;

  navLinks = [
    { path: '/dashboard', icon: '🗺️', label: 'My Trips' },
    { path: '/planner', icon: '✈️', label: 'Plan' },
    { path: '/weather', icon: '🌤', label: 'Weather' },
    { path: '/compare', icon: '⚖️', label: 'Compare' },
  ];

  isAuth = computed(() => this.auth.isLoggedIn());
  userName = computed(() => this.auth.currentUser()?.name || '');
  userEmail = computed(() => this.auth.currentUser()?.email || '');
  userInitial = computed(() => (this.auth.currentUser()?.name || 'U').charAt(0).toUpperCase());

  constructor(private auth: AuthService, private router: Router) {}

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  logout() {
    this.auth.logout();
    this.menuOpen = false;
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    const t = e.target as HTMLElement;
    if (!t.closest('.relative')) this.menuOpen = false;
  }
}