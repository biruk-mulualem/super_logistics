import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  canActivate(): boolean {
    // ✅ Only use localStorage if in browser
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) {
        return true; // logged in
      }
    }

    // ❌ Not logged in → redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
