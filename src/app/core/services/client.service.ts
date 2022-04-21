import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Api, HttpVerb, RequestBuilder } from '../classes/request-builder';
import { Router } from '@angular/router';
import { Dictionary } from '@core/classes/dictionary.type';
import { UserLogin } from '@core/models/user-login.model';
import { Toaster } from '@core/modules/toast-notification';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private login$: BehaviorSubject<UserLogin | null>;
  private loadingCounter$: BehaviorSubject<number>;
  private repository: Repository = { dateTime: new Date() };
  private access: Dictionary<Dictionary<boolean>> = {};
  get loadingAsObservable(): Observable<number> {
    return this.loadingCounter$.asObservable();
  }

  constructor(
    public http: HttpClient,
    public toaster: Toaster,
    public router: Router
  ) {
    this.login$ = new BehaviorSubject<UserLogin | null>(null);
    this.loadingCounter$ = new BehaviorSubject<number>(0);
  }

  public startLoading(): void {
    window.requestAnimationFrame(() => {
      this.loadingCounter$.next(1);
    });
  }

  public finishLoading(): void {
    window.requestAnimationFrame(() => this.loadingCounter$.next(0));
  }

  public api(verb: HttpVerb = 'GET'): RequestBuilder {
    return new RequestBuilder(verb);
  }

  get userLoginAsObservable() {
    return this.login$.asObservable();
  }

  public get token(): HttpParams | null {
    const user: UserLogin | null = this.currentUser || null;
    if (user && user.Token) {
      return new HttpParams().set('Token', user.Token);
    } else {
      return null;
    }
  }

  public get currentUser(): UserLogin | null {
    const userLoginData: string = localStorage.getItem('user') || '';
    if (userLoginData.length > 0) {
      this.repository.userLogin = JSON.parse(userLoginData);
      return this.repository.userLogin;
    } else {
      return null;
    }
  }

  public saveUserLogin(loginUser: UserLogin): void {
    this.repository.userLogin = Object.assign({}, loginUser);
    localStorage.setItem('user', JSON.stringify(loginUser));
    this.login$.next(this.repository.userLogin);
  }

  public userLogout(): void {
    this.repository.userLogin = null;
    localStorage.clear();
    this.login$.next(this.repository.userLogin);
    const pattern = new RegExp(
      '^(http(s)?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    if (!!pattern.test(environment.LOGIN_ROUTE)) {
      this.router.navigate([environment.LOGIN_ROUTE]);
    } else {
      window.location.href = environment.LOGIN_ROUTE;
    }
  }

  // public accessPage(pageID: number, callback: (accessList: Dictionary<boolean>) => void = null): Dictionary<boolean> {
  //   if (this.access[pageID] === undefined) {
  //     const accessList: Dictionary<boolean>=this.access[pageID] || {};
  //     const request = ApiRequest('GET', false).setController('ActionRole').setAction('AccessList').setModuleName('System')
  //     .addParam('ParentPageID',pageID);
  //     this.apiRequest<any>(request).subscribe( resp => {
  //       if ( resp.Success === true) {
  //         resp?.Data?.AccessRoleList?.forEach(element => {
  //           accessList[element.ActionID] = element.IsDisabled === true ? null : true;;
  //         });
  //         if (callback) {
  //           callback(accessList);
  //         }
  //       }
  //     }, () => {this.finishLoading(); }, () => {this.finishLoading(); });
  //     return {};
  //   } else {
  //     return this.access[pageID];
  //   }
  // }
}

export interface Repository extends Dictionary<any> {
  dateTime: Date;
}
