import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

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
  DOT: "dot"
};

function createMaze() {
  return {
    width: 60,
    height: 80,
    columns: 3,
    player: 1,
    exit: 10,
    items: [
      { id: 0, x: 0, y: 0, type: itemType.WALL },
      { id: 1, x: 30, y: 10, type: itemType.PLAYER },
      { id: 2, x: 40, y: 0, type: itemType.WALL },
      { id: 3, x: 0, y: 20, type: itemType.WALL },
      { id: 4, x: 30, y: 30, type: itemType.DOT },
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
  direction: directions.IDLE
};

export default function App() {
  const [maze, setMaze] = useState(initialState.createMaze);
  const [direction, setDirection] = useState(initialState.direction);

  const gameOver = maze.player === maze.exit;

  useKeyPress("ArrowUp", () => setDirection(directions.UP));
  useKeyPress("ArrowDown", () => setDirection(directions.DOWN));
  useKeyPress("ArrowLeft", () => setDirection(directions.LEFT));
  useKeyPress("ArrowRight", () => setDirection(directions.RIGHT));

  useInterval(() => {
    //TODO Deze if kan weg als de interval milliseconden stateful wordt
    if (direction === directions.IDLE || gameOver) return;

    move(direction);
  }, 400);

  function move(direction) {
    const updatedMaze = movePlayer(maze, direction);

    //TODO Deze if is een niet heel belangrijke optimalisatie, maar goed.
    //Als ik het goed heb begrepen doe je met deze if een shallow comparison,
    //die een verschill oplevert als de reference anders is geworden.
    //Als movePlayer een wijzigen heeft gedaan levert die een nieuwe reference op.
    //Hier checken: https://t.co/wMxnbQkgwh?amp=1
    if (updatedMaze !== maze) setMaze(updatedMaze);
  }

  return (
    <div className="App">
      <h1>My Game</h1>

      <svg width={maze.width} height={maze.height}>
        <rect width={maze.width} height={maze.height} fill="black" />
        {maze.items.map((item) => (
          <>
            <Item key={item.id} item={item} />
          </>
        ))}
      </svg>
    </div>
  );
}

function Item({ item }) {
  if (item.type === itemType.WALL) return <Wall wall={item} />;
  if (item.type === itemType.PLAYER) return <Player player={item} />;
  if (item.type === itemType.DOT) return <Dot dot={item} />;
  else return null;
}

function Player({ player }) {
  return <circle cx={player.x} cy={player.y} r={7} fill="yellow" />;
}

function Wall({ wall }) {
  return (
    <rect
      key={`${wall.x}-${wall.y}`}
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

function useKeyPress(targetKey, onKeyDownCallback = null, onKeyUpCallback = null) {
  useEffect(() => {
    const onKeyDown = ({ key }) => {
      if (onKeyDownCallback && key === targetKey) onKeyDownCallback();
    };

    const onKeyUp = ({ key }) => {
      if (onKeyUpCallback && key === targetKey) onKeyUpCallback();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [targetKey, onKeyDownCallback, onKeyUpCallback]);
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function movePlayer(maze, direction) {
  const newIndex = determineNewIndex(maze.player, maze.columns, direction);

  // Check the player does not go outside the maze.
  if (newIndex < 0 || newIndex > maze.items.length - 1) return maze;

  // Check the player does not walk into a wall.
  //...

  // Everything's fine, update the new player position in the maze.
  const updatedMaze = { ...maze };
}

function determineNewIndex(currentIndex, columns, direction) {
  switch (direction) {
    case directions.UP:
      return currentIndex - columns;
    case directions.LEFT:
      return currentIndex - 1;
    case directions.RIGHT:
      return currentIndex + 1;
    case directions.DOWN:
      return currentIndex + columns;
    default:
      return -1;
  }
}
