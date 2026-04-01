import { Component, inject, signal, HostListener } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="animated-bg"></div>
    @if (auth.isAuthenticated()) {
      <div class="flex h-screen overflow-hidden relative z-10">
        <!-- Sidebar -->
        <aside class="sidebar w-64 flex-shrink-0 flex flex-col h-full transition-all duration-300"
               [class.hidden]="mobileMenuOpen() === false && isMobile()"
               [class.fixed]="isMobile()"
               [class.inset-0]="isMobile() && mobileMenuOpen()">

          <!-- Logo -->
          <div class="p-6 border-b border-white/5">
            <a routerLink="/dashboard" class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-lg">✈️</div>
              <span class="font-display font-bold text-xl text-white">WanderPlan</span>
            </a>
          </div>

          <!-- Nav Items -->
          <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
            <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider px-4 mb-3">Menu</p>
            @for (item of navItems; track item.path) {
              <a [routerLink]="item.path" routerLinkActive="active" class="nav-item"
                 (click)="closeMobile()">
                <span class="text-lg">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
                @if (item.badge) {
                  <span class="ml-auto badge badge-primary text-xs">{{ item.badge }}</span>
                }
              </a>
            }
          </nav>

          <!-- User Section -->
          <div class="p-4 border-t border-white/5">
            <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                 (click)="router.navigate(['/profile'])">
              <div class="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-white">
                {{ getUserInitials() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-white truncate">{{ auth.currentUser()?.name }}</p>
                <p class="text-xs text-slate-500 truncate">{{ auth.currentUser()?.email }}</p>
              </div>
              <button (click)="$event.stopPropagation(); auth.logout()"
                      class="text-slate-500 hover:text-red-400 transition-colors p-1 rounded"
                      title="Logout">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        <!-- Mobile overlay -->
        @if (isMobile() && mobileMenuOpen()) {
          <div class="fixed inset-0 bg-black/60 z-40" (click)="closeMobile()"></div>
        }

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Top bar (mobile) -->
          @if (isMobile()) {
            <div class="flex items-center justify-between px-4 py-3 border-b border-white/5 glass">
              <button (click)="toggleMenu()" class="p-2 text-slate-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
              <span class="font-display font-bold text-lg gradient-text">WanderPlan</span>
              <div class="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold">
                {{ getUserInitials() }}
              </div>
            </div>
          }

          <main class="flex-1 overflow-y-auto">
            <router-outlet />
          </main>
        </div>
      </div>
    } @else {
      <router-outlet />
    }
  `
})
export class AppComponent {
  auth = inject(AuthService);
  router = inject(Router);
  mobileMenuOpen = signal(false);
  isMobile = signal(false);

  navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/trips', icon: '🗺️', label: 'Trip Planner' },
    { path: '/timeline', icon: '📅', label: 'Timeline' },
    { path: '/budget', icon: '💰', label: 'Budget' },
    { path: '/packing', icon: '🧳', label: 'Packing List' },
    { path: '/weather', icon: '🌤️', label: 'Weather' },
    { path: '/compare', icon: '⚖️', label: 'Compare Trips' },
    { path: '/explore', icon: '🔭', label: 'Explore' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth < 768);
  }

  constructor() {
    this.isMobile.set(window.innerWidth < 768);
  }

  toggleMenu() { this.mobileMenuOpen.update(v => !v); }
  closeMobile() { this.mobileMenuOpen.set(false); }

  getUserInitials(): string {
    const name = this.auth.currentUser()?.name || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
