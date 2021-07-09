
import { Assurance } from "./assurance";
import { Beneficiaire } from "./beneficiaire";
import { Charge } from "./charge";
import { Credit } from "./credit";
import { Impaye } from "./impaye";
import { Partenaire } from "./partenaire";
import { Rendez_vous } from "./rendez_vous";
import { Revenu } from "./revenu";
import { Structure } from "./structure";

export class Dossier {


    
    dossier_id: number;
    beneficiaire_id: number;
    beneficiaire:Beneficiaire;
    conjoint_id:number;
    conjoint:Beneficiaire;
    assurances: Assurance[];
    charges: Charge[];
    credits: Credit[];
    revenus: Revenu[];
    impayes: Impaye[];
    rendez_vous:Rendez_vous[];
    nature: string;
    etat: string;
    orientation: string;
    partenaire_id:number;
    partenaire:Partenaire;
    structure_id:number;
    structure:Structure;
    suivi: string;


    categorie:string;
    criteres:string[];

    rest_a_vivre:number;
    total_assurance:number;
    total_charges:number;
    total_credit:number;
    total_impaye:number;
    total_mensualite:number;
    total_revenu:number;

    sous_tot_charge_maison:number;
    sous_tot_charge_impots:number;
    sous_tot_charge_assurances:number;
    sous_tot_charge_enfants:number;
    sous_tot_charge_divers:number;


    sous_tot_credit_conso_mensualites:number;
    sous_tot_credit_conso_crd:number;
    sous_tot_credit_immo_mensualites:number;
    sous_tot_credit_immo_crd:number;

    tot_credit_mensualites:number;
    tot_credit_crd:number;
    tot_revenus:number;
    tot_charges:number;
    reste_a_vivre:number;
    taux_endetement:number;
    tot_impayes:number;
    pause_credit:boolean;
    cat_theorique:string
    cat_IA:number

    
constructor(){
    this.beneficiaire = new Beneficiaire()
    this.conjoint = new Beneficiaire()
    this.partenaire = new Partenaire()
    this.structure = new Structure()
    this.charges = []
    this.credits = []
    this.revenus = []
    this.impayes = []
    this.assurances = []
    this.rendez_vous = []
}




}

