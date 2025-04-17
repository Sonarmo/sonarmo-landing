import Image from "next/image";

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Image de fond */}
      <Image
        src="/background.jpg" // remplace par ton vrai nom de fichier
        alt="Background"
        fill
        priority
        className="object-cover z-0"
      />

      {/* Contenu au-dessus si besoin */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <h1 className="text-white text-3xl sm:text-5xl font-bold">
          Bienvenue sur Sonarmo
        </h1>
      </div>
    </main>
  );
}
