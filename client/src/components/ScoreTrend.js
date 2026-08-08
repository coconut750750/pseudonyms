import React from 'react';
import { LinearScale } from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';

import {
  STYLES,
  secToTime,
} from '../utils/const';

import './ScoreTrend.css';

class CluesScale extends LinearScale {
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

CluesScale.id = 'clues';
Chart.register(CluesScale);

class TimeScale extends LinearScale {
  buildTicks() {
    return this.chart.data.labels.slice(1).map((v, i) => ({
      value: v,
      label: secToTime(v),
      color: this.chart.data.color.indexToColor(i),
      major: false,
    }));
  }

  generateTickLabels(ticks) {
    // label already generated in buildTicks, override for noop
  }
}

TimeScale.id = 'times';
Chart.register(TimeScale);

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

const generateCluesAxisStyle = (defaultColor, max) => ({
  min: 0,
  max: max,
  position: 'top',
  type: 'clues',
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
});

const generateTimesAxisStyle = (defaultColor, max) => ({
  min: 0,
  max: max,
  position: 'bottom',
  type: 'times',
  ticks: {
    font: STYLES.font,
    color: defaultColor,
    maxRotation: 60,
    minRotation: 60,
  },
  grid: {
    drawBorder: false,
    color: (context) => context.tick.color,
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
});

const otherChartOptions = {
  plugins: {
    legend: false,
  },
  events: [],
  animation: {
    duration: 500,
  },
  maintainAspectRatio: false,
};

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
            indexToColor: indexToColor,
          },
        }}
        options={{
          ...otherChartOptions,
          scales: {
            clues: generateCluesAxisStyle(
              defaultColor,
              xMax,
            ),
            times: generateTimesAxisStyle(
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
