import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service'
import { catchError, switchMap, filter, take } from 'rxjs/operators'

import { Observable, pipe, throwError, BehaviorSubject } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isLoggedIn = this.authService.isLoggedIn();
    const token = this.authService.getToken(this.authService.TOKEN_NAME);

    if(isLoggedIn){
      request = request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(catchError(error => {
      const isRefreshable = this.authService.isRefreshable();
      if ( error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)
        && request.url === `${environment.apis.v1}/auth/token/refresh`) {
        this.authService.logout();
        return throwError(error);
      }
      else if (error instanceof HttpErrorResponse && error.status === 403) {
          return this.handle403or401RefreshError(request, next);
      } else if (error instanceof HttpErrorResponse && error.status === 401 && isRefreshable) {
          return this.handle403or401RefreshError(request, next);
      } else {
          return throwError(error);
      }
    }));
  }

  private handle403or401RefreshError(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.access);
          return next.handle(this.addToken(request, token.access));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer  ${token}`
      }
    });
  }
}
