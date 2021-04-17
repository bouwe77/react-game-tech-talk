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
  EMPTY: ' ',
  GHOST: '@',
}

const pipe = (...fns) => (x) => fns.reduce((y, f) => f(y), x)
const createMaze = pipe(getMazeFromTemplate, addFood)

export const getMaze = () => createMaze(mazeTemplates.maze2)

export const updateMaze = (maze, direction, onMove = null) => {
  // Do nothing if the player had already reached the exit.
  if (maze.reachedExit) return maze

  let updatedMaze = movePlayer(maze, direction, onMove)

  updatedMaze = moveGhosts(updatedMaze)

  return updatedMaze
}

function moveGhosts(maze) {
  let updatedMaze = createCopy(maze)

  for (
    let ghostsIndex = 0;
    ghostsIndex < updatedMaze.ghosts.length;
    ghostsIndex++
  ) {
    updatedMaze = moveGhost(updatedMaze, ghostsIndex)
  }

  return updatedMaze
}

function moveGhost(maze, ghostsIndex) {
  const ghost = maze.ghosts[ghostsIndex]
  const currentGhostMazeIndex = ghost.mazeIndex
  const possibleDirections = getPossibleGhostDirections(
    maze,
    currentGhostMazeIndex,
    ghost.previousDirection,
  )
  const direction = getRandom(possibleDirections)
  const onMove = () => {}

  //TODO Bug: Ghost vervangt denk ik de EXIT door iets anders, zodat exitReached opeens true wordt?
  //TODO Bovendien wordt de player ook vervangen, dat moet (nog) niet...

  const updatedMaze = moveItem(
    maze,
    currentGhostMazeIndex,
    itemTypes.GHOST,
    direction,
    onMove,
    ghost.replacedItemType || itemTypes.DOT,
  )

  const newMazeIndex = updatedMaze.items.indexOf(itemTypes.GHOST)

  updatedMaze.ghosts[ghostsIndex] = {
    ...updatedMaze.ghosts[ghostsIndex],
    mazeIndex: newMazeIndex,
    replacedItemType: maze.items[newMazeIndex],
    previousDirection: direction,
  }

  return updatedMaze
}

function moveItem(
  maze,
  itemCurrentIndex,
  itemType,
  direction,
  onMove,
  replaceByItemType,
) {
  const itemNewIndex = determineNewIndex(itemCurrentIndex, maze, direction)

  // Do nothing if you can't go that way.
  if (itemNewIndex === -1) return maze

  // Do nothing if the player walks into a wall.
  if (maze.items[itemNewIndex] === itemTypes.WALL) return maze

  // Call the onMove callback (if provided) and pass the item which the player will replace.
  if (onMove) onMove(maze.items[itemNewIndex])

  // Create a copy of the maze so we can make changes to it.
  let updatedMaze = createCopy(maze)

  // Set the item type of the previous item.
  updatedMaze.items[itemCurrentIndex] = replaceByItemType

  // Set the item type of the new item.
  updatedMaze.items[itemNewIndex] = itemType

  return updatedMaze
}

function movePlayer(maze, direction, onMove) {
  const currentPlayerIndex = maze.items.indexOf(itemTypes.PLAYER)
  const oldExitIndex = maze.items.indexOf(itemTypes.EXIT)

  let updatedMaze = moveItem(
    maze,
    currentPlayerIndex,
    itemTypes.PLAYER,
    direction,
    onMove,
    itemTypes.EMPTY,
  )

  const newPlayerIndex = updatedMaze.items.indexOf(itemTypes.PLAYER)

  updatedMaze.reachedExit = newPlayerIndex === oldExitIndex

  // Add new food if the player ate food.
  const ateFood = maze.items[newPlayerIndex] === itemTypes.FOOD
  if (ateFood) updatedMaze = addFood(updatedMaze)

  return updatedMaze
}

function addFood(maze) {
  const currentFoods = maze.items.filter((item) => item === itemTypes.FOOD)
    .length

  if (currentFoods === howManyFood) return maze

  const number = howManyFood - currentFoods

  // Pick some random positions.
  const randomPositions = getItemIndexes(maze.items, [
    itemTypes.DOT,
    itemTypes.EMPTY,
  ])
    // the remaining index numbers are shuffled
    .sort(() => Math.random() - Math.random())
    // Pick the number of indexes we need.
    .slice(0, number)

  // Create food on that positions.
  const updatedMaze = createCopy(maze)
  randomPositions.forEach((pos) => {
    updatedMaze.items[pos] = itemTypes.FOOD
  })

  return updatedMaze
}

function getItemIndexes(items, itemTypes) {
  return (
    items
      // map creates an array with the indexes of all items that are the given itemTypes and undefined for all other items.
      .map((item, index) => (itemTypes.includes(item) ? index : undefined))
      // filter removes all undefined items, i.e. other items than the given itemTypes
      .filter((x) => x)
  )
}

function getMazeFromTemplate(mazeTemplate) {
  const items = mazeTemplate.items.replace(/\s/g, '').split('')

  const ghosts = getItemIndexes(items, [itemTypes.GHOST]).map(
    (ghostMazeIndex) => {
      return {
        mazeIndex: ghostMazeIndex,
        replacedItemType: null,
        previousDirection: null,
      }
    },
  )

  const maze = {
    reachedExit: false,
    items,
    numberOfRows: mazeTemplate.numberOfRows,
    itemsPerRow: mazeTemplate.itemsPerRow,
    ghosts,
  }

  return maze
}

function determineNewIndex(currentIndex, maze, direction) {
  let newIndex
  switch (direction) {
    case directions.UP:
      newIndex = currentIndex - maze.itemsPerRow
      break
    case directions.LEFT:
      newIndex = currentIndex - 1
      break
    case directions.RIGHT:
      newIndex = currentIndex + 1
      break
    case directions.DOWN:
      newIndex = currentIndex + maze.itemsPerRow
      break
    default:
      newIndex = -1
      break
  }

  // Do not return the new index if it's outside of the maze.
  if (newIndex < 0 || newIndex > maze.items.length - 1) newIndex = -1

  return newIndex
}

function getPossibleGhostDirections(maze, index, previousDirection) {
  let possibleDirections = []

  //TODO Refactor this shite

  const canMoveTo = (maze, index) =>
    index !== -1 && maze.items[index] !== itemTypes.WALL

  const upIndex = determineNewIndex(index, maze, directions.UP)
  if (canMoveTo(maze, upIndex)) possibleDirections.push(directions.UP)

  const downIndex = determineNewIndex(index, maze, directions.DOWN)
  if (canMoveTo(maze, downIndex)) possibleDirections.push(directions.DOWN)

  const leftIndex = determineNewIndex(index, maze, directions.LEFT)
  if (canMoveTo(maze, leftIndex)) possibleDirections.push(directions.LEFT)

  const rightIndex = determineNewIndex(index, maze, directions.RIGHT)
  if (canMoveTo(maze, rightIndex)) possibleDirections.push(directions.RIGHT)

  if (previousDirection) {
    let skipDirection = getOppositeDirection(previousDirection)

    if (possibleDirections.length > 1) {
      possibleDirections = possibleDirections.filter((d) => d !== skipDirection)
    }
  }

  return possibleDirections
}

function getOppositeDirection(direction) {
  if (direction === directions.UP) return directions.DOWN
  if (direction === directions.DOWN) return directions.UP
  if (direction === directions.LEFT) return directions.RIGHT
  if (direction === directions.RIGHT) return directions.LEFT
}

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function createCopy(maze) {
  return {
    ...maze,
    items: [...maze.items],
    ghosts: [...maze.ghosts],
  }
}
