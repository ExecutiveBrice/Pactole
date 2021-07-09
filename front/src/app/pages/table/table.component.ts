import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  /**
   * Définition des variables du composant
   */
   filterColumn:String='beneficiaire.nom'
   orderWay:boolean;

  param: string = "";
  page: number = 1

  listNbPages: number[] = []
  orderList: string[] = []


  @Input()
  selectedNb: number;

  @Input()
  data: any[];
/*
  @Input()
  filterString:string;
*/
  constructor(
    public route: ActivatedRoute,
    public router: Router,
  ) { }

  /**
   * Initilisation des variables, filtre et ordonancement du composant
   */
  ngOnInit() {
    this.listNbPages = [5,10,100]

  }

  selectColumn(columnName:String) {
    console.log(columnName)
    if(columnName != this.filterColumn){
      this.filterColumn=columnName;
      this.orderWay=false
    }else{
      this.orderWay=!this.orderWay
    }
  }

  detailLink(dossier_id:number){
    this.router.navigate(['/detail/'+dossier_id]);

  }

}
