const howManyFood = 3;

export const directions = {
  IDLE: "idle",
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

export const itemType = {
  PLAYER: "player",
  WALL: "wall",
  DOT: "dot",
  FOOD: "food",
  EXIT: "exit",
  NONE: "none",
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
  const updatedMaze = {
    ...maze,
    items: [...maze.items],
    playerIndex: newIndex,
  };

  // Set the item type of the previous player position to none.
  updatedMaze.items[maze.playerIndex] = {
    ...maze.items[maze.playerIndex],
    type: itemType.NONE,
  };

  // Set the item type of the new player position to player.
  updatedMaze.items[newIndex] = {
    ...maze.items[newIndex],
    type: itemType.PLAYER,
  };

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
  const updatedMaze = { ...maze, currentFoods: howManyFood };
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
