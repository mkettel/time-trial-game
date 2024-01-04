import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

// Creating the Box Geometry outside of the component prevents it from being recreated on every render
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const startEndMat = new THREE.MeshStandardMaterial({ color: '#352D39' });
const floorRegMat = new THREE.MeshStandardMaterial({ color: '#B1EDE8' });
const obstacleMat = new THREE.MeshStandardMaterial({ color: '#FF6978' });
const wallMat = new THREE.MeshStandardMaterial({ color: '#5E807F' });

// Starting Block
export function BlockStart({ position = [ 0, 0, 0 ] })
{
  return <group position={ position }>
    <mesh
      geometry={ boxGeometry }
      material={ startEndMat }
      position={[ 0, -0.1, 0 ]}
      scale={[ 4, 0.2, 4 ]}
      receiveShadow
      />
  </group>
}

// End Block
export function BlockEnd({ position = [ 0, 0, 0 ] })
{

  const model = useGLTF('./hamburger.glb')

  model.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      // child.receiveShadow = true
    }
  })

  return <group position={ position }>
    <mesh
      geometry={ boxGeometry }
      material={ startEndMat }
      position={[ 0, -0.05, 0 ]}
      scale={[ 4, 0.4, 4 ]}
      receiveShadow
      />
      <RigidBody
        type="fixed"
        colliders="hull"
        position={[0, 0.2, 0]}
        restitution={0.2}
        friction={0}
        >
        <primitive object={model.scene} scale={0.2} />
      </RigidBody>
  </group>
}

// Main Floor Blocks
export function BlockSpinner({ position = [ 0, 0, 0 ] })
{
  // reference to the obstacle
  const obstacle = useRef();

  // setting random speed for the obstacle and random rotation 50/50
  const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1))

  // Make the obstacle spin
  useFrame((state) =>
  {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacle.current.setNextKinematicRotation(rotation)
  })

  return <group position={ position }>
    {/* floor block */}
    <mesh
      geometry={ boxGeometry }
      material={ floorRegMat }
      position={[ 0, -0.1, 0 ]}
      scale={[ 4, 0.2, 4 ]}
      receiveShadow
      />

      {/* Obstacle block */}
    <RigidBody
      ref={ obstacle }
      type='kinematicPosition'
      position={[0, 0.3, 0]}
      restitution={0.2}
      friction={0}
      >
      <mesh
        geometry={ boxGeometry }
        material={ obstacleMat }
        scale={[3.5, 0.3, 0.3]}
        castShadow
        receiveShadow
        />
    </RigidBody>
  </group>
}

// Vertical Wall Block
export function BlockVertical({ position = [ 0, 0, 0 ] })
{
  // reference to the obstacle
  const obstacle = useRef();

  // setting random speed for the obstacle and random rotation 50/50
  const [timeOffset] = useState(() => (Math.random() * Math.PI * 2))

  // Make the obstacle spin
  useFrame((state) =>
  {
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + timeOffset) + 1.15;
    obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })
  })

  return <group position={ position }>
    {/* floor block */}
    <mesh
      geometry={ boxGeometry }
      material={ floorRegMat }
      position={[ 0, -0.1, 0 ]}
      scale={[ 4, 0.2, 4 ]}
      receiveShadow
      />

      {/* Obstacle block */}
    <RigidBody
      ref={ obstacle }
      type='kinematicPosition'
      position={[0, 0.3, 0]}
      restitution={0.2}
      friction={0}
      >
      <mesh
        geometry={ boxGeometry }
        material={ obstacleMat }
        scale={[3.5, 0.3, 0.3]}
        castShadow
        receiveShadow
        />
    </RigidBody>
  </group>
}

// AXE Wall Block
export function BlockAxe({ position = [ 0, 0, 0 ] })
{
  // reference to the obstacle
  const obstacle = useRef();

  // setting random speed for the obstacle and random rotation 50/50
  const [timeOffset] = useState(() => (Math.random() * Math.PI * 2))

  // Make the obstacle spin
  useFrame((state) =>
  {
    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + timeOffset) * 1.25;
    obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] })
  })

  return <group position={ position }>
    {/* floor block */}
    <mesh
      geometry={ boxGeometry }
      material={ floorRegMat }
      position={[ 0, -0.1, 0 ]}
      scale={[ 4, 0.2, 4 ]}
      receiveShadow
      />

      {/* Obstacle block */}
    <RigidBody
      ref={ obstacle }
      type='kinematicPosition'
      position={[0, 0.3, 0]}
      restitution={0.2}
      friction={0}
      >
      <mesh
        geometry={ boxGeometry }
        material={ obstacleMat }
        scale={ [1.5, 1.5, 0.3] }
        castShadow
        receiveShadow
        />
    </RigidBody>
  </group>
}

function Bounds({ length = 1 })
{
  return <>
    <RigidBody type='fixed' restitution={0.2} friction={0}>
      <mesh
        position={[2.15, 0.75, - (length * 2) + 2]}
        geometry={ boxGeometry }
        material={ wallMat }
        scale={[0.3, 1.9, length * 4]}
        castShadow
      />
      <mesh
        position={[-2.15, 0.75, - (length * 2) + 2]}
        geometry={ boxGeometry }
        material={ wallMat }
        scale={[0.3, 1.9, length * 4]}
        receiveShadow
      />
      <mesh
        position={[0, 0.75, - (length * 4) + 2]}
        geometry={ boxGeometry }
        material={ wallMat }
        scale={[4.6, 1.9, 0.3]}
        receiveShadow
      />
      <CuboidCollider
        args={[ 2, 0.1, 2 * length ]}
        position={[0, -0.1, - (length * 2) + 2]}
        restitution={0.2}
        friction={1}
      />
    </RigidBody>
  </>
}


export function Level({ count = 6, types = [BlockSpinner, BlockVertical, BlockAxe], seed = 0}) {

  // Random blocks generator
  const blocks = useMemo(() =>
  {
    const blocks = []

    for (let i = 0; i < count; i++)
    {
      const type = types[Math.floor(Math.random() * types.length)]
      blocks.push(type);
    }
    return blocks
  }, [ count, types, seed ])

  return <>
        <BlockStart position={[0, 0, 0]} />
        { blocks.map((Block, i) => <Block key={i} position={[0, 0, - (i + 1) * 4]} /> )}
        <BlockEnd position={[0, 0, - (count + 1) * 4]} />

        <Bounds length={ count + 2 } />
  </>
}
