const Board = require('../board');
const WordList = require('../wordlist');
const { BOARD_LEN } = require("../const");

describe('initiating a board', () => {
  it('construct tiles', () => {
    const wordlist = new WordList('classic');
    const board = new Board(wordlist);
  });

  it('get tiles', () => {
    const wordlist = new WordList('classic');
    const board = new Board(wordlist);

    expect(board.getTile(BOARD_LEN - 1, BOARD_LEN - 1)).toBe(board.tiles[board.tiles.length - 1]);
    expect(board.getTile(0, 0)).toBe(board.tiles[0]);
    expect(board.getTile(0, BOARD_LEN - 1)).toBe(board.tiles[BOARD_LEN - 1]);
  });

  it('to json', () => {
    const wordlist = new WordList('classic');
    const board = new Board(wordlist);
    expect(board.json()['board'].length).toBe(BOARD_LEN);
    expect(board.json()['board'][0].length).toBe(BOARD_LEN);
  });
});