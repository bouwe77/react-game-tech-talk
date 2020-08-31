import { itemType } from "./functions";

const mazes = {
  test: `XPX
  X.X
  X.X
  X.X
  X.X
  X.X
  XEX`,

  maze1: `XPXXXXXXXXXXXXXXXXXX
  X....X....X....X...X
  X.X..X.X..X.X..X.X.X
  X.XX.X.XX.X.XX.X...X
  X................XXX
  X.XX.X.X.XXXXXXXX..E
  X.X..XXX.X......X.XX
  X.XX.X.X.XX.X.X....X
  X............X..X.XX
  XXXXXXXXXXXXXXXXXXXX`,

  maze2: `XPXXXXXXXXXXXXXXXXXX
  X........X...X.....X
  X.X.X.XX.X.X.X.XXX.X
  X...X......X.......X
  XX.XXXX.XX.X.X.XX.XX
  X..X....XX.X.X.XX.XX
  X.XX.X.XXX...X.....X
  X....X...X.XXX.XXX.X
  XXX.XX.XX......X...X
  XXXXXXXXXXXXXXXXEXXX`,

  maze3: `XPXXXXXXXXXXXXXXXXXX
  X..................X
  XXXXXXXXXXXXXXXXXX.X
  X..................X
  X.XXXXXXXXXXXXXXXXXX
  X..................X
  X.XXX.XX.XX.XX.XXX.X
  X.XXX.XX.XX.XX.XXX.X
  X.......X..X.......X
  XXXXXXXXXXXXXXXXEXXX`,

  newnexus: `XPXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
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

  kpn: `XPXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  X...............................X
  X.X...X.XXXXX.X.....X.....XXXXX.X
  X.X...X.X.....X.....X.....X...X.X
  X.XXXXX.XXXX..X.....X.....X...X.X
  X.X...X.X.....X.....X.....X...X.X
  X.X...X.XXXXX.XXXXX.XXXXX.XXXXX.X
  X...............................X
  X.X...X.XXXXX.X...X.....X.X.....X
  X.X..X..X...X.XX..X.............X
  X.XXX...XXXXX.X.X.X...X.....X...X
  X.X..X..X.....X..XX....X...X....X
  X.X...X.X.....X...X.....XXX.....X
  X...............................X
  XXXXXXXXXXXXXXXXXEXXXXXXXXXXXXXXX`
};

export const defaultItemSize = 20;

const mazeTemplate = mazes.test;
//const mazeTemplate = mazes.newnexus;
//const mazeTemplate = mazes.kpn;
//const mazeTemplate = mazes.maze1;
//const mazeTemplate = mazes.maze2;
//const mazeTemplate = mazes.maze3;

// return {
//   width: 60,
//   height: 80,
//   columns: 3,
//   playerIndex: 1,
//   exitIndex: 10,
//   currentFoods: 1,
//   items: [
//     { id: 0, x: 0, y: 0, type: itemType.WALL },
//     { id: 1, x: 30, y: 10, type: itemType.PLAYER },
//     { id: 2, x: 40, y: 0, type: itemType.WALL },
//     { id: 3, x: 0, y: 20, type: itemType.WALL },
//     { id: 4, x: 30, y: 30, type: itemType.FOOD },
//     { id: 5, x: 40, y: 20, type: itemType.WALL },
//     { id: 6, x: 0, y: 40, type: itemType.WALL },
//     { id: 7, x: 30, y: 50, type: itemType.DOT },
//     { id: 8, x: 40, y: 40, type: itemType.WALL },
//     { id: 9, x: 0, y: 60, type: itemType.WALL },
//     { id: 10, x: 30, y: 70, type: itemType.DOT },
//     { id: 11, x: 40, y: 60, type: itemType.WALL }
//   ]
// };

export function getMaze() {
  const columns = mazeTemplate.split("\n")[0].length;

  const maze = {
    width: columns * defaultItemSize,
    height: mazeTemplate.split("\n").length * defaultItemSize,
    columns,
    currentFoods: 0,
    items: []
  };

  let index = 0;
  let x = 0;
  let y = 0;

  mazeTemplate.split("\n").forEach((line) => {
    line.split("").forEach((character) => {
      if (character === "X") maze.items.push(createWall(x, y));
      else if (character === ".") maze.items.push(createDot(x, y));
      else if (character === "P") {
        maze.items.push(createPlayer(x, y));
        maze.playerIndex = index;
      } else if (character === "E") {
        maze.items.push(createExit(x, y));
        maze.exitIndex = index;
      }
      maze.items[index].id = index;
      index++;
      x += defaultItemSize;
    });
    x = 0;
    y += defaultItemSize;
  });

  return maze;
}

function createWall(x, y) {
  return { x, y, size: defaultItemSize, type: itemType.WALL };
}

function createDot(x, y) {
  return {
    x: x + defaultItemSize / 2,
    y: y + defaultItemSize / 2,
    size: 2,
    type: itemType.DOT
  };
}

function createPlayer(x, y) {
  return {
    x: x + defaultItemSize / 2,
    y: y + defaultItemSize / 2,
    size: 7,
    type: itemType.PLAYER
  };
}

function createExit(x, y) {
  return {
    x: x + defaultItemSize / 2,
    y: y + defaultItemSize / 2,
    size: 2,
    type: itemType.EXIT
  };
}
