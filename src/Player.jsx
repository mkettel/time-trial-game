import { RigidBody, useRapier } from "@react-three/rapier"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls, Html } from "@react-three/drei"
import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import useGame from "./stores/useGame"
import { NodeToyMaterial } from "@nodetoy/react-nodetoy"
import { data as shaderData } from "./shaders/shader.js"
import { data as rainbowShader } from "./shaders/rainbow-shader.js"


export default function Player()
{
  const body = useRef()

  // subscripbe keys listens to changes (spacebar) and the getKeys returns the current state
  const [ subscribeKeys, getKeys ] = useKeyboardControls()
  const { rapier, world } = useRapier()
  const rapierWorld = world

  const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
  const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

  // Getting the functions from the store
  const start = useGame((state) => state.start)
  const end = useGame((state) => state.end)
  const restart = useGame((state) => state.restart)
  const blocksCount = useGame((state) => state.blocksCount)

  // Jumping with rapier raycast
  const jump = () =>
  {
    const origin = body.current.translation() // get middle of the ball
    origin.y -= 0.31 // move it down to right below the ball (its size is 0.3)
    const direction = { x: 0, y: -1, z: 0 } // raycast down
    const ray = new rapier.Ray(origin, direction) // create the ray
    const hit = rapierWorld.castRay(ray, 10, true) // cast the ray (10 is the max distance, true is to say that things are solid so it will hit the floor at the top)

    if (hit.toi < 0.55) { // change value to allow for more double jumping
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 }) // allow jumping only if the ball is close to the floor
    }
  }

  // Restarting the Player
  const reset = () =>
  {
    body.current.setTranslation({ x: 0, y: 1, z: 0 }) // reset the ball's position
    body.current.setLinvel({ x: 0, y: 0, z: 0 }) // reset the ball's velocity
    body.current.setAngvel({ x: 0, y: 0, z: 0 }) // reset the ball's angular velocity
  }

  useEffect(() =>
  {
    // subscribe to store
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase, // selector function
      (value) =>
      {
        if (value === 'ready')
        {
          reset()
        }
      }
    )

    const unsubscribeJump = subscribeKeys(
      (state) =>
      {
        return state.jump // first function listens to the spacebar
      },
      (value) =>
      {
        if (value)
        {
          jump()
        }
      })

      const unsubscribeAny = subscribeKeys(
        () =>
        {
          start() // second function listens to any key
        }
      )

      // unsubscribe function to clean up the event listener
      return () =>
      {
        unsubscribeJump()
        unsubscribeAny()
        unsubscribeReset()
      }
  }, [])

  const [touchControls, setTouchControls] = useState({
    forwardTouch: false,
    backwardTouch: false,
    leftTouch: false,
    rightTouch: false,
    jumpTouch: false
  })

  const handleTouchStart = (direction) => {
    setTouchControls(prev => ({ ...prev, [direction]: true }));
  }

  const handleTouchEnd = (direction) => {
    setTouchControls(prev => ({ ...prev, [direction]: false }));
  }


  useFrame((state, delta) =>
  {
    const { forward, backward, left, right } = getKeys()

    // Replace keyboard control checks with touch control checks
    const { forwardTouch, backwardTouch, leftTouch, rightTouch } = touchControls;

    const impulse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 0.6 * delta
    const torqueStrength = 0.2 * delta

    if (forward || forwardTouch)
    {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }

    if (right)
    {
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }

    if (backward)
    {
      impulse.z += impulseStrength
      torque.x += torqueStrength
    }

    if (left)
    {
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }

    body.current.applyImpulse(impulse)
    body.current.applyTorqueImpulse(torque)

    /**
     * Camera
     * 1. Get the position of the ball
     * 2. create a vector for the camera position
     * 3. copy the position of the ball to the vector for the camera to set the camera position
     * 4. move the camera back & up
     * 5. create a vector for the camera target
     * 6. copy the position of the ball to the vector for the camera target to set the camera target
     * 7. looks slightly above the ball
     * 8. lerp the camera position & target by using useState with Vector3
     * 9. set the camera position & target to the state of the camera
     */
    const bodyPosition = body.current.translation() // get the position of the ball

    const cameraPosition = new THREE.Vector3() // create a new vector
    cameraPosition.copy(bodyPosition) // copy the position of the ball to the vector for the camera
    cameraPosition.z += 2.25 // move the camera back
    cameraPosition.y += 0.65 // move the camera up

    const cameraTarget = new THREE.Vector3() // create a new vector for the camera target
    cameraTarget.copy(bodyPosition) // copy the position of the ball to the vector for the camera target
    cameraTarget.y += 0.25 // looks slightly above the ball

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta) // lerp the camera position and multiply by delta to make it smooth on all computers
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta) // lerp the camera target

    state.camera.position.copy(smoothedCameraPosition) // set the camera position
    state.camera.lookAt(smoothedCameraTarget) // set the camera target

    /**
     * Phases
     */
    if (bodyPosition.z < -(blocksCount * 4 + 2))
    {
      end()
    }

    if (bodyPosition.y < -4)
    {
      restart()
    }

  })

  return <>

    <RigidBody
      ref={body}
      canSleep={false}
      position={[ 0, 2, 0 ]}
      colliders="ball"
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      >
      <mesh castShadow>
        <sphereGeometry args={[ 0.3, 52 ]} />
        {/* <meshStandardMaterial color="mediumpurple" flatShading /> */}
        <NodeToyMaterial data={rainbowShader} />
      </mesh>
    </RigidBody>

    {/* <TouchCube handleTouchEnd={handleTouchEnd} handleTouchStart={handleTouchStart} bodyPosition={body.current ? body.current.translation() : { x: 0, y: 0, z: 0 }} /> */}

  </>
}


function TouchCube({ bodyPosition, handleTouchEnd, handleTouchStart }) {
  // Create a ref for the touch cube
  const cubeRef = useRef();

  // Create a vector to store the smoothed position
  const smoothedCubePosition = useRef(new THREE.Vector3());

  // Update the position of the touch cube on each frame
  useFrame((state, delta) => {
    const cubePosition = new THREE.Vector3() // create a new vector
    cubePosition.copy(bodyPosition) // copy the position of the ball to the vector for the cube
    cubePosition.z += 0.4 // move the cube back
    cubePosition.y -= 0// move the cube up

    smoothedCubePosition.current.lerp(cubePosition, 5 * delta) // lerp the cube position and multiply by delta to make it smooth on all computers

    if (cubeRef.current) {
      cubeRef.current.position.copy(smoothedCubePosition.current);
    }
  });

  return (
    <mesh
      ref={cubeRef}
      position={[ 0, 0, 0 ]}
      onPointerDown={() => handleTouchStart('forwardTouch')}
      onPointerUp={() => handleTouchEnd('forwardTouch')}
      onPointerOut={() => handleTouchEnd('forwardTouch')}
      >
      <boxGeometry args={[ 0.2, 0.2, 0.2 ]} />
      <meshStandardMaterial color="mediumpurple" flatShading />
    </mesh>
  );
}
