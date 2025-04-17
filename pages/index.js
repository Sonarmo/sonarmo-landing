import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-black min-h-screen flex items-center justify-center">
      <div className="animate-fade-in-up hover:scale-105 hover:rotate-1 transition-all duration-700 ease-in-out">
        <<Image
  src="/hero-sonarmo.png"
  alt="Teaser Sonarmo"
  width={1080}
  height={600}
  priority
  className="w-full h-auto object-contain"
/>

      </div>
    </main>
  );
}
