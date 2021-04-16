import { itemTypes } from './functions'

const mazes = {
  test: {
    items: `XPX
  X.X
  X.X
  X.X
  X.X
  X.X
  XEX`,
    itemsPerRow: 3,
    numberOfRows: 7,
  },

  maze1: {
    items: `XPXXXXXXXXXXXXXXXXXX
  X....X....X....X...X
  X.X..X.X..X.X..X.X.X
  X.XX.X.XX.X.XX.X...X
  X................XXX
  X.XX.X.X.XXXXXXXX..E
  X.X..XXX.X......X.XX
  X.XX.X.X.XX.X.X....X
  X............X..X.XX
  XXXXXXXXXXXXXXXXXXXX`,
    itemsPerRow: 20,
    numberOfRows: 10,
  },

  maze2: {
    items: `XPXXXXXXXXXXXXXXXXXX
  X........X...X.....X
  X.X.X.XX.X.X.X.XXX.X
  X...X......X.......X
  XX.XXXX.XX.X.X.XX.XX
  X..X....XX.X.X.XX.XX
  X.XX.X.XXX...X.....X
  X....X...X.XXX.XXX.X
  XXX.XX.XX......X...X
  XXXXXXXXXXXXXXXXEXXX`,
    itemsPerRow: 20,
    numberOfRows: 10,
  },

  maze3: {
    items: `XPXXXXXXXXXXXXXXXXXX
  X..................X
  XXXXXXXXXXXXXXXXXX.X
  X..................X
  X.XXXXXXXXXXXXXXXXXX
  X..................X
  X.XXX.XX.XX.XX.XXX.X
  X.XXX.XX.XX.XX.XXX.X
  X.......X..X.......X
  XXXXXXXXXXXXXXXXEXXX`,
    itemsPerRow: 20,
    numberOfRows: 10,
  },

  newnexus: {
    items: `XPXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    X.............................X
    X.X...X.XXXX.X...X............X
    X.XX..X.X....X...X............X
    X.X.X.X.XXX..X.X.X............X
    X.X..XX.X....X.X.X............X
    X.X...X.XXXX.XX.XX............X
    X.............................X
    X.X...X.XXXX.X...X.X...X.XXXX.X
    X.XX..X.X.....X.X..X...X.X....X
    X.X.X.X.XXX....X...X...X.XXXX.X
    X.X..XX.X.....X.X..X...X....X.X
    X.X...X.XXXX.X...X.XXXXX.XXXX.X
    X.............................X
    XXXXXXXXXXXXXXXEXXXXXXXXXXXXXXX`,
    itemsPerRow: 31,
    numberOfRows: 15,
  },

  kpn: {
    items: `XPXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    X...............................X
    X.X...X.XXXXX.X.....X.....XXXXX.X
    X.X...X.X.....X.....X.....X...X.X
    X.XXXXX.XXXX..X.....X.....X...X.X
    X.X...X.X.....X.....X.....X...X.X
    X.X...X.XXXXX.XXXXX.XXXXX.X.XXX.X
    X...............................X
    X.X...X.XXXXX.X...X.....X.X.....X
    X.X..X..X...X.XX..X.............X
    X.XXX...X.XXX.X.X.X...X.....X...X
    X.X..X..X.....X..XX....X...X....X
    X.X...X.X.....X...X.....XXX.....X
    X...............................X
    XXXXXXXXXXXXXXXXXEXXXXXXXXXXXXXXX`,
    itemsPerRow: 33,
    numberOfRows: 15,
  },
}

const mazeTemplate = mazes.test
//const mazeTemplate = mazes.newnexus
//const mazeTemplate = mazes.kpn;
//const mazeTemplate = mazes.maze1;
//const mazeTemplate = mazes.maze2;
//const mazeTemplate = mazes.maze3;

export function getMaze() {
  const items = mazeTemplate.items.replace(/\s/g, '').split('')

  const maze = {
    currentFoods: 0,
    reachedExit: false,
    items,
    numberOfRows: mazeTemplate.numberOfRows,
    itemsPerRow: mazeTemplate.itemsPerRow,
    playerIndex: items.indexOf(itemTypes.PLAYER),
    exitIndex: items.indexOf(itemTypes.EXIT),
  }

  return maze
}
