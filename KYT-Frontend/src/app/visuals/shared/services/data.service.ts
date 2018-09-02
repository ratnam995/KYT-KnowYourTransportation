import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class DataService {
  public dataObject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private fetchingData: BehaviorSubject<any> = new BehaviorSubject<boolean>(
    true
  );

  watchDataObject$ = this.dataObject.asObservable();
  watchFetchingData$ = this.fetchingData.asObservable();

  constructor() {}

  setDataObject(dataObj: any) {
    this.dataObject.next(dataObj);
  }
  setFetchingData(fetchingData: boolean) {
    this.fetchingData.next(fetchingData);
  }
  getFetchingData() {
    return this.fetchingData.getValue();
  }
}
