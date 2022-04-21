import { Injectable, ErrorHandler } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ClientService } from './client.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
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
    private globalService: ClientService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.globalService.token) {
      return true;
    }

    this.router.navigate([environment.LOGIN_ROUTE], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
