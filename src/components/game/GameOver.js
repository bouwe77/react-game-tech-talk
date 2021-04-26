import React from 'react'
import { gameStatuses } from '../../engine/constants'

export default function GameOver({
  score = 0,
  gameStatus,
  resetGame = () => {},
}) {
  return (
    <Modal>
      <h3>
        {gameStatus === gameStatuses.GAMEOVER ? (
          <>GAME OVER...</>
        ) : (
          <>YESSS!!!</>
        )}
      </h3>
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

export const Modal = ({ children }) => {
  return (
    <div className="modal display-block">
      <section className="modal-main">{children}</section>
    </div>
  )
}
