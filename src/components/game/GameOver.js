import React from 'react'

export default function GameOver({ score = 0, resetGame = () => {} }) {
  return (
    <Modal>
      <h3>GAME OVER...</h3>
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
