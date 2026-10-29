import { UndoToast } from './components/undo-toast/UndoToast.tsx'
import { Board } from './layout/board/Board.tsx'
import { Toolbar } from './layout/toolbar/Toolbar.tsx'

export default function App() {
  return (
    <div className="app">
      <Toolbar />
      <Board />
      <UndoToast />
    </div>
  )
}
