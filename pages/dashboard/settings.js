import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../../lib/firebase";
import Link from "next/link";

export default function Settings() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [router]);

    return (
        <main className="bg-[#121212] text-white min-h-screen p-10 font-[Poppins]">
            <h1 className="text-3xl font-bold mb-6">⚙️ Réglages</h1>

            {/* SECTION CONNEXION SPOTIFY */}
            <section className="bg-[#1e1e1e] rounded-2xl p-6 mb-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">🎧 Connecter Spotify</h2>
                <p className="mb-4 text-gray-300">
                    Relie ton compte Spotify pour permettre à Sonarmo de lire, créer et gérer tes playlists musicales en temps réel.
                </p>
                <Link href="/api/login">
                    <button className="bg-green-500 hover:bg-green-600 transition px-5 py-2 rounded-lg font-semibold text-white shadow-md">
                        Se connecter à Spotify
                    </button>
                </Link>
            </section>
        </main>
    );
}
