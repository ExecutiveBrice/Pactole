import { Component } from '@angular/core';
import { ConfigService } from './services';

import dossiers_JSON from 'src/environments/dossiers.json';


@Component({
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {


    constructor(
        public configService: ConfigService) {
    }

    ngOnInit() {

        if(this.configService.getItem("dossiers_JSON") == null){
            this.configService.saveItem("dossiers_JSON",dossiers_JSON)
        }

    }



}