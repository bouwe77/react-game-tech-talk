import { directions, itemTypes } from './constants'
import { getItemIndexes } from './functions'

export function createGetMaze(getMaze = fetchMaze) {
  return function (level = 1, pointsPerDot = 1, pointsPerFood = 10) {
    validate(level, pointsPerDot, pointsPerFood)

    let maze = getMaze(level)

    let ghosts = {}
    for (let ghostIndex of getItemIndexes(maze.items, [itemTypes.GHOST])) {
      ghosts = {
        ...ghosts,
        [ghostIndex]: {
          previousDirection: directions.NONE,
        },
      }
    }

    maze = {
      ...maze,
      ghosts,
      replacedItems: {},
      game: {
        status: null,
        points: 0,
        level,
      },
      pointsPerDot,
      pointsPerFood,
    }

    return maze
  }
}

function validate(level, pointsPerDot, pointsPerFood) {
  if (isNaN(level) || level < 0 || isNaN(pointsPerDot) || isNaN(pointsPerFood))
    throw new Error(
      'Please supply valid numbers for level, pointsPerDot and pointsPerFood',
    )
}

export function fetchMaze(level) {
  const mazeTemplates = [
    {
      items: [
        'X',
        'P',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        'X',
        'X',
        'X',
      ],
      itemsPerRow: 3,
      numberOfRows: 7,
      dotsUntilFood: 10,
      dotsEaten: 0,
    },
    {
      items: [
        'X',
        'P',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        '.',
        'X',
        'X',
        '@',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
      ],
      itemsPerRow: 4,
      numberOfRows: 7,
      dotsUntilFood: 3,
      dotsEaten: 0,
    },
    {
      items: [
        'X',
        'P',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        '.',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        'X',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '@',
        'X',
        '@',
        '.',
        'X',
        '.',
        '.',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
      ],
      itemsPerRow: 20,
      numberOfRows: 10,
      dotsUntilFood: 20,
      dotsEaten: 0,
    },
    {
      items: [
        'X',
        'P',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        'X',
        '@',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
      ],
      itemsPerRow: 20,
      numberOfRows: 10,
      dotsUntilFood: 20,
      dotsEaten: 0,
    },
    {
      items: [
        'X',
        'P',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        '@',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        '@',
        '@',
        '@',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
      ],
      itemsPerRow: 20,
      numberOfRows: 10,
      dotsUntilFood: 20,
      dotsEaten: 0,
    },
    {
      items: [
        'X',
        'P',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        'X',
        '.',
        'X',
        '.',
        '.',
        '.',
        'X',
        '.',
        'X',
        'X',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        'X',
        'X',
        '.',
        'X',
        'X',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        '.',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
        'X',
      ],
      itemsPerRow: 31,
      numberOfRows: 15,
      dotsUntilFood: 20,
      dotsEaten: 0,
    },
    ,
  ]

  return mazeTemplates[level]
}
