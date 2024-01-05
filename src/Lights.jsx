import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

export default function Lights()
{
  /**
   * Make the Light follow the camera (which is following the ball)
   * 1. Create a ref for the light
   * 2. Use the useFrame hook to update the light's position
   * 3. Set the light's position to the camera's position
   * 4. Set the light's target position to the camera's position
   * 5. Update the light's matrix world (this is needed for the light to follow the camera)
   */
  const light = useRef()

  useFrame((state) =>
  {
    light.current.position.z = state.camera.position.z + 1 - 4
    light.current.target.position.z = state.camera.position.z -4
    light.current.target.updateMatrixWorld()
  })

    return <>
        <directionalLight
            ref={ light }
            castShadow
            position={ [ 4, 4, 1 ] }
            intensity={ 1.5 }
            shadow-mapSize={ [ 1024, 1024 ] }
            shadow-camera-near={ 1 }
            shadow-camera-far={ 10 }
            shadow-camera-top={ 10 }
            shadow-camera-right={ 10 }
            shadow-camera-bottom={ - 10 }
            shadow-camera-left={ - 10 }
        />
        <ambientLight intensity={ 1.5 } />
    </>
}
