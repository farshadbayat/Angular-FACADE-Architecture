import { Injectable } from '@angular/core';
import { Application } from '@common/models/application.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private applicationList$: BehaviorSubject<Application[]>;

  constructor() {
    this.applicationList$ = new BehaviorSubject<Application[]>([]);
  }

  get applicationAsObservable() {
    return this.applicationList$.asObservable();
  }

  public addApplicationList(applications: Application[]) {
    this.applicationList$.next(applications);
  }

}
