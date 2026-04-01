import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  tripsCount: number;
  countriesVisited: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'wanderplan_user';
  private readonly USERS_KEY = 'wanderplan_users';

  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private router: Router) {
    this.loadSession();
  }

  private loadSession(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      }
    } catch {}
  }

  private getUsers(): any[] {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    } catch { return []; }
  }

  private saveUsers(users: any[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  signup(name: string, email: string, password: string): { success: boolean; error?: string } {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    const user: User = {
      id: Date.now().toString(),
      name,
      email,
      joinDate: new Date().toISOString(),
      tripsCount: 0,
      countriesVisited: 0,
    };
    users.push({ ...user, password });
    this.saveUsers(users);
    this.setSession(user);
    return { success: true };
  }

  login(email: string, password: string): { success: boolean; error?: string } {
    const users = this.getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: 'Invalid email or password' };
    }
    const { password: _, ...user } = found;
    this.setSession(user);
    return { success: true };
  }

  private setSession(user: User): void {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  updateUser(updates: Partial<User>): void {
    const current = this.currentUser();
    if (!current) return;
    const updated = { ...current, ...updates };
    this.currentUser.set(updated);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      this.saveUsers(users);
    }
  }
}
