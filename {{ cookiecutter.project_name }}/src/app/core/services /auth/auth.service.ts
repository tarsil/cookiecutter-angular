import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { JWTPayload } from '@app/core/interfaces/common';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private is_token_valid: boolean = false;
  private is_token_refresh_valid: boolean = false;
  readonly TOKEN_NAME: string = 'token';
  readonly REFRESH_TOKEN_NAME: string = 'refresh';

  constructor(private http: HttpClient) { }

  private setSession(authResult) {
    const token = authResult.access;
    const payload = <JWTPayload> jwt_decode(token);
    const expiresAt = moment.unix(payload.exp);
    localStorage.setItem('token', authResult.access);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  private setRefreshSession(authResult) {
    const refresh = authResult.refresh;
    const payload = <JWTPayload> jwt_decode(refresh);
    const expiresAt = moment.unix(payload.exp);
    localStorage.setItem('refresh', authResult.refresh);
    localStorage.setItem('refresh_expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  get token(): string {
    return localStorage.getItem('token');
  }

  get tokenRefresh(): string {
    return localStorage.getItem('refresh');
  }

  login(email: string, password: string) {
    return this.http.post('/auth/api/token', {email: email, password: password})
    .pipe(
      tap(response => this.setSession(response)),
      shareReplay()
    ).pipe(
      tap(response => this.setRefreshSession(response))
    )
  }

  refreshToken() {
    return this.http.post('/auth/api/token/refresh', { refresh: this.tokenRefresh }
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


  // private is_token_valid: boolean = false;
  // private is_token_refresh_valid: boolean = false;
  // readonly TOKEN_NAME: string = 'token';
  // readonly REFRESH_TOKEN_NAME: string = 'refresh';

  // private setTokenValid(result){
  //   if(Object.keys(result).length === 0){
  //     this.is_token_valid = true;
  //   } else {
  //     this.is_token_valid = false;
  //   }
  // }

  // private setTokenRefreshValid(result){
  //   if(Object.keys(result).length === 0){
  //     this.is_token_refresh_valid = true;
  //   } else {
  //     this.is_token_refresh_valid = false;
  //   }
  // }

  // verifyToken() {
  //   const token: string = localStorage.getItem('token');
  //   return this.http.post('/auth/api/token/verify', { token: token })
  //   .pipe(
  //     tap(response => this.setTokenValid(response)),
  //     shareReplay()
  //   ).subscribe();
  // }

  // verifyRefreshToken() {
  //   const refresh: string = localStorage.getItem('refresh');
  //   return this.http.post('/auth/api/token/verify', { token: refresh })
  //   .pipe(
  //     tap(response => this.setTokenRefreshValid(response)),
  //     shareReplay()
  //   ).subscribe();
  // }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getRefreshExpiration() {
    const expiration = localStorage.getItem('refresh_expires_at');
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

  // isTokenValid() {
  //   debugger;
  //  if(!this.is_token_valid) {
  //    this.verifyToken();
  //  }

  //  return this.is_token_valid;
  // }

  // isTokenRefreshValid() {
  //   if(!this.is_token_refresh_valid) {
  //     this.verifyRefreshToken();
  //   }

  //   return this.is_token_refresh_valid;
  // }

  getToken(tokenName): string {
    return localStorage.getItem(tokenName);
  }

}
