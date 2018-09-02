import { Injectable } from "@angular/core";
import { Response, Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Rx";

const API_HOST = "http://localhost:3030";

@Injectable()
export class HttpService {
  constructor(protected http: Http) {}

  post(url: string, element: any): Observable<any> {
    return this.http
      .post(`${API_HOST}/api/${url}/`, element)
      .map((response: Response) => {
        return response.json();
      })
      .catch(err => {
        console.log(
          "Inside http service error",
          JSON.parse(JSON.stringify(err))
        );
        return Observable.throw(err.json());
      });
  }
}
