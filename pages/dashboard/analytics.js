import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

export default function AnalyticsPage() {
    const pathname = usePathname();
    const [data, setData] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setData([
            { hour: "08h", volume: 20 },
            { hour: "10h", volume: 35 },
            { hour: "12h", volume: 60 },
            { hour: "14h", volume: 40 },
            { hour: "16h", volume: 55 },
            { hour: "18h", volume: 80 },
            { hour: "20h", volume: 75 },
            { hour: "22h", volume: 50 },
        ]);
    }, []);

    return (
        <div className="flex min-h-screen bg-black text-white font-[Poppins]">
            {/* Mobile toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="absolute top-4 left-4 z-50 md:hidden text-white"
            >
                <Menu size={28} />
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed md:static z-40 w-64 bg-black text-gray-300 p-6 flex flex-col gap-8 transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
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

            {/* Main content */}
            <main className="flex-1 p-6 font-[Poppins]">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-semibold mb-8"
                >
                    📊 Analyses Sonarmo
                </motion.h1>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <Card className="bg-[#1f1f1f] font-[Poppins]">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-400">Temps total de musique</p>
                            <p className="text-xl font-bold mt-1">4h32</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#1f1f1f] font-[Poppins]">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-400">Playlist la plus jouée</p>
                            <p className="text-xl font-bold mt-1">Lounge Chill 🌙</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#1f1f1f] font-[Poppins]">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-400">Heures de pic</p>
                            <p className="text-xl font-bold mt-1">18h - 20h</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-[#1f1f1f] rounded-2xl p-4 shadow-lg mb-8 font-[Poppins]">
                    <h2 className="text-lg font-semibold mb-4">Volume moyen par heure</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <XAxis dataKey="hour" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip contentStyle={{ backgroundColor: "#1f1f1f", border: "none" }} labelStyle={{ color: '#F28500' }} />
                            <Line type="monotone" dataKey="volume" stroke="#F28500" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-[#1f1f1f] rounded-2xl p-4 shadow-lg font-[Poppins]">
                    <h2 className="text-lg font-semibold mb-4">Ambiances jouées</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={[
                            { name: "Chill", plays: 12 },
                            { name: "Énergique", plays: 9 },
                            { name: "Jazz", plays: 6 },
                            { name: "Electro", plays: 4 },
                        ]}>
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip contentStyle={{ backgroundColor: "#1f1f1f", border: "none" }} labelStyle={{ color: '#FF00FF' }} />
                            <Bar dataKey="plays" fill="#FF00FF" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </div>
    );
}
