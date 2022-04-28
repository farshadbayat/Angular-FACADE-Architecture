import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ClientService } from '../services/client.service';
import { Observable, of } from 'rxjs';
import { IResponse } from '../models/response.model';
import { ParamsHandler } from '../classes/params-handler';
import { ServiceLocator } from '../services/locator.service';
import { ErrorHandeling } from './error-handeling';
import { IErrorHistory } from '../models/error-history.model';
import { Environment, IEnvironment } from '../models/enviroment.model';

export function Api(
  verb: HttpVerb = 'GET',
  global: boolean = false
): RequestBuilder {
  return new RequestBuilder(verb, global);
}

export declare type HttpVerb = 'GET' | 'POST' | 'DELETE' | 'PUT';
export declare type CachMode = 'none' | 'memory' | 'localstorage';
export declare type ModuleName = 'System' | string;
export declare type ContentType =
  | 'application/json'
  | 'text/plain'
  | 'application/octet-stream'
  | string;
export class RequestBuilder {
  private static _globalRequestID = 0;
  private static _errorHistory: IErrorHistory[] = [];
  private _moduleName: ModuleName | string = '';
  private _apiSignature: string = '';
  private _version: string = 'v1';
  private _controllerName: string = '';
  private _actionName: string = '';
  private _urlParameters: ParamsHandler;
  private _bodyParameters: ParamsHandler;
  private _formData: FormData | null = null;
  private _headerParameters: ParamsHandler | null = null;
  private _requestID: number;
  private _baseURL: string | null = null;
  private _cachMode: CachMode = 'none';
  private _loading: boolean;
  private _messageShow: boolean;
  private _encodeQueryParam: boolean;
  private _ignoreNullParam: boolean;
  private _contentType: ContentType = 'application/json';
  private _bearer: string;
  private readonly _enviroment: IEnvironment;

  constructor(private verb: HttpVerb = 'GET', public global: boolean = false) {
    this._requestID = RequestBuilder._globalRequestID++;
    this._bodyParameters = new ParamsHandler();
    this._urlParameters = new ParamsHandler();
    this._messageShow = true;
    this._loading = true;
    this._ignoreNullParam = true;
    this._enviroment = ServiceLocator.injector.get(Environment);
    this._apiSignature = this._enviroment?.apiSignatureName || '';
    this._bearer = this._enviroment?.bearer || '';
    this._encodeQueryParam = this._enviroment?.encodeQueryParam || true;
  }

  get requestID() {
    return this._requestID;
  }

  get errorHistory(): IErrorHistory[] {
    return RequestBuilder._errorHistory;
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

  public baseURL(baseURL: string | null) {
    this._baseURL = baseURL;
    this._version = '';
    this._apiSignature = '';
    return this;
  }

  public module(name: ModuleName) {
    this._moduleName = name;
    return this;
  }

  public version(name: string) {
    this._version = name;
    return this;
  }

  public contentType(conteType: ModuleName) {
    this._contentType = conteType;
    return this;
  }

  public showLoading(show: boolean = true) {
    this._loading = show;
    return this;
  }

  public showMessage(show: boolean = true) {
    this._messageShow = show;
    return this;
  }

  public cachMode(cachMode: CachMode) {
    this._cachMode = cachMode;
  }

  public controller(controllerName: string): RequestBuilder {
    this._controllerName = controllerName;
    return this;
  }

  public action(actionName: string): RequestBuilder {
    this._actionName = actionName;
    return this;
  }

  public setBody(data: ParamsHandler): RequestBuilder {
    this._bodyParameters = data;
    return this;
  }

  public addBody(key: any, value: any): RequestBuilder {
    if (this._bodyParameters === null || this._bodyParameters === undefined) {
      this._bodyParameters = new ParamsHandler();
    }
    this._bodyParameters.addParam(key, value);
    return this;
  }

  public removeBody(key: any): RequestBuilder {
    if (this._bodyParameters === null || this._bodyParameters === undefined) {
      this._bodyParameters = new ParamsHandler();
    }
    this._bodyParameters.removeParam(key);
    return this;
  }

  public setParam(param: ParamsHandler): RequestBuilder {
    this._urlParameters = param;
    return this;
  }

  public addParam(key: any, value: any): RequestBuilder {
    if (this._urlParameters === null || this._urlParameters === undefined) {
      this._urlParameters = new ParamsHandler();
    }
    this._urlParameters.addParam(key, value);
    return this;
  }

  public removeParam(key: any): RequestBuilder {
    if (this._bodyParameters === null || this._bodyParameters === undefined) {
      this._bodyParameters = new ParamsHandler();
    }
    this._bodyParameters.removeParam(key);
    return this;
  }

  public addFormData(key: string, value: string | Blob) {
    if (this._formData === null) {
      this._formData = new FormData();
    }
    this._formData.append(key, value);
    return this;
  }

  public setFormData(key: string, value: string | Blob) {
    if (this._formData === null) {
      this._formData = new FormData();
    }
    this._formData.set(key, value);
    return this;
  }

  public removeFormData(key: string) {
    if (this._formData !== null) {
      this._formData.delete(key);
    }
    return this;
  }

  public setHeader(param: ParamsHandler): RequestBuilder {
    this._headerParameters = param;
    return this;
  }

  public addHeader(key: any, value: any): RequestBuilder {
    if (
      this._headerParameters === null ||
      this._headerParameters === undefined
    ) {
      this._headerParameters = new ParamsHandler();
    }
    this._headerParameters.addParam(key, value);
    return this;
  }

  public ignoreNull(ignore: boolean) {
    this._ignoreNullParam = ignore;
    return this;
  }

  public getUrl(): string {
    let url = this._baseURL || this._enviroment.baseEndpoint;
    url = url.substring(url.length - 1) === '/' ? url : url + '/';
    let urlPath = this._enviroment?.urlPathSchema;
    urlPath = urlPath.replace(
      '{MODULE_NAME}/',
      this._moduleName ? `${this._moduleName}/` : ''
    );
    urlPath = urlPath.replace(
      '{API_SIGNATURE_NAME}/',
      this._apiSignature ? `${this._apiSignature}/` : ''
    );
    urlPath = urlPath.replace(
      '{API_VERSION}/',
      this._version ? `${this._version}/` : ''
    );
    urlPath = urlPath.replace(
      '{CONTROLLER_NAME}/',
      this._controllerName ? `${this._controllerName}/` : ''
    );
    urlPath = urlPath.replace(
      '{ACTION_NAME}',
      this._actionName ? this._actionName : ''
    );
    return url + urlPath;
  }

  public call(): Observable<IResponse<any>> {
    if (ServiceLocator?.injector === null) {
      throw new Error('Service Locator is not initiation yet.');
    }
    const clientService: ClientService =
      ServiceLocator.injector.get(ClientService);
    const hasParam =
      this._urlParameters !== undefined && this._urlParameters.count() > 0;
    const urlWithParams =
      this.getUrl() +
      (hasParam
        ? '?' +
          this._urlParameters.urlParamaters(
            this._ignoreNullParam,
            this._encodeQueryParam
          )
        : '');
    let headerItems = { 'Content-Type': this._contentType };
    if (clientService.currentUser !== null) {
      headerItems = {
        ...headerItems,
        ...{
          Authorization: `${this._bearer} ${clientService.currentUser.Token}`,
        },
      };
    }
    if (this._headerParameters != null) {
      headerItems = { ...headerItems, ...this._headerParameters.toJson(true) };
    }

    if (this._loading) {
      clientService.startLoading();
    }
    if (this.verb === 'GET') {
      return clientService.http
        .get<IResponse<any>>(urlWithParams, {
          headers: new HttpHeaders(headerItems),
        })
        .pipe(
          map(this.handlePipeMap),
          catchError((error) => this.errorHandling(error, clientService)),
          tap((resp) => this.messageHandling(this, resp, clientService))
        );
    } else if (this.verb === 'POST') {
      const data = this._formData || this._bodyParameters.toJson();
      return clientService.http
        .post<IResponse<any>>(urlWithParams, data, {
          headers: new HttpHeaders(headerItems),
        })
        .pipe(
          map(this.handlePipeMap),
          catchError((error) => this.errorHandling(error, clientService)),
          tap((resp) => this.messageHandling(this, resp, clientService))
        );
    } else if (this.verb === 'PUT') {
      const data = this._formData || this._bodyParameters.toJson();
      return clientService.http
        .put<IResponse<any>>(urlWithParams, data, {
          headers: new HttpHeaders(headerItems),
        })
        .pipe(
          map(this.handlePipeMap),
          catchError((error) => this.errorHandling(error, clientService)),
          tap((resp: IResponse<any>) =>
            this.messageHandling(this, resp, clientService)
          )
        );
    } else if (this.verb === 'DELETE') {
      return clientService.http
        .delete<IResponse<any>>(urlWithParams, {
          headers: new HttpHeaders(headerItems),
        })
        .pipe(
          map(this.handlePipeMap),
          catchError((error) => this.errorHandling(error, clientService)),
          tap((resp: IResponse<any>) =>
            this.messageHandling(this, resp, clientService)
          )
        );
    } else {
      return of();
    }
  }

  private errorHandling(
    error: HttpErrorResponse,
    clientService: ClientService
  ) {
    if (this._enviroment.debug === true) {
      RequestBuilder._errorHistory.push({ request: this, error: error });
    }
    if (this._loading === true) {
      clientService.finishLoading();
    }
    return ErrorHandeling(error);
  }

  private messageHandling(
    parent: RequestBuilder,
    resp: IResponse<any>,
    globalService: ClientService
  ) {
    if (parent._loading === true) {
      globalService.finishLoading();
    }
    if (parent._messageShow && resp.messages) {
      resp.messages.forEach((data: string) => {
        globalService.toaster.open({
          type: resp.success ? 'success' : 'danger',
          duration: 3000,
          caption: '',
          text: data.trim(),
        });
      });
    }
  }

  private handlePipeMap(resp: IResponse<any>): IResponse<any> {
    if (resp?.success === false) {
      throw { message: resp.messages?.join(',').toString(), status: 0 };
    } else {
      return resp;
    }
  }

  private parseException(error: HttpErrorResponse): string {
    const errors = [];
    if (typeof error == 'object' && error?.error?.title !== undefined) {
      errors.push(error.error.title);
    }
    if (
      typeof error == 'object' &&
      error?.error?.errors &&
      error?.error?.errors['$.Gender'] !== undefined
    ) {
      error.error.errors['$.Gender'].forEach((err: any) => {
        errors.push(err);
      });
    }
    return errors.join(' - ');
  }
}
