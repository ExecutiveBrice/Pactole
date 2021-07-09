
import { Component, OnInit } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models';
import { ConfigService } from 'src/app/services';
import { TokenStorageService } from '../../../auth/token-storage.service';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.css']
})

export class UtilisateurComponent implements OnInit {
  utilisateurs: User[];
  private isAdmin: boolean;
  private loggedIn: boolean;
  roles: String[] = ["USER","GEST","ADMIN"]

  constructor(
    public configService: ConfigService,
    public router: Router,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private tokenStorage: TokenStorageService) { }


  ngOnInit() {
    this.loggedIn = this.tokenStorage.isLoggedIn();
    console.log(this.loggedIn)
    this.isAdmin = this.tokenStorage.isAdmin();
    console.log(this.isAdmin)

    this.getAllUsers();
  }


  getAllUsers() {
    this.authService.getAll()
      .subscribe(data => {
        console.log(data);
        this.utilisateurs = data;
      }, err => {
        console.log(err);
      });
  }


}