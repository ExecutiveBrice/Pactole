objectif = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1]

IA = [
    [1, 0, 0, 0, 1, 1, 0, 1, 1, 1],
    [0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 1, 0, 1, 0],
    [0, 1, 1, 0, 1, 0, 1, 1, 1, 1],
    [0, 1, 0, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 1, 1],
    [0, 1, 0, 0, 1, 1, 1, 1, 0, 1],
]


def precision(ia):
    p = 0
    for a, b in zip(objectif, ia):
        if a == b:
            p += 1
    return p / len(objectif) * 100


def superIA(IA):
    s = [0 for _ in range(len(IA[0]))]
    for ia in IA:
        for i, v in enumerate(ia):
            s[i] += v
    for i, data in enumerate(s):
        if data >= len(IA) / 2:
            s[i] = 1
        else:
            s[i] = 0
    return s


p = []
for i, ia in enumerate(IA):
    p.append(precision(ia))
    print("Precision ia " + str(i) + " : " + str(precision(ia)) + " %")

print("\nPrecision moyenne : " + str(sum(p) / len(p)) + " %")

si = superIA(IA)

print("\nMoyenne des ia : " + str(si) + ", precision : " + str(precision(si)) + " %")
