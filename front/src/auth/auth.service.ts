import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../app/models';

import { JwtResponse } from './jwt-response';
import { AuthLoginInfo } from './login-info';
import { SignUpInfo } from './signup-info';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'auth/';



  constructor(private http: HttpClient) {
  }

  attemptAuth(credentials: AuthLoginInfo): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.apiUrl+'signin', credentials, {  responseType: 'json'});
  }

  signUp(info: SignUpInfo): Observable<string> {
    return this.http.post<string>(this.apiUrl+'signup', info);
  }

  confirm(token: String): Observable<string> {
    let params = new HttpParams().set('token', ''+token+'');
    return this.http.get<string>(this.apiUrl+'confirm', {params, responseType: 'json'});
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl+'getAll', {responseType: 'json'});
  }
}
