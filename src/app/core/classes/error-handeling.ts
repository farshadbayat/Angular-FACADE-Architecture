import { HttpErrorResponse } from '@angular/common/http';
import { Toaster } from '@core/modules/toast-notification';
import { ServiceLocator } from '@core/services/locator.service';
import { Observable, throwError } from 'rxjs';

export function ErrorHandeling(
  error: HttpErrorResponse | any
): Observable<never> {
  const { status } = error;
  const toaster = ServiceLocator.injector.get(Toaster);
  if (error.error instanceof ErrorEvent) {
    // Get client-side error
    toaster.open({
      type: 'danger',
      caption: 'Client Exception',
      text: error.error.message,
    });
  } else {
    // Get server-side error
    switch (status) {
      case 404: {
        toaster.open({
          type: 'danger',
          caption: 'Not Found',
          text: 'Error Code: 404',
        });
        break;
      }
      case 401: {
        toaster.open({
          type: 'danger',
          caption: 'Unathorize',
          text: 'Error Code: 401',
        });
        break;
      }
      case 403: {
        toaster.open({
          type: 'danger',
          caption: 'Access Denide',
          text: 'Error Code: 403',
        });
        break;
      }
      case 500: {
        toaster.open({
          type: 'danger',
          caption: 'Server Error',
          text: 'Error Code: 500',
        });
        break;
      }
      case 0: {
        toaster.open({
          type: 'warning',
          caption: 'Server Error',
          text: error.message,
        });
        break;
      }
      default:
        toaster.open({
          type: 'danger',
          caption: `Error Code: ${error.status}`,
          text: error.message,
        });
    }
  }

  return throwError(error);
}
