import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-black min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[700px] mx-auto">
        <Image
          src="/hero-sonarmo.png"
          alt="Teaser Sonarmo"
          width={1200}
          height={675}
          priority
          className="w-full h-auto object-contain rounded-xl"
        />
      </div>
    </main>
  );
}
