import React, { useState, useEffect } from "react";
import "./styles.css";
import Modal from "./Modal";
import { useKeyPress } from "./useKeyPress";
import { useInterval } from "./useInterval";

const directions = {
  IDLE: "idle",
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right"
};

const itemType = {
  PLAYER: "player",
  WALL: "wall",
  DOT: "dot",
  FOOD: "food",
  NONE: "none"
};

const howManyFood = 1;

function createMaze() {
  return {
    width: 60,
    height: 80,
    columns: 3,
    playerIndex: 1,
    exitIndex: 10,
    currentFoods: 1,
    items: [
      { id: 0, x: 0, y: 0, type: itemType.WALL },
      { id: 1, x: 30, y: 10, type: itemType.PLAYER },
      { id: 2, x: 40, y: 0, type: itemType.WALL },
      { id: 3, x: 0, y: 20, type: itemType.WALL },
      { id: 4, x: 30, y: 30, type: itemType.FOOD },
      { id: 5, x: 40, y: 20, type: itemType.WALL },
      { id: 6, x: 0, y: 40, type: itemType.WALL },
      { id: 7, x: 30, y: 50, type: itemType.DOT },
      { id: 8, x: 40, y: 40, type: itemType.WALL },
      { id: 9, x: 0, y: 60, type: itemType.WALL },
      { id: 10, x: 30, y: 70, type: itemType.DOT },
      { id: 11, x: 40, y: 60, type: itemType.WALL }
    ]
  };
}

const initialState = {
  createMaze: () => createMaze(),
  direction: directions.IDLE,
  score: 0
};

export default function App() {
  const [maze, setMaze] = useState(initialState.createMaze);
  const [direction, setDirection] = useState(initialState.direction);
  const [score, setScore] = useState(initialState.score);

  const gameOver = maze.playerIndex === maze.exitIndex;

  useKeyPress("ArrowUp", () => setDirection(directions.UP));
  useKeyPress("ArrowDown", () => setDirection(directions.DOWN));
  useKeyPress("ArrowLeft", () => setDirection(directions.LEFT));
  useKeyPress("ArrowRight", () => setDirection(directions.RIGHT));

  useInterval(() => {
    //TODO Deze if kan weg als de interval milliseconden stateful wordt
    if (direction === directions.IDLE || gameOver) return;

    move(direction);
  }, 400);

  useEffect(() => {
    addFood(maze);
  }, [maze]);

  function move(direction) {
    const updatedMaze = movePlayer(maze, direction, updateScore);

    //TODO Deze if is een niet heel belangrijke optimalisatie, maar goed.
    //Als ik het goed heb begrepen doe je met deze if een shallow comparison,
    //die een verschill oplevert als de reference anders is geworden.
    //Als movePlayer een wijzigen heeft gedaan levert die een nieuwe reference op.
    //Hier checken: https://t.co/wMxnbQkgwh?amp=1
    if (updatedMaze !== maze) setMaze(updatedMaze);
  }

  function updateScore(item) {
    if (item.type === itemType.DOT) setScore(score + 1);
    else if (item.type === itemType.FOOD) setScore(score + 10);
  }

  function changeDirection(direction) {
    setDirection(direction);
  }

  function resetGame() {
    setMaze(initialState.createMaze());
    setDirection(initialState.direction);
    setScore(initialState.score);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>My Game</h1>

      {gameOver && <GameOver score={score} resetGame={resetGame} />}

      <Score score={score} />

      <svg width={maze.width} height={maze.height}>
        <rect width={maze.width} height={maze.height} fill="black" />
        {maze.items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </svg>

      <Buttons buttonClicked={changeDirection} disabled={gameOver} />
    </div>
  );
}

function Item({ item }) {
  if (item.type === itemType.WALL) return <Wall wall={item} />;
  if (item.type === itemType.PLAYER) return <Player player={item} />;
  if (item.type === itemType.DOT) return <Dot dot={item} />;
  if (item.type === itemType.FOOD) return <Food food={item} />;
  else return null;
}

function Player({ player }) {
  return <circle cx={player.x} cy={player.y} r={7} fill="yellow" />;
}

function Wall({ wall }) {
  return (
    <rect
      width={20}
      height={20}
      x={wall.x}
      y={wall.y}
      fill="brown"
      rx="5"
      ry="5"
      stroke="black"
    />
  );
}

function Dot({ dot }) {
  return <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={2} fill="green" />;
}

function Food({ food }) {
  return <circle cx={food.x} cy={food.y} r={7} fill="green" />;
}

function Score({ score }) {
  return <div className="score">score: {score}</div>;
}

function Buttons({ buttonClicked, disabled }) {
  return (
    <div>
      <div>
        <button
          onClick={() => buttonClicked(directions.UP)}
          disabled={disabled}
          className="arrowButton"
        >
          <i className="arrow up"></i>
        </button>
      </div>
      <div>
        <button
          onClick={() => buttonClicked(directions.LEFT)}
          style={{ marginRight: "60px" }}
          disabled={disabled}
          className="arrowButton"
        >
          <i className="arrow left"></i>
        </button>
        <button
          onClick={() => buttonClicked(directions.RIGHT)}
          disabled={disabled}
          className="arrowButton"
        >
          <i className="arrow right"></i>
        </button>
      </div>
      <div>
        <button
          onClick={() => buttonClicked(directions.DOWN)}
          disabled={disabled}
          className="arrowButton"
        >
          <i className="arrow down"></i>
        </button>
      </div>
    </div>
  );
}

function GameOver({ score, resetGame }) {
  return (
    <Modal>
      <h3>YES! You made it!</h3>
      <p>
        You scored {score} points, good job!
        <br />
        <br />
        <button autoFocus onClick={resetGame}>
          Try again
        </button>
      </p>
    </Modal>
  );
}
