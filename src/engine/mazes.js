import { itemTypes } from './constants'
import { getItemIndexes } from './functions'

export function createGetMaze(getMaze = fetchMaze) {
  return function (level = 0) {
    let maze = getMaze(level)

    const ghostMazeIndexes = getItemIndexes(maze.items, [itemTypes.GHOST])
    let ghosts = []
    ghostMazeIndexes.forEach((ghostMazeIndex) => {
      const ghost = {
        mazeIndex: ghostMazeIndex,
        replacedItemType: null,
        previousDirection: null,
      }
      ghosts = [...ghosts, ghost]
    })

    maze = { ...maze, ghosts, gameOver: false }

    return maze
  }
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
        '@',
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
        '@',
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
        '.',
        'X',
        '.',
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
