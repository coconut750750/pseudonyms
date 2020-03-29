var _ = require('lodash');

export default class Key {
  constructor(tiles) {
    this.tiles = tiles;
  }

  get(r, c) {
    return this.tiles[r][c];
  }
}

export function newKey(json) {
  return new Key(json);
}