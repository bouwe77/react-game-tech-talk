import React, { useState } from 'react'
import GameOver from './GameOver'
import Buttons from './Buttons'
import { useKeyPress } from './useKeyPress'
import { useInterval } from './useInterval'
import { createGetMaze } from '../../engine/mazes'
import { directions, gameStatuses } from '../../engine/constants'
import { createUpdateMaze } from '../../engine/functions'
import Maze from './Maze'

const getMaze = createGetMaze()
const updateMaze = createUpdateMaze()

const initialState = {
  getMaze: () => getMaze(1),
  direction: directions.NONE,
  interval: 400,
}

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

      <GameInfo game={maze.game} />

      <Maze maze={maze} />

      <Buttons buttonClicked={(direction) => setDirection(direction)} />
    </>
  )
}

function GameInfo({ game }) {
  return (
    <div className="score">
      [level {game.level}] [score {game.points}]
    </div>
  )
}
