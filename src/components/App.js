import { useState } from 'react'
import Designer from './designer/Designer'
import Game from './game/Game'

export default function App() {
  const [playGame, setPlayGame] = useState(true)

  {
    /*
      <div>
        <button onClick={() => setPlayGame(!playGame)}>toggle</button>
      </div>
*/
  }

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        {playGame ? (
          <>
            <h1>REpACTman</h1>
            <Game />
          </>
        ) : (
          <>
            <h1>DESIGNER</h1>
            <Designer />
          </>
        )}
      </div>
    </>
  )
}
