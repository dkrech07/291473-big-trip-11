import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {calculateTripDuration} from "../utils/common";

const BAR_HEIGHT = 55;
const ICON_SIZE = 20;

const ChartTitle = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME SPENT`
};

const getUniqueTripTypes = (type, index, allTripTypes) => {
  return allTripTypes.indexOf(type) === index;
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

const chartContent = (ctx, pointTypes, pointParameters, chartName, formatter) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: pointTypes,
      datasets: [{
        data: pointParameters,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        minBarLength: 50,
        barThickness: 40
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
          formatter,
        }
      },
      title: {
        display: true,
        text: `${chartName}`,
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

const renderMoneyChart = (moneyCtxElement, points) => {
  const pointTypes = getPointsType(points);
  const pointsCosts = pointTypes.map((type) => calculateUniquePrice(points, type));

  chartContent(moneyCtxElement, pointTypes, pointsCosts, ChartTitle.MONEY, (val) => `€ ${val}`);
};

const renderTransportChart = (transportCtxElement, points) => {
  const pointTypes = getPointsType(points).filter((point) => point !== `RESTAURANT` && point !== `CHECK-IN` && point !== `SIGHTSEEING`);
  const pointTypesCount = pointTypes.map((type) => calculateUniqueCost(points, type));

  chartContent(transportCtxElement, pointTypes, pointTypesCount, ChartTitle.TRANSPORT, (val) => `${val}x`);
};

const renderTimeSpentChart = (timeSpentCtxElement, points) => {
  const pointTypes = getPointsType(points);
  const pointTypesTimeSpent = pointTypes.map((type) => calculateUniqueTimeSpent(points, type));

  chartContent(timeSpentCtxElement, pointTypes, pointTypesTimeSpent, ChartTitle.TIME, (val) => `${val}H`);
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
  constructor(points) {
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

    const moneyCtxElement = element.querySelector(`.statistics__chart--money`);
    const transportCtxElement = element.querySelector(`.statistics__chart--transport`);
    const timeSpentCtxElement = element.querySelector(`.statistics__chart--time`);

    moneyCtxElement.height = BAR_HEIGHT * 6;
    transportCtxElement.height = BAR_HEIGHT * 7;
    timeSpentCtxElement.height = BAR_HEIGHT * 7;

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtxElement, this._points.getPoints());
    this._transportChart = renderTransportChart(transportCtxElement, this._points.getPoints());
    this._timeSpendChart = renderTimeSpentChart(timeSpentCtxElement, this._points.getPoints());
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
