from scipy.stats import norm
import numpy as np
import os
import logging

logging.basicConfig(level=logging.INFO)

PATH = __file__


def save_model(data, assignments, means):
    gaussienne = []
    data_class = [[] for _ in range(len(means))]
    for i, d in enumerate(data):
        data_class[assignments[i]].append(d)

    for c in data_class:
        gaussienne.append([])
        for dim in range(len(data[0])):
            x_points = [point[dim] for point in c]
            gaussienne[-1].append(norm.fit(x_points))

    # Write the array to disk
    with open(PATH[:-16] + "/../trained_model/EM_model.txt", "w") as outfile:
        for data_slice in gaussienne:
            line = ""
            for tuple in data_slice:
                line += str(tuple) + ";"
            line += "\n"
            outfile.write(line)


def load_model():
    file = open(PATH[:-16] + "/../trained_model/EM_model.txt", "r")
    lines = file.readlines()
    file.close()

    gaussiennes = []

    for line in lines:
        l = line.rstrip("\n").split(";")
        l = l[:-1]
        for i, tuple in enumerate(l):
            l[i] = eval(tuple)
        gaussiennes.append(l)

    return gaussiennes


def predict(gaussiennes, data):

    point = data

    def gaussian(x, mean, sig):
        return np.exp(-np.power(x - mean, 2.0) / (2 * np.power(sig, 2.0)))

    def gaussian_n(gaussienne, point):
        s = 0
        index = 0
        for x, (mean, sigma) in zip(point, gaussienne):
            if sigma != 0:
                s += gaussian(x, mean, sigma)
                index += 1
        if index == 0:
            return 0
        s /= index
        return s

    values = [gaussian_n(gaussiennes[i], point) for i in range(len(gaussiennes))]

    return cluster_decision(values)


def cluster_decision(values):
    clusters = {
        0: {0: 1.0},
        1: {3: 0.8, 4: 1.0},
        2: {3: 1.0, 4: 0.8, 1: 0.2},
        3: {1: 0.8, 2: 1},
    }
    c = [0 for _ in clusters.keys()]

    for cluster, cluster_data in clusters.items():
        c[cluster] = sum(
            [values[accepted] * facteur for accepted, facteur in cluster_data.items()]
        ) / len(cluster_data)

    logging.info("PROBA D'APPARTENIR A UN CLUSTER :")
    logging.info(values)
    logging.info("PROBA D'APPARTENIR A UNE CLASSE :")
    logging.info(c)
    logging.info("CLASSE TROUVEE : ")
    logging.info(c.index(max(c)))

    return c.index(max(c))
