import { useKeyboardControls } from "@react-three/drei"
import useGame from "./stores/useGame"
import { useRef, useEffect } from "react"
import { addEffect } from "@react-three/fiber";

export default function Interface() {

  // create a ref for the time
  const time = useRef();

  // get the restart and phases from the store
  const restart = useGame((state) => state.restart)
  const phase = useGame((state) => state.phase)

  // subscribe to the keyboard controls and get the current state
  const forward = useKeyboardControls((state) => state.forward)
  const backward = useKeyboardControls((state) => state.backward)
  const right = useKeyboardControls((state) => state.right)
  const left = useKeyboardControls((state) => state.left)
  const jump = useKeyboardControls((state) => state.jump)

  // subscribe to the touch controls and get the current state
  const forwardTouch = useGame((state) => state.forward)
  const backwardTouch = useGame((state) => state.backward)
  const rightTouch = useGame((state) => state.right)
  const leftTouch = useGame((state) => state.left)
  const jumpTouch = useGame((state) => state.jump)

  // subscribe to the time and update the time
  useEffect(() =>
  {
    const unsubscribeEffect = addEffect(() =>
    {
      // get the state
      const state = useGame.getState()

      let elapsedTime = 0

      if (state.phase === 'playing')
      {
        elapsedTime = Date.now() - state.startTime
      } else if (state.phase === 'ended')
      {
        elapsedTime = state.endTime - state.startTime
      }

      elapsedTime /= 1000
      elapsedTime = elapsedTime.toFixed(2)

      if (time.current)
      {
        time.current.textContent = elapsedTime
      }
    })

    return () => unsubscribeEffect() // unsubscribe when the component unmounts
  }, [])


  return <div className="interface">
    {/* Time */}
    <div ref={time} className="time">0.00</div>


    {/* Restart */}
    {phase === 'ended' && <div onClick={restart} className="restart">Restart</div>}

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

    {/* Mobile Joystick */}
    {/* <div className="joystick">
        <div className="stick"></div>
        <div className="button" onTouchStart={() => handleTouchStart('jump')} onTouchEnd={() => handleTouchEnd('jump')}></div>
        <div className="button" onTouchStart={() => handleTouchStart('forward')} onTouchEnd={() => handleTouchEnd('forward')}></div>
        <div className="button" onTouchStart={() => handleTouchStart('backward')} onTouchEnd={() => handleTouchEnd('backward')}></div>
        <div className="button" onTouchStart={() => handleTouchStart('left')} onTouchEnd={() => handleTouchEnd('left')}></div>
        <div className="button" onTouchStart={() => handleTouchStart('right')} onTouchEnd={() => handleTouchEnd('right')}></div>
    </div> */}



  </div>
}
