
import { Component, OnInit } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

import { Router, ActivatedRoute } from '@angular/router';
import { IAService, ConfigService, MessageService } from 'src/app/services'
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';
import { Charge, Credit, Dossier, Revenu } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-menu',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit {

  constructor(

    public route: ActivatedRoute,
    public router: Router,
    public configService: ConfigService,
    private toastr: ToastrService,
    public messageService: MessageService,
    public sanitizer: DomSanitizer,
    public iAService: IAService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }


  dossiers: Dossier[] = this.configService.getItem("dossiers_JSON")
  dossier: Dossier
  categorie_initiale: string
  newcreditImmo: Credit = new Credit()
  newcreditConso: Credit = new Credit()
  newrevenu: Revenu = new Revenu()

  newCharge1: Charge = new Charge()
  newCharge2: Charge = new Charge()
  newCharge3: Charge = new Charge()
  newCharge4: Charge = new Charge()
  newCharge5: Charge = new Charge()





  nuage_point_dataSet_catA: any[] = []
  nuage_point_dataSet_catB: any[] = []
  nuage_point_dataSet_catC: any[] = []
  nuage_point_dataSet_catD: any[] = []

  nuage_point_dataSet_perso: any[] = []


  ngOnInit() {




    this.fill_graph(this.configService.getItem('nuage_point_dataSet_catA'), this.nuage_point_dataSet_catA)
    this.fill_graph(this.configService.getItem('nuage_point_dataSet_catB'), this.nuage_point_dataSet_catB)
    this.fill_graph(this.configService.getItem('nuage_point_dataSet_catC'), this.nuage_point_dataSet_catC)
    this.fill_graph(this.configService.getItem('nuage_point_dataSet_catD'), this.nuage_point_dataSet_catD)




    this.route.params.subscribe(
      params => {
        if (params['dossier_id'] != undefined) {
          this.dossier = this.dossiers.find(ben => {
            return ben.dossier_id == params['dossier_id']
          })

        } else {
          this.dossier = new Dossier
        }
      }
    );

    this.calcul_sous_totaux(this.dossier)









  }


  fill_graph(listSource: any[], listetoFill: any[]) {

    listSource.forEach(element => {
      listetoFill.push(element)
    })
  }



  sous_tot_charge_maison: number
  sous_tot_charge_impots: number
  sous_tot_charge_assurances: number
  sous_tot_charge_enfants: number
  sous_tot_charge_divers: number


  sous_tot_credit_conso_mensualites: number
  sous_tot_credit_conso_crd: number
  sous_tot_credit_immo_mensualites: number
  sous_tot_credit_immo_crd: number
  pause_credit: boolean = false


  tot_credit_mensualites: number
  tot_credit_crd: number
  tot_revenus: number
  tot_charges: number
  reste_a_vivre: number
  taux_endetement: number
  tot_impayes: number
  calcul_sous_totaux(dossier: Dossier) {
    this.sous_tot_charge_maison = 0
    this.sous_tot_charge_impots = 0
    this.sous_tot_charge_assurances = 0
    this.sous_tot_charge_enfants = 0
    this.sous_tot_charge_divers = 0


    this.sous_tot_credit_conso_mensualites = 0
    this.sous_tot_credit_conso_crd = 0
    this.sous_tot_credit_immo_mensualites = 0
    this.sous_tot_credit_immo_crd = 0

    this.tot_credit_mensualites = 0
    this.tot_credit_crd = 0
    this.tot_revenus = 0
    this.tot_charges = 0
    this.reste_a_vivre = 0
    this.taux_endetement = 0
    this.tot_impayes = 0
    dossier.revenus.forEach(revenu => {
      this.tot_revenus += revenu.montant
    })

    dossier.credits.forEach(credit => {
      if (credit.type == "Renouvelable") {
        this.sous_tot_credit_conso_mensualites += credit.mensualite
        this.sous_tot_credit_conso_crd += credit.crd
      } else if (credit.type == "R") {
        this.sous_tot_credit_conso_mensualites += credit.mensualite
        this.sous_tot_credit_conso_crd += credit.crd
      } else if (credit.type == "A") {
        this.sous_tot_credit_immo_mensualites += credit.mensualite
        this.sous_tot_credit_immo_crd += credit.crd
      } else if (credit.type == "I") {
        this.sous_tot_credit_immo_mensualites += credit.mensualite
        this.sous_tot_credit_immo_crd += credit.crd
      } else if (credit.type == "Sans Hypothèque") {
        this.sous_tot_credit_immo_mensualites += credit.mensualite
        this.sous_tot_credit_immo_crd += credit.crd
      }

      if (credit.mensualite < 1) {
        this.pause_credit = true
      }
      this.tot_credit_mensualites += credit.mensualite
      this.tot_credit_crd += credit.crd
    })


    dossier.charges.forEach(charge => {
      if (charge.type == "MAISON") {
        this.sous_tot_charge_maison += charge.montant
      } else if (charge.type == "IMPOTS") {
        this.sous_tot_charge_impots += charge.montant
      } else if (charge.type == "ASSURANCES") {
        this.sous_tot_charge_assurances += charge.montant
      } else if (charge.type == "ENFANTS") {
        this.sous_tot_charge_enfants += charge.montant
      } else if (charge.type == "DIVERS") {
        this.sous_tot_charge_divers += charge.montant
      }
      this.tot_charges += charge.montant
    });


    dossier.impayes.forEach(impaye => {
      this.tot_impayes += impaye.montant
    })

    this.reste_a_vivre = this.tot_revenus - this.tot_charges - this.tot_credit_mensualites
    this.taux_endetement = 0
    if (this.tot_credit_mensualites > 0) {
      ((this.taux_endetement = this.tot_revenus / this.tot_credit_mensualites) - 1) * 100
    }

    this.calc_categorie()

    this.fill_graph([{ x: this.tot_charges, y: this.tot_credit_mensualites, r: 20 }], this.nuage_point_dataSet_perso)


    this.pieChartData = []
    this.pieChartData.push(this.tot_revenus)
    this.pieChartData.push(this.tot_charges)
    this.pieChartData.push(this.tot_credit_mensualites)


  }


  criteres = [
    ["Touchent moins de 100 € d'aides", "Au plus 3 personnes à charge"],
    ["Touchent moins de 300 € d'aides", "Au plus une personne à charge", "Locataires"],
    ["Touchent moins de 624 € d'aides", "Au plus une personne à charge", "Locataires"],
    ["Touchent moins de 1000 € d'aides", "Au plus une personne à charge", "Locataires", "payent moins de 590€ d'assurances"],
  ]

  cat_theorique: string
  calc_categorie() {
    if (this.reste_a_vivre <= 100) {
      this.cat_theorique = "A"
    } else if (this.reste_a_vivre < 400) {
      this.cat_theorique = "B"
    } else if (this.reste_a_vivre > 400) {
      this.cat_theorique = "C"
    }
    if (this.reste_a_vivre > 400 && this.tot_impayes < 10 && !this.pause_credit && this.taux_endetement < 35) {
      this.cat_theorique = "D"
    }
    this.dossier.categorie = this.cat_theorique
    this.categorie_initiale = this.cat_theorique
  }

  add_to_list(array: any[], object: any) {


    array.push(object)

    this.newcreditImmo = new Credit()
    this.newcreditConso = new Credit()
    this.newrevenu = new Revenu()

    this.newCharge1 = new Charge()
    this.newCharge2 = new Charge()
    this.newCharge3 = new Charge()
    this.newCharge4 = new Charge()
    this.newCharge5 = new Charge()

    this.calcul_sous_totaux(this.dossier)
  }

  remove_from_list(listeName: string, objectId: number) {

    if (listeName == "revenus") {
      this.dossier.revenus.forEach((value, index) => {
        if (value.id == objectId) this.dossier.revenus.splice(index, 1);
      });
    } else if (listeName == "charges") {
      this.dossier.charges.forEach((value, index) => {
        if (value.id == objectId) this.dossier.charges.splice(index, 1);
      });
    } else if (listeName == "credits") {
      this.dossier.credits.forEach((value, index) => {
        if (value.id == objectId) this.dossier.credits.splice(index, 1);
      });
    }


    this.calcul_sous_totaux(this.dossier)
  }


  annuler() {
    this.router.navigate(['/']);
  }


  update() {


    this.iAService.analyse(this.dossier)
      .subscribe(data => {

        this.dossier.cat_IA = data.categorie;
        this.dossier.criteres = this.criteres[data.categorie];
        let evolution = 0
        if (this.categorie_initiale == "A" && this.dossier.cat_IA != 3) {
          evolution = 1
        }
        if (this.categorie_initiale == "B" && this.dossier.cat_IA < 2) {
          evolution = 2
        }
        if (this.categorie_initiale == "B" && this.dossier.cat_IA > 2) {
          evolution = 1
        }
        if (this.categorie_initiale == "C" && this.dossier.cat_IA < 1) {
          evolution = 2
        }
        if (this.categorie_initiale == "C" && this.dossier.cat_IA > 1) {
          evolution = 1
        }

        if (this.categorie_initiale == "D" && this.dossier.cat_IA != 0) {
          evolution = 2
        }





        let criteres = ""
        data.criteres.forEach(string => {
          criteres = criteres + string + "\r\n"
        })

        let pipe = new DatePipe('en-US'); // Use your own locale

        let date_du_message = pipe.transform(new Date(), 'short');

        if (evolution == 1) {

          let message = "Le " + date_du_message + ", le dossier n°" + this.dossier.dossier_id + " de " + this.dossier.beneficiaire.prenom + " " + this.dossier.beneficiaire.nom + " à amélioré sa note"
          this.messageService.addGreenMessage(this.dossier.dossier_id.toString(), message)
        } else if (evolution == 2) {

          let message = "Le " + date_du_message + ", le dossier n°" + this.dossier.dossier_id + " de " + this.dossier.beneficiaire.prenom + " " + this.dossier.beneficiaire.nom + " à baissé sa note"
          this.messageService.addRedMessage(this.dossier.dossier_id.toString(), message)
        }
        this.configService.removeItem("dossiers_JSON")
        this.configService.saveItem("dossiers_JSON", this.dossiers)



        this.router.navigate(['/']);

      }, err => {
        console.log(err);
      });

  }

  test() {


    this.iAService.analyse(this.dossier)
      .subscribe(data => {


        this.dossier.cat_IA = data.categorie;
        this.dossier.criteres = this.criteres[data.categorie];
        let evolution = 0
        if (this.categorie_initiale == "A" && this.dossier.cat_IA != 3) {
          evolution = 1
        }
        if (this.categorie_initiale == "B" && this.dossier.cat_IA < 2) {
          evolution = 1
        }
        if (this.categorie_initiale == "B" && this.dossier.cat_IA > 2) {
          evolution = 2
        }
        if (this.categorie_initiale == "C" && this.dossier.cat_IA < 1) {
          evolution = 1
        }
        if (this.categorie_initiale == "C" && this.dossier.cat_IA > 1) {
          evolution = 2
        }

        if (this.categorie_initiale == "D" && this.dossier.cat_IA != 0) {
          evolution = 2
        }


        let criteres = ""
        data.criteres.forEach(string => {
          criteres = criteres + string + "\r\n"
        })

        if (evolution == 1) {
          let message = "Le dossier n°" + this.dossier.dossier_id + " à amélioré sa note"
          this.toastr.success(criteres, message, { tapToDismiss: true, timeOut: 10000, progressBar: true })

        } else if (evolution == 2) {
          let message = "Le dossier n°" + this.dossier.dossier_id + " à baissé sa note"
          this.toastr.error(criteres, message, { tapToDismiss: true, timeOut: 10000, progressBar: true })

        } else {
          let message = "Le dossier n°" + this.dossier.dossier_id + " n'a pas modifié sa note"
          this.toastr.warning(criteres, message, { tapToDismiss: true, timeOut: 10000, progressBar: true })

        }


      }, err => {
        console.log(err);
      });

  }




  spinner(visible: boolean) {
    if (visible) {
      document.getElementById("overlay").style.display = "block";
    } else {
      document.getElementById("overlay").style.display = "none";
    }
  }






  public pieChartLabels: Label[] = ["Revenus", "Charges", "Credits"];
  public pieChartOptions: ChartOptions = {

    responsive: true,
  };

  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = false;
  public pieChartPlugins = [];


  public nuage_point_Colors = [
    { backgroundColor: '#4477B0' },
    { backgroundColor: '#50B044' },
    { backgroundColor: '#FFCF59' },
    { backgroundColor: '#FFAC59' },
    { backgroundColor: '#FF7659' },
  ]
  public nuage_point_Options = {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Credits'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Charges'
        }
      }]
    },
    responsive: true
  };
  public nuage_point_Type = 'scatter';
  public nuage_point_Legend = true;
  public nuage_point_Data = [
    { data: this.nuage_point_dataSet_perso, label: 'Bénéficiaire', },
    { data: this.nuage_point_dataSet_catD, label: 'Non-Endetté', },
    { data: this.nuage_point_dataSet_catC, label: 'Pré-Endetté', },
    { data: this.nuage_point_dataSet_catB, label: 'Mal-Endetté', },
    { data: this.nuage_point_dataSet_catA, label: 'Sur-Endetté', },

  ];

}