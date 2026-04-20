"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Center, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

const PARTICLE_COUNT = 5000;

function Particles({ onComplete }: { onComplete: () => void }) {
    const pointsRef = useRef<THREE.Points>(null!);
    const rotationIntensity = useRef({ value: 1 });
    const [animationStarted, setAnimationStarted] = useState(false);

    // Initial Sphere Positions
    const spherePositions = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
            const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
            const r = 2; // Radius

            positions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
            positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return positions;
    }, []);

    // Random Scattered Positions
    const scatteredPositions = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return positions;
    }, []);

    // Text Positions (sampled from canvas)
    const textPositions = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        
        // Increase canvas size for higher resolution sampling
        canvas.width = 2000;
        canvas.height = 400;
        
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        // Use a standard thick font
        ctx.font = "bold 200px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("SPARKIIT", canvas.width / 2, canvas.height / 2);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const sampledPoints = [];
        
        // Sample points from the text
        for (let y = 0; y < canvas.height; y += 3) {
            for (let x = 0; x < canvas.width; x += 3) {
                if (imageData[(y * canvas.width + x) * 4] > 128) {
                    sampledPoints.push({ x, y });
                }
            }
        }

        // Shuffle points to ensure even distribution during animation
        for (let i = sampledPoints.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sampledPoints[i], sampledPoints[j]] = [sampledPoints[j], sampledPoints[i]];
        }

        // Calculate bounding box for centering and scaling
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        sampledPoints.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        });

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const width = maxX - minX;
        
        // Target width in 3D units (fits well in 45deg FOV at 10 units distance)
        const targetWidth = 8; 
        const scale = targetWidth / width;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = sampledPoints[i % sampledPoints.length];
            // Center and scale
            positions[i * 3] = (p.x - centerX) * scale;
            positions[i * 3 + 1] = (centerY - p.y) * scale;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
        }
        return positions;
    }, []);

    useEffect(() => {
        if (!pointsRef.current) return;

        const currentPos = pointsRef.current.geometry.attributes.position.array as Float32Array;
        
        const tl = gsap.timeline({
            onComplete: () => {
                setTimeout(onComplete, 800);
            }
        });

        // 1. Initial Sphere Bloom
        tl.to(currentPos, {
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                pointsRef.current.geometry.attributes.position.needsUpdate = true;
            }
        });

        // 2. Scatter
        tl.to(currentPos, {
            duration: 1.2,
            ease: "expo.out",
            onUpdate: function(this: any) {
                const progress = this.progress();
                for (let i = 0; i < currentPos.length; i++) {
                    currentPos[i] = THREE.MathUtils.lerp(spherePositions[i], scatteredPositions[i], progress);
                }
                pointsRef.current.geometry.attributes.position.needsUpdate = true;
            }
        }, "+=0.2");

        // 3. Reform into Text
        tl.to(currentPos, {
            duration: 1.8,
            ease: "back.out(1.2)",
            onUpdate: function(this: any) {
                const progress = this.progress();
                for (let i = 0; i < currentPos.length; i++) {
                    currentPos[i] = THREE.MathUtils.lerp(scatteredPositions[i], textPositions[i], progress);
                }
                pointsRef.current.geometry.attributes.position.needsUpdate = true;
            }
        }, "-=0.3");

        // Stop rotation during reform
        tl.to(rotationIntensity.current, {
            value: 0,
            duration: 1.2,
            ease: "power2.inOut"
        }, "-=1.5");

    }, [onComplete, scatteredPositions, textPositions]);

    useFrame((state) => {
        if (rotationIntensity.current.value > 0) {
            const time = state.clock.getElapsedTime();
            pointsRef.current.rotation.y = time * 0.1 * rotationIntensity.current.value;
            pointsRef.current.rotation.x = Math.sin(time * 0.2) * 0.05 * rotationIntensity.current.value;
        } else {
            // Ensure it's perfectly straight when rotation stops
            pointsRef.current.rotation.x = 0;
            pointsRef.current.rotation.y = 0;
        }
    });

    return (
        <group>
            <Points ref={pointsRef} positions={spherePositions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#00875a"
                    size={0.04}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
            
            {/* Ambient Glow */}
            <mesh scale={[20, 20, 1]}>
                <planeGeometry />
                <meshBasicMaterial 
                    transparent 
                    opacity={0.05} 
                    color="#00875a" 
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}

export default function ParticleLoader({ onComplete }: { onComplete: () => void }) {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <Particles onComplete={onComplete} />
            </Canvas>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-radial-gradient from-[#00875a]/5 to-transparent pointer-events-none" />
            
            <style jsx>{`
                .bg-radial-gradient {
                    background: radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%);
                }
            `}</style>
        </div>
    );
}
