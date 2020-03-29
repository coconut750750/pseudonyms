const PlayerList = require('../playerlist');

describe('initiating a playerlist', () => {
  it('generating keycard', () => {
    var plist = PlayerList();

    plist.add("p1", undefined);
    plist.add("p2", undefined);

    console.log(plist.get("p1"));
  });
});