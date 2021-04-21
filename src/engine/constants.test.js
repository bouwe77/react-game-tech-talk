import { itemTypes, directions } from './constants'

test('itemTypes have expected values', () => {
  expect(Object.keys(itemTypes).length).toBe(7)
  expect(itemTypes.PLAYER).toBe('P')
  expect(itemTypes.WALL).toBe('X')
  expect(itemTypes.DOT).toBe('.')
  expect(itemTypes.FOOD).toBe('F')
  expect(itemTypes.EXIT).toBe('E')
  expect(itemTypes.EMPTY).toBe(' ')
  expect(itemTypes.GHOST).toBe('@')
})

test('directions have expected values', () => {
  expect(Object.keys(directions).length).toBe(5)
  expect(directions.NONE).toBe('none')
  expect(directions.UP).toBe('up')
  expect(directions.DOWN).toBe('down')
  expect(directions.LEFT).toBe('left')
  expect(directions.RIGHT).toBe('right')
})
