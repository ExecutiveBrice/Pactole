
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dossier } from 'src/app/models';
import { ConfigService, MessageService } from 'src/app/services';


@Component({
  selector: 'app-menu',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})

export class AccueilComponent implements OnInit {
  subscription = new Subscription()
  table:string = 'surendetes'
  nb_messages: number
  all: Dossier[] = []
  surendetes: Dossier[] = []
  malendetes: Dossier[] = []
  preendetes: Dossier[] = []
  bienendetes: Dossier[] = []
  messagesRed: Map<string, string>
  messagesGreen: Map<string, string>

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public configService: ConfigService,
    public messageService: MessageService,
    public sanitizer: DomSanitizer) { }


  ngOnInit() {

    this.filterBeneficiaires(this.configService.getItem("dossiers_JSON"))

    this.updateMessage();

  
  }


  updateMessage() {
    this.messagesRed = this.messageService.getRedMessages()
    this.messagesGreen = this.messageService.getGreenMessages()
    this.nb_messages = this.messagesGreen.size + this.messagesRed.size
    console.log(this.nb_messages)
  }


  filter(filterString: any) {
    let dossiers
    if (filterString != undefined) {
      dossiers = this.configService.getItem("dossiers_JSON").filter(dossier => {

        if (!isNaN(filterString) && dossier.dossier_id != undefined && dossier.dossier_id.toString().indexOf(filterString.toString()) !== -1) {
          return true
        }
        if (isNaN(filterString) && dossier.beneficiaire.nom != undefined && dossier.beneficiaire.nom.toUpperCase().indexOf(filterString.toUpperCase()) !== -1) {
          return true
        }
        if (isNaN(filterString) && dossier.beneficiaire.prenom != undefined && dossier.beneficiaire.prenom.toUpperCase().indexOf(filterString.toUpperCase()) !== -1) {
          return true
        }
        if (!isNaN(filterString) && dossier.beneficiaire.code_postal != undefined && dossier.beneficiaire.code_postal.toString().indexOf(filterString.toString()) !== -1) {
          return true
        }
        if (!isNaN(filterString) && dossier.beneficiaire.telephone_fixe != undefined && dossier.beneficiaire.telephone_fixe.indexOf(filterString.toString()) !== -1) {
          return true
        }
        if (!isNaN(filterString) && dossier.beneficiaire.telephone_mobile != undefined && dossier.beneficiaire.telephone_mobile.indexOf(filterString.toString()) !== -1) {
          return true
        }
        if (isNaN(filterString) && dossier.partenaire != undefined && dossier.partenaire.nom.toUpperCase().indexOf(filterString.toUpperCase()) !== -1) {
          return true
        }
        if (isNaN(filterString) && dossier.structure != undefined && dossier.structure.nom.toUpperCase().indexOf(filterString.toUpperCase()) !== -1) {
          return true
        }
        if (dossier.rendez_vous != undefined && dossier.rendez_vous.length > 0 && dossier.rendez_vous[dossier.rendez_vous.length - 1].date_debut_rdv.indexOf(filterString.toString()) !== -1) {
          return true
        }
        return false

      })
    } else {
      dossiers = this.configService.getItem("dossiers_JSON")
    }

    this.filterBeneficiaires(dossiers)
  }

  filterBeneficiaires(dossiers: Dossier[]) {
    this.all = []
    this.surendetes = []
    this.malendetes = []
    this.preendetes = []
    this.bienendetes = []
    dossiers.forEach(dossier => {
      if (dossier.categorie == "A") {
        this.surendetes.push(dossier)
      } else if (dossier.categorie == "B") {
        this.malendetes.push(dossier)
      } else if (dossier.categorie == "C") {
        this.preendetes.push(dossier)
      } else {
        this.bienendetes.push(dossier)
      }
      this.all.push(dossier)
    });
  }



  dashboard() {
    this.router.navigate(['/dashboard']);
  }


  creation() {
    this.router.navigate(['/detail']);
  }


  detailLink(dossier_id: number) {
    this.router.navigate(['/detail/' + dossier_id]);

  }
  removeMessage(dossier_id: string) {

    this.messageService.deleteGreenMessage(dossier_id)
    this.messageService.deleteRedMessage(dossier_id)
    this.updateMessage()
  }


}