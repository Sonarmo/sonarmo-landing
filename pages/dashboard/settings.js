import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Settings() {
  const router = useRouter();
  const pathname = "/dashboard/settings";
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [spotifyProfile, setSpotifyProfile] = useState(null);
  const [forceReconnect, setForceReconnect] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setUserUid(user.uid);

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const token = userData.spotifyAccessToken;

          if (token && typeof token === "string" && !forceReconnect) {
            console.log("🎧 Token Spotify détecté :", token.slice(0, 10) + "...");

            try {
              const res = await fetch("https://api.spotify.com/v1/me", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              const profile = await res.json();
              console.log("📥 Réponse Spotify /me :", profile);

              if (res.ok && !profile.error) {
                setIsSpotifyConnected(true);
                setSpotifyProfile({
                  displayName: profile.display_name,
                  email: profile.email,
                  image: profile.images?.[0]?.url || null,
                });
              } else {
                console.warn("⚠️ Token Spotify invalide ou expiré :", profile);
                setIsSpotifyConnected(false);
              }
            } catch (err) {
              console.error("❌ Erreur fetch Spotify /me :", err);
            }
          }
        }
      } catch (error) {
        console.error("Erreur Firestore ou Spotify API :", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, forceReconnect]);

  const handleSpotifyDisconnect = async () => {
    if (!userUid) return;

    try {
      const userRef = doc(db, "users", userUid);
      await updateDoc(userRef, {
        spotifyAccessToken: "",
        updatedAt: new Date(),
      });
      setIsSpotifyConnected(false);
      setSpotifyProfile(null);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur de déconnexion Spotify :", error);
    }
  };

  return (
    <main className="bg-black text-white min-h-screen flex font-[Poppins]">

      {/* SIDEBAR */}
      <aside className="hidden md:flex md:w-64 bg-black text-gray-300 p-6 flex-col gap-8">
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

      {/* CONTENU */}
      <section className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">⚙️ Réglages</h1>

        <section className="bg-[#1e1e1e] rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">🎧 Connecter Spotify</h2>
          <p className="mb-4 text-gray-300">
            Relie ton compte Spotify pour permettre à Sonarmo de lire, créer et gérer tes playlists musicales en temps réel.
          </p>

          {loading ? (
            <p className="text-gray-400">Chargement...</p>
          ) : isSpotifyConnected ? (
            <div className="flex flex-col gap-4">
              <div className="bg-green-700 text-white px-4 py-2 rounded-lg inline-block font-medium w-fit">
                ✅ Connecté à Spotify
              </div>

              {spotifyProfile && (
                <div className="flex items-center gap-4 bg-[#2a2a2a] p-4 rounded-lg">
                  {spotifyProfile.image && (
                    <Image
                      src={spotifyProfile.image}
                      alt="Photo Spotify"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-white font-medium">{spotifyProfile.displayName}</p>
                    <p className="text-gray-400 text-sm">{spotifyProfile.email}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleSpotifyDisconnect}
                className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg font-medium text-white w-fit"
              >
                Se déconnecter de Spotify
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/api/login-user">
                <button className="bg-green-500 hover:bg-green-600 transition px-5 py-2 rounded-lg font-semibold text-white shadow-md">
                  Se connecter à Spotify
                </button>
              </Link>
              <button
                onClick={() => setForceReconnect(true)}
                className="text-sm underline text-gray-400 hover:text-white"
              >
                Recharger la connexion si le token est expiré
              </button>
            </div>
          )}
        </section>

        {showToast && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg transition-all animate-fade-in-out">
            ✅ Déconnecté de Spotify
          </div>
        )}
      </section>

      <style jsx global>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }

        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out;
        }
      `}</style>
    </main>
  );
}