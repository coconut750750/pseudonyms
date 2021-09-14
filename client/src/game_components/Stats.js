import React from 'react';
import { LinearScale } from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';

import {
  isClassic,
  isDuet,
  STYLES,
} from '../utils/const';

class GameTimelineScale extends LinearScale {
  buildTicks() {
    return this.chart.data.annotations.map(v => ({
      value: v.value,
      label: [v.annotation],
      major: false,
    }));
  }

  generateTickLabels(ticks) {
    // label already generated in buildTicks
    // override for noop
  }
}

GameTimelineScale.id = 'timelineScale';
Chart.register(GameTimelineScale);

const generateLabels = (guessEndTimes) => (
  [0, ...guessEndTimes.map(t => Math.floor(t))]
);

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
  pointRadius: 2,
});

const generateXAxisStyle = (color, max) => ({
  min: 0,
  max: max,
  type: 'timelineScale',
  ticks: {
    padding: 0,
    font: {
      family: STYLES.font,
      size: STYLES.fontSize,
    },
    color,
    autoSkip: false,
    maxRotation: 30,
    minRotation: 30,
    labelOffset: -STYLES.fontSize / 2,
  },
  grid: {
    // display: false,
    drawBorder: false,
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
  afterDataLimits: function(axis) {
    // add innder padding for points on the top and bottom lines
    axis.max += .5;
    axis.min -= .5;
  },
});

const otherChartOptions = {
  plugins: {
    legend: false,
  },
  events: [],
};

const secToTime = (s) => {
  if (s < 60 * 60) {
    return new Date(s * 1000).toISOString().substr(14, 5).toString();
  } else {
    return new Date(s * 1000).toISOString().substr(11, 8).toString();
  }
}

export default function Stats({ mode, stats, clueHistory }) {
  const secondTeam = stats.startTeam === 'blue' ? 'red' : 'blue';

  const renderClassicScoreTrend = (stats, clueHistory) => {
    return (
      <Line
        data={{
          labels: generateLabels(stats.guessEndTimes),
          annotations: generateAnnotations(clueHistory, stats.clueEndTimes, []),
          datasets: [
            generateDataset(stats.startTeam, STYLES.colors[stats.startTeam], stats.firstTeamScoreTrend),
            generateDataset(secondTeam, STYLES.colors[secondTeam], stats.secondTeamScoreTrend),
          ],
        }}
        options={{
          ...otherChartOptions,
          scales: {
            x: generateXAxisStyle(
              (context) => {
                if (context.index % 2 === 0) {
                  return STYLES.colors[stats.startTeam];
                } else {
                  return STYLES.colors[secondTeam];
                }
              },
              stats.timeInSec,
            ),
            y: generateYAxisStyle(9),
          }
        }}
      />
    );
  };

  const renderDuetScoreTrend = (stats, clueHistory) => {
    const hasSuddenDeath = clueHistory.length === stats.scoreTrend.length - 2;
    return (
      <Line
        data={{
          labels: generateLabels(stats.guessEndTimes),
          annotations: generateAnnotations(clueHistory, stats.clueEndTimes, hasSuddenDeath ? ['sudden death'] : []),
          datasets: [
            generateDataset('green', STYLES.colors.green, stats.scoreTrend),
          ],
        }}
        options={{
          ...otherChartOptions,
          scales: {
            x: generateXAxisStyle(
              (context) => {
                if (context.index < clueHistory.length) {
                  return STYLES.colors.green;
                } else {
                  return 'black';
                }
              },
              stats.timeInSec,
            ),
            y: generateYAxisStyle(15),
          }
        }}
      />
    );
  };

  const renderSummary = (stats) => {
    return (
      <div className="d-flex justify-content-around">
        <p>Time elapsed: {secToTime(stats.timeInSec)}</p>
        <p>Turns taken: {stats.turns}</p>
      </div>
    );
  };

  return (
    <div id="stats" className="skinny">
      <h6>Game Progress</h6>

      {stats !== undefined &&
        <div>
          {renderSummary(stats)}
          {isClassic(mode) && renderClassicScoreTrend(stats, clueHistory)}
          {isDuet(mode) && renderDuetScoreTrend(stats, clueHistory)}
        </div>
      }
    </div>
  );
}