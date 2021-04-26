import React, { useState } from 'react'
import GameOver from './GameOver'
import Buttons from './Buttons'
import { useKeyPress } from './useKeyPress'
import { useInterval } from './useInterval'
import { createGetMaze } from '../../engine/mazes'
import { itemTypes, directions, gameStatuses } from '../../engine/constants'
import { createUpdateMaze } from '../../engine/functions'

const getMaze = createGetMaze()
const updateMaze = createUpdateMaze()

const initialState = {
  getMaze: () => getMaze(1),
  direction: directions.NONE,
  interval: 400,
}

const itemSize = 20

export default function App() {
  const [maze, setMaze] = useState(initialState.getMaze)
  const [direction, setDirection] = useState(initialState.direction)
  const [interval, setInterval] = useState(initialState.interval)
  const score = maze.game.points

  useKeyPress('ArrowUp', () => setDirection(directions.UP))
  useKeyPress('ArrowDown', () => setDirection(directions.DOWN))
  useKeyPress('ArrowLeft', () => setDirection(directions.LEFT))
  useKeyPress('ArrowRight', () => setDirection(directions.RIGHT))

  useInterval(() => {
    const updatedMaze = updateMaze(maze, direction)
    if (updatedMaze !== maze) setMaze(updatedMaze)
    if (
      [gameStatuses.GAMEOVER, gameStatuses.WON].includes(
        updatedMaze.game.status,
      )
    )
      setInterval(null)
  }, interval)

  function resetGame() {
    setMaze(initialState.getMaze())
    setDirection(initialState.direction)
    setInterval(initialState.interval)
  }

  return (
    <>
      {!!maze.game.status && (
        <GameOver
          score={score}
          gameStatus={maze.game.status}
          resetGame={resetGame}
        />
      )}

      <Score score={score} />

      <Maze maze={maze} />

      <Buttons buttonClicked={(direction) => setDirection(direction)} />
    </>
  )
}

function Maze({ maze }) {
  const width = maze.itemsPerRow * itemSize
  const height = maze.numberOfRows * itemSize

  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="black" />

      {maze.items.reduce((itemComponents, item, index) => {
        const x = (index % maze.itemsPerRow) * itemSize
        const y = Math.floor(index / maze.itemsPerRow) * itemSize
        return [
          ...itemComponents,
          <Item key={`${item}-${x}-${y}`} item={item} x={x} y={y} />,
        ]
      }, [])}
    </svg>
  )
}

function Item({ item, x, y }) {
  if (item === itemTypes.WALL) return <Wall x={x} y={y} />
  if (item === itemTypes.PLAYER) return <Player x={x} y={y} />
  if (item === itemTypes.DOT) return <Dot x={x} y={y} />
  if (item === itemTypes.FOOD) return <Food x={x} y={y} />
  if (item === itemTypes.GHOST) return <Ghost x={x} y={y} />
  return null
}

function Player({ x, y }) {
  return (
    <circle cx={x + itemSize / 2} cy={y + itemSize / 2} r={7} fill="yellow" />
  )
}

function Ghost({ x, y }) {
  return <circle cx={x + itemSize / 2} cy={y + itemSize / 2} r={7} fill="red" />
}

function Wall({ x, y }) {
  return (
    <rect
      width={itemSize}
      height={itemSize}
      x={x}
      y={y}
      fill="brown"
      rx="5"
      ry="5"
      stroke="black"
    />
  )
}

function Dot({ x, y }) {
  return (
    <circle
      key={`${x}-${y}`}
      cx={x + itemSize / 2}
      cy={y + itemSize / 2}
      r={2}
      fill="green"
    />
  )
}

function Food({ x, y }) {
  return (
    <circle cx={x + itemSize / 2} cy={y + itemSize / 2} r={7} fill="green" />
  )
}

function Score({ score }) {
  return <div className="score">score: {score}</div>
}
