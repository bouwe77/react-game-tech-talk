import { itemTypes } from '../../engine/constants'

const itemSize = 20

export default function Maze({ maze }) {
  const width = maze.itemsPerRow * itemSize
  const height = maze.numberOfRows * itemSize

  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="black" />

      {maze.items.map((item, index) => {
        const x = (index % maze.itemsPerRow) * itemSize
        const y = Math.floor(index / maze.itemsPerRow) * itemSize
        return <Item key={`${item}-${x}-${y}`} item={item} x={x} y={y} />
      })}
    </svg>
  )
}

function Item({ item, x, y }) {
  if (item === itemTypes.WALL) return <Wall x={x} y={y} />
  if (item === itemTypes.PLAYER) return <Player x={x} y={y} />
  if (item === itemTypes.DOT) return <Dot x={x} y={y} />
  if (item === itemTypes.FOOD) return <Food x={x} y={y} />
  if (item === itemTypes.GHOST) return <Ghost x={x} y={y} />
  return null
}

function Player({ x, y }) {
  return (
    <circle cx={x + itemSize / 2} cy={y + itemSize / 2} r={7} fill="yellow" />
  )
}

function Ghost({ x, y }) {
  return <circle cx={x + itemSize / 2} cy={y + itemSize / 2} r={7} fill="red" />
}

function Wall({ x, y }) {
  return (
    <rect
      width={itemSize}
      height={itemSize}
      x={x}
      y={y}
      fill="brown"
      rx="5"
      ry="5"
      stroke="black"
    />
  )
}

function Dot({ x, y }) {
  return (
    <circle
      key={`${x}-${y}`}
      cx={x + itemSize / 2}
      cy={y + itemSize / 2}
      r={2}
      fill="green"
    />
  )
}

function Food({ x, y }) {
  return (
    <circle cx={x + itemSize / 2} cy={y + itemSize / 2} r={7} fill="green" />
  )
}
