import React, { useContext } from 'react';

import ScoreTrend from '../components/ScoreTrend';

import { PreferencesContext } from '../contexts/PreferencesContext';

import {
  isClassic,
  isDuet,
  STYLES,
  RED,
  BLUE,
  GREEN,
} from '../utils/const';

const secToTime = (s) => {
  if (s < 60 * 60) {
    return new Date(s * 1000).toISOString().substr(14, 5).toString();
  } else {
    return new Date(s * 1000).toISOString().substr(11, 8).toString();
  }
};

export default function Stats({ mode, stats, clueHistory }) {
  const { darkModeOn } = useContext(PreferencesContext);
  const defaultColor = darkModeOn ? STYLES.colors.white : STYLES.colors.black;

  const renderClassicScoreTrend = (stats, clueHistory) => {
    const secondTeam = stats.startTeam === BLUE ? RED : BLUE;
    const indexToColor = (index) => {
      if (index % 2 === 0) {
        return STYLES.colors[stats.startTeam];
      } else {
        return STYLES.colors[secondTeam];
      }
    };

    return (
      <ScoreTrend
        clueHistory={clueHistory}
        guessEndTimes={stats.guessEndTimes}
        clueEndTimes={stats.clueEndTimes}
        annotationSuffix={[]}
        datasets={[
          { name: stats.startTeam, color: STYLES.colors[stats.startTeam], trend: stats.firstTeamScoreTrend },
          { name: secondTeam, color: STYLES.colors[secondTeam], trend: stats.secondTeamScoreTrend },
        ]}
        indexToColor={indexToColor}
        defaultColor={defaultColor}
        xMax={stats.timeInSec}
        yMax={9}
      />
    );
  };

  const renderDuetScoreTrend = (stats, clueHistory) => {
    const hasSuddenDeath = clueHistory.length === stats.scoreTrend.length - 2;
    const indexToColor = (index) => {
      if (index < clueHistory.length) {
        return STYLES.colors.green;
      } else {
        return defaultColor;
      }
    };

    return (
      <ScoreTrend
        clueHistory={clueHistory}
        guessEndTimes={stats.guessEndTimes}
        clueEndTimes={stats.clueEndTimes}
        annotationSuffix={hasSuddenDeath ? ['sudden death'] : []}
        datasets={[
          { name: GREEN, color: STYLES.colors.green, trend: stats.scoreTrend },
        ]}
        indexToColor={indexToColor}
        defaultColor={defaultColor}
        xMax={stats.timeInSec}
        yMax={15}
      />
    );
  };

  return (
    <div id="stats" className="skinny">
      <h6>Game Progression</h6>

      {stats !== undefined &&
        <div>
          <div className="d-flex justify-content-around">
            <p>Time elapsed: {secToTime(stats.timeInSec)}</p>
            <p>Turns taken: {stats.turns}</p>
          </div>

          {isClassic(mode) && renderClassicScoreTrend(stats, clueHistory)}
          {isDuet(mode) && renderDuetScoreTrend(stats, clueHistory)}
        </div>
      }
    </div>
  );
}