import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth/auth.service';
import { SignUpInfo } from '../../../auth/signup-info';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  form: any = {};
  signupInfo: SignUpInfo;
  isSignedUp = false;
  isSignUpFailed = false;
  errorMessage = '';


  constructor(private authService: AuthService,
    public router: Router) { }

  ngOnInit() {



  }


  spinner(visible:boolean) {
    if (visible) {
      document.getElementById("overlay").style.display = "block";
    } else {
      document.getElementById("overlay").style.display = "none";
    }
  }

  onSubmit() {
    console.log(this.form);
    this.spinner(true);

    this.signupInfo = new SignUpInfo(
      this.form.username,
      this.form.email,
      this.form.password);

    this.authService.signUp(this.signupInfo).subscribe(
      data => {

        console.log("succes");
        console.log(data);
        this.spinner(false);
        this.isSignedUp = true;
        this.isSignUpFailed = false;
      },
      error => {

        console.log("error");
        console.log(error);
        this.errorMessage = error;
        this.spinner(false);
        this.isSignedUp = false;
        this.isSignUpFailed = true;
      }
    );
  }
}
