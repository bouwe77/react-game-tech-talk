import React from 'react'
import { Modal } from './GameOver'

export default function GameWon({ score = 0, resetGame = () => {} }) {
  return (
    <Modal>
      <h3>YES!!!</h3>
      <p>
        You scored {score} points!
        <br />
        <br />
        <button autoFocus onClick={resetGame}>
          Try again
        </button>
      </p>
    </Modal>
  )
}
