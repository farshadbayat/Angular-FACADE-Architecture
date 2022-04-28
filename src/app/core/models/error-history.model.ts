import { HttpErrorResponse } from '@angular/common/http';
import { RequestBuilder } from '../classes/request-builder';

export interface IErrorHistory {
  request: RequestBuilder;
  error?: HttpErrorResponse | string;
}
