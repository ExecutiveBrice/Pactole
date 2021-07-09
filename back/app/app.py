## Global Imports
import os
import sys
import json
import logging
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin

## Personal import
from model import basic, esperance_maximisation
from flask_mysqldb import MySQL
from model.utils.transform import transform

app = Flask(__name__)


app.config["MYSQL_HOST"] = "127.0.0.1"
app.config["MYSQL_USER"] = "essai"
app.config["MYSQL_PASSWORD"] = "essai"
app.config["MYSQL_DB"] = "ep2"
app.config["MYSQL_PORT"] = 3306
app.config["MYSQL_DATABASE_SOCKET"] = "/tmp/mysql.sock"

mysql = MySQL(app)


app.config["CORS_HEADERS"] = "Content-Type"
cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:port"}})


logging.basicConfig(level=logging.INFO)


@app.errorhandler(404)
def not_found(error):
    """Used function in order to return 404 code when non-existing route

    Args:
        error : catched error when using non-existing route

    Returns:
        JSON that contains "Resource not found" message and returned code 404
    """
    return make_response(
        jsonify({"error": 'Resource not found: "{0}"'.format(error)}), 404
    )


@app.errorhandler(405)
def method_not_allowed(error):
    """Used function in order to return 405 code when not allowed method on concerned route

    Args:
        error : catched error when using not allowed method

    Returns:
        JSON that contains "Bad request method" message and returned code 405
    """
    return make_response(
        jsonify({"error": 'Bad request method: "{0}"'.format(error)}), 405
    )


## Root
@app.route("/ia", methods=["POST", "GET"])
@cross_origin(origin="localhost", headers=["Content- Type", "Authorization"])
def ia():
    """Used function in order to avoid 404 return on POST or GET methods on the root

    Returns:
        JSON that contains "'API': 'EMAC'" and returned code 200
    """
    if request.method == "POST":
        """modify/update the information for <user_id>"""
        # you can use <user_id>, which is a str but could
        # changed to be int or whatever you want, along
        # with your lxml knowledge to make the required
        # changes
        dossier = request.json  # a multidict containing POST data

        prediction = esperance_maximisation.predict(dossier)

        reponse = {
            "dossier_id": dossier["dossier_id"],
            "categorie": prediction,
            "criteres": ["impayé", "credit"],
        }

    return make_response(jsonify(reponse), 200)


## Root
@app.route("/", methods=["POST", "GET"])
def index():
    """Used function in order to avoid 404 return on POST or GET methods on the root

    Returns:
        JSON that contains "'API': 'EMAC'" and returned code 200
    """
    return make_response(jsonify({"API": "EMAC"}), 200)


## Update route
@app.route("/update", methods=["POST"])
@cross_origin(origin="localhost", headers=["Content- Type", "Authorization"])
def update():
    """Used function in order to update a beneficiary. It receives data from front, checks the request
    then calls the IA function to know the associated indebtedness status.

    Returns:
        If the done request is well done, it returns JSON that contains the beneficiary's ID and its indebtedness status with 200 HTTP code.
        If not, it returns a JSON that explain why and the associated HTTP code.
    """
    logging.info("Received a request on route : update")

    dossier = request.json

    if len(dossier["charges"]):



        dossier_formatted = json.dumps(dossier)
        dossier_formatted = transform("[" + dossier_formatted + "]")
        logging.info(dossier_formatted)

        prediction = esperance_maximisation.prediction(dossier_formatted)

        print(dossier["dossier_id"])
        reponse = {
            "dossier_id": dossier["dossier_id"],
            "categorie": prediction,
            "criteres": ["impayé", "credit"],
        }

        return make_response(jsonify(reponse), 200)

    else :
        reponse2 = {
        "dossier_id": dossier["dossier_id"],
        "categorie": 0,
        "criteres": ["impayé", "credit"],
        }

        return make_response(jsonify(reponse2), 200)


@app.route("/sql", methods=["GET"])
def sql():
    """Used function in order to avoid 404 return on POST or GET methods on the root

    Returns:
        JSON that contains "'API': 'EMAC'" and returned code 200
    """

    cur = mysql.connection.cursor()

    cur.execute("SELECT dossier.dossier_id, dossier.partenaire_id, dossier.beneficiaire_id, dossier.conjoint_id, dossier.structure_id, dossier.nature, dossier.etat, dossier.orientation, dossier.suivi FROM dossier, beneficiaire, budget  WHERE dossier.beneficiaire_id = beneficiaire.beneficiaire_id AND budget.id_dossier = dossier.dossier_id ")
    dossier_headers=[x[0] for x in cur.description] #this will extract row headers

    dossiers_results = cur.fetchall()

    json_dossiers = []
    for dossier in dossiers_results:

        idPartenaire = dossier[1]
        if idPartenaire is not None:
            cur.execute(
                "SELECT partenaire.nom, partenaire.type_plateforme FROM partenaire WHERE partenaire.partenaire_id = %s",
                (idPartenaire,),
            )
            partenaire_headers = [
                x[0] for x in cur.description
            ]  # this will extract row headers
            partenaire_result = cur.fetchone()
            json_partenaire = dict(zip(partenaire_headers, partenaire_result))

        idBeneficiaire = dossier[2]
        if idBeneficiaire is not None:
            cur.execute(
                "SELECT beneficiaire.nom, beneficiaire.prenom, beneficiaire.sexe, beneficiaire.date_naissance, beneficiaire.adresse, beneficiaire.complement_adresse, beneficiaire.code_postal, beneficiaire.ville, beneficiaire.pays, beneficiaire.telephone_fixe, beneficiaire.telephone_mobile, beneficiaire.email, beneficiaire.profession, beneficiaire.type_logement, beneficiaire.situation_familiale, beneficiaire.personnes_a_charge, beneficiaire.ages_personnes_a_charge, beneficiaire.profession_detail FROM beneficiaire WHERE beneficiaire.beneficiaire_id = %s",
                (idBeneficiaire,),
            )
            beneficiaire_headers = [
                x[0] for x in cur.description
            ]  # this will extract row headers
            beneficiaire_results = cur.fetchone()
            json_beneficiaire = dict(zip(beneficiaire_headers, beneficiaire_results))

        idConjoint = dossier[2]
        if idConjoint is not None:
            cur.execute(
                "SELECT beneficiaire.nom, beneficiaire.prenom, beneficiaire.sexe, beneficiaire.date_naissance, beneficiaire.adresse, beneficiaire.complement_adresse, beneficiaire.code_postal, beneficiaire.ville, beneficiaire.pays, beneficiaire.telephone_fixe, beneficiaire.telephone_mobile, beneficiaire.email, beneficiaire.profession, beneficiaire.type_logement, beneficiaire.situation_familiale, beneficiaire.personnes_a_charge, beneficiaire.ages_personnes_a_charge, beneficiaire.profession_detail FROM beneficiaire WHERE beneficiaire.beneficiaire_id = %s",
                (idConjoint,),
            )
            conjoint_headers = [
                x[0] for x in cur.description
            ]  # this will extract row headers
            conjoint_results = cur.fetchone()
            json_conjoint = dict(zip(conjoint_headers, conjoint_results))

        idStructure = dossier[4]
        if idStructure is not None:
            cur.execute(
                "SELECT structure.nom, structure.type FROM structure WHERE structure.structure_id = %s",
                (idStructure,),
            )
            structure_headers = [
                x[0] for x in cur.description
            ]  # this will extract row headers
            structure_results = cur.fetchone()
            json_structure = dict(zip(structure_headers, structure_results))

        idDossier = dossier[0]
        cur.execute(
            "SELECT charges.nom, charges.montant, charges.`type`, charges.id FROM budget, charges WHERE charges.montant > 0 AND charges.id_budget = budget.id AND budget.id_dossier = %s",
            (idDossier,),
        )
        charges_headers = [
            x[0] for x in cur.description
        ]  # this will extract row headers
        charges_results = cur.fetchall()

        total_charges = 0
        json_charges = []
        for charge in charges_results:
            total_charges = total_charges + charge[1]
            json_charges.append(dict(zip(charges_headers, charge)))

        cur.execute(
            "SELECT assurances.nom, assurances.montant, assurances.id FROM budget, assurances WHERE assurances.montant > 0 AND assurances.id_budget = budget.id AND budget.id_dossier = %s",
            (idDossier,),
        )
        assurances_headers = [
            x[0] for x in cur.description
        ]  # this will extract row headers
        assurances_results = cur.fetchall()

        total_assurance = 0
        json_assurances = []
        for assurance in assurances_results:
            total_assurance = total_assurance + assurance[1]
            json_assurances.append(dict(zip(assurances_headers, assurance)))

        cur.execute(
            "SELECT credits.`type`, credits.organisme, credits.mensualite, credits.crd,credits.date_octroi, credits.proposition_cresus, credits.validation_creancier, credits.taux, credits.taux_cresus, credits.id FROM budget, credits WHERE credits.id_budget = budget.id AND credits.crd > 0 AND budget.id_dossier = %s",
            (idDossier,),
        )
        credits_header = [
            x[0] for x in cur.description
        ]  # this will extract row headers
        credits_results = cur.fetchall()

        total_mensualite = 0
        pause_credit = False
        total_credit = 0
        json_credits = []
        for credit in credits_results:
            if credit[2] == 0:
                pause_credit = True
            total_credit = total_credit + credit[3]
            total_mensualite = total_mensualite + credit[2]
            json_credits.append(dict(zip(credits_header, credit)))

        cur.execute(
            "SELECT impayes.nom, impayes.montant, impayes.id FROM budget, impayes WHERE impayes.montant > 0 AND impayes.id_budget = budget.id AND budget.id_dossier = %s",
            (idDossier,),
        )
        impayes_header = [
            x[0] for x in cur.description
        ]  # this will extract row headers
        impayes_results = cur.fetchall()

        total_impaye = 0
        json_impayes = []
        for impaye in impayes_results:
            total_impaye = total_impaye + impaye[1]
            json_impayes.append(dict(zip(impayes_header, impaye)))

        cur.execute(
            "SELECT revenus.nom, revenus.montant, revenus.id FROM budget, revenus WHERE revenus.montant > 0 AND revenus.id_budget = budget.id AND budget.id_dossier = %s",
            (idDossier,),
        )
        revenus_header = [
            x[0] for x in cur.description
        ]  # this will extract row headers
        revenus_results = cur.fetchall()

        total_revenu = 0
        json_revenus = []
        for revenu in revenus_results:
            total_revenu = total_revenu + revenu[1]
            json_revenus.append(dict(zip(revenus_header, revenu)))

        cur.execute(
            "SELECT rendez_vous.date_debut_rdv, rendez_vous.date_fin_rdv, rendez_vous.agent_cresus_id FROM rendez_vous WHERE rendez_vous.dossier_id = %s",
            (idDossier,),
        )
        rendez_vous_header = [
            x[0] for x in cur.description
        ]  # this will extract row headers
        rendez_vous_results = cur.fetchall()

        json_rendez_vous = []
        for rendez_vous in rendez_vous_results:
            json_rendez_vous.append(dict(zip(rendez_vous_header, rendez_vous)))

        rav = (
            total_revenu
            - total_assurance
            - total_charges
            - total_mensualite
            - total_impaye
        )
        taux_endetement = 0
        if total_mensualite > 0:
            taux_endetement = total_revenu / total_mensualite * 100
        categorie = ""
        if rav <= 100:
            categorie = "A"
        elif rav < 400:
            categorie = "B"
        elif rav > 400:
            categorie = "C"

        if (
            rav > 400
            and total_impaye < 10
            and pause_credit != True
            and taux_endetement < 35
        ):
            categorie = "D"

        jsonObject = dict(
            zip(dossier_headers, dossier),
            categorie=categorie,
            rest_a_vivre=rav,
            taux_endetement=taux_endetement,
            total_mensualite=total_mensualite,
            total_impaye=total_impaye,
            total_assurance=total_assurance,
            total_charges=total_charges,
            total_credit=total_credit,
            total_revenu=total_revenu,
            rendez_vous=json_rendez_vous,
            conjoint=json_conjoint,
            partenaire=json_partenaire,
            beneficiaire=json_beneficiaire,
            structure=json_structure,
            revenus=json_revenus,
            impayes=json_impayes,
            credits=json_credits,
            charges=json_charges,
            assurances=json_assurances,
        )

        json_dossiers.append(jsonObject)
    cur.close()

    with open("data.json", "w", encoding="utf-8") as f:
        json.dump(
            json_dossiers, f, ensure_ascii=False, indent=4, sort_keys=True, default=str
        )

    return make_response(jsonify("json_dossiers"), 200)


app.run(host="0.0.0.0", port=5000)
