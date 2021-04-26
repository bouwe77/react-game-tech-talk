import { itemTypes, directions, gameStatuses } from './constants'

export const createUpdateMaze = (
  getGhostDirection = (directions) => getRandomFromArray(directions),
  addFood = (maze) => addRandomFood(maze, getRandomFromArray),
) => {
  return function updateMaze(maze, direction, onMove = null) {
    let updatedMaze = maze

    if (direction !== directions.NONE)
      updatedMaze = movePlayer(maze, direction, onMove, addFood)

    if (updatedMaze.game.status === gameStatuses.GAMEOVER) return updatedMaze

    updatedMaze = moveGhosts(updatedMaze, getGhostDirection)

    if (
      !updatedMaze.game.status &&
      getItemIndexes(updatedMaze.items, [itemTypes.DOT, itemTypes.FOOD])
        .length === 0 &&
      getItemIndexes(Object.values(updatedMaze.replacedItems), [
        itemTypes.DOT,
        itemTypes.FOOD,
      ]).length === 0
    )
      updatedMaze.game.status = gameStatuses.WON

    return updatedMaze
  }
}

function moveGhosts(maze, getDirection) {
  if (Object.keys(maze.ghosts).length === 0) return maze

  let updatedMaze = createCopy(maze)

  for (let ghostIndex of Object.keys(maze.ghosts)) {
    updatedMaze = moveGhost(
      updatedMaze,
      ghostIndex,
      maze.ghosts[ghostIndex].previousDirection,
      getDirection,
    )
  }

  return updatedMaze
}

function moveGhost(maze, currentGhostIndex, previousDirection, getDirection) {
  // Pick a random direction
  const possibleDirections = getPossibleGhostDirections(
    maze,
    currentGhostIndex,
    previousDirection,
  )

  if (possibleDirections.length === 0) return maze

  const direction = getDirection(possibleDirections)

  const newGhostIndex = determineNewIndex(currentGhostIndex, maze, direction)

  const replacedItem = maze.items[newGhostIndex]

  // Do nothing if you can't go that way.
  if (newGhostIndex === -1) return maze

  // Do nothing if you walk into a wall.
  if (replacedItem === itemTypes.WALL) return maze

  // Create a copy of the maze so we can make changes to it.
  let updatedMaze = createCopy(maze)

  // Restore the item type of the previous item.
  updatedMaze.items[currentGhostIndex] =
    updatedMaze.replacedItems[currentGhostIndex] || itemTypes.DOT
  delete updatedMaze.replacedItems.currentGhostIndex

  // Set the item type of the new item.
  updatedMaze.items[newGhostIndex] = itemTypes.GHOST
  updatedMaze.replacedItems[newGhostIndex] = replacedItem

  updatedMaze.ghosts[newGhostIndex] = {
    ...updatedMaze.ghosts[currentGhostIndex],
    previousDirection: direction,
  }
  delete updatedMaze.ghosts[currentGhostIndex]

  if (replacedItem === itemTypes.PLAYER)
    updatedMaze.game.status = gameStatuses.GAMEOVER

  return updatedMaze
}

function movePlayer(maze, direction, onMove, addFood) {
  const currentPlayerIndex = maze.items.indexOf(itemTypes.PLAYER)

  const newPlayerIndex = determineNewIndex(currentPlayerIndex, maze, direction)

  // Do nothing if you can't go that way.
  if (newPlayerIndex === -1) return maze

  const replacedItem = maze.items[newPlayerIndex]

  // Do nothing if the player walks into a wall.
  if (replacedItem === itemTypes.WALL) return maze

  // Call the onMove callback (if provided) and pass the item which the player will replace.
  if (onMove) onMove(replacedItem)

  // Create a copy of the maze so we can make changes to it.
  let updatedMaze = createCopy(maze)

  // Restore the item type of the previous item.
  updatedMaze.items[currentPlayerIndex] =
    updatedMaze.replacedItems[currentPlayerIndex] || itemTypes.EMPTY
  delete updatedMaze.replacedItems.currentPlayerIndex

  // Set the item type of the new item.
  if (replacedItem === itemTypes.GHOST) {
    updatedMaze.items[newPlayerIndex] = itemTypes.GHOST
    updatedMaze.game.status = gameStatuses.GAMEOVER
    return updatedMaze
  }

  updatedMaze.replacedItems[newPlayerIndex] = itemTypes.EMPTY
  updatedMaze.items[newPlayerIndex] = itemTypes.PLAYER

  if (replacedItem === itemTypes.DOT)
    updatedMaze.game.points += updatedMaze.pointsPerDot
  if (replacedItem === itemTypes.FOOD)
    updatedMaze.game.points += updatedMaze.pointsPerFood

  if (updatedMaze.dotsUntilFood > 0) {
    if (replacedItem === itemTypes.DOT) updatedMaze.dotsEaten++

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

export function addRandomFood(maze, getRandomPosition) {
  // Pick a random food position from all the empty spots in the maze.
  const possiblePositions = getItemIndexes(maze.items, [itemTypes.EMPTY])
  const foodPosition = getRandomPosition(possiblePositions)

  // Create food on that position.
  const updatedMaze = createCopy(maze)
  updatedMaze.items[foodPosition] = itemTypes.FOOD

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
  const currentIndexNumber = Number(currentIndex)
  let newIndex

  switch (direction) {
    case directions.UP:
      newIndex = currentIndexNumber - maze.itemsPerRow
      break
    case directions.LEFT:
      newIndex = currentIndexNumber - 1
      break
    case directions.RIGHT:
      newIndex = currentIndexNumber + 1
      break
    case directions.DOWN:
      newIndex = currentIndexNumber + maze.itemsPerRow
      break
    case directions.NONE:
      newIndex = -1
      break
    default:
      throw new Error('Unknown direction: ' + direction)
  }

  // Do not return the new index if it's outside of the maze.
  if (newIndex < 0 || newIndex > maze.items.length - 1) newIndex = -1

  return newIndex
}

function getPossibleGhostDirections(maze, index, previousDirection) {
  let possibleDirections = []

  //TODO Refactor this shite

  // A ghost can not move outside the maze and not into a wall or another ghost.
  const canMoveTo = (maze, index) => {
    return (
      index !== -1 &&
      ![itemTypes.WALL, itemTypes.GHOST].includes(maze.items[index])
    )
  }
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

    if (possibleDirections.length > 1)
      possibleDirections = possibleDirections.filter((d) => d !== skipDirection)
  }

  return possibleDirections
}

function getOppositeDirection(direction) {
  if (direction === directions.UP) return directions.DOWN
  if (direction === directions.DOWN) return directions.UP
  if (direction === directions.LEFT) return directions.RIGHT
  if (direction === directions.RIGHT) return directions.LEFT
}

function getRandomFromArray(array) {
  return array[(array.length * Math.random()) | 0]
}

function createCopy(maze) {
  return {
    ...maze,
    items: [...maze.items],
    ghosts: { ...maze.ghosts },
    replacedItems: { ...maze.replacedItems },
  }
}
