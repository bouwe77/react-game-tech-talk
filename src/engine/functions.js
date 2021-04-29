import { itemTypes, directions, gameStatuses } from './constants'

export const createUpdateMaze = (
  getGhostDirection = getRandomGhostDirection,
  addFood = (maze) => addRandomFood(maze, getRandomFromArray),
) => {
  return function updateMaze(maze, direction) {
    let updatedMaze = movePlayer(maze, direction)

    updatedMaze = determineGameStatus(updatedMaze)

    if (gameHasEnded(updatedMaze)) return updatedMaze

    updatedMaze = addFoodIfNecessary(updatedMaze, addFood)

    updatedMaze = moveGhosts(updatedMaze, getGhostDirection)

    updatedMaze = determineGameStatus(updatedMaze)

    if (gameHasEnded(updatedMaze)) return updatedMaze

    return updatedMaze
  }
}

function moveGhosts(maze, getDirection) {
  if (Object.keys(maze.ghosts).length === 0) return maze

  let updatedMaze = maze

  for (let ghostIndex of Object.keys(maze.ghosts)) {
    updatedMaze = moveGhost(updatedMaze, ghostIndex, getDirection)
  }

  return updatedMaze
}

function moveItem(
  maze,
  currentIndex,
  direction,
  getPreviousItemType,
  getNewItemType,
) {
  if (direction === directions.NONE) return maze

  const newIndex = determineNewIndex(currentIndex, maze, direction)

  const canMoveToThatIndex = canMoveTo(maze, maze.items[currentIndex], newIndex)
  if (!canMoveToThatIndex) return maze

  // Create a copy of the maze so we can make changes to it.
  let updatedMaze = createCopy(maze)

  // Restore the item type of the previous item.
  const previousItem = getPreviousItemType()
  updatedMaze.items[currentIndex] = previousItem
  delete updatedMaze.replacedItems.currentIndex

  // Remember the replaced item type so it can be restored the next time.
  updatedMaze.replacedItems[newIndex] =
    previousItem === itemTypes.EMPTY ? itemTypes.EMPTY : maze.items[newIndex]

  // Set the item type of the new item.
  updatedMaze.items[newIndex] = getNewItemType(maze, newIndex)

  return updatedMaze
}

function movePlayer(maze, direction) {
  if (direction === directions.NONE) return maze

  const currentPlayerIndex = maze.items.indexOf(itemTypes.PLAYER)

  const getPreviousItemType = () => itemTypes.EMPTY

  const getNewItemType = (maze, index) => {
    if (getItemIndexes(maze.items, [itemTypes.GHOST]).includes(index))
      return itemTypes.GHOST
    return itemTypes.PLAYER
  }

  const updatedMaze = moveItem(
    maze,
    currentPlayerIndex,
    direction,
    getPreviousItemType,
    getNewItemType,
  )

  // Update the points if the player ate a dot and/or food.
  const dotEaten = hasItemTypeDecreased(maze, updatedMaze, itemTypes.DOT)
  if (dotEaten) {
    updatedMaze.dotsEaten++
    updatedMaze.game.points += updatedMaze.pointsPerDot
  }
  const foodEaten = hasItemTypeDecreased(maze, updatedMaze, itemTypes.FOOD)
  if (foodEaten) updatedMaze.game.points += updatedMaze.pointsPerFood

  return updatedMaze
}

function moveGhost(maze, currentGhostIndex, getDirection) {
  const direction = getDirection(maze, currentGhostIndex)

  const getPreviousItemType = () =>
    maze.replacedItems[currentGhostIndex] || itemTypes.DOT
  const getNewItemType = () => itemTypes.GHOST

  const updatedMaze = moveItem(
    maze,
    currentGhostIndex,
    direction,
    getPreviousItemType,
    getNewItemType,
  )

  // Set the ghost's current direction as the previousDirection for the next move.
  const oldGhostIndexes = getItemIndexes(maze.items, [itemTypes.GHOST])
  const newGhostIndexes = getItemIndexes(updatedMaze.items, [itemTypes.GHOST])
  //console.log({ oldGhostIndexes, newGhostIndexes })

  //TODO De new index van de zojuist verplaatste ghost achterhalen...

  const stront = newGhostIndexes.filter((el) => !oldGhostIndexes.includes(el))
  //console.log(stront)

  const newGhostIndex = stront[0] //TODO determine new ghost index
  updatedMaze.ghosts[newGhostIndex] = {
    previousDirection: direction,
  }
  delete updatedMaze.ghosts[currentGhostIndex]

  //console.log(updatedMaze)

  return updatedMaze
}

//TODO Refactor this FUCKIN' shite
function getRandomGhostDirection(maze, currentGhostIndex) {
  const previousDirection = maze.ghosts[currentGhostIndex].previousDirection

  // Pick a random direction
  let possibleDirections = []

  //TODO curry canMoveTo, because 2 of the 3 arguments are always the same...

  const upIndex = determineNewIndex(currentGhostIndex, maze, directions.UP)
  if (canMoveTo(maze, itemTypes.GHOST, upIndex))
    possibleDirections.push(directions.UP)

  const downIndex = determineNewIndex(currentGhostIndex, maze, directions.DOWN)
  if (canMoveTo(maze, itemTypes.GHOST, downIndex))
    possibleDirections.push(directions.DOWN)

  const leftIndex = determineNewIndex(currentGhostIndex, maze, directions.LEFT)
  if (canMoveTo(maze, itemTypes.GHOST, leftIndex))
    possibleDirections.push(directions.LEFT)

  const rightIndex = determineNewIndex(
    currentGhostIndex,
    maze,
    directions.RIGHT,
  )
  if (canMoveTo(maze, itemTypes.GHOST, rightIndex))
    possibleDirections.push(directions.RIGHT)

  if (previousDirection) {
    let skipDirection = getOppositeDirection(previousDirection)

    if (possibleDirections.length > 1)
      possibleDirections = possibleDirections.filter((d) => d !== skipDirection)
  }

  if (possibleDirections.length === 0) return directions.NONE

  const direction = getRandomFromArray(possibleDirections)

  return direction
}

function canMoveTo(maze, itemType, index) {
  return (
    // You can not exit the maze
    index !== -1 &&
    // You can not go through a wall and you can not go to a place where the same item type already is
    ![itemTypes.WALL, itemType].includes(maze.items[index])
  )
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

function hasItemTypeDecreased(maze1, maze2, itemType) {
  return (
    maze1.items.filter((i) => i === itemType).length >
    maze2.items.filter((i) => i === itemType).length
  )
}
