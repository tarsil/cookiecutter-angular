import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private toast: ToastrService) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
    this.toast.info("Your session has expired. Please login again", "Information")
  }

  /**
   * Verifies if user is logged in and if the token is refreshable.
   * @returns boolean
   */
  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.authService.refreshToken();
      return true;

    } else if (this.authService.isRefreshable()){
      this.authService.refreshToken();
      return true
    }
    else {
      this.logout()
      return false;
    }
  }
}
