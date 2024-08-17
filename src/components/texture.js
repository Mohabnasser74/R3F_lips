import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

export default function Texture() {
    const ref = useRef();
    const { viewport } = useThree();
    const texture = useTexture("/texture/Chile_overlook.jpg");

    texture.minFilter = 2000;
    texture.magFilter = 2000;

    return (
      <mesh ref={ref} >
        <planeGeometry args={[viewport.width, viewport.height]}/>
        <meshBasicMaterial map={texture} shininess={2} />
      </mesh>
    );
};

