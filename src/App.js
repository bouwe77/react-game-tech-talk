import React, { useState, useEffect } from 'react'
import GameOver from './GameOver'
import Buttons from './Buttons'
import { useKeyPress } from './useKeyPress'
import { useInterval } from './useInterval'
import { getMaze, itemTypes, directions, movePlayer } from './functions'

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
    if (direction === directions.NONE) return
    moveToDirection()
  }, interval)

  useEffect(() => {
    if (maze.reachedExit) setInterval(null)
  }, [maze])

  function moveToDirection() {
    const updatedMaze = movePlayer(maze, direction, updateScore)
    if (updatedMaze !== maze) setMaze(updatedMaze)
  }

  function updateScore(item) {
    if (item === itemTypes.DOT || item === itemTypes.EXIT) setScore(score + 1)
    if (item === itemTypes.FOOD) setScore(score + 10)
  }

  function resetGame() {
    setMaze(initialState.getMaze())
    setDirection(initialState.direction)
    setScore(initialState.score)
    setInterval(initialState.interval)
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>REPACTMAN</h1>

      {maze.reachedExit && <GameOver score={score} resetGame={resetGame} />}

      <Score score={score} />

      <Maze maze={maze} />

      <Buttons
        buttonClicked={(direction) => setDirection(direction)}
        disabled={maze.reachedExit}
      />
    </div>
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
  if (item === itemTypes.EXIT) return <Dot x={x} y={y} />
  if (item === itemTypes.FOOD) return <Food x={x} y={y} />
  return null
}

function Player({ x, y }) {
  return (
    <circle cx={x + itemSize / 2} cy={y + itemSize / 2} r={7} fill="yellow" />
  )
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
