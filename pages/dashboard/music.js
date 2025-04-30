import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const playlists = [
    {
        name: "Lounge Chill 🌙",
        description: "Ambiance feutrée pour soirées douces.",
        image: "/images/lounge.jpg",
        url: "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6"
    },
    {
        name: "Apéro Festif 🍹",
        description: "Idéal pour lancer une soirée entre amis.",
        image: "/images/apero.jpg",
        url: "https://open.spotify.com/playlist/37i9dQZF1DWZwtERXCS82H"
    },
    {
        name: "Night Club 🔥",
        description: "Des beats puissants pour faire monter l'énergie.",
        image: "/images/night.jpg",
        url: "https://open.spotify.com/playlist/37i9dQZF1DX4dyzvuaRJ0n"
    },
    {
        name: "Café Cosy ☕",
        description: "Une vibe douce et relax pour les moments calmes.",
        image: "/images/cafe.jpg",
        url: "https://open.spotify.com/playlist/37i9dQZF1DX6VdMW310YC7"
    }
];

export default function MusicPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push("/login");
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return <div className="text-white min-h-screen flex items-center justify-center">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#1c1c1c] text-gray-300 p-6 flex flex-col gap-8">
                <Link href="/dashboard" className="flex items-center gap-3 mb-8">
                    <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={140} height={40} />
                </Link>

                <nav className="flex flex-col gap-6 text-sm">
                    <Link href="/dashboard" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard" ? "text-white" : ""}`}>
                        <Image src="/icons/home.png" alt="Home" width={24} height={24} />
                        Dashboard
                    </Link>
                    <Link href="/dashboard/music" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/music" ? "text-white" : ""}`}>
                        <Image src="/icons/music.png" alt="Music" width={24} height={24} />
                        Musique
                    </Link>
                    <Link href="/dashboard/analytics" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/analytics" ? "text-white" : ""}`}>
                        <Image src="/icons/analytics.png" alt="Analytics" width={24} height={24} />
                        Analyses
                    </Link>
                    <Link href="/dashboard/settings" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/settings" ? "text-white" : ""}`}>
                        <Image src="/icons/settings.png" alt="Settings" width={24} height={24} />
                        Réglages
                    </Link>
                    <Link href="/dashboard/profile" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/profile" ? "text-white" : ""}`}>
                        <Image src="/icons/profile.png" alt="Profile" width={24} height={24} />
                        Profil
                    </Link>
                    <Link href="/logout" className="flex items-center gap-4 hover:text-white mt-8">
                        <Image src="/icons/logout.png" alt="Logout" width={24} height={24} />
                        Déconnexion
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 text-white">
                <h1 className="text-3xl font-bold mb-8">Sélection de Playlists 🎵</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {playlists.map((playlist) => (
                        <motion.a
                            href={playlist.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={playlist.name}
                            whileHover={{ scale: 1.05 }}
                            className="bg-[#1c1c1c] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
                        >
                            <Image
                                src={playlist.image}
                                alt={playlist.name}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-1">{playlist.name}</h2>
                                <p className="text-gray-400 text-sm">{playlist.description}</p>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </main>
        </div>
    );
}
