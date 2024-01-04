import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Lights from './Lights.jsx'
import { Level, BlockAxe, BlockEnd, BlockSpinner, BlockVertical, BlockStart} from './Level.jsx'
import Player from './Player.jsx'
import useGame from './stores/useGame.jsx'

export default function Experience()
{
  // (selector) get the blocksCount from the store
  const blocksCount = useGame((state) => state.blocksCount)

    return <>

        <OrbitControls makeDefault />

        <Physics debug={ false }>
          <Lights />
          <Level count={blocksCount} />
          <Player />
        </Physics>

    </>
}
