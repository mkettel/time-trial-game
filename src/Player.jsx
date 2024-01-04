import { RigidBody, useRapier } from "@react-three/rapier"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { useRef, useEffect, useState } from "react"
import * as THREE from "three"


export default function Player()
{
  const body = useRef()

  // subscripbe keys listens to changes (spacebar) and the getKeys returns the current state
  const [ subscribeKeys, getKeys ] = useKeyboardControls()
  const { rapier, world } = useRapier()
  const rapierWorld = world

  const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
  const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

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

  useEffect(() =>
  {
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

      // unsubscribe from the jump function to clean up the event listener
      return () =>
      {
        unsubscribeJump()
      }
  }, [])

  useFrame((state, delta) =>
  {
    const { forward, backward, left, right } = getKeys()

    const impulse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 0.6 * delta
    const torqueStrength = 0.2 * delta

    if (forward)
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

  })

  return <>
    <RigidBody
      ref={body}
      canSleep={false}
      position={[ 0, 1, 0 ]}
      colliders="ball"
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      >
      <mesh castShadow>
        <sphereGeometry args={[ 0.3, 52 ]} />
        <meshStandardMaterial flatShading color={ 'mediumpurple' } />
      </mesh>
    </RigidBody>
  </>
}
