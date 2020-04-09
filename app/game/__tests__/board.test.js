const Board = require('../board');
const WordList = require('../wordlist');
const { BOARD_LEN } = require("../const");

describe('initiating a board', () => {
  it('construct tiles', () => {
    const wordlist = new WordList('classic');
    const board = new Board(wordlist, () => {}, () => {});
  });

  it('get tiles', () => {
    const wordlist = new WordList('classic');
    const board = new Board(wordlist, () => {}, () => {});

    expect(board.getTile(BOARD_LEN - 1, BOARD_LEN - 1)).toBe(board.tiles[board.tiles.length - 1]);
    expect(board.getTile(0, 0)).toBe(board.tiles[0]);
    expect(board.getTile(0, BOARD_LEN - 1)).toBe(board.tiles[BOARD_LEN - 1]);
  });

  it('to json', () => {
    const wordlist = new WordList('classic');
    const board = new Board(wordlist, () => {}, () => {});
    expect(board.json()['board'].length).toBe(BOARD_LEN);
    expect(board.json()['board'][0].length).toBe(BOARD_LEN);
  });

  it('valid word', () => {
    const wordlist = new WordList('classic');
    const board = new Board(wordlist, () => {}, () => {});

    const validWord = 'this is a valid word';
    const invalidWord = board.getTile(0, 0);

    expect(board.validWord(validWord)).toBeTruthy();
    expect(board.validWord(invalidWord)).toBeFalsy();
  });

  it('reveals working', () => {
    const wordlist = new WordList('classic');
    const board = new Board(wordlist, () => {}, () => {});

    expect(board.isRevealed(0, 0)).toBeFalsy();
    board.reveal(0, 0);
    expect(board.isRevealed(0, 0)).toBeTruthy();
  });

  it('reveal word broadcasts working', () => {
    let broadcasts = 0;
    const wordlist = new WordList('classic');
    const board = new Board(wordlist, () => broadcasts += 1, () => {});

    broadcasts = 0;
    board.reveal(0, 0);
    expect(broadcasts).toBe(1);
  });

  it('sending reveals on reconnect', () => {
    let result = undefined;
    const wordlist = new WordList('classic');
    const board = new Board(wordlist, () => {}, data => result = data);

    board.reveal(0, 0);
    board.sendReveals();
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(expect.arrayContaining([0, 0]));
  });
});