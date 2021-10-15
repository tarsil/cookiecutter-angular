import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { JWTPayload } from '@app/core/interfaces/common';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly baseURL: string = environment.apiUrl;
  readonly TOKEN_NAME: string = 'token';
  readonly REFRESH_TOKEN_NAME: string = 'refresh';

  constructor(private http: HttpClient) { }

  private setSession(authResult: any) {
    const token = authResult.access;
    const payload = <JWTPayload> jwt_decode(token);
    const expiresAt = moment.unix(payload.exp);
    localStorage.setItem('token', authResult.access);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  private setRefreshSession(authResult: any) {
    const refresh = authResult.refresh;
    const payload = <JWTPayload> jwt_decode(refresh);
    const expiresAt = moment.unix(payload.exp);
    localStorage.setItem('refresh', authResult.refresh);
    localStorage.setItem('refresh_expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get tokenRefresh(): string | null {
    return localStorage.getItem('refresh');
  }

  login(email: string, password: string) {
    return this.http.post(`${this.baseURL}/auth/api/token`, {email: email, password: password})
    .pipe(
      tap(response => this.setSession(response)),
      shareReplay()
    ).pipe(
      tap(response => this.setRefreshSession(response))
    )
  }

  refreshToken() {
    return this.http.post(`${this.baseURL}/auth/api/token/refresh`, { refresh: this.tokenRefresh }
    ).pipe(
      tap(response => this.setSession(response)),
      shareReplay(),
    )
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('refresh_expires_at');
  }

  getExpiration() {
    const expiration: any = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getRefreshExpiration() {
    const expiration: any = localStorage.getItem('refresh_expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  /**
   * Validates if the session is still refreshable to continue, else logout
   * @returns boolean
   */
  isRefreshable(){
    return moment().isBefore(this.getRefreshExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getToken(tokenName: string): string | null {
    return localStorage.getItem(tokenName);
  }

}
