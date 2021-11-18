import { Injectable, ErrorHandler } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './global.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, HttpInterceptor {

  intercept( req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      })
    );
  }

  constructor(
    private router: Router,
    public errorHandler: ErrorHandler,
    private globalService: GlobalService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if ( this.globalService.token ) {
      return true;
    }

    this.router.navigate([ environment.loginRoute], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
