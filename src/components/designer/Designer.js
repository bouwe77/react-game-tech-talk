import { useEffect, useReducer, useState } from 'react'
import { itemTypes } from '../../engine/constants'
import Maze from '../game/Maze'

function validate(maze) {
  if (!maze) return null

  switch (true) {
    case maze.items.length !== maze.numberOfRows * maze.itemsPerRow:
      return 'Should have ' + maze.numberOfRows * maze.itemsPerRow + ' items'
    case maze.items.filter((i) => i === itemTypes.PLAYER).length !== 1:
      return 'Should have 1 player'
    case maze.items.filter((i) => i === itemTypes.DOT).length < 1:
      return 'Should have at least 1 dot'
  }

  return null
}

function fetchMazes() {
  return [
    {
      id: 'horlepiep',
      items: ['X', 'P', 'X', 'X', '.', 'X', 'X', 'X', 'X'],
      itemsPerRow: 3,
      numberOfRows: 3,
    },
    {
      id: 'hatseflats',
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
        'X',
        '.',
        'X',
        'X',
        'X',
        'X',
        'X',
      ],
      itemsPerRow: 4,
      numberOfRows: 4,
    },
  ]
}

const initialState = {
  mazes: [],
  selectedMaze: null,
  error: null,
  mazeItemsText: '',
}

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_MAZES': {
      const mazes = fetchMazes()

      const selectedMaze = mazes[0]
      const error = validate(selectedMaze)
      const mazeItemsText = selectedMaze.items.reduce(
        (items, item, index) =>
          (items +=
            item + ((index + 1) % selectedMaze.itemsPerRow === 0 ? '\n' : '')),
        '',
      )

      return { ...state, mazes, selectedMaze, error, mazeItemsText }
    }
    case 'SELECT_MAZE': {
      const selectedMaze = state.mazes.filter(
        (m) => m.id === action.payload.mazeId,
      )[0]
      const mazeItemsText = selectedMaze.items.reduce(
        (items, item, index) =>
          (items +=
            item + ((index + 1) % selectedMaze.itemsPerRow === 0 ? '\n' : '')),
        '',
      )
      const error = validate(selectedMaze)

      return {
        ...state,
        selectedMaze,
        mazeItemsText,
        error,
      }
    }
    case 'CHANGE_ROWS_AND_COLUMNS': {
      if (action.payload.numberOfRows === 0 || action.payload.itemsPerRow === 0)
        return state

      const updatedMaze = {
        ...state.selectedMaze,
        numberOfRows: action.payload.numberOfRows,
        itemsPerRow: action.payload.itemsPerRow,
      }
      const error = validate(updatedMaze)

      return {
        ...state,
        selectedMaze: updatedMaze,
        error,
      }
    }
    case 'CHANGE_TEXT': {
      const mazeItemsText = action.payload.text
      const items = mazeItemsText
        .replaceAll('\n', '')
        .substr(
          0,
          state.selectedMaze.numberOfRows * state.selectedMaze.itemsPerRow,
        )
        .split('')

      const updatedMaze = { ...state.selectedMaze, items }
      const error = validate(updatedMaze)

      return { ...state, selectedMaze: updatedMaze, mazeItemsText, error }
    }
    default:
      return state
  }
}

export default function Designer() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { error, mazes, selectedMaze, mazeItemsText } = state

  useEffect(() => {
    dispatch({ type: 'FETCH_MAZES' })
  }, [])

  function onSelectMaze(event) {
    dispatch({
      type: 'SELECT_MAZE',
      payload: { mazeId: event.currentTarget.value },
    })
  }

  const changeRows = (numberOfRows) => {
    dispatch({
      type: 'CHANGE_ROWS_AND_COLUMNS',
      payload: { numberOfRows, itemsPerRow: selectedMaze.itemsPerRow },
    })
  }

  const changeColumns = (itemsPerRow) => {
    dispatch({
      type: 'CHANGE_ROWS_AND_COLUMNS',
      payload: { numberOfRows: selectedMaze.numberOfRows, itemsPerRow },
    })
  }

  const changeText = (event) => {
    dispatch({
      type: 'CHANGE_TEXT',
      payload: { text: event.currentTarget.value },
    })
  }

  const showMazePreview =
    selectedMaze &&
    selectedMaze.items.length ===
      selectedMaze.numberOfRows * selectedMaze.itemsPerRow

  return (
    <div style={{ justifyContent: 'center' }}>
      <div style={{ margin: '10px' }}>
        <select
          value={selectedMaze?.id}
          onChange={onSelectMaze}
          style={{ width: '200px', height: '40px', fontSize: '14px' }}
        >
          {mazes.map((maze) => (
            <option key={maze.id} value={maze.id}>
              {maze.id}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {selectedMaze && (
          <>
            <div style={{ margin: '10px' }}>
              Rows
              <br />
              <button onClick={() => changeRows(selectedMaze.numberOfRows - 1)}>
                -
              </button>{' '}
              {selectedMaze.numberOfRows}{' '}
              <button onClick={() => changeRows(selectedMaze.numberOfRows + 1)}>
                +
              </button>{' '}
            </div>
            <div style={{ margin: '10px' }}>
              Columns
              <br />
              <button
                onClick={() => changeColumns(selectedMaze.itemsPerRow - 1)}
              >
                -
              </button>{' '}
              {selectedMaze.itemsPerRow}{' '}
              <button
                onClick={() => changeColumns(selectedMaze.itemsPerRow + 1)}
              >
                +
              </button>{' '}
            </div>
          </>
        )}
      </div>
      <div style={{ margin: '10px' }}>
        {error ? `❌ ${error}` : '✅ Valid!'}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ margin: '10px' }}>
          <textarea
            value={mazeItemsText}
            onChange={changeText}
            style={{
              width: '200px',
              height: '200px',
              fontFamily: 'monospace',
              fontSize: '18px',
            }}
          />
        </div>
        <div style={{ margin: '10px' }}>
          {showMazePreview && <Maze maze={selectedMaze} />}
        </div>
      </div>

      <div style={{ margin: '10px' }}>{JSON.stringify(selectedMaze)}</div>

      <div style={{ margin: '10px' }}>
        <button disabled={error ? 'disabled' : undefined}>Save</button>
      </div>
    </div>
  )
}
