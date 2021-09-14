import { newBoard } from '../models/board';
import Key from '../models/keycard';
import Player from '../models/player';

export const me = new Player('me', true, true, 'blue', 'player');

export const board = newBoard([
  [{word: '1'},{word: '2'},{word: '3'},{word: '4'},{word: '5'}],
  [{word: '6'},{word: '7'},{word: '8'},{word: '9'},{word: '10'}],
  [{word: '11'},{word: '12'},{word: '13'},{word: '14'},{word: '15'}],
  [{word: '16'},{word: '17'},{word: '18'},{word: '19'},{word: '20'}],
  [{word: '21'},{word: '22'},{word: '23'},{word: '24'},{word: '25'}],
]);

export const clues = [
  {word: 'clue', count: 2, team: 'blue'},
  {word: 'tree', count: 2, team: 'red'},
  {word: 'trumpet', count: 2, team: 'blue'},
  {word: 'kangaroo', count: 2, team: 'red'},
  {word: 'miss', count: 2, team: 'blue'},
  {word: 'ball', count: 2, team: 'red'},
  {word: 'kite', count: 2, team: 'blue'},
  {word: 'fdsa', count: 2, team: 'red'},
  {word: 'asdf', count: 2, team: 'blue'},
];

export const classic = {
  key: new Key([
    [{color: 'b'},{color: 'b'},{color: 'b'},{color: 'b'},{color: 'b'}],
    [{color: 'b'},{color: 'b'},{color: 'b'},{color: 'b'},{color: 'r'}],
    [{color: 'r'},{color: 'r'},{color: 'r'},{color: 'r'},{color: 'r'}],
    [{color: 'r'},{color: 'r'},{color: 'y'},{color: 'y'},{color: 'y'}],
    [{color: 'y'},{color: 'y'},{color: 'y'},{color: 'y'},{color: 'x'}],
  ]),
  reveals: [
    {r:3, c:3, color: 'r'},
    {r:3, c:4, color: 'r'},
  ],
  stats: {
    firstTeamScoreTrend: [9,8,8,6,6,3,2,0],
    secondTeamScoreTrend: [8,8,6,6,4,3,1,1],
    clueEndTimes: [60, 125, 145, 165, 175, 185, 195],
    guessEndTimes: [120, 140, 160, 170, 180, 190, 200],
    startTeam: "blue",
    timeInSec: 200,
    turns: 1,
  },
};

export const duet = {
  key: new Key([
    [{color: {red: 'g', blue: 'g'}}, {color: {red: 'g', blue: 'y'}}, {color: {red: 'y', blue: 'g'}}, {color: {red: 'y', blue: 'y'}}, {color: {red: 'g', blue: 'x'}}],
    [{color: {red: 'g', blue: 'y'}}, {color: {red: 'g', blue: 'g'}}, {color: {red: 'g', blue: 'y'}}, {color: {red: 'y', blue: 'g'}}, {color: {red: 'x', blue: 'y'}}],
    [{color: {red: 'y', blue: 'y'}}, {color: {red: 'y', blue: 'g'}}, {color: {red: 'y', blue: 'g'}}, {color: {red: 'g', blue: 'y'}}, {color: {red: 'y', blue: 'y'}}],
    [{color: {red: 'g', blue: 'g'}}, {color: {red: 'y', blue: 'y'}}, {color: {red: 'y', blue: 'g'}}, {color: {red: 'y', blue: 'y'}}, {color: {red: 'y', blue: 'y'}}],
    [{color: {red: 'g', blue: 'y'}}, {color: {red: 'x', blue: 'g'}}, {color: {red: 'y', blue: 'y'}}, {color: {red: 'y', blue: 'x'}}, {color: {red: 'x', blue: 'x'}}],
  ]),
  reveals: [
    {r: 3, c: 0, color: 'x', team: 'red'},
  ],
  stats: {
    scoreTrend: [15, 14, 12, 10, 6, 4, 3, 2, 1, 1, 0],
    clueEndTimes: [5.088, 12.138, 15.284, 18.784, 23.796, 29.206, 32.399, 37.922, 41.767, 46.7],
    guessEndTimes: [10.69, 14.037, 17.419, 21.84, 27.23, 31.215, 36.165, 39.841, 46.7, 49.793],
    timeInSec: 49.793,
    turns: 1,
    win: false,
  },
};
