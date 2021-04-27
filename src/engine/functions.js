import { itemTypes, directions, gameStatuses } from './constants'

export const createUpdateMaze = (
  getGhostDirection = getRandomGhostDirection,
  addFood = (maze) => addRandomFood(maze, getRandomFromArray),
) => {
  return function updateMaze(maze, direction) {
    let updatedMaze = maze

    updatedMaze = movePlayer(maze, direction)

    updatedMaze = determineGameStatus(updatedMaze)

    if (gameHasEnded(updatedMaze)) return updatedMaze

    updatedMaze = addFoodIfNecessary(updatedMaze, addFood)

    updatedMaze = moveGhosts(updatedMaze, getGhostDirection)

    updatedMaze = determineGameStatus(updatedMaze)

    if (gameHasEnded(updatedMaze)) return updatedMaze

    return updatedMaze
  }
}

function movePlayer(maze, direction) {
  if (direction === directions.NONE) return maze

  const currentPlayerIndex = maze.items.indexOf(itemTypes.PLAYER)

  const newPlayerIndex = determineNewIndex(currentPlayerIndex, maze, direction)

  // Do nothing if you can't go that way.
  if (newPlayerIndex === -1) return maze

  const replacedItem = maze.items[newPlayerIndex]

  // Do nothing if the player walks into a wall.
  if (replacedItem === itemTypes.WALL) return maze

  // Create a copy of the maze so we can make changes to it.
  let updatedMaze = createCopy(maze)

  // Restore the item type of the previous item.
  updatedMaze.items[currentPlayerIndex] =
    updatedMaze.replacedItems[currentPlayerIndex] || itemTypes.EMPTY
  delete updatedMaze.replacedItems.currentPlayerIndex

  // Set the item type of the new item.
  updatedMaze.replacedItems[newPlayerIndex] = itemTypes.EMPTY

  if (
    getItemIndexes(updatedMaze.items, [itemTypes.GHOST]).includes(
      newPlayerIndex,
    )
  )
    updatedMaze.items[newPlayerIndex] = itemTypes.GHOST
  else updatedMaze.items[newPlayerIndex] = itemTypes.PLAYER

  // Update the points
  if (replacedItem === itemTypes.DOT) {
    updatedMaze.dotsEaten++
    updatedMaze.game.points += updatedMaze.pointsPerDot
  }
  if (replacedItem === itemTypes.FOOD)
    updatedMaze.game.points += updatedMaze.pointsPerFood

  return updatedMaze
}

function moveGhosts(maze, getDirection) {
  if (Object.keys(maze.ghosts).length === 0) return maze

  let updatedMaze = maze

  for (let ghostIndex of Object.keys(maze.ghosts)) {
    updatedMaze = moveGhost(updatedMaze, ghostIndex, getDirection)
  }

  return updatedMaze
}

function moveGhost(maze, currentGhostIndex, getDirection) {
  const direction = getDirection(maze, currentGhostIndex)

  if (direction === directions.NONE) return maze

  const newGhostIndex = determineNewIndex(currentGhostIndex, maze, direction)

  // Do nothing if you can't go that way.
  if (newGhostIndex === -1) return maze

  const replacedItem = maze.items[newGhostIndex]

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

  // Set the ghost's current direction as the previousDirection for the next move.
  updatedMaze.ghosts[newGhostIndex] = {
    previousDirection: direction,
  }
  delete updatedMaze.ghosts[currentGhostIndex]

  return updatedMaze
}

//TODO Refactor this FUCKIN' shite
function getRandomGhostDirection(maze, currentGhostIndex) {
  const previousDirection = maze.ghosts[currentGhostIndex].previousDirection

  // Pick a random direction
  let possibleDirections = []
  // A ghost can not move outside the maze and not into a wall or another ghost.
  const canMoveTo = (maze, index) => {
    return (
      index !== -1 &&
      ![itemTypes.WALL, itemTypes.GHOST].includes(maze.items[index])
    )
  }

  const upIndex = determineNewIndex(currentGhostIndex, maze, directions.UP)
  if (canMoveTo(maze, upIndex)) possibleDirections.push(directions.UP)

  const downIndex = determineNewIndex(currentGhostIndex, maze, directions.DOWN)
  if (canMoveTo(maze, downIndex)) possibleDirections.push(directions.DOWN)

  const leftIndex = determineNewIndex(currentGhostIndex, maze, directions.LEFT)
  if (canMoveTo(maze, leftIndex)) possibleDirections.push(directions.LEFT)

  const rightIndex = determineNewIndex(
    currentGhostIndex,
    maze,
    directions.RIGHT,
  )
  if (canMoveTo(maze, rightIndex)) possibleDirections.push(directions.RIGHT)

  if (previousDirection) {
    let skipDirection = getOppositeDirection(previousDirection)

    if (possibleDirections.length > 1)
      possibleDirections = possibleDirections.filter((d) => d !== skipDirection)
  }

  if (possibleDirections.length === 0) return directions.NONE

  const direction = getRandomFromArray(possibleDirections)

  return direction
}

function addFoodIfNecessary(maze, addFood) {
  // Add food if necessary
  if (
    maze.dotsUntilFood > 0 &&
    maze.dotsEaten > 0 &&
    maze.dotsEaten % maze.dotsUntilFood === 0
  ) {
    maze = addFood(maze)
    maze.dotsEaten = 0
  }

  return maze
}

function addRandomFood(maze, getRandomPosition) {
  // Pick a random food position from all the empty spots in the maze.
  const possiblePositions = getItemIndexes(maze.items, [itemTypes.EMPTY])
  const foodPosition = getRandomPosition(possiblePositions)

  // Create food on that position.
  const updatedMaze = createCopy(maze)
  updatedMaze.items[foodPosition] = itemTypes.FOOD

  return updatedMaze
}

function gameHasEnded(maze) {
  return [gameStatuses.GAMEOVER, gameStatuses.WON].includes(maze.game.status)
}

function determineGameStatus(maze) {
  const playerIndex = maze.items.indexOf(itemTypes.PLAYER)

  // If the player is gone it's game over...
  if (playerIndex === -1) {
    maze.game.status = gameStatuses.GAMEOVER
    return maze
  }

  // If the player encountered a ghost it's game over...
  if (getItemIndexes(maze.items, [itemTypes.GHOST]).includes(playerIndex)) {
    maze.game.status = gameStatuses.GAMEOVER
    return maze
  }

  if (
    !maze.game.status &&
    getItemIndexes(maze.items, [itemTypes.DOT, itemTypes.FOOD]).length === 0 &&
    getItemIndexes(Object.values(maze.replacedItems), [
      itemTypes.DOT,
      itemTypes.FOOD,
    ]).length === 0
  ) {
    maze.game.status = gameStatuses.WON
    return maze
  }

  return maze
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
