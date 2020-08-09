const howManyFood = 1;

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

  if (onMove) onMove(maze.items[newIndex]);

  // Update the new player position in the maze.
  const updatedMaze = { ...maze, playerIndex: newIndex };

  updatedMaze.items[maze.playerIndex].type = itemType.NONE;
  updatedMaze.items[newIndex].type = itemType.PLAYER;

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

export function addFood(maze) {
  if (maze.currentFoods === howManyFood) return maze;

  //TODO Create random food
  return maze;
}
