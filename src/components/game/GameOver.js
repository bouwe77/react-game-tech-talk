import React from 'react'

export default function GameOver({ score = 0, resetGame = () => {} }) {
  return (
    <Modal>
      <h3>YES!!!</h3>
      <p>
        You scored {score} points, good job!
        <br />
        <br />
        <button autoFocus onClick={resetGame}>
          Try again
        </button>
      </p>
    </Modal>
  )
}

const Modal = ({ children }) => {
  return (
    <div className="modal display-block">
      <section className="modal-main">{children}</section>
    </div>
  )
}
