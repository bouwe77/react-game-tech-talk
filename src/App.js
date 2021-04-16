import React, { useState, useEffect } from 'react'
import GameOver from './GameOver'
import Buttons from './Buttons'
import { useKeyPress } from './useKeyPress'
import { useInterval } from './useInterval'
import { itemTypes, directions, movePlayer, addFood } from './functions'
import { getMaze } from './mazes'

const initialState = {
  getMaze,
  direction: directions.NONE,
  score: 0,
  interval: 400,
}

const defaultItemSize = 20

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
    const updatedMaze = addFood(maze)
    if (maze.reachedExit) setInterval(null)
    if (updatedMaze !== maze) setMaze(updatedMaze)
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

  let x = 0
  let y = 0

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>REPACTMAN</h1>

      {maze.reachedExit && <GameOver score={score} resetGame={resetGame} />}

      <Score score={score} />

      <Maze
        width={maze.itemsPerRow * defaultItemSize}
        height={maze.numberOfRows * defaultItemSize}
      >
        {maze.items.map((item, index) => {
          const itemComponent = (
            <Item key={`${item}-${x}-${y}`} item={item} x={x} y={y} />
          )
          x += defaultItemSize
          if ((index + 1) % maze.itemsPerRow === 0) {
            x = 0
            y += defaultItemSize
          }

          return itemComponent
        })}
      </Maze>

      <Buttons
        buttonClicked={(direction) => setDirection(direction)}
        disabled={maze.reachedExit}
      />
    </div>
  )
}

function Maze({ width, height, children }) {
  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="black" />
      {children}
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
    <circle
      cx={x + defaultItemSize / 2}
      cy={y + defaultItemSize / 2}
      r={7}
      fill="yellow"
    />
  )
}

function Wall({ x, y }) {
  return (
    <rect
      width={defaultItemSize}
      height={defaultItemSize}
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
      cx={x + defaultItemSize / 2}
      cy={y + defaultItemSize / 2}
      r={2}
      fill="green"
    />
  )
}

function Food({ x, y }) {
  return (
    <circle
      cx={x + defaultItemSize / 2}
      cy={y + defaultItemSize / 2}
      r={7}
      fill="green"
    />
  )
}

function Score({ score }) {
  return <div className="score">score: {score}</div>
}
