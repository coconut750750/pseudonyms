import React from 'react';
import { LinearScale } from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';

import {
  STYLES,
} from '../utils/const';

import './ScoreTrend.css';

class ScoreTrendScale extends LinearScale {
  buildTicks() {
    return this.chart.data.annotations.map(v => ({
      value: v.value,
      label: [v.annotation],
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

const generateXAxisStyle = (color, max) => ({
  min: 0,
  max: max,
  type: 'scoreTrendScale',
  ticks: {
    padding: 0,
    font: {
      family: STYLES.font,
      size: STYLES.fontSize,
    },
    color,
    autoSkip: false,
    maxRotation: 60,
    minRotation: 60,
  },
  grid: {
    // display: false,
    drawBorder: false,
    drawOnChartArea: false,
    color: 'black',
  },
  afterDataLimits: function(axis) {
    // add inner padding for points on the far right edge
    const max = axis.max;
    // console.log(axis.min, axis.max)
    axis.min -= max * .01;
    axis.max += max * .01;
  },
});

const generateYAxisStyle = (max) => ({
  min: 0,
  max,
  ticks: {
    beginAtZero: true,
    font: {
      family: STYLES.font,
    },
    color: 'black',
    stepSize: 1,
    autoSkip: false,
  },
  grid: {
    color: 'black',
    drawBorder: false,
  },
});

const otherChartOptions = {
  plugins: {
    legend: false,
  },
  events: [],
};

const plugins = (linePositions, colorFn) => ([{
  afterDatasetsDraw: function(chart) {
    const ctx = chart.ctx;
    const y_axis = chart.scales['y'];
    const topY = y_axis.top;
    const bottomY = y_axis.bottom;

    ctx.lineWidth = 1;

    linePositions.forEach((t, index) => {
      const x = chart.scales.x.getPixelForValue(t)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.strokeStyle = colorFn(index);
      ctx.stroke();
      ctx.restore();
    });
  }
}]);

export default function ScoreTrend({
  clueHistory,
  guessEndTimes,
  clueEndTimes,
  annotationSuffix,
  datasets,
  indexToColor,
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
      }}
      plugins={plugins(guessEndTimes, indexToColor)}
      options={{
        maintainAspectRatio: false,
        ...otherChartOptions,
        scales: {
          x: generateXAxisStyle(
            (context) => indexToColor(context.index),
            xMax,
          ),
          y: generateYAxisStyle(yMax),
        }
      }}
    />
    </div>
  );
};
