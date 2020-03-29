const Board = require('../board');
const WordList = require('../wordlist');
const { BOARD_LEN } = require("../const");

describe('initiating a board', () => {
  it('construct tiles', () => {
    const wordlist = new WordList('test');
    const board = new Board(wordlist);
  });

  it('get tiles', () => {
    const wordlist = new WordList('test');
    const board = new Board(wordlist);

    expect(board.getTile(BOARD_LEN - 1, BOARD_LEN - 1)).toBe(board.tiles[board.tiles.length - 1]);
    expect(board.getTile(0, 0)).toBe(board.tiles[0]);
    expect(board.getTile(0, BOARD_LEN - 1)).toBe(board.tiles[BOARD_LEN - 1]);
  });
});