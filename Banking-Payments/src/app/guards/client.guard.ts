import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class clientGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated() && this.isClient()) {
      return true;
    }
  
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  private isClient(): boolean {
    const role = localStorage.getItem('role');
    return role === '3';
  }
};
