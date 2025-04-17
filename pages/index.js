import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[600px] h-auto">
        <Image
          src="/hero-sonarmo.png"
          alt="Teaser Sonarmo"
          width={600}
          height={600}
          priority
          className="w-full h-auto object-contain"
        />
      </div>
    </main>
  );
}
