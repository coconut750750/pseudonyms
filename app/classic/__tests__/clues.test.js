const PseudoGame = require('../game');
const WordList = require('../../common/wordlist');
const Board = require('../board');
const GameOptions = require('../gameoptions');
const KeyCard = require("../keycard");

jest.mock('../player');
const Player = require('../player');

describe('clues test', () => {
  const wordlist = new WordList('classic');
  const board = new Board(wordlist, () => {});
  const gameOptions = new GameOptions({});

  it('adding a clue to list', () => {
    let game = new PseudoGame("code", () => {}, () => {}, (event, data) => {});
    game.board = board;
    game.gameoptions = gameOptions;

    game.addClue(undefined, "clue", 1);
    game.addClue(undefined, "clue", 2);
    game.addClue(undefined, "clue", 3);

    expect(game.clues.clues.length).toBe(3);
  });

  it('adding a clue broadcasts it to everyone', () => {
    let totalBroadcasts = 0;
    let game = new PseudoGame("code", () => {}, () => {}, (event, data) => {
      if (event === 'clue') {
        totalBroadcasts += 1;
      }
    });
    game.board = board;
    game.gameoptions = gameOptions;
    totalBroadcasts = 0;

    game.addClue(undefined, "clue", 1);
    game.addClue(undefined, "clue", 2);
    game.addClue(undefined, "clue", 3);

    expect(totalBroadcasts).toBe(3);
  });

  it('reconnecting user gets existing current clue', () => {
    let game = new PseudoGame("code", () => {}, () => {}, (event, data) => {} );
    game.board = board;
    game.gameoptions = gameOptions;

    game.addPlayer("p1", undefined);
    game.addClue(undefined, "clue", 1);

    const p1 = game.plist.get("p1");
    let sendEvent = "";
    p1.send.mockImplementation( (event, data) => sendEvent = event );

    game.reconnectSendClue(p1);

    expect(sendEvent).toBe("clue");
  });

  it('reconnecting user gets gets nothing with no current clue', () => {
    let game = new PseudoGame("code", () => {}, () => {}, (event, data) => {} );
    game.board = board;
    game.gameoptions = gameOptions;

    game.addPlayer("p1", undefined);
    const p1 = game.plist.get("p1");

    let sendEvent = undefined;
    p1.send.mockImplementation( (event, data) => sendEvent = event );

    game.reconnectSendClue(p1);

    expect(sendEvent).toBe(undefined);
  });

  it('allow end turn with current clue', () => {
    let game = new PseudoGame("code", () => {}, () => {}, (event, data) => {} );
    game.board = board;
    game.gameoptions = gameOptions;

    game.addPlayer("p1", undefined);
    const p1 = game.plist.get("p1");

    p1.isOnTeam.mockImplementation( (team) => true );

    game.addClue(undefined, "clue", 1);

    expect(game.canEndTurn(p1)).toBeTruthy();
  });

  it('disallow end turn with no current clue', () => {
    let game = new PseudoGame("code", () => {}, () => {}, (event, data) => {} );
    game.board = board;
    game.gameoptions = gameOptions;

    game.addPlayer("p1", undefined);
    const p1 = game.plist.get("p1");

    p1.isOnTeam.mockImplementation( (team) => true );

    expect(game.canEndTurn(p1)).toBeFalsy();
  });

  it('end turn clears current clue', () => {
    let game = new PseudoGame("code", () => {}, () => {}, (event, data) => {} );
    game.board = board;
    game.gameoptions = gameOptions;

    game.addClue(undefined, "clue", 1);

    expect(game.clues.currentExists()).toBeTruthy();

    game.keycard = new KeyCard();
    game.endTurn();

    expect(game.clues.currentExists()).toBeFalsy();
  });

  it('resetting game clears clues', () => {
    let game = new PseudoGame("code", () => {}, () => {}, (event, data) => {} );
    game.board = board;
    game.gameoptions = gameOptions;

    game.addClue(undefined, "clue", 1);
    game.addClue(undefined, "clue", 2);

    expect(game.clues.clues.length).toBe(2);

    game.reset();
    expect(game.clues.clues.length).toBe(0);
  });
});