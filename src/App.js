import './index.css';
import { Canvas } from '@react-three/fiber';
import Avatar from "./components/Avatar";
import Texture from "./components/texture";

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
      <ambientLight intensity={3}/>
      <Avatar position={[0, -1.5, 1.4]} scale={1} />
      <Texture />
    </Canvas>
  )
}

export default App;