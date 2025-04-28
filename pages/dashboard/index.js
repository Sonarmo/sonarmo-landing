import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const playlistUrls = {
    "Lounge Chill 🌙": "https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6",
    "Apéro Festif 🍹": "https://open.spotify.com/embed/playlist/37i9dQZF1DWZwtERXCS82H",
    "Night Club 🔥": "https://open.spotify.com/embed/playlist/37i9dQZF1DX4dyzvuaRJ0n",
    "Café Cosy ☕": "https://open.spotify.com/embed/playlist/37i9dQZF1DX6VdMW310YC7"
};

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const [ambiance, setAmbiance] = useState("Lounge Chill 🌙");
    const [showAmbiance, setShowAmbiance] = useState(true);
    const [showToast, setShowToast] = useState(false);

    const handleAmbianceChange = (e) => {
        setShowAmbiance(false);
        setTimeout(() => {
            setAmbiance(e.target.value);
            setShowAmbiance(true);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }, 300);
    };

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
        <div className="min-h-screen bg-[#121212] flex flex-col md:flex-row relative">
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
                <h1 className="text-3xl font-bold mb-6">Bienvenue sur ton Dashboard 🎶</h1>
                <section className="bg-[#1c1c1c] rounded-xl p-6 md:p-8 shadow-lg mb-10">
                    <h2 className="text-2xl font-semibold mb-6">Ambiance actuelle</h2>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left min-h-[60px]">
                            <AnimatePresence mode="wait">
                                {showAmbiance && (
                                    <motion.div
                                        key={ambiance}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p className="text-lg font-light">{ambiance}</p>
                                        <p className="text-gray-400 text-sm">Adaptée à l&apos;heure actuelle</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="flex flex-col gap-4">
                            <select
                                value={ambiance}
                                onChange={handleAmbianceChange}
                                className="bg-[#121212] border border-gray-600 rounded-full px-6 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#F28500]"
                            >
                                <option value="Lounge Chill 🌙">Lounge Chill 🌙</option>
                                <option value="Apéro Festif 🍹">Apéro Festif 🍹</option>
                                <option value="Night Club 🔥">Night Club 🔥</option>
                                <option value="Café Cosy ☕">Café Cosy ☕</option>
                            </select>
                            <button className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] text-white font-semibold px-6 py-3 rounded-full shadow-md hover:opacity-90 transition">
                                Changer d&apos;ambiance
                            </button>
                        </div>
                    </div>
                </section>

                {/* Spotify Player Section */}
                <section className="bg-[#1c1c1c] rounded-xl p-6 md:p-8 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Lecteur Spotify 🎵</h2>
                    <div className="w-full">
                        <iframe
                            src={playlistUrls[ambiance]}
                            width="100%"
                            height="80"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            className="rounded-lg"
                        ></iframe>
                    </div>
                </section>

                <p className="mt-10">Commence à explorer l&apos;univers de ton ambiance musicale personnalisée.</p>
            </main>

            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.5 }}
                        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1DB954] text-white px-6 py-3 rounded-full shadow-lg"
                    >
                        Ambiance changée avec succès ✔️
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
