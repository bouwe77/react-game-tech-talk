import * as mazes from "./mazes.js";

export const defaultItemSize = 20;
const howManyFood = 1;

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

export const directions = {
  IDLE: "idle",
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right"
};

export const itemType = {
  PLAYER: "player",
  WALL: "wall",
  DOT: "dot",
  FOOD: "food",
  EXIT: "exit",
  NONE: "none"
};

export function movePlayer(maze, direction, onMove = null) {
  const newIndex = determineNewIndex(maze.playerIndex, maze.columns, direction);

  // Do nothing if the player goes outside the maze.
  if (newIndex < 0 || newIndex > maze.items.length - 1) return maze;

  // Do nothing if the player walks into a wall.
  if (maze.items[newIndex].type === itemType.WALL) return maze;

  // Do nothing if the player had already reached the exit.
  if (maze.playerIndex === maze.exitIndex) return maze;

  // Call the onMove callback (if provided) and pass the item which the player will replace.
  if (onMove) onMove(maze.items[newIndex]);

  // Create a copy of the maze and update the new player index in the maze.
  const updatedMaze = { ...maze, items: [...maze.items], playerIndex: newIndex };

  // Set the item type of the previous player position to none.
  updatedMaze.items[maze.playerIndex] = {
    ...maze.items[maze.playerIndex],
    type: itemType.NONE
  };

  // Set the item type of the new player position to player.
  updatedMaze.items[newIndex] = { ...maze.items[newIndex], type: itemType.PLAYER };

  // Decrement the food counter if the player ate food.
  if (maze.items[newIndex].type === itemType.FOOD) updatedMaze.currentFoods--;

  return updatedMaze;
}

export function addFood(maze) {
  if (maze.currentFoods === howManyFood) return maze;

  const number = howManyFood - maze.currentFoods;

  // Pick some random positions.
  const randomPositions = maze.items
    .filter((item) => item.type === itemType.DOT || item.type === itemType.NONE)
    .sort(() => Math.random() - Math.random())
    .slice(0, number);

  // Create food on that positions.
  const updatedMaze = { ...maze, currentFoods: number };
  randomPositions.forEach((pos) => {
    updatedMaze.items[pos.id] = { ...maze.items[pos.id], type: itemType.FOOD };
  });

  return updatedMaze;
}

function determineNewIndex(currentIndex, columns, direction) {
  switch (direction) {
    case directions.UP:
      return currentIndex - columns;
    case directions.LEFT:
      return currentIndex - 1;
    case directions.RIGHT:
      return currentIndex + 1;
    case directions.DOWN:
      return currentIndex + columns;
    default:
      return -1;
  }
}
