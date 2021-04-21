import { createGetMaze } from './mazes'
import { updateMaze } from './functions'
import { itemTypes } from './constants'

test("Try to go where you can't go", () => {
  // Arrange
  const getMazeTemplate = (level) => {
    return {
      items: ['X', 'P', 'X', 'X', '.', 'X', 'X', 'E', 'X'],
      itemsPerRow: 3,
      numberOfRows: 3,
      dotsUntilFood: 0,
      dotsEaten: 0,
    }
  }
  const level = 0
  const getMaze = createGetMaze(getMazeTemplate)
  const maze = getMaze(level)

  // NOTE: .toBe on an object means check reference equality, it should be exactly the same object.

  // ====== Move to the top, which shouldn't be possible because you can't exit the maze's boundaries. ======
  // Act
  let updatedMaze = updateMaze(maze, 'up')
  // Assert
  expect(updatedMaze).toBe(maze)

  // ====== Move to the left, which shouldn't be possible because there is a wall... ======
  // Act
  updatedMaze = updateMaze(maze, 'left')
  // Assert
  expect(updatedMaze).toBe(maze)

  // ====== Move to the right, which shouldn't be possible because there is a wall... ======
  // Act
  updatedMaze = updateMaze(maze, 'right')
  // Assert
  expect(updatedMaze).toBe(maze)

  // ====== Move down to the exit, and when reached, move down again, which shouldn't be possible because you can't exit the maze's boundaries. ======

  // Act (move down)
  const updatedMaze1 = updateMaze(maze, 'down')
  // Assert the maze has been updated
  expect(updatedMaze1).not.toBe(maze)

  // Act (move down again so you reach the exit)
  const updatedMaze2 = updateMaze(updatedMaze1, 'down')
  // Assert the maze has been updated
  expect(updatedMaze2).not.toBe(updatedMaze1)

  // Act (move down again, which should not be possible because we already reached the exit)
  const notUpdatedMaze = updateMaze(updatedMaze2, 'down')
  // Assert the maze is NOT updated
  expect(notUpdatedMaze).toBe(updatedMaze2)
})

test('Walk straight to the exit in a very simple maze without ghosts', () => {
  // Arrange
  const getMazeTemplate = (level) => {
    return {
      items: ['X', 'P', 'X', 'X', '.', 'X', 'X', 'E', 'X'],
      itemsPerRow: 3,
      numberOfRows: 3,
      dotsUntilFood: 1, // Every time a dot is eaten, new food appears
      dotsEaten: 0,
    }
  }
  const level = 0
  const getMaze = createGetMaze(getMazeTemplate)
  const maze = getMaze(level)

  let actualItemType
  const onMove = (itemType) => (actualItemType = itemType)

  // ====== 1st move down ======

  // Act
  let updatedMaze = updateMaze(maze, 'down', onMove)

  // Assert
  expect(actualItemType).toBe('.')
  expect(updatedMaze.items).toEqual([
    'X',
    'F',
    'X',
    'X',
    'P',
    'X',
    'X',
    'E',
    'X',
  ])
  expect(updatedMaze.reachedExit).toBe(false)

  // ====== 2nd move down, so we reach the exit ======

  // Act
  updatedMaze = updateMaze(updatedMaze, 'down', onMove)

  // Assert
  expect(actualItemType).toBe('E')
  expect(updatedMaze.items).toEqual([
    'X',
    'F',
    'X',
    'X',
    'F',
    'X',
    'X',
    'P',
    'X',
  ])
  expect(updatedMaze.reachedExit).toBe(true)
})

test('A bit more complex maze', () => {
  // Arrange
  const getMazeTemplate = (level) => {
    return {
      numberOfRows: 4,
      itemsPerRow: 4,
      items: [
        'X',
        'P',
        'X',
        'X',
        'X',
        '.',
        '.',
        'X',
        'X',
        '.',
        '.',
        'X',
        'X',
        'X',
        'E',
        'X',
      ],
      dotsUntilFood: 3, // Every time 3 dots are eaten, new food appears
      dotsEaten: 0,
    }
  }
  const level = 0
  const getMaze = createGetMaze(getMazeTemplate)
  const maze = getMaze(level)

  const moves = ['down', 'down', 'right', 'down']

  // Act
  let updatedMaze = maze
  moves.forEach((move) => (updatedMaze = updateMaze(updatedMaze, move)))

  // Assert
  expect(updatedMaze.dotsEaten).toEqual(0) // dotsEaten has been reset, because food was just added
  expect(updatedMaze.items.filter((i) => i === itemTypes.FOOD).length).toEqual(
    1,
  )
  expect(updatedMaze.reachedExit).toBe(true)
})
