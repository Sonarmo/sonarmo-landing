import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/user-stats");
      if (!res.ok) {
        const err = await res.json();
        console.error("❌ Erreur analyse cumulée :", err);
        return;
      }
      const json = await res.json();
      setStats(json.stats);
      setHistory(json.stats?.history || []);
    }
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white">
  
        

      <main className="flex-1 p-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-semibold mb-6"
        >
          Analyses globales
        </motion.h1>

        {stats ? (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-10 font-[Poppins]">
              <Card className="bg-[#1f1f1f]">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400">Énergie moyenne</p>
                  <p className="text-xl font-bold mt-1">
                    {interpretEnergy(stats.averageEnergy)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-[#1f1f1f]">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400">Valence moyenne</p>
                  <p className="text-xl font-bold mt-1">
                    {interpretValence(stats.averageValence)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-[#1f1f1f]">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400">Morceaux analysés</p>
                  <p className="text-xl font-bold mt-1">
                    {stats.total_tracks}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#1f1f1f] mb-10">
              <CardContent className="p-6">
                <p className="text-md text-gray-300 mb-4">Évolution de l’énergie</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={history.map((h, i) => ({ name: `#${i + 1}`, energy: Math.round(h.energy * 10) }))}>
                    <XAxis dataKey="name" stroke="#999" />
                    <YAxis domain={[0, 10]} stroke="#999" />
                    <Tooltip />
                    <Line type="monotone" dataKey="energy" stroke="#F28500" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        ) : (
          <p className="text-gray-500">Chargement des données...</p>
        )}
      </main>
    </div>
  );
}
