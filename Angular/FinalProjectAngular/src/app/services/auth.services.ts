import { Injectable, signal } from '@angular/core';
import { User } from '../models/trip.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'wp_users';
  private readonly SESSION_KEY = 'wp_session';

  currentUser = signal<User | null>(null);
  isLoggedIn = signal<boolean>(false);

  constructor() {
    const session = localStorage.getItem(this.SESSION_KEY);
    if (session) {
      const user = JSON.parse(session);
      this.currentUser.set(user);
      this.isLoggedIn.set(true);
    }
  }

  getUsers(): User[] {
    const raw = localStorage.getItem(this.USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  signup(name: string, email: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email already registered.' };
    }
    const user: User = {
      id: 'u' + Date.now(),
      name, email, password,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Account created! Please log in.' };
  }

  login(email: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }
    this.currentUser.set(user);
    this.isLoggedIn.set(true);
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    return { success: true, message: 'Welcome back!' };
  }

  logout() {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    localStorage.removeItem(this.SESSION_KEY);
  }
}