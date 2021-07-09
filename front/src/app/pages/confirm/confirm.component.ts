import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent implements OnInit {



  isConfirmed;
  errorMessage = '';

  constructor(private authService: AuthService,
    public route: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {

    this.route.params.subscribe(
      params => {
        console.log(params['token'])
        this.confirm(params['token']);
      }
    );
  }



  confirm(token: String) {
    this.authService.confirm(token)
      .subscribe(data => {
        console.log(data);
        this.isConfirmed = true
      }, err => {
        console.log(err);
        this.isConfirmed = false
        this.errorMessage = err
      });
  }

}
