"use client";

import { useEffect, useRef, useState } from "react";

interface ParticleEffectProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
}

export default function ParticleEffect({ active }: ParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const requestRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  // Create particles when active changes to true
  useEffect(() => {
    if (active && particles.length === 0) {
      const newParticles: Particle[] = [];

      for (let i = 0; i < 15; i++) {
        newParticles.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * 2) + 1,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          life: 0,
          maxLife: Math.random() * 50 + 50,
        });
      }

      setParticles(newParticles);
      particlesRef.current = newParticles;
    }
  }, [active, particles.length]);

  // Animation loop
  useEffect(() => {
    if (!active) {
      setParticles([]);
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      const updatedParticles = particlesRef.current
        .map((particle) => {
          const updatedParticle = { ...particle };

          // Update position
          updatedParticle.x += updatedParticle.speedX;
          updatedParticle.y += updatedParticle.speedY;

          // Update life
          updatedParticle.life += 1;

          // Draw particle
          const opacity = 1 - updatedParticle.life / updatedParticle.maxLife;
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fillRect(
            updatedParticle.x,
            updatedParticle.y,
            updatedParticle.size,
            updatedParticle.size,
          );

          return updatedParticle;
        })
        .filter((particle) => particle.life < particle.maxLife);

      particlesRef.current = updatedParticles;
      setParticles(updatedParticles);

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      width={100}
      height={100}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
}
