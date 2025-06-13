// components/AnimatedWave.js
import { useEffect, useRef } from "react";

export default function AnimatedWave() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let time = 1;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 100;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = Array.from({ length: 7000 }, () => ({
      x: Math.random() * canvas.width,
      baseY: Math.random() * canvas.height,
      radius: Math.random() * 1.0 + 0.3,
      dx: Math.random() * 0.8 + 0.5,
      dy: Math.sin(Math.random() * 1 * Math.PI) * 0.9
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#FF9400");
      gradient.addColorStop(1, "#FF0BED");
      ctx.fillStyle = gradient;

      particles.forEach((p) => {
        p.x += p.dx;
        const wave = Math.sin(p.x * 0.01 + time * 0.01) * 15;
        const y = p.baseY + wave;

        if (p.x > canvas.width) {
          p.x = 0;
          p.baseY = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.arc(p.x, y, p.radius, 0, Math.PI * 1.5);
        ctx.fill();
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
  className="absolute bottom-5 left-0 w-full z-5 pointer-events-none"
  style={{
    height: "100px",           // ce que l'utilisateur voit
    maxHeight: "500px",        // évite tout débordement visuel
    overflow: "hidden",        // empêche les particules de s’afficher hors zone
  }}
/>
  );
}