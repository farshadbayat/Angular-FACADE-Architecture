import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError, tap } from 'rxjs/operators';
import { GlobalService } from './global.service';
import { Observable, of, throwError } from 'rxjs';
import { Response } from '@core/models/response.model';
import { ErrorHandeling } from '@core/classes/error-handeling';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ParamsHandler } from '@core/classes/params-handler';

export function ApiRequest(verb: HttpVerb = 'GET', global: boolean = false): RequestBuilder {
  return new RequestBuilder(verb, global);
}

export declare type HttpVerb = 'GET' | 'POST' | 'DELETE' | 'PUT';
export declare type CachMode = 'none' | 'memory' | 'localstorage';
export declare type ModuleName = 'System' | 'FileStream' | 'BIS' | 'Avl' | string;
export declare type ContentType = 'application/json' | 'text/plain' | 'application/octet-stream' | string;


export class RequestBuilder {
  private static globalRequestID = 0;
  private moduleName: ModuleName = 'BIS';
  private version: string = 'v1';
  private controllerName: string = '';
  private actionName: string = '';
  private urlParameters: ParamsHandler;
  private bodyParameters: ParamsHandler;
  private formData: FormData | null = null;
  private headerParameters: ParamsHandler | null = null;
  private requestID: number;
  private baseURL: string | null = null;
  private cachMode: CachMode = 'none';
  private loading: boolean;
  private messageShow: boolean;
  private ignoreNullParam: boolean;
  private contentType: ContentType = 'application/json';

  constructor(private verb: HttpVerb = 'GET', public global: boolean = false) {
    this.requestID = RequestBuilder.globalRequestID++;
    this.bodyParameters = new ParamsHandler();
    this.urlParameters = new ParamsHandler();
    this.messageShow = true;
    this.loading = true;
    this.ignoreNullParam = true;
  }

  get getRequestID() {
    return this.requestID;
  }

  public get(): RequestBuilder {
    this.verb = 'GET';
    return this;
  }

  public post(): RequestBuilder {
    this.verb = 'POST';
    return this;
  }

  public delete(): RequestBuilder {
    this.verb = 'DELETE';
    return this;
  }

  public put(): RequestBuilder {
    this.verb = 'PUT';
    return this;
  }

  public setBaseURL(baseURL: string | null) {
    this.baseURL = baseURL;
    return this;
  }

  public setModuleName(name: ModuleName) {
    this.moduleName = name;
    return this;
  }

  public setVersion(name: string) {
    this.version = name;
    return this;
  }

  public setContentType(conteType: ModuleName) {
    this.contentType = conteType;
    return this;
  }

  public showLoading(show: boolean = true) {
    this.loading = show;
    return this;
  }

  public showMessage(show: boolean = true) {
    this.messageShow = show;
    return this;
  }

  public setMode(cachMode: CachMode) {
    this.cachMode = cachMode;
  }

  public setController( controllerName: string ): RequestBuilder {
    this.controllerName = controllerName;
    return this;
  }

  public setAction(actionName: string): RequestBuilder {
    this.actionName = actionName;
    return this;
  }

  public setBody(data: ParamsHandler): RequestBuilder {
    this.bodyParameters = data;
    return this;
  }

  public addBody(key: any, value: any): RequestBuilder {
    if(this.bodyParameters === null || this.bodyParameters === undefined) {
      this.bodyParameters = new ParamsHandler();
    }
    this.bodyParameters.addParam(key, value);
    return this;
  }

  public removeBody(key: any): RequestBuilder {
    if(this.bodyParameters === null || this.bodyParameters === undefined) {
      this.bodyParameters = new ParamsHandler();
    }
    this.bodyParameters.removeParam(key);
    return this;
  }

  public setParam(param: ParamsHandler): RequestBuilder {
    this.urlParameters = param;
    return this;
  }

  public addParam(key: any, value: any): RequestBuilder {
    if(this.urlParameters === null || this.urlParameters === undefined) {
      this.urlParameters = new ParamsHandler();
    }
    this.urlParameters.addParam(key, value);
    return this;
  }

  public removeParam(key: any): RequestBuilder {
    if(this.bodyParameters === null || this.bodyParameters === undefined) {
      this.bodyParameters = new ParamsHandler();
    }
    this.bodyParameters.removeParam(key);
    return this;
  }

  public addFormData(key: string, value: string | Blob) {
    if (this.formData === null) {
      this.formData = new FormData();
    }
    this.formData.append(key, value);
    return this;
  }

  public setFormData(key: string, value: string | Blob) {
    if (this.formData === null) {
      this.formData = new FormData();
    }
    this.formData.set(key, value);
    return this;
  }

  public removeFormData(key: string) {
    if (this.formData !== null) {
      this.formData.delete(key);
    }
    return this;
  }

  public setHeader(param: ParamsHandler): RequestBuilder {
    this.headerParameters = param;
    return this;
  }

  public addHeader(key: any, value: any): RequestBuilder {
    if(this.headerParameters === null || this.headerParameters === undefined) {
      this.headerParameters = new ParamsHandler();
    }
    this.headerParameters.addParam(key, value);
    return this;
  }

  public setIgnoreNull(ignore: boolean) {
    this.ignoreNullParam = ignore;
    return this;
  }

  public getUrl(): string {
    let url = this.baseURL || environment.BASE_ENDPOINT;
    if (environment.API_NAME) {
      url += environment.API_NAME + '/';
    }
    if (this.version) {
      url += this.version + '/';
    }
    if (this.moduleName) {
      url += this.moduleName + '/';
    }
    if (this.controllerName && this.controllerName.toString() !== '') {
      url += this.controllerName + '/';
    }
    if (this.actionName && this.actionName.toString() !== '') {
      url += this.actionName + '/';
    }
    return url.substring(url.length - 1) === '/' ? url.substring(0,url.length - 1) : url;
  }

  public call(globalService: GlobalService): Observable<Response<any>> {
    const hasParam = this.urlParameters !== undefined && this.urlParameters.count() > 0;
    const urlWithParams = this.getUrl() + ( hasParam ? '?' + this.urlParameters.urlParamaters(this.ignoreNullParam) : '');
    // const token = globalService.token;
    let headerItems = {'Content-Type':  this.contentType || 'application/json', 'charset' : 'UTF-8'};
    //let hdrs = new HttpHeaders({'Content-Type':  this.contentType || 'application/json', 'charset' : 'UTF-8', ...this.headerParameters?.toJson()});        // , 'Authorization': 'Bearer kjlkljkl'
    if(globalService.currentUser !== null) {
      headerItems = { ...headerItems, ...{'Authorization': 'Bearer ' + globalService.currentUser.Token} };
    }
    if(this.headerParameters != null) {
      headerItems = { ...headerItems, ...this.headerParameters };
    }
    const headers = new HttpHeaders(headerItems);

    if (this.loading) {
      globalService.startLoading();
    }

    if (this.verb === 'GET') {
      return globalService.http
        .get<Response<any>>(urlWithParams, { headers: headers })
        .pipe(
          map(this.handlePipeMap),
          catchError(error => {
            return this.ErrorHandeling(error, globalService);
          }),
          tap((resp) => this.messageHandling(this, resp, globalService)));
    } else if (this.verb === 'POST') {
      const data = this.formData || this.bodyParameters.toJson();
      const postHeader = this.headerParameters?.toJson() || { headers: headers};
      return globalService.http
        .post<Response<any>>(urlWithParams, data, postHeader)
        .pipe(
          map(this.handlePipeMap),
          catchError(error => {
            return this.ErrorHandeling(error, globalService);
          }),
          tap((resp) => this.messageHandling(this, resp, globalService)));
    } else if (this.verb === 'PUT') {
      const data = this.formData || this.bodyParameters.toJson();
      return globalService.http
        .put<Response<any>>(urlWithParams, data, { headers: headers })
        .pipe(
          map(this.handlePipeMap),
          catchError(error => {
            return this.ErrorHandeling(error, globalService);
          }),
          tap((resp) => this.messageHandling(this, resp, globalService)));
    } else if (this.verb === 'DELETE') {
      return globalService.http
        .delete<Response<any>>(urlWithParams, { headers: headers })
        .pipe(
          map(this.handlePipeMap),
          catchError(error => {
            return this.ErrorHandeling(error, globalService);
          }),
          tap((resp) => this.messageHandling(this, resp, globalService)));
    } else {
      return of();
    }
  }

  private messageHandling(parent: RequestBuilder, resp: Response<any>, globalService: GlobalService) {

    if (parent.loading === true) {
      globalService.finishLoading();
    }
    if (parent.messageShow && resp.Messages) {
      resp.Messages.forEach((data: string) => {
        globalService.toaster.open({
          type: resp.Success ? 'success' : 'danger',
          duration: 3000,
          caption: '',
          text: data.trim()
        });
      });
    }
  }

  private handlePipeMap(resp: Response<any>): Response<any> {

    if (resp?.Success === false) {
      throw { message: resp.Messages.join(',').toString(), status: 0};
    } else {
      return resp;
    }
  }

  ErrorHandeling(error: HttpErrorResponse, globalService: GlobalService) {
    console.log(error);

    if (this.loading === true) {
      globalService.finishLoading();
    }
    const { status } = error ;
    const toaster = globalService.toaster; // ServiceLocator.injector.get(Toaster);
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      toaster.open({ type: 'light', caption: 'پیام سمت مشتری', text: error.error.message });
    } else if (error?.error?.Messages !== undefined) {
      // Get Server-side error
      toaster.open({ type: 'danger', caption: 'پیام سمت سرور', text: error.error.Messages });
    }else {
      // Get server-side error
      const detailError = this.parseException(error);
      switch (status) {
        case 401: {
          toaster.open({ type: 'danger', caption: 'غیرمجاز', text: 'کد خطا: 401' + detailError });
          globalService.router.navigate(['logout']);
          break;
        }
        case 403: {
          toaster.open({ type: 'danger', caption: 'Access Denide', text: 'کد خطا: 403' + detailError});
          break;
        }
        case 404: {
          toaster.open({ type: 'danger', caption: 'صفحه یافت نشد', text: 'کد خطا: 404' + detailError});
          break;
        }
        case 500: {
          toaster.open({ type: 'danger', caption: 'خطای سرور', text: 'کد خطا: 500' + detailError});
          break;
        }
        case 0: {
          toaster.open({ type: 'warning', caption: 'پیام سرور', text: error.message });
          break;
        }
        default:
          toaster.open({ type: 'danger', caption: `کد خطا: ${error.status}`, text: error.message + detailError});
      }
    }

    return throwError(error);
  }

  private parseException(error: HttpErrorResponse) : string
  {
    const errors = [];
    if (typeof error == 'object' && error?.error?.title !== undefined) {
      errors.push(error.error.title);
    }
    if (typeof error == 'object' && error?.error?.errors && error?.error?.errors['$.Gender'] !== undefined) {
      error.error.errors['$.Gender'].forEach((err: any) => {
        errors.push(err);
      });
    }
    return errors.join(' - ');
  }
}
