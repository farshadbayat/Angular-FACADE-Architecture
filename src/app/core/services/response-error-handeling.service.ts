import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root',
})
export class ResponseErrorHandelingService implements HttpInterceptor {
  constructor(private readonly clientService: ClientService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if (!window.navigator.onLine) {
    //   this.clientService.userLogout(true);
    //   return EMPTY;
    // }
    console.log(req.headers);

    return next.handle(req).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 403) {
          this.clientService.userLogout(true);
          return EMPTY;
        }
        return throwError(err);
      })
    );
  }
}
