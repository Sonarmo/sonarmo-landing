import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function PromptHistoryDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "promptHistory"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(results);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Historique des playlists générées</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full text-sm bg-[#1c1c1c] rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="p-4">Date</th>
              <th className="p-4">Email</th>
              <th className="p-4">Nom Playlist</th>
              <th className="p-4">Tracks</th>
              <th className="p-4">Pays</th>
              <th className="p-4">Produit</th>
              <th className="p-4">Lien</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-t border-gray-700 hover:bg-gray-800">
                <td className="p-4">{new Date(item.createdAt.toDate()).toLocaleString()}</td>
                <td className="p-4">{item.spotifyEmail || "-"}</td>
                <td className="p-4">{item.playlistName || "-"}</td>
                <td className="p-4">{item.totalTracks}</td>
                <td className="p-4">{item.spotifyCountry}</td>
                <td className="p-4">{item.spotifyProduct}</td>
                <td className="p-4">
                  <a
                    href={item.playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 underline"
                  >
                    Ouvrir
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
