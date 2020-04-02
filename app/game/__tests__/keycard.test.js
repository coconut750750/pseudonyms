const KeyCard = require('../keycard');

describe('initiating a keycard', () => {
  it('generating keycard', () => {
    const keycard = new KeyCard();
    console.log(keycard.tiles);
  });
});