import { Component, OnInit } from '@angular/core';
import { Dossier } from 'src/app/models';
import dossiers_JSON from 'src/environments/dossiers.json';
import { ChartOptions, ChartType } from 'chart.js';
import { MultiDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { ConfigService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
@Component({
  selector: 'app-menu',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  dossiers: Dossier[] = dossiers_JSON

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.generate()
  }

  repart_dataSet_catA: any[] = []
  repart_dataSet_catB: any[] = []
  repart_dataSet_catC: any[] = []
  repart_dataSet_catD: any[] = []
  public doughnutChartLabels: Label[] = ['Maison', 'Impots', 'Assurances', 'Enfants', 'Divers'];
  public doughnutChartData: MultiDataSet = [
    this.repart_dataSet_catA,
    this.repart_dataSet_catB,
    this.repart_dataSet_catC,
    this.repart_dataSet_catD,
  ];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutOptions: ChartOptions = {

    responsive: true,
  };



  nuage_point_dataSet_catA: any[] = []
  nuage_point_dataSet_catB: any[] = []
  nuage_point_dataSet_catC: any[] = []
  nuage_point_dataSet_catD: any[] = []

  public nuage_point_Colors = [

    { backgroundColor: '#50B044' },
    { backgroundColor: '#FFCF59' },
    { backgroundColor: '#FFAC59' },
    { backgroundColor: '#FF7659' },
    { backgroundColor: '#4477B0' },
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
    { data: this.nuage_point_dataSet_catD, label: 'Non-Endetté', },
    { data: this.nuage_point_dataSet_catC, label: 'Pré-Endetté', },
    { data: this.nuage_point_dataSet_catB, label: 'Mal-Endetté', },
    { data: this.nuage_point_dataSet_catA, label: 'Sur-Endetté', },];








  repart_charge: any[] = []
  repart_revenu: any[] = []
  repart_credit: any[] = []
  repart_impaye: any[] = []


  public repart_tot_Options = {
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Euros'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Catégories RAV'
        }
      }]
    },
    responsive: true,
  };
  public repart_tot_Labels = ['Non-Endetté', 'Pré-Endetté', 'Mal-Endetté', 'Sur-Endetté'];
  public repart_tot_Type = 'bar';
  public repart_tot_Legend = true;
  public repart_tot_Data = [
    {
      label: "Charges",
      backgroundColor: '#FFCF59',
      data: this.repart_charge,
      stack: 'Stack 0',
    },
    {
      label: "Revenus",
      backgroundColor: '#50B044',
      data: this.repart_revenu,
      stack: 'Stack 1',
    },
    {
      label: "Credits",
      backgroundColor: '#FF7659',
      data: this.repart_credit,
      stack: 'Stack 0',
    },
    {
      label: "Impayés",
      backgroundColor: '#4477B0',
      data: this.repart_impaye,
      stack: 'Stack 0',
    },
  ];



  calcul_par_categorie(dossier: Dossier, list1: any[]) {


    list1.push({
      x: dossier.tot_charges,
      y: dossier.tot_credit_mensualites
    })





  }



  generate() {
    let tot_charge_maison_catA = 0
    let tot_charge_impots_catA = 0
    let tot_charge_assurances_catA = 0
    let tot_charge_enfants_catA = 0
    let tot_charge_divers_catA = 0
    let tot_charge_maison_catB = 0
    let tot_charge_impots_catB = 0
    let tot_charge_assurances_catB = 0
    let tot_charge_enfants_catB = 0
    let tot_charge_divers_catB = 0
    let tot_charge_maison_catC = 0
    let tot_charge_impots_catC = 0
    let tot_charge_assurances_catC = 0
    let tot_charge_enfants_catC = 0
    let tot_charge_divers_catC = 0
    let tot_charge_maison_catD = 0
    let tot_charge_impots_catD = 0
    let tot_charge_assurances_catD = 0
    let tot_charge_enfants_catD = 0
    let tot_charge_divers_catD = 0

    let tot_charge_catA = 0
    let tot_charge_catB = 0
    let tot_charge_catC = 0
    let tot_charge_catD = 0
    let tot_revenu_catA = 0
    let tot_revenu_catB = 0
    let tot_revenu_catC = 0
    let tot_revenu_catD = 0
    let tot_credit_catA = 0
    let tot_credit_catB = 0
    let tot_credit_catC = 0
    let tot_credit_catD = 0
    let tot_impaye_catA = 0
    let tot_impaye_catB = 0
    let tot_impaye_catC = 0
    let tot_impaye_catD = 0

    let compteA = 1
    let compteB = 1
    let compteC = 1
    let compteD = 1
    this.dossiers.forEach(dossier => {
      this.calcul_sous_totaux(dossier)

      if (dossier.cat_theorique == "A") {
        compteA++
        this.calcul_par_categorie(dossier, this.nuage_point_dataSet_catA)
        tot_charge_catA += dossier.tot_charges
        tot_revenu_catA += dossier.tot_revenus
        tot_credit_catA += dossier.tot_credit_mensualites
        tot_impaye_catA += dossier.tot_impayes


        tot_charge_maison_catA += dossier.sous_tot_charge_maison
        tot_charge_impots_catA += dossier.sous_tot_charge_impots
        tot_charge_assurances_catA += dossier.sous_tot_charge_assurances
        tot_charge_enfants_catA += dossier.sous_tot_charge_enfants
        tot_charge_divers_catA += dossier.sous_tot_charge_divers
      }
      if (dossier.cat_theorique == "B") {
        compteB++
        this.calcul_par_categorie(dossier, this.nuage_point_dataSet_catB)
        tot_charge_catB += dossier.tot_charges
        tot_revenu_catB += dossier.tot_revenus
        tot_credit_catB += dossier.tot_credit_mensualites
        tot_impaye_catB += dossier.tot_impayes

        tot_charge_maison_catB += dossier.sous_tot_charge_maison
        tot_charge_impots_catB += dossier.sous_tot_charge_impots
        tot_charge_assurances_catB += dossier.sous_tot_charge_assurances
        tot_charge_enfants_catB += dossier.sous_tot_charge_enfants
        tot_charge_divers_catB += dossier.sous_tot_charge_divers
      }
      if (dossier.cat_theorique == "C") {
        compteC++
        this.calcul_par_categorie(dossier, this.nuage_point_dataSet_catC)
        tot_charge_catC += dossier.tot_charges
        tot_revenu_catC += dossier.tot_revenus
        tot_credit_catC += dossier.tot_credit_mensualites
        tot_impaye_catC += dossier.tot_impayes


        tot_charge_maison_catC += dossier.sous_tot_charge_maison
        tot_charge_impots_catC += dossier.sous_tot_charge_impots
        tot_charge_assurances_catC += dossier.sous_tot_charge_assurances
        tot_charge_enfants_catC += dossier.sous_tot_charge_enfants
        tot_charge_divers_catC += dossier.sous_tot_charge_divers
      }
      if (dossier.cat_theorique == "D") {
        compteD++
        this.calcul_par_categorie(dossier, this.nuage_point_dataSet_catD)
        tot_charge_catD += dossier.tot_charges
        tot_revenu_catD += dossier.tot_revenus
        tot_credit_catD += dossier.tot_credit_mensualites
        tot_impaye_catD += dossier.tot_impayes

        tot_charge_maison_catD += dossier.sous_tot_charge_maison
        tot_charge_impots_catD += dossier.sous_tot_charge_impots
        tot_charge_assurances_catD += dossier.sous_tot_charge_assurances
        tot_charge_enfants_catD += dossier.sous_tot_charge_enfants
        tot_charge_divers_catD += dossier.sous_tot_charge_divers
      }



    })



    this.repart_dataSet_catA.push(tot_charge_maison_catA / compteA)
    this.repart_dataSet_catA.push(tot_charge_impots_catA / compteA)
    this.repart_dataSet_catA.push(tot_charge_assurances_catA / compteA)
    this.repart_dataSet_catA.push(tot_charge_enfants_catA / compteA)
    this.repart_dataSet_catA.push(tot_charge_divers_catA / compteA)



    this.repart_dataSet_catB.push(tot_charge_maison_catB / compteB)
    this.repart_dataSet_catB.push(tot_charge_impots_catB / compteB)
    this.repart_dataSet_catB.push(tot_charge_assurances_catB / compteB)
    this.repart_dataSet_catB.push(tot_charge_enfants_catB / compteB)
    this.repart_dataSet_catB.push(tot_charge_divers_catB / compteB)


    this.repart_dataSet_catC.push(tot_charge_maison_catC / compteC)
    this.repart_dataSet_catC.push(tot_charge_impots_catC / compteC)
    this.repart_dataSet_catC.push(tot_charge_assurances_catC / compteC)
    this.repart_dataSet_catC.push(tot_charge_enfants_catC / compteC)
    this.repart_dataSet_catC.push(tot_charge_divers_catC / compteC)




    this.repart_dataSet_catD.push(tot_charge_maison_catD / compteD)
    this.repart_dataSet_catD.push(tot_charge_impots_catD / compteD)
    this.repart_dataSet_catD.push(tot_charge_assurances_catD / compteD)
    this.repart_dataSet_catD.push(tot_charge_enfants_catD / compteD)
    this.repart_dataSet_catD.push(tot_charge_divers_catD / compteD)



    this.repart_charge.push(tot_charge_catD / compteD)
    this.repart_charge.push(tot_charge_catC / compteC)
    this.repart_charge.push(tot_charge_catB / compteB)
    this.repart_charge.push(tot_charge_catA / compteA)


    this.repart_revenu.push(tot_revenu_catD / compteD)
    this.repart_revenu.push(tot_revenu_catC / compteC)
    this.repart_revenu.push(tot_revenu_catB / compteB)
    this.repart_revenu.push(tot_revenu_catA / compteA)

    this.repart_credit.push(tot_credit_catD / compteD)
    this.repart_credit.push(tot_credit_catC / compteC)
    this.repart_credit.push(tot_credit_catB / compteB)
    this.repart_credit.push(tot_credit_catA / compteA)


    this.repart_impaye.push(tot_impaye_catD / compteD)
    this.repart_impaye.push(tot_impaye_catC / compteC)
    this.repart_impaye.push(tot_impaye_catB / compteB)
    this.repart_impaye.push(tot_impaye_catA / compteA)


    this.configService.saveItem('nuage_point_dataSet_catA', this.nuage_point_dataSet_catA)
    this.configService.saveItem('nuage_point_dataSet_catB', this.nuage_point_dataSet_catB)
    this.configService.saveItem('nuage_point_dataSet_catC', this.nuage_point_dataSet_catC)
    this.configService.saveItem('nuage_point_dataSet_catD', this.nuage_point_dataSet_catD)


  }





  calcul_sous_totaux(dossier: Dossier) {
    dossier.sous_tot_charge_maison = 0
    dossier.sous_tot_charge_impots = 0
    dossier.sous_tot_charge_assurances = 0
    dossier.sous_tot_charge_enfants = 0
    dossier.sous_tot_charge_divers = 0


    dossier.sous_tot_credit_conso_mensualites = 0
    dossier.sous_tot_credit_conso_crd = 0
    dossier.sous_tot_credit_immo_mensualites = 0
    dossier.sous_tot_credit_immo_crd = 0

    dossier.tot_credit_mensualites = 0
    dossier.tot_credit_crd = 0
    dossier.tot_revenus = 0
    dossier.tot_charges = 0
    dossier.reste_a_vivre = 0
    dossier.taux_endetement = 0
    dossier.tot_impayes = 0

    dossier.pause_credit = false


    dossier.revenus.forEach(revenu => {
      dossier.tot_revenus += revenu.montant
    })

    dossier.credits.forEach(credit => {
      if (credit.type == "Renouvelable") {
        dossier.sous_tot_credit_conso_mensualites += credit.mensualite
        dossier.sous_tot_credit_conso_crd += credit.crd
      } else if (credit.type == "R") {
        dossier.sous_tot_credit_conso_mensualites += credit.mensualite
        dossier.sous_tot_credit_conso_crd += credit.crd
      } else if (credit.type == "A") {
        dossier.sous_tot_credit_immo_mensualites += credit.mensualite
        dossier.sous_tot_credit_immo_crd += credit.crd
      } else if (credit.type == "I") {
        dossier.sous_tot_credit_immo_mensualites += credit.mensualite
        dossier.sous_tot_credit_immo_crd += credit.crd
      } else if (credit.type == "Sans Hypothèque") {
        dossier.sous_tot_credit_immo_mensualites += credit.mensualite
        dossier.sous_tot_credit_immo_crd += credit.crd
      }

      if (credit.mensualite < 1) {
        dossier.pause_credit = true
      }
      dossier.tot_credit_mensualites += credit.mensualite
      dossier.tot_credit_crd += credit.crd
    })


    dossier.charges.forEach(charge => {
      if (charge.type == "MAISON") {
        dossier.sous_tot_charge_maison += charge.montant
      } else if (charge.type == "IMPOTS") {
        dossier.sous_tot_charge_impots += charge.montant
      } else if (charge.type == "ASSURANCES") {
        dossier.sous_tot_charge_assurances += charge.montant
      } else if (charge.type == "ENFANTS") {
        dossier.sous_tot_charge_enfants += charge.montant
      } else if (charge.type == "DIVERS") {
        dossier.sous_tot_charge_divers += charge.montant
      }
      dossier.tot_charges += charge.montant
    });


    dossier.impayes.forEach(impaye => {
      dossier.tot_impayes += impaye.montant
    })

    dossier.reste_a_vivre = dossier.tot_revenus - dossier.tot_charges - dossier.tot_credit_mensualites
    dossier.taux_endetement = 0
    if (dossier.tot_credit_mensualites > 0) {
      dossier.taux_endetement = ((dossier.tot_revenus / dossier.tot_credit_mensualites) - 1) * 100
    }

    if (dossier.reste_a_vivre <= 100) {
      dossier.cat_theorique = "A"
    } else if (dossier.reste_a_vivre < 400) {
      dossier.cat_theorique = "B"
    } else if (dossier.reste_a_vivre > 400) {
      dossier.cat_theorique = "C"
    }




    if (dossier.reste_a_vivre > 400 && dossier.tot_impayes < 10 && !dossier.pause_credit && dossier.taux_endetement < 40) {

      dossier.cat_theorique = "D"
    }
  }



  annuler() {
    this.router.navigate(['/']);
  }

}