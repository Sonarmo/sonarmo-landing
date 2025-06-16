import { useEffect, useRef } from "react";

export default function AnimatedWave() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement.offsetHeight || Math.min(window.innerHeight * 1, 8000);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const NUM_PARTICLES = 8000;
    const baseAmplitude = canvas.height * 0.1;

    let particles = [];

    const initParticles = () => {
      particles = Array.from({ length: NUM_PARTICLES }, () => ({
        x: Math.random() * canvas.width,
        baseY: canvas.height * 0.3 + Math.random() * (canvas.height * 0.4),
        radius: Math.random() * 1.0 + 0.3,
        dx: Math.random() * 0.7 + 0.5,
      }));
    };

    initParticles();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#FF9400");
      gradient.addColorStop(1, "#FF0BED");
      ctx.fillStyle = gradient;

      const dynamicAmplitude = baseAmplitude * (1 + 0.2 * Math.sin(time * 0.001));
      const verticalShift = Math.cos(time * 0.0015) * canvas.height * 0.015;

      particles.forEach((p) => {
        p.x += p.dx;

        // Base verticale légèrement animée
        let baseY = p.baseY + Math.sin(time * 0.0005 + p.x * 0.0001) * canvas.height * 0.01;

        // Onde complexe (superposition sinusoïdale)
        const wave = (
          Math.sin(p.x * 0.004 + time * 0.002) +
          0.5 * Math.sin(p.x * 0.008 + time * 0.004 + 10) +
          0.25 * Math.sin(p.x * 0.012 + time * 0.006 + 20)
        ) * dynamicAmplitude;

        // Variation aléatoire subtile : flicker
        const flicker = Math.sin(time * 0.003 + p.x * 0.01) * (Math.random() * 2 - 1) * canvas.height * 0;

        // Calcul final Y
        let y = baseY + wave + verticalShift + flicker;

        y = Math.min(canvas.height - 1, Math.max(1, y));

        // Variation d’opacité selon distance à baseY (vapeur)
        const distanceFromCore = Math.abs(y - p.baseY);
        ctx.globalAlpha = Math.max(1, 1 - distanceFromCore / (canvas.height * 0.05));

        // Respawn si sortie à droite
        if (p.x > canvas.width + p.radius) {
          p.x = -p.radius;
          p.baseY = canvas.height * 0.4 + Math.random() * (canvas.height * 0.4);
          p.dx = Math.random() * 0.7 + 0.5;
          p.radius = Math.random() * 1.0 + 0.3;
        }

        ctx.beginPath();
        ctx.arc(p.x, y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.2; // reset alpha
      });

      time += 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 left-0 w-full opacity-100 z-0 pointer-events-none"
      style={{ height: "100%", maxHeight: "100%", overflow: "hidden" }}
    />
  );
}