import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../auth/auth.service';
import { TokenStorageService } from '../../../auth/token-storage.service';
import { AuthLoginInfo } from '../../../auth/login-info';
import { Router } from '@angular/router';
import { TransmissionService } from 'src/app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  private loginInfo: AuthLoginInfo;

  constructor(private authService: AuthService,
    private transmissionService: TransmissionService,
    private tokenStorage: TokenStorageService,
    public router: Router) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    console.log(this.form);

    this.loginInfo = new AuthLoginInfo(
      this.form.username,
      this.form.password);

    this.authService.attemptAuth(this.loginInfo).subscribe(
      data => {
        console.log("succes");
        console.log(data)
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveId(data.id);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveAuthorities(data.authorities);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getAuthorities();
        this.transmissionService.dataTransmission(data.username);
        this.router.navigate(['/']);
      },
      error => {
        console.log("error");
        console.log(error);
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
      }
    );
  }

}
