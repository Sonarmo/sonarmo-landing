import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <Image
          src="/hero-sonarmo.png"
          alt="Teaser Sonarmo"
          width={1600}
          height={900}
          priority
          className="w-full h-auto object-contain"
        />
      </div>
    </main>
  );
}

