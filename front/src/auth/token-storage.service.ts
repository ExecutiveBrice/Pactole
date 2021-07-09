import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';
const AUTHORITIES_ID = 'AuthId';


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private roles: Array<string> = [];
  constructor() { }



  isLoggedIn(): boolean {
    if (this.getToken()) {
      console.log("logged")
      return true
    } else {
      console.log("not logged")
      return false
    }
  }

  getRoles() {
    if (this.getToken()) {
      return this.getAuthorities();
    } else {
      return undefined
    }
  }

  isAdmin(): boolean {
    if (this.getToken()) {
      return this.getAuthorities().some(s => s == 'ROLE_ADMIN')
    } else {
      return false
    }
  }

  getAuthority(): string {
    if (this.getToken()) {
      this.roles = this.getAuthorities();
      this.roles.forEach(role => {
        if (role === 'ROLE_ADMIN') {
          console.log('admin')
          return "admin";
        } else if (role === 'ROLE_GEST') {
          console.log('gestionnaire')
          return "gestionnaire";
        }
        console.log('user')
        return "user";
      });
    }
    console.log('undefined')
    return undefined;
  }


  signOut() {
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUsername(username: string) {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, username);
  }

  public getUsername(): string {
    return sessionStorage.getItem(USERNAME_KEY);
  }

  public saveId(id: number) {
    window.sessionStorage.removeItem(AUTHORITIES_ID);
    window.sessionStorage.setItem(AUTHORITIES_ID, id.toString());
  }

  public getId(): number {
    return JSON.parse(sessionStorage.getItem(AUTHORITIES_ID));
  }

  public saveAuthorities(authorities: string[]) {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    this.roles = [];

    if (sessionStorage.getItem(TOKEN_KEY)) {
      if (sessionStorage.getItem(AUTHORITIES_KEY)) {
        JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
          console.log(authority)
          this.roles.push(authority);
        });
      }
    }
    console.log(this.roles)
    return this.roles;
  }
}
