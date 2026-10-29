import { Board } from './layout/board/Board.tsx'
import { Toolbar } from './layout/toolbar/Toolbar.tsx'

export default function App() {
  return (
    <div className="app">
      <Toolbar />
      <Board />
    </div>
  )
}
