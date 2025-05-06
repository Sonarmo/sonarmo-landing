import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function SpotifyPlayer() {
    const router = useRouter();
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) return router.push("/login");

            const docSnap = await getDoc(doc(db, "users", user.uid));
            if (docSnap.exists()) {
                const data = docSnap.data();
                setAccessToken(data.spotifyAccessToken || null);
            }
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (!accessToken) return;

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "Sonarmo Player",
                getOAuthToken: cb => cb(accessToken),
                volume: 0.5,
            });

            player.addListener("ready", ({ device_id }) => {
                console.log("✅ Player prêt avec ID :", device_id);
                setDeviceId(device_id);
            });

            player.addListener("not_ready", ({ device_id }) => {
                console.warn("🛑 Player non prêt :", device_id);
            });

            player.connect();
            setPlayer(player);
        };
    }, [accessToken]);

    const handlePlay = async () => {
        if (!deviceId || !accessToken) return;

        const playEndpoint = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
        const res = await fetch(playEndpoint, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                context_uri: "spotify:playlist:37i9dQZF1DX4WYpdgoIcn6", // Exemple : Lounge Chill
                offset: { position: 0 },
                position_ms: 0,
            }),
        });

        if (res.status === 204) {
            console.log("▶️ Lecture lancée !");
        } else {
            console.error("❌ Échec lecture :", await res.json());
        }
    };

    return (
        <main className="bg-[#121212] text-white font-[Poppins] min-h-screen p-10">
            <h1 className="text-3xl font-bold mb-6">🎛️ Lecteur Personnel Spotify</h1>
            <p className="mb-4">Lecture directe depuis ton compte Spotify connecté.</p>
            <button
                onClick={handlePlay}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
                ▶️ Lancer la lecture
            </button>
        </main>
    );
}
