import { RigidBody } from "@react-three/rapier"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { useRef } from "react"


export default function Player()
{
  const body = useRef()
  const [ subscribeKeys, getKeys ] = useKeyboardControls()

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
