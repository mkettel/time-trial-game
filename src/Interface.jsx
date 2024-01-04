import { useKeyboardControls } from "@react-three/drei"

export default function Interface() {

  // subscribe to the keyboard controls and get the current state
  const forward = useKeyboardControls((state) => state.forward)
  const backward = useKeyboardControls((state) => state.backward)
  const right = useKeyboardControls((state) => state.right)
  const left = useKeyboardControls((state) => state.left)
  const jump = useKeyboardControls((state) => state.jump)


  return <div className="interface">
    {/* Time */}
    <div className="time">0.00</div>


    {/* Restart */}
    <div className="restart">Restart</div>

    {/* Controls */}
    <div className="controls">
        <div className="raw">
            <div className={`key ${forward ? 'active' : ''}`}></div>
        </div>
        <div className="raw">
            <div className={`key ${left ? 'active' : ''}`}></div>
            <div className={`key ${backward ? 'active' : ''}`}></div>
            <div className={`key ${right ? 'active' : ''}`}></div>
        </div>
        <div className="raw">
            <div className={`key large ${jump ? 'active' : ''}`}></div>
        </div>
    </div>


  </div>
}
