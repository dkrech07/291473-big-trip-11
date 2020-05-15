import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {calculateTripDuration} from "../utils/common";

const BAR_HEIGHT = 55;
const ICON_SIZE = 20;

const getUniqueTripTypes = (type, index, array) => {
  return array.indexOf(type) === index;
};

const calculateUniqueCost = (points, type) => {
  return points.filter((point) => point.type.toUpperCase() === type).length;
};

const calculateUniquePrice = (points, type) => {
  let priceSum = 0;
  const pointsCosts = points.reduce((acc, point) => {
    if (point.type.toUpperCase() === type) {
      priceSum += point.price;
      acc[point.type.toUpperCase()] = priceSum;
    }
    return acc;
  }, {});

  return pointsCosts[type];
};

const calculateUniqueTimeSpent = (points, type) => {
  let timeSum = 0;
  const pointsTimeSpend = points.reduce((acc, point) => {
    if (point.type.toUpperCase() === type) {
      const durationTime = calculateTripDuration(point.departure, point.arrival);
      timeSum += durationTime.asHours();
      acc[point.type.toUpperCase()] = Math.round(timeSum);
    }
    return acc;
  }, {});
  return pointsTimeSpend[type];
};

const getPointsType = (points) => {
  return points.map((point) => point.type.toUpperCase()).filter(getUniqueTripTypes);
};

const chartCallback = (animation) => {
  const chart = animation.chart;
  const axisY = chart.scales[`y-axis-0`];
  const ticks = axisY.ticks;
  const fontSize = axisY.options.ticks.fontSize;

  if (axisY.getPixelForTick(ticks.length - 1)) {
    ticks.forEach((tick, idx) => {

      const onLoadImage = (evt) => {
        const textParams = chart.ctx.font;
        chart.ctx.font = `normal ${fontSize}px sans-serif`;
        const tickWidth = chart.ctx.measureText(tick).width;
        chart.ctx.font = textParams;

        const tickY = axisY.getPixelForTick(idx) - fontSize;
        const tickX = axisY.right - tickWidth - (ICON_SIZE * 2);

        chart.ctx.drawImage(evt.target, tickX, tickY, ICON_SIZE, ICON_SIZE);
        evt.target.removeEventListener(`load`, onLoadImage);
      };

      const tickIcon = new Image();
      tickIcon.addEventListener(`load`, onLoadImage);
      tickIcon.src = `img/icons/${tick.toLowerCase()}.png`;
    });
  }
};

const renderMoneyChart = (moneyCtx, points) => {
  const pointTypes = getPointsType(points);
  const pointsCosts = pointTypes.map((type) => calculateUniquePrice(points, type));

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: pointTypes,
      datasets: [{
        data: pointsCosts,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        minBarLength: 50,
        barThickness: 44
      }]
    },
    options: {
      events: [`click`],
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      },
      animation: {
        onProgress: chartCallback
      }
    }
  });
};

const renderTransportChart = (transportCtx, points) => {
  const pointTypes = getPointsType(points).filter((point) => point !== `RESTAURANT` && point !== `CHECK-IN` && point !== `SIGHTSEEING`);
  const pointTypesCount = pointTypes.map((type) => calculateUniqueCost(points, type));

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: pointTypes,
      datasets: [{
        data: pointTypesCount,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        minBarLength: 50,
        barThickness: 44
      }]
    },
    options: {
      events: [`click`],
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      },
      animation: {
        onProgress: chartCallback
      }
    }
  });
};

const renderTimeSpentChart = (timeSpentCtx, points) => {
  const pointTypes = getPointsType(points);
  const pointTypesTimeSpent = pointTypes.map((type) => calculateUniqueTimeSpent(points, type));

  return new Chart(timeSpentCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: pointTypes,
      datasets: [{
        data: pointTypesTimeSpent,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        minBarLength: 50,
        barThickness: 44
      }]
    },
    options: {
      events: [`click`],
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}H`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      },
      animation: {
        onProgress: chartCallback
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor({points}) {
    super();

    this._points = points;

    this._daysChart = null;
    this._colorsChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this.rerender(this._points);
  }

  recoveryListeners() {}

  rerender(points) {
    this._points = points;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpentCtx = element.querySelector(`.statistics__chart--time`);

    moneyCtx.height = BAR_HEIGHT * 6;
    transportCtx.height = BAR_HEIGHT * 6;
    timeSpentCtx.height = BAR_HEIGHT * 6;

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._points.getPoints());
    this._transportChart = renderTransportChart(transportCtx, this._points.getPoints());
    this._timeSpendChart = renderTimeSpentChart(timeSpentCtx, this._points.getPoints());
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }
}
