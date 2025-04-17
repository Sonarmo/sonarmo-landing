import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-black min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-screen-lg">
        <Image
          src="/hero-sonarmo.png"
          alt="Teaser Sonarmo"
          width={1920}
          height={1080}
          priority
          className="w-full h-auto object-contain"
        />
      </div>
    </main>
  );
}

