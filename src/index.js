// import React from "react";
// import ReactDOM from "react-dom";

// import "./styles.css";
// import App from "./components/App";
// import { createMaze } from "./mazes";

// const rootElement = document.getElementById("root");
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   rootElement
// );

import { itemType, addFood } from "./functions";
const maze = {
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

const updatedMaze = { ...maze, items: [...maze.items] };
//const updatedMaze = addFood()
updatedMaze.items[2] = { ...maze.items[2] }; // <<<< ===== Dit is het!!!
updatedMaze.items[2].type = itemType.FOOD;

assertNotEquals("maze", maze, updatedMaze);
assertNotEquals("items", maze.items, updatedMaze.items);
assertIsTrue(
  "maze has NO food",
  maze.items.findIndex((item) => item.type === itemType.FOOD) === -1
);
assertIsTrue(
  "updatedMaze DOES HAVE food",
  updatedMaze.items.findIndex((item) => item.type === itemType.FOOD) !== -1
);

function assertEquals(description, expected, actual) {
  assertIsTrue(description, expected === actual);
}

function assertNotEquals(description, expected, actual) {
  assertIsTrue(description, !(expected === actual));
}

function assertIsTrue(description, condition) {
  if (!condition) console.log(description, "NOT OK");
  //console.log(description, condition ? "OK" : "NOT OK");
}
