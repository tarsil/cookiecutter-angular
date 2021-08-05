import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  redirect() {
    this.router.navigate(['home']);
  }

  /**
   * Verifies if user is logged in and if the token is refreshable.
   * @returns boolean
   */
  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['home']);
      return false;
    } else {
      this.authService.logout();
      return true;
    }
  }
}
