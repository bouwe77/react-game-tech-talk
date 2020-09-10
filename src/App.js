import React, { useState, useEffect } from "react";
import GameOver from "./GameOver";
import Buttons from "./Buttons";
import { useKeyPress } from "./useKeyPress";
import { useInterval } from "./useInterval";
import { itemType, directions, movePlayer, addFood } from "./functions";
import { getMaze } from "./mazes";

const initialState = {
  getMaze,
  direction: directions.IDLE,
  score: 0,
};

export default function App() {
  const [maze, setMaze] = useState(initialState.getMaze);
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
    const updatedMaze = addFood(maze);
    if (updatedMaze !== maze) setMaze(updatedMaze);
  }, [maze]);

  function move(direction) {
    const updatedMaze = movePlayer(maze, direction, updateScore);
    if (updatedMaze !== maze) setMaze(updatedMaze);
  }

  function updateScore(item) {
    if (item.type === itemType.DOT) setScore(score + 1);
    else if (item.type === itemType.FOOD) setScore(score + 10);
  }

  function resetGame() {
    setMaze(initialState.getMaze());
    setDirection(initialState.direction);
    setScore(initialState.score);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>My Game</h1>

      {gameOver && <GameOver score={score} resetGame={resetGame} />}

      <Score score={score} />

      <Maze width={maze.width} height={maze.height}>
        {maze.items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </Maze>

      <Buttons
        buttonClicked={(direction) => setDirection(direction)}
        disabled={gameOver}
      />
    </div>
  );
}

function Maze({ width, height, children }) {
  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="black" />
      {children}
    </svg>
  );
}

function Item({ item }) {
  if (item.type === itemType.WALL) return <Wall wall={item} />;
  if (item.type === itemType.PLAYER) return <Player player={item} />;
  if (item.type === itemType.DOT) return <Dot dot={item} />;
  if (item.type === itemType.EXIT) return <Dot dot={item} />;
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
  return (
    <circle
      key={`${dot.x}-${dot.y}`}
      cx={dot.x}
      cy={dot.y}
      r={2}
      fill="green"
    />
  );
}

function Food({ food }) {
  return <circle cx={food.x} cy={food.y} r={7} fill="green" />;
}

function Score({ score }) {
  return <div className="score">score: {score}</div>;
}
