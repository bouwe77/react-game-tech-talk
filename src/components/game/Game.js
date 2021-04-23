import React, { useState, useEffect } from 'react'
import GameOver from './GameOver'
import Buttons from './Buttons'
import { useKeyPress } from './useKeyPress'
import { useInterval } from './useInterval'
import { createGetMaze } from '../../engine/mazes'
import { itemTypes, directions } from '../../engine/constants'
import { updateMaze } from '../../engine/functions'

const getMaze = createGetMaze()

const initialState = {
  getMaze,
  direction: directions.NONE,
  score: 0,
  interval: 400,
}

const itemSize = 20

export default function App() {
  const [maze, setMaze] = useState(initialState.getMaze)
  const [direction, setDirection] = useState(initialState.direction)
  const [score, setScore] = useState(initialState.score)
  const [interval, setInterval] = useState(initialState.interval)

  useKeyPress('ArrowUp', () => setDirection(directions.UP))
  useKeyPress('ArrowDown', () => setDirection(directions.DOWN))
  useKeyPress('ArrowLeft', () => setDirection(directions.LEFT))
  useKeyPress('ArrowRight', () => setDirection(directions.RIGHT))

  useInterval(() => {
    //if (direction === directions.NONE) return
    const updatedMaze = updateMaze(maze, direction, updateScore)
    if (updatedMaze !== maze) setMaze(updatedMaze)
  }, interval)

  useEffect(() => {
    if (maze.gameOver) setInterval(null)
  }, [maze])

  function updateScore(item) {
    if (item === itemTypes.DOT) setScore(score + 1)
    if (item === itemTypes.FOOD) setScore(score + 10)
  }

  function resetGame() {
    setMaze(initialState.getMaze())
    setDirection(initialState.direction)
    setScore(initialState.score)
    setInterval(initialState.interval)
  }

  return (
    <>
      {maze.gameOver && <GameOver score={score} resetGame={resetGame} />}

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
