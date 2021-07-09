import pandas as pd
import json

INTERESTING = (
    # "dossier_id",
    "personnes_a_charge",
    "total_assurances",
    "total_charge",
    "total_charge_maison",
    "total_charge_divers",
    "total_charge_impots",
    "total_charge_assurances",
    "total_credits",
    "total_impayes",
    "total_revenus",
    "total_revenu_salaire",
    "total_retraite",
    "total_pension",
    "total_allocation",
    "total_aide",
    "total_revenu_autre",
    # "classification",
    "_ACCIDENT_DE_LA_VIE",
    "_CESSATION_PAIEMENT",
    "_DIFFICULTES_DE_GESTION",
    "_ENDETTEMENT",
    "_IMPAYES",
    "_MICROCREDIT_PERSONNEL",
    "_PROCEDURES_COLLECTIVES",
    "_REDRESSEMENT_JUDICIAIRE",
    "_ARTISANAT",
    "_AUTRE",
    "_CADRE",
    "_CHOMEUR",
    "_EMPLOYE",
    "_ENTREPRENEUR",
    "_FONCTIONNAIRE",
    "_FONCTIONNAIRE_CADRE",
    "_INVALIDE",
    "_RETRAITE",
    "_SANS_EMPLOI",
    "_CELIBATAIRE",
    "_CONCUBINAGE",
    "_DIVORCE",
    "_MARIE",
    "_PACS",
    "_SEPARE",
    "_VEUF",
    "_CO_LOCATAIRE",
    "_HEBERGE_A_TITRE_GRATUIT",
    "_LOCATAIRE",
    "_PROPRIETAIRE",
    "RAV",
)


def transform(json_string):
    df = pd.read_json(json_string)

    df = df.drop(
        columns=[
            "beneficiaire_id",
            "conjoint",
            "conjoint_id",
            "dossier_id",
            "etat",
            "orientation",
            "partenaire",
            "partenaire_id",
            "rendez_vous",
            "rest_a_vivre",
            "structure",
            "structure_id",
            "suivi",
            "taux_endetement",
            "total_assurance",
            "total_charges",
            "total_credit",
            "total_impaye",
            "total_mensualite",
            "total_revenu",
        ]
    )

    df["personnes_a_charge"] = 0
    df["personnes_a_charge"] = df["beneficiaire"][0]["personnes_a_charge"]

    df["profession"] = 0
    df["profession"] = df["beneficiaire"][0]["profession"]
    df["situation_familiale"] = 0
    df["situation_familiale"] = df["beneficiaire"][0]["situation_familiale"]

    l = [
        "_ACCIDENT_DE_LA_VIE",
        "_CESSATION_PAIEMENT",
        "_DIFFICULTES_DE_GESTION",
        "_ENDETTEMENT",
        "_IMPAYES",
        "_MICROCREDIT_PERSONNEL",
        "_PROCEDURES_COLLECTIVES",
        "_REDRESSEMENT_JUDICIAIRE",
    ]
    for i in l:
        df[i] = 0
        if df["nature"][0] == i:
            df[i] = 1

    l = [
        "_ARTISANAT",
        "_AUTRE",
        "_CADRE",
        "_CHOMEUR",
        "_EMPLOYE",
        "_ENTREPRENEUR",
        "_FONCTIONNAIRE",
        "_FONCTIONNAIRE_CADRE",
        "_INVALIDE",
        "_RETRAITE",
        "_SANS_EMPLOI",
        "_CELIBATAIRE",
        "_CONCUBINAGE",
        "_DIVORCE",
        "_MARIE",
        "_PACS",
        "_SEPARE",
        "_VEUF",
        "_CO_LOCATAIRE",
        "_HEBERGE_A_TITRE_GRATUIT",
        "_LOCATAIRE",
        "_PROPRIETAIRE",
    ]
    for i in l:
        df[i] = 0
        if df["beneficiaire"][0]["profession"] == i:
            df[i] = 1

    l = ["_HEBERGE_A_TITRE_GRATUIT", "_LOCATAIRE", "_NON_RENSEIGNE", "_PROPRIETAIRE"]
    for i in l:
        df[i] = 0
        if df["beneficiaire"][0]["type_logement"] == i:
            df[i] = 1

    def somme_assurance(i):
        somme = 0
        for j in range(len(df["assurances"][i])):
            somme = somme + df["assurances"][i][j]["montant"]
        return somme

    df["total_assurances"] = 0
    for i in range(len(df)):
        df["total_assurances"][i] = somme_assurance(i)
    df = df.drop(columns=["assurances"])

    def somme_charges(i):
        somme = 0
        for j in range(len(df["charges"][i])):
            somme = somme + df["charges"][i][j]["montant"]
        return somme

    df["total_charge"] = 0
    for i in range(len(df)):
        df["total_charge"][i] = somme_charges(i)

    def somme_charges_2(i):
        somme_maison = 0
        somme_divers = 0
        somme_impots = 0
        somme_assurances = 0
        for j in range(len(df["charges"][i])):
            if df["charges"][i][j]["type"] == "MAISON":
                somme_maison = somme_maison + df["charges"][i][j]["montant"]
            if df["charges"][i][j]["type"] == "DIVERS":
                somme_divers = somme_maison + df["charges"][i][j]["montant"]
            if df["charges"][i][j]["type"] == "IMPOTS":
                somme_impots = somme_maison + df["charges"][i][j]["montant"]
            if df["charges"][i][j]["type"] == "ASSURANCES":
                somme_assurances = somme_maison + df["charges"][i][j]["montant"]
        return somme_maison, somme_divers, somme_impots, somme_assurances

    df["total_charge_maison"] = 0
    df["total_charge_divers"] = 0
    df["total_charge_impots"] = 0
    df["total_charge_assurances"] = 0

    for i in range(len(df)):
        somme_maison, somme_divers, somme_impots, somme_assurances = somme_charges_2(i)
        df["total_charge_maison"][i] = somme_maison
        df["total_charge_divers"][i] = somme_divers
        df["total_charge_impots"][i] = somme_impots
        df["total_charge_assurances"][i] = somme_assurances
    df = df.drop(columns=["charges"])

    def somme_credits(i):
        somme = 0
        for j in range(len(df["credits"][i])):
            somme = somme + df["credits"][i][j]["mensualite"]
        return somme

    df["total_credits"] = 0
    for i in range(len(df)):
        df["total_credits"][i] = somme_credits(i)
    df = df.drop(columns=["credits"])

    def somme_impaye(i):
        somme = 0
        for j in range(len(df["impayes"][i])):
            somme = somme + df["impayes"][i][j]["montant"]
        return somme

    df["total_impayes"] = 0
    for i in range(len(df)):
        df["total_impayes"][i] = somme_impaye(i)
    df = df.drop(columns=["impayes"])

    df["personnes_a_charge"][df["personnes_a_charge"] < 0] = 0

    def somme_revenus(i):
        somme = 0
        for j in range(len(df["revenus"][i])):
            somme = somme + df["revenus"][i][j]["montant"]
        return somme

    df["total_revenus"] = 0
    for i in range(len(df)):
        df["total_revenus"][i] = somme_revenus(i)
    import re

    def somme_revenus_2(i):
        somme_salaire = 0
        somme_retraite = 0
        somme_pension = 0
        somme_allocation = 0
        somme_aide = 0
        somme_autre = 0

        for j in range(len(df["revenus"][i])):

            # Salaire / Retraite
            if re.compile(".*alair*").match(df["revenus"][i][j]["nom"]) != None:
                somme_salaire = somme_salaire + df["revenus"][i][j]["montant"]

            elif re.compile(".*activit*").match(df["revenus"][i][j]["nom"]) != None:
                somme_salaire = somme_salaire + df["revenus"][i][j]["montant"]

            elif re.compile(".*travail*").match(df["revenus"][i][j]["nom"]) != None:
                somme_salaire = somme_salaire + df["revenus"][i][j]["montant"]

            #  Retraite

            elif re.compile(".*retraite*").match(df["revenus"][i][j]["nom"]) != None:
                somme_retraite = somme_retraite + df["revenus"][i][j]["montant"]

            elif (
                re.compile(".*omplementaire*").match(df["revenus"][i][j]["nom"]) != None
            ):
                somme_retraite = somme_retraite + df["revenus"][i][j]["montant"]

            # Pension

            elif re.compile(".*ension*").match(df["revenus"][i][j]["nom"]) != None:
                somme_pension = somme_pension + df["revenus"][i][j]["montant"]

            elif re.compile(".*nvalidit*").match(df["revenus"][i][j]["nom"]) != None:
                somme_pension = somme_pension + df["revenus"][i][j]["montant"]

            elif re.compile(".*rente*").match(df["revenus"][i][j]["nom"]) != None:
                somme_pension = somme_pension + df["revenus"][i][j]["montant"]

            # Allocation

            elif re.compile(".*lloc*").match(df["revenus"][i][j]["nom"]) != None:
                somme_allocation = somme_allocation + df["revenus"][i][j]["montant"]

            elif re.compile(".*apl*").match(df["revenus"][i][j]["nom"]) != None:
                somme_allocation = somme_allocation + df["revenus"][i][j]["montant"]

            elif re.compile(".*caf*").match(df["revenus"][i][j]["nom"]) != None:
                somme_allocation = somme_allocation + df["revenus"][i][j]["montant"]

            # Aide

            elif re.compile(".*ide*").match(df["revenus"][i][j]["nom"]) != None:
                somme_aide = somme_aide + df["revenus"][i][j]["montant"]

            elif (
                re.compile(".*articipation*").match(df["revenus"][i][j]["nom"]) != None
            ):
                somme_aide = somme_aide + df["revenus"][i][j]["montant"]

            # Autre
            else:
                somme_autre = somme_autre + df["revenus"][i][j]["montant"]

        return (
            somme_salaire,
            somme_retraite,
            somme_pension,
            somme_allocation,
            somme_aide,
            somme_autre,
        )

    df["total_revenu_salaire"] = 0
    df["total_retraite"] = 0
    df["total_pension"] = 0
    df["total_allocation"] = 0
    df["total_aide"] = 0
    df["total_revenu_autre"] = 0

    for i in range(len(df)):
        (
            somme_salaire,
            somme_retraite,
            somme_pension,
            somme_allocation,
            somme_aide,
            somme_autre,
        ) = somme_revenus_2(i)
        df["total_revenu_salaire"][i] = somme_salaire
        df["total_retraite"][i] = somme_retraite
        df["total_pension"][i] = somme_pension
        df["total_allocation"][i] = somme_allocation
        df["total_aide"][i] = somme_aide
        df["total_revenu_autre"][i] = somme_autre

    df = df.drop(columns=["revenus"])

    df["RAV"] = (
        df["total_revenus"]
        - df["total_credits"]
        - df["total_charge"]
        - df["total_assurances"]
    )

    df["classification"] = 0
    df.loc[df["RAV"] <= 100, "classification"] = "A"
    df.loc[(df["RAV"] > 100) & (df["RAV"] <= 400), "classification"] = "B"
    df.loc[df["RAV"] > 400, "classification"] = "C"

    df = df.drop(
        columns=[
            "beneficiaire",
            "categorie",
            "nature",
            "profession",
            "situation_familiale",
        ]
    )

    dossier = json.loads(df.to_json())
    print(dossier)
    return [dossier[key]["0"] for key in INTERESTING]
