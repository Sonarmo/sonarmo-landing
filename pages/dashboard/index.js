// dashboard.js – version corrigée avec mini lecteur et context
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import TrackPreviewPanel from "/components/builder/TrackPreviewPanel";
import { getIdToken } from "firebase/auth";
import { usePlayer } from "/lib/contexts/PlayerContext";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [ambiance, setAmbiance] = useState("Lounge Chill 🌙");
  const [ambianceUri, setAmbianceUri] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [playlistAnalysis, setPlaylistAnalysis] = useState(null);
  const [energy, setEnergy] = useState(0.65);
  const { currentTrack, recentTracks } = usePlayer();

  const fakeEnergyData = Array.from({ length: 15 }, (_, i) => ({
    name: `T${i + 1}`,
    energy: Math.random() * 0.5 + 0.4,
  }));

  const handleAmbianceChange = (e) => {
    setAmbiance(e.target.value);
    setAmbianceUri(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return router.push("/login");
      setLoading(false);
      try {
        const freshToken = await getIdToken(user, true);
        document.cookie = `token=${freshToken}; path=/`;

        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.selectedPlaylistUri) setAmbianceUri(data.selectedPlaylistUri);
          if (data.ambianceLabel) setAmbiance(data.ambianceLabel);
        }
      } catch (err) {
        console.error("❌ Erreur Firestore:", err);
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!ambianceUri) return;
    const playlistId = ambianceUri.match(/spotify:playlist:(.+)/)?.[1];
    if (!playlistId) return;

    fetch("/api/analyse-playlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlistId }),
    })
      .then((res) => res.json())
      .then((data) => setPlaylistAnalysis(data))
      .catch((err) => console.error("Erreur analyse:", err));
  }, [ambianceUri]);

  const playlistUrls = {
    "Lounge Chill 🌙": "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6",
    "Apéro Festif 🍹": "https://open.spotify.com/playlist/37i9dQZF1DWZwtERXCS82H",
    "Night Club 🔥": "https://open.spotify.com/playlist/37i9dQZF1DX4dyzvuaRJ0n",
    "Café Cosy ☕": "https://open.spotify.com/playlist/37i9dQZF1DX6VdMW310YC7",
  };

  if (loading) {
    return <div className="text-white min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row pb-24">
      <main className="flex-1 p-6 md:p-10 text-white">
        <h1 className="text-3xl font-semibold mb-6">Bienvenue sur ton Dashboard</h1>

        <section className="bg-[#1c1c1c] rounded-xl p-6 md:p-8 shadow-lg mb-10">
          <h2 className="text-2xl font-semibold mb-6">Ambiance actuelle</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left min-h-[60px]">
              <AnimatePresence mode="wait">
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
              </AnimatePresence>
            </div>
            <select
              value={ambiance}
              onChange={handleAmbianceChange}
              className="bg-[#121212] border border-gray-600 rounded-full px-6 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#F28500]"
            >
              {Object.keys(playlistUrls).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
        </section>

        {playlistAnalysis && typeof playlistAnalysis === "object" && (
          <div className="bg-[#1c1c1c] text-white p-4 rounded-xl mb-8">
            <h3 className="text-xl font-semibold mb-2">Analyse Playlist</h3>
            <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
              <li>
                <strong>Énergie moyenne :</strong>{" "}
                {playlistAnalysis.average_energy !== undefined
                  ? `${(playlistAnalysis.average_energy * 100).toFixed(1)}%`
                  : "Données non disponibles"}
              </li>
              <li>
                <strong>Tempo moyen :</strong>{" "}
                {playlistAnalysis.average_tempo !== undefined
                  ? `${playlistAnalysis.average_tempo.toFixed(0)} BPM`
                  : "Données non disponibles"}
              </li>
              <li>
                <strong>Valence moyenne :</strong>{" "}
                {playlistAnalysis.average_valence !== undefined
                  ? `${(playlistAnalysis.average_valence * 100).toFixed(1)}%`
                  : "Données non disponibles"}
              </li>
              <li>
                <strong>Nombre de morceaux :</strong>{" "}
                {playlistAnalysis.total_tracks !== undefined
                  ? playlistAnalysis.total_tracks
                  : "Données non disponibles"}
              </li>
            </ul>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <TrackPreviewPanel
            currentTrack={currentTrack}
            recentTracks={recentTracks}
          />
          <div className="bg-[#1c1c1c] p-4 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Énergie musicale</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={fakeEnergyData}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis domain={[0, 1]} stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="energy" stroke="#F28500" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <Box mt={4}>
              <Slider
                value={energy}
                min={0}
                max={1}
                step={0.01}
                onChange={(e, val) => setEnergy(val)}
                sx={{ color: "#F28500" }}
              />
              <p className="text-sm text-center mt-2 text-gray-400">
                Énergie cible : {(energy * 100).toFixed(0)}%
              </p>
            </Box>
          </div>
        </div>
      </main>

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