import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { MainPlaylistBadge } from "/components/builder/MainPlaylistBadge";
import { usePlayer } from "/lib/contexts/PlayerContext";

export default function MusicPage() {
  const router = useRouter();
  const { deviceId, setAccessToken: setContextToken } = usePlayer();

  const [loading, setLoading] = useState(true);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [uid, setUid] = useState(null);
  const [localAccessToken, setLocalAccessToken] = useState(null);
  const [promptText, setPromptText] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const promptRef = useRef();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUid(user.uid);

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const token = userDoc.data().spotifyAccessToken;
            setContextToken(token); // pour le PlayerContext
            setLocalAccessToken(token); // pour cette page
          }

          const profileSnap = await getDoc(doc(db, "profiles", user.uid));
          if (profileSnap.exists()) {
            setUserProfile(profileSnap.data());
          }
        } catch (error) {
          console.error("Erreur récupération Firestore:", error);
        }

        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, setContextToken]);

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      if (!localAccessToken) {
        console.warn("⛔ Aucun accessToken local pour récupérer les playlists");
        return;
      }

      try {
        const res = await fetch("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${localAccessToken}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`❌ Erreur HTTP ${res.status} :`, errorText);
          return;
        }

        const data = await res.json();
        console.log("📥 Playlists récupérées :", data);
        setUserPlaylists(data.items || []);
      } catch (err) {
        console.error("❌ Erreur récupération playlists Spotify:", err);
      }
    };

    fetchUserPlaylists();
  }, [localAccessToken]);

  const playPlaylist = async (playlistUri) => {
    if (!deviceId || !localAccessToken) {
      console.error("❌ Device ID ou accessToken manquant pour lire la playlist");
      return;
    }

    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context_uri: playlistUri,
      }),
    });
  };

  const generatePlaylistFromPrompt = async () => {
    if (!promptText || promptText.length < 10) return;
    setIsGenerating(true);
    setPlaylistUrl(null);

    try {
      const res = await fetch("/api/generate-playlist-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();
      if (res.ok) {
        setPlaylistUrl(data.url);
      } else {
        console.error("Erreur génération:", data.error);
        alert("Erreur: " + data.error);
      }
    } catch (err) {
      console.error("Erreur fetch:", err);
    }

    setIsGenerating(false);
  };

  if (loading) {
    return <div className="text-white min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row pb-24">
      <main className="flex-1 p-6 md:p-10 text-white">
        <h1 className="text-3xl font-semibold mb-6">Vos Playlists</h1>

        {userProfile?.mainPlaylist?.id && (
          <MainPlaylistBadge
            lastUpdated={userProfile?.mainPlaylist?.lastUpdated}
            spotifyUrl={`https://open.spotify.com/playlist/${userProfile?.mainPlaylist?.id}`}
          />
        )}
{userProfile?.mainPlaylist?.id && (
  <div className="bg-[#1c1c1c] p-6 rounded-xl shadow-lg mb-10">
    <h2 className="text-xl font-bold mb-2">Playlist principale</h2>
    
    <p className="text-gray-400 text-sm mb-4">
      Générée le : {new Date(userProfile.mainPlaylist.lastUpdated).toLocaleString("fr-FR")}
      <br />
      Ambiance : {userProfile.mainPlaylist.mood || "N.C."} | Météo : {userProfile.mainPlaylist.meteo || "N.C."}
    </p>

    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => playPlaylist(`spotify:playlist:${userProfile.mainPlaylist.id}`)}
        className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
      >
        Écouter la playlist
      </button>

      <a
        href={userProfile.mainPlaylist.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-[#1DB954] flex items-center"
      >
        Voir sur Spotify
      </a>

      <button
        onClick={async () => {
          try {
            const res = await fetch(`/api/generate-playlist?id=${uid}`);
            const data = await res.json();

            if (res.ok) {
              alert("✅ Playlist régénérée avec succès !");
              window.location.reload();
            } else {
              alert("❌ Erreur : " + data.error);
            }
          } catch (error) {
            console.error("Erreur génération:", error);
            alert("❌ Erreur inattendue");
          }
        }}
        className="bg-blue-700 px-6 py-2 rounded-full text-white font-semibold hover:bg-blue-600"
      >
        Régénérer la playlist
      </button>
    </div>
  </div>
)}
        <section className="bg-[#1c1c1c] p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-semibold mb-4">Intelligence Atmospherique</h2>
          <textarea
            ref={promptRef}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={4}
            placeholder="Ex: Ce soir c'est football, met moi une ambiance de stade"
            className="w-full bg-[#121212] border border-gray-600 text-white p-4 rounded-lg mb-4"
          />
          <button
            onClick={generatePlaylistFromPrompt}
            disabled={isGenerating}
            className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
          >
            {isGenerating ? "Génération en cours..." : "Générer la playlist"}
          </button>

          {playlistUrl && (
            <div className="mt-6">
              <p className="text-green-400 mb-2">✅ Playlist générée avec succès !</p>
              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#1DB954]"
              >
                Lancer la playlist
              </a>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {userPlaylists.map((playlist) => (
            <motion.div
              key={playlist.id}
              whileHover={{ scale: 1.05 }}
              className="bg-[#1c1c1c] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer"
              onClick={async () => {
                await playPlaylist(playlist.uri);
                if (uid) {
                  try {
                    await updateDoc(doc(db, "users", uid), {
                      selectedPlaylistUri: playlist.uri,
                      ambianceLabel: playlist.name,
                    });
                    console.log("✅ Playlist enregistrée dans Firestore");
                  } catch (error) {
                    console.error("❌ Erreur enregistrement Firestore :", error);
                  }
                }
              }}
            >
              <Image
                src={playlist.images[0]?.url || "/images/default.jpg"}
                alt={playlist.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1">{playlist.name}</h2>
                <p className="text-gray-400 text-sm truncate">{playlist.description || ""}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
