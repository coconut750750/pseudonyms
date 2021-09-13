import React, { useState, useEffect } from 'react';
import { Line, Pie, defaults } from 'react-chartjs-2';

defaults.global.defaultFontFamily = 'Roboto Mono, monospace';

export default function Stats({ gameMode, stats }) {
  useEffect(() => {
    getStats().then(resp => {
      setStats(resp);
    });
  }, []);

  const generateWordlistDistribution = (distribution) => {
    const labels = Object.keys(distribution);
    const data = labels.map(label => distribution[label]);
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#003f5c',
          '#444e86',
          '#955196',
          '#dd5182',
          '#ff6e54',
          '#ffa600',
        ],
      }]
    }
  };

  const generateScoreTrendData = (firstTeam, secondTeam) => {
    const labels = [...firstTeam.keys()].map(i => `Turn ${i}`);
    return {
      labels,
      datasets: [
        {
          label: 'Lead Team',
          fill: false,
          lineTension: 0.25,
          backgroundColor: '#ffffff',
          borderColor: '#36A2EB',
          borderWidth: 2,
          data: firstTeam
        }, {
          label: 'Second Team',
          fill: false,
          lineTension: 0.25,
          backgroundColor: '#ffffff',
          borderColor: '#FF6384',
          borderWidth: 2,
          data: secondTeam
        }
      ]
    }
  };

  const renderWorlistChart = (stats) => {
    return (
      <Pie 
        data={generateWordlistDistribution(stats.wordlistDistribution)}
        options={{
          title: {
            display: true,
            text: 'Distribution of wordlist usage',
            fontSize: 16
          },
          legend: {
            display: true,
            position: 'right',
          }
        }}
      />
    );
  };

  const renderScoreTrendChart = (stats) => {
    return (
      <Line
        data={generateScoreTrendData(stats.matureGames.firstTeamScoreTrend, stats.matureGames.secondTeamScoreTrend)}
        options={{
          title: {
            display: true,
            text: 'Average Score per Turn',
            fontSize: 16
          },
          legend: {
            display: true,
            position: 'top',
          }
        }}
      />
    );
  };

  const renderSummary = (stats) => {
    return (
      <div>
        <div>
          <h6>Total games completed: {stats.totalGames}</h6>
          <h6>Average players per game: {stats.averagePlayersPerGame.toFixed(2)}</h6>
        </div>
        <div>
          {renderWorlistChart(stats)}
        </div>
        <br/>
      </div>
    );
  };

  const renderMatureSummary = (stats) => {
    const { totalGames } = stats;
    const percentMature = ((stats.matureGames.count / totalGames) * 100).toFixed(2);
    const firstTeamWin = (stats.matureGames.firstTeamWinPercent * 100).toFixed(2);
    const averageTurns = stats.matureGames.averageTurnsPerGame.toFixed(2);
    
    const averageTime = stats.matureGames.averageTimePerGame;
    const minutes = Math.floor(averageTime / 60);
    const seconds = (averageTime % 60).toFixed(3);
    const timeDisplay = `${minutes}m ${seconds}s`
    
    return (
      <div>
        <h6>Games that ended without revealing the black word: {percentMature}%</h6>
        <p>Leading team won {firstTeamWin}%</p>
        <p>Average time taken: {timeDisplay}</p>
        <p>Average turns taken: {averageTurns}</p>
        
        {renderScoreTrendChart(stats)}
      </div>
    );
  };

  return (
    <div id="stats" className="text-left">
      <h4>Game Statistics</h4>

      {stats !== undefined &&
        <div>
          {renderSummary(stats)}
          <br/>
          {renderMatureSummary(stats)}
          <br/>
        </div>
      }
      <a className="btn btn-light" role="button" href="/">Back</a>
    </div>
  );
}