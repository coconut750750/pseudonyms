import React from 'react';
import { Line } from 'react-chartjs-2';

import {
  isClassic,
  isDuet,
  STYLES,
} from '../utils/const';

const generateLabels = (clueHistory, suffix) => (
  [...clueHistory.map(c => c.word), ...suffix]
);

const generateDataset = (name, color, trend) => ({
  label: name,
  fill: false,
  lineTension: 0.1,
  backgroundColor: '#ffffff',
  borderColor: color,
  borderWidth: 2,
  data: trend,
  pointRadius: 3, // hide the point image
});

const generateXAxisStyle = (color) => ({
  ticks: {
    font: {
      family: STYLES.font,
    },
    color,
  },
  grid: {
    display: false,
  },
});

const generateYAxisStyle = (max) => ({
  min: 0,
  max,
  ticks: {
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

export default function Stats({ mode, stats, clueHistory }) {
  const secondTeam = stats.startTeam === 'blue' ? 'red' : 'blue';

  const renderClassicScoreTrend = (stats, clueHistory) => {
    return (
      <Line
        height={100}
        data={{
          labels: generateLabels(clueHistory, [' ']),
          datasets: [
            generateDataset(stats.startTeam, STYLES.colors[stats.startTeam], stats.firstTeamScoreTrend),
            generateDataset(secondTeam, STYLES.colors[secondTeam], stats.secondTeamScoreTrend),
          ],
        }}
        options={{
          ...otherChartOptions,
          scales: {
            x: generateXAxisStyle((context) => {
                if (context.index % 2 === 0) {
                  return STYLES.colors[stats.startTeam];
                } else {
                  return STYLES.colors[secondTeam];
                }
              }),
            y: generateYAxisStyle(9),
          }
        }}
      />
    );
  };

  const renderDuetScoreTrend = (stats, clueHistory) => {
    return (
      <Line
        height={100}
        data={{
          labels: generateLabels(clueHistory, [['sudden', 'death'], '']),
          datasets: [
            generateDataset('green', STYLES.colors.green, stats.scoreTrend),
          ],
        }}
        options={{
          ...otherChartOptions,
          scales: {
            x: generateXAxisStyle(STYLES.colors.green),
            y: generateYAxisStyle(15),
          }
        }}
      />
    );
  };

  const renderSummary = (stats) => {
    return (
      <div className="d-flex justify-content-around">
        <p>Time elapsed: {stats.timeInSec}s</p>
        <p>Turns taken: {stats.turns}</p>
      </div>
    );
  };

  return (
    <div id="stats" className="ml-4 mr-4">
      <h6>Game Stats</h6>

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