import { useState } from 'react'
import { itemTypes } from '../../engine/constants'

function validate(maze) {
  switch (true) {
    case maze.items.length < 3:
      return 'Should have at least 3 items'
    case maze.items.filter((i) => i === itemTypes.PLAYER).length !== 1:
      return 'Should have 1 player'
  }

  return null
}

const items = [
  itemTypes.WALL,
  itemTypes.WALL,
  itemTypes.WALL,
  itemTypes.WALL,
  itemTypes.WALL,
  itemTypes.WALL,
  itemTypes.WALL,
  itemTypes.WALL,
  itemTypes.WALL,
]
const initialMaze = {
  numberOfRows: 3,
  itemsPerRow: 3,
  items,
}

export default function Designer() {
  const [maze, setMaze] = useState(initialMaze)
  const [tool, setTool] = useState(itemTypes.PLAYER)
  const [error, setError] = useState(validate(maze))
  const { FOOD, ...availableItemTypes } = itemTypes

  const changeRows = (numberOfRows) => {
    if (numberOfRows === 0) return

    const items = Array(numberOfRows * maze.itemsPerRow).fill(itemTypes.WALL)

    const updatedMaze = {
      ...maze,
      numberOfRows,
      items,
    }
    setMaze(updatedMaze)
    setError(validate(updatedMaze))
  }

  const changeColumns = (itemsPerRow) => {
    if (itemsPerRow === 0) return

    const items = Array(maze.numberOfRows * itemsPerRow).fill(itemTypes.WALL)

    const updatedMaze = {
      ...maze,
      itemsPerRow,
      items,
    }
    setMaze(updatedMaze)
    setError(validate(updatedMaze))
  }

  const changeItemType = (index) => {
    const updatedItems = [...maze.items]
    updatedItems[index] = tool
    const updatedMaze = {
      ...maze,
      items: updatedItems,
    }
    setMaze(updatedMaze)
    setError(validate(updatedMaze))
  }

  return (
    <div style={{ justifyContent: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ margin: '10px' }}>
          Rows
          <br />
          <button onClick={() => changeRows(maze.numberOfRows - 1)}>
            -
          </button>{' '}
          {maze.numberOfRows}{' '}
          <button onClick={() => changeRows(maze.numberOfRows + 1)}>+</button>{' '}
        </div>
        <div style={{ margin: '10px' }}>
          Columns
          <br />
          <button onClick={() => changeColumns(maze.itemsPerRow - 1)}>
            -
          </button>{' '}
          {maze.itemsPerRow}{' '}
          <button onClick={() => changeColumns(maze.itemsPerRow + 1)}>+</button>{' '}
        </div>
      </div>

      <div style={{ margin: '10px' }}>
        {Object.keys(availableItemTypes).map((itemType, index) => (
          <button
            onClick={() => setTool(itemTypes[itemType])}
            style={{
              border: tool === itemTypes[itemType] ? '3px solid black' : 0,
              margin: '3px',
              width: '70px',
              height: '70px',
              outline: 0,
            }}
            key={`x${index}`}
          >
            {itemType}
          </button>
        ))}
      </div>

      <div style={{ margin: '10px' }}>
        {error ? `❌ ${error}` : '✅ Valid!'}
      </div>

      <div style={{ margin: '10px' }}>
        {maze.items.map((item, index) => (
          <span key={`y${index}`}>
            <button
              onClick={() => changeItemType(index)}
              style={{
                backgroundColor: 'pink',
                margin: '3px',
                width: '40px',
                height: '40px',
                border: 0,
                outline: 0,
              }}
            >
              {item}
            </button>
            {(index + 1) % maze.itemsPerRow === 0 && <br />}
          </span>
        ))}
      </div>

      <div style={{ margin: '10px' }}>{JSON.stringify(maze)}</div>
    </div>
  )
}
