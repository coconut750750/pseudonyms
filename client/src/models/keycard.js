export default class Key {
  constructor(tiles) {
    this.tiles = [];
    for (var row of tiles) {
      this.tiles.push([])
      for (var col of row) {
        this.tiles[this.tiles.length - 1].push(col.color);
      }
    }
    this.width = this.tiles[0].length;
    this.height = this.tiles.length;
  }

  get(r, c) {
    return this.tiles[r][c];
  }
}

export function newKey(json) {
  console.log(new Key(json));
  return new Key(json);
}