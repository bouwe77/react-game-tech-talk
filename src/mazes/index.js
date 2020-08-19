import { itemType } from "../functions";
//import mazeTemplate from "./testmaze.js";
//import mazeTemplate from "./maze1.js";
//import mazeTemplate from "./kpn.js";
import mazeTemplate from "./newnexus.js";

export const defaultItemSize = 20;

export function createMaze() {
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

  //console.log("maze", maze);

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
