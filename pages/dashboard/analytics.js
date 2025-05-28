import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

// Interpréteurs de données
function interpretEnergy(value) {
  if (value < 0.3) return "🟦 Calme";
  if (value < 0.6) return "🟨 Modérée";
  if (value < 0.8) return "🟧 Énergique";
  return "🔴 Très énergique";
}

function interpretValence(value) {
  if (value < 0.3) return "😔 Triste / mélancolique";
  if (value < 0.6) return "😌 Neutre / doux";
  return "😄 Joyeux / positif";
}

export default function AnalyticsPage() {
  const pathname = usePathname();
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      const playlistId = "37i9dQZF1DXdPec7aLTmlC"; // playlist test
      const token = localStorage.getItem("spotifyToken");
      const res = await fetch("/api/analyse-playlist"); // plus besoin de token
const json = await res.json();
setStats(json.stats);
    }
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Mobile toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute top-4 left-4 z-50 md:hidden text-white">
        <Menu size={28} />
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:static z-40 w-64 bg-black text-gray-300 p-6 flex flex-col gap-8 transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <Link href="/dashboard" className="flex items-center gap-3 mb-8">
          <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={140} height={40} />
        </Link>

        <nav className="flex flex-col gap-6 text-sm">
          <Link href="/dashboard" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard" ? "text-white" : ""}`}>
            <Image src="/icons/home.png" alt="Home" width={24} height={24} /> Dashboard
          </Link>
          <Link href="/dashboard/music" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/music" ? "text-white" : ""}`}>
            <Image src="/icons/music.png" alt="Music" width={24} height={24} /> Musique
          </Link>
          <Link href="/dashboard/analytics" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/analytics" ? "text-white" : ""}`}>
            <Image src="/icons/analytics.png" alt="Analytics" width={24} height={24} /> Analyses
          </Link>
          <Link href="/dashboard/settings" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/settings" ? "text-white" : ""}`}>
            <Image src="/icons/settings.png" alt="Settings" width={24} height={24} /> Réglages
          </Link>
          <Link href="/dashboard/profile" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/profile" ? "text-white" : ""}`}>
            <Image src="/icons/profile.png" alt="Profile" width={24} height={24} /> Profil
          </Link>
          <Link href="/logout" className="flex items-center gap-4 hover:text-white mt-8">
            <Image src="/icons/logout.png" alt="Logout" width={24} height={24} /> Déconnexion
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-semibold mb-6">
          Analyses
        </motion.h1>

        {stats ? (
          <div className="grid md:grid-cols-3 gap-6 mb-10 font-[Poppins]">
            <Card className="bg-[#1f1f1f]">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Énergie moyenne</p>
                <p className="text-xl font-bold mt-1">{interpretEnergy(stats.averageEnergy)}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#1f1f1f]">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Valence moyenne</p>
                <p className="text-xl font-bold mt-1">{interpretValence(stats.averageValence)}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#1f1f1f]">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Genres dominants</p>
                <p className="text-xl font-bold mt-1">{stats.topGenres.map(g => g.genre).join(", ")}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-gray-500">Chargement des données...</p>
        )}
      </main>
    </div>
  );
}