const KeyCard = require('../keycard');
const { BOARD_LEN } = require("../../common/const");

describe('initiating a keycard', () => {
  it('generating keycard', () => {
    const keycard = new KeyCard();
    expect(keycard.tiles.length).toBe(BOARD_LEN * BOARD_LEN);
  });
});