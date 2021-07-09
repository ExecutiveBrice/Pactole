import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ResponseIA } from '../models';

@Injectable()
export class IAService {
  apiUrl = 'http://localhost:5000';

  constructor(
    private http: HttpClient
  ) { }

  analyse(Dossier) {
    return this.http.post<ResponseIA>(this.apiUrl + '/update', Dossier, {responseType: 'json'});
  }


}
