const PlayerList = require('../playerlist');

describe('initiating a playerlist', () => {
  it('generating keycard', () => {
    var plist = new PlayerList(() => {}, () => {});

    plist.add("p1", undefined);
    plist.add("p2", undefined);

    expect(plist.get("p1").name).toBe("p1");
  });
});