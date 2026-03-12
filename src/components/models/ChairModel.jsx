import { useGLTF } from "@react-three/drei";

export default function ChairModel(props) {
  const { scene } = useGLTF("/models/chair.glb");

  return <primitive object={scene} scale={1} {...props} />;
}