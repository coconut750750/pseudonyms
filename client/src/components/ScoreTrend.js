import React from 'react';
import { LinearScale } from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';

import {
  STYLES,
  secToTime,
} from '../utils/const';

import './ScoreTrend.css';

class ScoreTrendScale extends LinearScale {
  buildTicks() {
    return this.chart.data.annotations.map((v, i) => ({
      value: v.value,
      label: v.annotation,
      color: this.chart.data.color.indexToColor(i),
      major: false,
    }));
  }

  generateTickLabels(ticks) {
    // label already generated in buildTicks, override for noop
  }
}

ScoreTrendScale.id = 'scoreTrendScale';
Chart.register(ScoreTrendScale);

const generateLabels = (guessEndTimes) => ([0, ...guessEndTimes.map(t => t)]);

const clueToAnnotation = (clue) => (`${clue.word} : ${clue.count}`);

const generateAnnotations = (clueHistory, clueEndTimes, suffix) => {
  const annotations = clueHistory.map(c => clueToAnnotation(c)).concat(suffix);
  return clueEndTimes.map((t, i) => ({ value: t, annotation: annotations[i] }));
};

const generateDataset = (name, color, trend) => ({
  label: name,
  fill: false,
  tension: 0.1,
  backgroundColor: color,
  borderColor: color,
  borderWidth: 3,
  data: trend,
  pointRadius: 0,
});

const generateXAxisStyle = (defaultColor, max) => ({
  min: 0,
  max: max,
  type: 'scoreTrendScale',
  ticks: {
    padding: 0,
    font: STYLES.font,
    color: (context) => context.tick.color,
    autoSkip: false,
    maxRotation: 60,
    minRotation: 60,
  },
  grid: {
    // display: false,
    drawBorder: false,
    drawOnChartArea: false,
    color: defaultColor,
  },
  title: {
    display: true,
    text: 'Clues over time',
    font: STYLES.font,
    color: defaultColor,
  },
});

const generateYAxisStyle = (defaultColor, max) => ({
  min: 0,
  max,
  ticks: {
    beginAtZero: true,
    font: STYLES.font,
    color: defaultColor,
    stepSize: 1,
    autoSkip: false,
  },
  grid: {
    color: defaultColor,
    drawBorder: false,
  },
  title: {
    display: true,
    text: 'Words left',
    font: STYLES.font,
    color: defaultColor,
  },
});

const otherChartOptions = {
  plugins: {
    legend: false,
  },
  events: [],
  layout: {
    padding: 20,
  },
  animation: {
    duration: 500,
  },
  maintainAspectRatio: false,
};

const plugins = [{
  afterDatasetsDraw: function(chart) {
    const ctx = chart.ctx;
    const y_axis = chart.scales['y'];
    const topY = y_axis.top;
    const bottomY = y_axis.bottom;

    ctx.lineWidth = 1;

    const linePositions = chart.data.labels.slice(1);

    linePositions.forEach((t, index) => {
      const x = chart.scales.x.getPixelForValue(t)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.strokeStyle = chart.data.color.indexToColor(index);
      ctx.stroke();
      ctx.restore();
    });

    let t = linePositions[linePositions.length - 1];
    let x = chart.scales.x.getPixelForValue(t);
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = STYLES.font.size + 'px ' + STYLES.font.family;
    ctx.fillStyle = chart.data.color.defaultColor;
    ctx.fillText(secToTime(t), x, topY - STYLES.font.size);
    ctx.restore();
  },
}];

export default function ScoreTrend({
  clueHistory,
  guessEndTimes,
  clueEndTimes,
  annotationSuffix,
  datasets,
  indexToColor,
  defaultColor,
  xMax,
  yMax,
}) {
  return (
    <div className="scoreTrend">
      <Line
        data={{
          labels: generateLabels(guessEndTimes),
          annotations: generateAnnotations(clueHistory, clueEndTimes, annotationSuffix),
          datasets: datasets.map(d => generateDataset(d.name, d.color, d.trend)),
          color: {
            defaultColor: defaultColor,
            indexToColor: indexToColor,
          },
        }}
        plugins={plugins}
        options={{
          ...otherChartOptions,
          scales: {
            x: generateXAxisStyle(
              defaultColor,
              xMax,
            ),
            y: generateYAxisStyle(
              defaultColor,
              yMax,
            ),
          }
        }}
      />
    </div>
  );
};
