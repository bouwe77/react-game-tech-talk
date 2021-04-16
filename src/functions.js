const howManyFood = 3

export const directions = {
  NONE: 'none',
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
}

export const itemTypes = {
  PLAYER: 'P',
  WALL: 'X',
  DOT: '.',
  FOOD: 'F',
  EXIT: 'E',
  EMPTY: '-',
}

export function movePlayer(maze, direction, onMove = null) {
  const newIndex = determineNewIndex(
    maze.playerIndex,
    maze.itemsPerRow,
    direction,
  )

  // Do nothing if the player goes outside the maze.
  if (newIndex < 0 || newIndex > maze.items.length - 1) return maze

  // Do nothing if the player walks into a wall.
  if (maze.items[newIndex] === itemTypes.WALL) return maze

  // Do nothing if the player had already reached the exit.
  if (maze.reachedExit) return maze

  // Call the onMove callback (if provided) and pass the item which the player will replace.
  if (onMove) onMove(maze.items[newIndex])

  // Create a copy of the maze and update the new player index in the maze.
  const updatedMaze = {
    ...maze,
    items: [...maze.items],
    playerIndex: newIndex,
  }

  // Set the item type of the previous player position to empty.
  updatedMaze.items[maze.playerIndex] = itemTypes.EMPTY

  // Set the item type of the new player position to player.
  updatedMaze.items[newIndex] = itemTypes.PLAYER

  // Decrement the food counter if the player ate food.
  if (maze.items[newIndex] === itemTypes.FOOD) updatedMaze.currentFoods--

  updatedMaze.reachedExit = updatedMaze.playerIndex === updatedMaze.exitIndex

  return updatedMaze
}

export function addFood(maze) {
  if (maze.currentFoods === howManyFood) return maze

  const number = howManyFood - maze.currentFoods

  // Pick some random positions.
  const randomPositions = maze.items
    // map creates an array with the index of DOT and EMPTY items and undefined for all other items.
    .map((item, index) =>
      item === itemTypes.DOT || item === itemTypes.EMPTY ? index : undefined,
    )
    // filter removes all undefined items, i.e. other items than DOT and EMPTY
    .filter((x) => x)
    // the remaining index numbers are shuffled
    .sort(() => Math.random() - Math.random())
    // Pick the number of indexes we need.
    .slice(0, number)

  // Create food on that positions.
  const updatedMaze = { ...maze, currentFoods: howManyFood }
  randomPositions.forEach((pos) => {
    updatedMaze.items[pos] = itemTypes.FOOD
  })

  return updatedMaze
}

function determineNewIndex(currentIndex, itemsPerRow, direction) {
  switch (direction) {
    case directions.UP:
      return currentIndex - itemsPerRow
    case directions.LEFT:
      return currentIndex - 1
    case directions.RIGHT:
      return currentIndex + 1
    case directions.DOWN:
      return currentIndex + itemsPerRow
    default:
      return -1
  }
}
