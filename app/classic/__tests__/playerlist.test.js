const PlayerList = require('../playerlist');

describe('initiating a playerlist', () => {
  test('adding two players', () => {
    const plist = new PlayerList(() => {}, () => {});
    plist.add("p1", undefined);
    plist.add("p2", undefined);

    expect(plist.get("p1").name).toBe("p1");
  });

  test('getting all players', () => {
    const plist = new PlayerList(() => {}, () => {});
    plist.add("p1", undefined);
    plist.add("p2", undefined);

    const all = plist.getAll();
    expect(all.length).toBe(2);
    expect(all[0].name).toBe('p1');
    expect(all[1].name).toBe('p2');
  });

  test('checking is player exists', () => {
    const plist = new PlayerList(() => {}, () => {});
    plist.add("p1", undefined);

    expect(plist.exists('p1')).toBeTruthy();
    expect(plist.exists('p2')).toBeFalsy();
  });

  test('checking if player is active', () => {
    const plist = new PlayerList(() => {}, () => {});
    plist.add("p1", undefined);
    plist.add("p2", undefined);

    expect(plist.isActive("p1")).toBeTruthy();

    plist.deactivate("p1");
    expect(plist.isActive("p1")).toBeFalsy();
  });

  test('removing a player', () => {
    const plist = new PlayerList(() => {}, () => {});
    plist.add("p1", undefined);
    plist.add("p2", undefined);

    expect(plist.length()).toBe(2);

    plist.remove("p1");
    expect(plist.length()).toBe(1);
    expect(plist.exists("p1")).toBeFalsy();
  });

  test('calling on empty when all players removed', () => {
    let called = false;
    const plist = new PlayerList(() => {}, () => called = true);
    plist.add("p1", undefined);

    plist.remove("p1");
    expect(called).toBeTruthy();
  });

  test('calling on empty when all players deactivate', () => {
    let called = false;
    const plist = new PlayerList(() => {}, () => called = true);
    plist.add("p1", undefined);

    plist.deactivate("p1");
    expect(called).toBeTruthy();
  });

  test('set team of one player', () => {
    const plist = new PlayerList(() => {}, () => {});
    plist.add("p1", undefined);
    plist.add("p2", undefined);

    plist.setTeam("p1", true);
    plist.setTeam("p2", false);

    expect(plist.get("p1").team).toEqual("red");
    expect(plist.get("p2").team).toEqual("blue");
  });

  test('reseting teams', () => {
    const plist = new PlayerList(() => {}, () => {});
    plist.add("p1", undefined);
    plist.add("p2", undefined);

    plist.setTeam("p1", true);
    plist.setTeam("p2", false);

    plist.resetTeams();

    expect(plist.get("p1").team).toEqual("");
    expect(plist.get("p2").team).toEqual("");
  });

  test('checking if all players are assigned teams', () => {
    const plist = new PlayerList(() => {}, () => {});
    plist.add("p1", undefined);
    plist.add("p2", undefined);

    plist.setTeam("p1", true);
    plist.setTeam("p2", false);

    expect(plist.allAssignedTeam()).toBeTruthy();
  });

  test('setting captains', () => {
    const plist = new PlayerList(() => {}, () => {});
    plist.add("p1", undefined);
    plist.add("p2", undefined);

    plist.setTeam("p1", true);
    plist.setTeam("p2", false);

    plist.setCaptain("p1");

    expect(plist.get("p1").isCaptain()).toBeTruthy();
  });

  test('set captain of one team multiple times', () => {
    const plist = new PlayerList(() => {}, () => {});
    plist.add("p1", undefined);
    plist.add("p2", undefined);

    plist.setTeam("p1", true);
    plist.setTeam("p2", true);

    plist.setCaptain("p1");
    plist.setCaptain("p2");

    expect(plist.get("p1").isCaptain()).toBeFalsy();
    expect(plist.get("p2").isCaptain()).toBeTruthy();
  });

  test('randomize captains', () => {
    const plist = new PlayerList(() => {}, () => {});

    plist.add("p1", undefined);
    plist.add("p2", undefined);
    plist.add("p3", undefined);
    plist.add("p4", undefined);


    plist.setTeam("p1", true);
    plist.setTeam("p2", true);
    plist.setTeam("p3", false);
    plist.setTeam("p4", false);

    plist.randomizeCaptain(plist.get("p1").team);
    plist.randomizeCaptain(plist.get("p3").team);

    expect(plist.get("p1").isCaptain() || plist.get("p2").isCaptain()).toBeTruthy();
    expect(plist.get("p3").isCaptain() || plist.get("p4").isCaptain()).toBeTruthy();

    expect(plist.enoughCaptains()).toBeTruthy();
  });

  test('check if enough captains', () => {
    const plist = new PlayerList(() => {}, () => {});
    plist.add("p1", undefined);
    plist.add("p2", undefined);

    plist.setTeam("p1", true);
    plist.setTeam("p2", false);

    plist.setCaptain("p1");
    plist.setCaptain("p2");

    expect(plist.enoughCaptains()).toBeTruthy();
  });
});