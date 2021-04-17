import { mazeTemplates } from './mazes'

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

export function getMaze() {
  const maze = getMazeFromTemplate(mazeTemplates.test)
  return addFood(maze)
}

function getMazeFromTemplate(mazeTemplate) {
  const items = mazeTemplate.items.replace(/\s/g, '').split('')

  const maze = {
    reachedExit: false,
    items,
    numberOfRows: mazeTemplate.numberOfRows,
    itemsPerRow: mazeTemplate.itemsPerRow,
  }

  return maze
}

export function movePlayer(maze, direction, onMove = null) {
  // Do nothing if the player had already reached the exit.
  if (maze.reachedExit) return maze

  const currentPlayerIndex = maze.items.indexOf(itemTypes.PLAYER)

  const newPlayerIndex = determineNewIndex(
    currentPlayerIndex,
    maze.itemsPerRow,
    direction,
  )

  const oldExitIndex = maze.items.indexOf(itemTypes.EXIT)
  const ateFood = maze.items[newPlayerIndex] === itemTypes.FOOD

  // Do nothing if the player goes outside the maze.
  if (newPlayerIndex < 0 || newPlayerIndex > maze.items.length - 1) return maze

  // Do nothing if the player walks into a wall.
  if (maze.items[newPlayerIndex] === itemTypes.WALL) return maze

  // Call the onMove callback (if provided) and pass the item which the player will replace.
  if (onMove) onMove(maze.items[newPlayerIndex])

  // Create a copy of the maze so we can make changes to it.
  let updatedMaze = {
    ...maze,
    reachedExit: newPlayerIndex === oldExitIndex,
    items: [...maze.items],
  }

  // Set the item type of the previous player position to empty.
  updatedMaze.items[currentPlayerIndex] = itemTypes.EMPTY

  // Set the item type of the new player position to player.
  updatedMaze.items[newPlayerIndex] = itemTypes.PLAYER

  // Add new food if the player ate food.
  if (ateFood) updatedMaze = addFood(updatedMaze)

  return updatedMaze
}

export function addFood(maze) {
  const currentFoods = maze.items.filter((item) => item === itemTypes.FOOD)
    .length
  if (currentFoods === howManyFood) return maze

  const number = howManyFood - currentFoods

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
  const updatedMaze = { ...maze }
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
