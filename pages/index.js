import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-black min-h-screen flex items-center justify-center">
      <Image
        src="/logo-sonarmo-officiel.png"
        alt="Sonarmo logo"
        width={1280}
        height={720}
        priority
      />
    </main>
  );
}
