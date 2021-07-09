import numpy as np
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


def verification(dataset):
    interesting = []
    for key in INTERESTING:
        if test_none(key, dataset):
            interesting.append(key)
    return interesting


def test_none(key, dataset):
    n = len(dataset[INTERESTING[0]].values())
    s = 0
    for v in dataset[key].values():
        if v is not None:
            s += 1
    if s / n >= 0.95:
        return True
    print("KEY : " + key + " is not relevant.")
    return False


def set_datas(datasetPath):

    dataset_file = open(datasetPath, "r")
    dataset = json.load(dataset_file)

    interesting = verification(dataset)

    pass_data = [False for _ in range(len(dataset[interesting[0]].values()))]
    for key in interesting:
        for i, v in enumerate(dataset[key].values()):
            if v is None:
                pass_data[i] = True

    result = np.zeros(
        (len(pass_data) - sum(pass_data), len(interesting)),
        dtype=np.float32,
    )
    classe = []
    for i, v in enumerate(dataset["classification"].values()):
        if pass_data[i] is False:
            classe.append(v)

    for j, key in enumerate(interesting):
        index = 0
        for i, v in enumerate(dataset[key].values()):
            if pass_data[i] is False:
                result[index][j] = v
                index += 1

    return result, len(interesting), interesting, classe
