import { itemTypes, directions, gameStatuses } from './constants'

export const updateMaze = (maze, direction, onMove = null) => {
  let updatedMaze = maze

  if (direction !== directions.NONE)
    updatedMaze = movePlayer(maze, direction, onMove)

  updatedMaze = moveGhosts(updatedMaze)

  if (
    !updatedMaze.gameStatus &&
    getItemIndexes(updatedMaze.items, [itemTypes.DOT, itemTypes.FOOD])
      .length === 0
  )
    updatedMaze.gameStatus = gameStatuses.WON

  return updatedMaze
}

function moveGhosts(maze) {
  if (maze.ghosts.length === 0) return maze

  const ghostsIndex = 0 // because there is only one ghost supported at this moment

  let updatedMaze = createCopy(maze)
  updatedMaze = moveGhost(updatedMaze, ghostsIndex)

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

  const updatedMaze = moveItem(
    maze,
    currentGhostMazeIndex,
    itemTypes.GHOST,
    direction,
    onMove,
    ghost.replacedItemType || itemTypes.DOT,
  )
  const newMazeIndex = updatedMaze.items.indexOf(itemTypes.GHOST)

  const replacedItemType = maze.items[newMazeIndex]

  updatedMaze.ghosts[ghostsIndex] = {
    ...updatedMaze.ghosts[ghostsIndex],
    mazeIndex: newMazeIndex,
    replacedItemType,
    previousDirection: direction,
  }

  if (replacedItemType === itemTypes.PLAYER)
    updatedMaze.gameStatus = gameStatuses.GAMEOVER

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

  let updatedMaze = moveItem(
    maze,
    currentPlayerIndex,
    itemTypes.PLAYER,
    direction,
    onMove,
    itemTypes.EMPTY,
  )

  const newPlayerIndex = updatedMaze.items.indexOf(itemTypes.PLAYER)

  if (updatedMaze.dotsUntilFood > 0) {
    if (maze.items[newPlayerIndex] === itemTypes.DOT) updatedMaze.dotsEaten++

    if (
      updatedMaze.dotsEaten > 0 &&
      updatedMaze.dotsEaten % updatedMaze.dotsUntilFood === 0
    ) {
      updatedMaze = addFood(updatedMaze)
      updatedMaze.dotsEaten = 0
    }
  }

  return updatedMaze
}

export function addFood(maze) {
  // Pick a random position.
  const possiblePositions = getItemIndexes(maze.items, [
    itemTypes.DOT,
    itemTypes.EMPTY,
  ])
  const randomPosition =
    possiblePositions[(possiblePositions.length * Math.random()) | 0]

  // Create food on that position.
  const updatedMaze = createCopy(maze)
  updatedMaze.items[randomPosition] = itemTypes.FOOD

  return updatedMaze
}

export function getItemIndexes(items, itemTypes) {
  return (
    items
      // map creates an array with the indexes of all items that are the given itemTypes and undefined for all other items.
      .map((item, index) => (itemTypes.includes(item) ? index : undefined))
      // filter removes all undefined items, i.e. other items than the given itemTypes
      .filter((x) => x)
  )
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
