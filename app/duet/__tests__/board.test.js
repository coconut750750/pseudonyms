const Board = require('../board');
const WordList = require('../../common/wordlist');
const { BOARD_LEN } = require("../../common/const");

describe('duet board test', () => {
  it('get board tiles', () => {
    const wordlist = new WordList('duet');
    const board = new Board(wordlist, () => {}, () => {});

    expect(board.getTile(BOARD_LEN - 1, BOARD_LEN - 1)).toBe(board.tiles[board.tiles.length - 1]);
    expect(board.getTile(0, 0)).toBe(board.tiles[0]);
    expect(board.getTile(0, BOARD_LEN - 1)).toBe(board.tiles[BOARD_LEN - 1]);
  });

  it('valid word', () => {
    const wordlist = new WordList('classic');
    const board = new Board(wordlist, () => {}, () => {});

    const validWord = 'this is a valid word';
    const invalidWord = board.getTile(0, 0);

    expect(board.validWord(validWord)).toBeTruthy();
    expect(board.validWord(invalidWord)).toBeFalsy();
  });

  it('valid word after revealing', () => {
    const wordlist = new WordList('classic');
    const board = new Board(wordlist, () => {}, () => {});

    const greenWord = board.getTile(0, 0);
    const doubleWhiteWord = board.getTile(0, 1);
    expect(board.validWord(greenWord)).toBeFalsy();
    expect(board.validWord(doubleWhiteWord)).toBeFalsy();

    board.reveal(0, 0, "blue", true);
    board.reveal(0, 1, "blue", false);
    board.reveal(0, 1, "red", false);

    expect(board.validWord(greenWord)).toBeTruthy();
    expect(board.validWord(doubleWhiteWord)).toBeTruthy();
  });

  it('incorrect reveals working', () => {
    const wordlist = new WordList('classic');
    const board = new Board(wordlist, () => {}, () => {});

    expect(board.isRevealed(0, 0, "red")).toBeFalsy();
    board.reveal(0, 0, "red", false);
    expect(board.isRevealed(0, 0, "red")).toBeTruthy();
    expect(board.isRevealed(0, 0, "blue")).toBeFalsy();
    board.reveal(0, 0, "blue", false);
    expect(board.isRevealed(0, 0, "blue")).toBeTruthy();
  });

  it('correct reveals working', () => {
    const wordlist = new WordList('classic');
    const board = new Board(wordlist, () => {}, () => {});

    expect(board.isRevealed(0, 0, "red")).toBeFalsy();
    expect(board.isRevealed(0, 0, "blue")).toBeFalsy();
    board.reveal(0, 0, "red", true);
    expect(board.isRevealed(0, 0, "red")).toBeTruthy();
    expect(board.isRevealed(0, 0, "blue")).toBeTruthy();
  });
})