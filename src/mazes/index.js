import { itemType } from "../functions";

export function createMaze() {
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
