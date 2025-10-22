import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

export default function BowCoMPrototype() {
  const [riserMass, setRiserMass] = useState(900);
  const [frontMass, setFrontMass] = useState(120);
  const [frontLength, setFrontLength] = useState(30);
  const [frontAngle, setFrontAngle] = useState(0);
  const [leftMass, setLeftMass] = useState(40);
  const [leftLength, setLeftLength] = useState(12);
  const [leftAngle, setLeftAngle] = useState(10);
  const [rightMass, setRightMass] = useState(15);
  const [rightLength, setRightLength] = useState(12);
  const [rightAngle, setRightAngle] = useState(10);

  const cmToM = (cm) => cm / 100;
  const degToRad = (d) => (d * Math.PI) / 180;

  const components = useMemo(() => {
    const parts = [];
    parts.push({ name: "Riser", m: riserMass / 1000, pos: [0, 0, 0], color: "#444" });
    const fx = cmToM(frontLength);
    const fz = -Math.sin(degToRad(frontAngle)) * cmToM(frontLength);
    parts.push({ name: "FrontTip", m: frontMass / 1000, pos: [fx, 0, fz], color: "#666" });
    const ly = cmToM(leftLength);
    const lz = -Math.sin(degToRad(leftAngle)) * cmToM(leftLength);
    parts.push({ name: "LeftTip", m: leftMass / 1000, pos: [0, ly, lz], color: "#666" });
    const ry = -cmToM(rightLength);
    const rz = -Math.sin(degToRad(rightAngle)) * cmToM(rightLength);
    parts.push({ name: "RightTip", m: rightMass / 1000, pos: [0, ry, rz], color: "#666" });
    parts.push({ name: "Sight", m: 20 / 1000, pos: [0.06, 0.02, 0.0], color: "#888" });
    return parts;
  }, [riserMass, frontMass, frontLength, frontAngle, leftMass, leftLength, leftAngle, rightMass, rightLength, rightAngle]);

  const com = useMemo(() => {
    let M = 0, sx = 0, sy = 0, sz = 0;
    components.forEach((p) => { M += p.m; sx += p.pos[0] * p.m; sy += p.pos[1] * p.m; sz += p.pos[2] * p.m; });
    if (M === 0) return [0, 0, 0];
    return [sx / M, sy / M, sz / M];
  }, [components]);

  return (
    <div className='flex h-full w-full p-4 gap-4' style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <div className='w-96 bg-white/90 rounded-xl p-4 shadow-md overflow-auto'>
        <h2 className='text-xl font-semibold mb-2'>Bue Tyngdepunkt</h2>
        <label>Front length (cm)<input type='number' value={frontLength} onChange={(e)=>setFrontLength(+e.target.value)} /></label>
        <div>Center of Mass: x={com[0].toFixed(3)} y={com[1].toFixed(3)} z={com[2].toFixed(3)}</div>
      </div>
      <div className='flex-1 rounded-xl overflow-hidden shadow-lg'>
        <Canvas camera={{ position: [0.3, 0.2, 0.4], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[1,1,1]} intensity={0.6} />
          <mesh position={com}><sphereGeometry args={[0.01, 16, 16]} /><meshStandardMaterial color='red' emissive='red' emissiveIntensity={1}/></mesh>
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
}
