import { RigidBody, useRapier } from "@react-three/rapier"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { useRef, useEffect } from "react"


export default function Player()
{
  const body = useRef()

  // subscripbe keys listens to changes (spacebar) and the getKeys returns the current state
  const [ subscribeKeys, getKeys ] = useKeyboardControls()
  const { rapier, world } = useRapier()
  const rapierWorld = world

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
