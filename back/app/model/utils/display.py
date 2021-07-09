import numpy as np
import tensorflow.compat.v1 as tf
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from matplotlib.widgets import Slider, Button
from scipy.integrate import quad
import scipy.stats
from scipy.stats import norm


def setSliders(t0, n_step, dim, dim_0=0):
    # adjust the main plot to make room for the sliders
    plt.subplots_adjust(left=0.25, bottom=0.25)
    axcolor = "lightgoldenrodyellow"

    # Make a horizontal slider to control the frequency.
    axTime = plt.axes([0.25, 0.1, 0.65, 0.03], facecolor=axcolor)
    time_slider = Slider(
        ax=axTime,
        label="Time",
        valmin=0,
        valmax=n_step - 1,
        valinit=t0,
    )

    # Make a vertically oriented slider to control the amplitude
    axDim = plt.axes([0.1, 0.25, 0.0225, 0.63], facecolor=axcolor)
    dim_slider = Slider(
        ax=axDim,
        label="Dimension",
        valmin=0,
        valmax=dim - 1,
        valinit=dim_0,
        orientation="vertical",
    )

    return time_slider, dim_slider


def plot_clustered_data(ax, points, c_means, c_assignments, dim1, clusters):
    """Plots the cluster-colored data and the cluster means"""
    colors = cm.rainbow(np.linspace(0, 1, clusters))
    i = 0
    for cluster, color in zip(range(clusters), colors):
        c_points = points[c_assignments == cluster]
        ax.plot(
            c_points[:, dim1],
            [0 for _ in range(len(c_points[:, dim1]))],
            ".",
            color=color,
            zorder=0,
        )
        ax.plot(c_means[cluster, dim1], 0, ".", color="black", zorder=1)
        plot_gaussienne(ax, c_points[:, dim1], color, i)
        i = i + 1


def plot_gaussienne(ax, x_points, color, legend=None, i=None):
    if len(x_points) > 1:
        x = np.linspace(min(x_points), max(x_points), 1000)
        mu, std = norm.fit(x_points)

        y = scipy.stats.norm.pdf(x, mu, std)

        if legend is not None:
            ax.plot(x, y, color=color, label=legend)
            ax.legend()
        else:
            ax.plot(x, y, color=color, label=f"cluster {i}")
            ax.legend()


def plot_fig(
    data,
    save_means,
    save_assignments,
    current_means,
    current_assignments,
    n_step,
    clusters,
    dim,
    names,
    classe,
):
    # The function to be called anytime a slider's value changes
    def update(val):
        ax.clear()
        axs[1].clear()
        dim = round(dim_slider.val)
        t = round(time_slider.val)
        axs[1].set_xlabel(names[dim])
        plot_clustered_data(ax, data, save_means[t], save_assignments[t], dim, clusters)
        plot_categories(axs[1], data, classe, dim)
        fig.canvas.draw_idle()

    # Create the figure and the line that we will manipulate
    fig, axs = plt.subplots(2)
    ax = axs[0]

    plot_clustered_data(ax, data, current_means, current_assignments, 0, clusters)
    plot_categories(axs[1], data, classe, 0)

    axs[1].set_xlabel(names[0])

    time_slider, dim_slider = setSliders(n_step, n_step, dim)

    # register the update function with each slider
    time_slider.on_changed(update)
    dim_slider.on_changed(update)

    plt.show()


def plot_categories(ax, points, classes, dim1):
    colors = cm.rainbow(np.linspace(0, 1, 3))

    for cluster, color in zip(["A", "B", "C"], colors):
        c_points = [p for i, p in enumerate(points) if classes[i] == cluster]
        ax.plot(
            [d[dim1] for d in c_points],
            [0 for _ in range(len([d[dim1] for d in c_points]))],
            ".",
            color=color,
            zorder=0,
        )

        plot_gaussienne(ax, [d[dim1] for d in c_points], color, cluster)
