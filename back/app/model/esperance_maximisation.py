import tensorflow.compat.v1 as tf

# Relative import
from .utils.display import plot_fig
from .utils.setData import set_datas
from .utils.model_manager import save_model, load_model, predict

tf.compat.v1.disable_eager_execution()


CLUSTERS = 6
TRAINING_STEPS = 1000
TOLERANCE = 0
N_STEP = 0
NAMES = None


def simulate(path=None):

    data, dimension, names, classe = set_datas(path)

    ################## BUILDING COMPUTATIONAL GRAPH ###################

    # model inputs: generated data points
    input = tf.placeholder(tf.float32, [None, dimension])

    # trainable variables: clusters means
    random_point_ids = tf.squeeze(
        tf.multinomial(tf.ones([1, tf.shape(input)[0]]), CLUSTERS)
    )
    means = tf.Variable(tf.gather(input, random_point_ids), dtype=tf.float32)

    # E-step: recomputing cluster assignments according to the current means
    inputs_ex, means_ex = tf.expand_dims(input, 0), tf.expand_dims(means, 1)
    distances = tf.reduce_sum(tf.squared_difference(inputs_ex, means_ex), 2)
    assignments = tf.argmin(distances, 0)

    # M-step: relocating cluster means according to the computed assignments
    sums = tf.unsorted_segment_sum(input, assignments, CLUSTERS)
    counts = tf.reduce_sum(tf.one_hot(assignments, CLUSTERS), 0)
    means_ = tf.divide(sums, tf.expand_dims(counts, 1))

    # distortion measure: sum of squared distances
    # from each point to the closest cluster mean
    distortion = tf.reduce_sum(tf.reduce_min(distances, 0))

    # updating the means by new values
    train_step = means.assign(means_)

    ################ RUNNING COMPUTATIONAL GRAPH ###################

    # creating session
    sess = tf.InteractiveSession()

    # initializing trainable variables
    sess.run(tf.global_variables_initializer(), feed_dict={input: data})

    previous_assignments = None

    # training loop
    save_means = []
    save_assignments = []
    n_step = 0
    for step in range(TRAINING_STEPS):
        n_step += 1
        # executing a training step and
        # fetching evaluation information
        distortion_measure, current_means, current_assignments, _ = sess.run(
            [distortion, means_, assignments, train_step], feed_dict={input: data}
        )
        save_means.append(current_means)
        save_assignments.append(current_assignments)

        if step > 0:
            # computing the number of re-assignments during the step
            re_assignments = (current_assignments != previous_assignments).sum()
            print(
                "{0}:\tdistortion {1:.2f}\tre-assignments {2}".format(
                    step, distortion_measure, re_assignments
                )
            )

            # stopping if no re-assignments occurred
            if re_assignments <= TOLERANCE:
                break
        else:
            print("{0}:\tdistortion {1:.2f}".format(step, distortion_measure))

        previous_assignments = current_assignments

    N_STEP = n_step

    save_model(data, current_assignments, current_means)

    plot_fig(
        data,
        save_means,
        save_assignments,
        current_means,
        current_assignments,
        N_STEP,
        CLUSTERS,
        dimension,
        names,
        classe,
    )


def prediction(data):
    gaussiennes = load_model()
    categorie = predict(gaussiennes, data)
    return categorie


def main(methode, path=None, data=None):

    if methode == "train":
        simulate(path)
    elif methode == "predict":
        p = prediction(data)
        print("Categorie prédite : ", p)
    else:
        print("Nothing to do for this methode")


if __name__ == "__main__":
    import plac

    plac.call(main)
