import { useEffect, useState } from "react";
import { db } from "/lib/firebase";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";

export default function PromptHistoryDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "promptHistory"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const results = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let userEmail = "-";

          if (data.uid) {
            try {
              const userDoc = await getDoc(doc(db, "users", data.uid));
              if (userDoc.exists()) {
                userEmail = userDoc.data().email || "-";
              }
            } catch (err) {
              console.warn("Erreur lors de la récupération de l'email utilisateur:", err);
            }
          }

          return { id: docSnap.id, ...data, userEmail };
        })
      );

      setHistory(results);
      setLoading(false);
    };

    fetchData();
  }, []);
  const exportToCSV = (data) => {
  if (!data.length) return;

  const headers = [
    "Date",
    "Email",
    "Nom Playlist",
    "Prompt",
    "Nombre de tracks",
    "Pays",
    "Produit",
    "Lien Playlist"
  ];

  const rows = data.map((item) => [
    new Date(item.createdAt.toDate()).toLocaleString(),
    item.userEmail,
    item.playlistName,
    item.prompt,
    item.totalTracks,
    item.spotifyCountry,
    item.spotifyProduct,
    item.playlistUrl
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows]
      .map((row) =>
        row
          .map((val) =>
            typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val
          )
          .join(";")
      )
      .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "historique_playlists_sonarmo.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Historique des playlists générées</h1>
      <button
  onClick={() => exportToCSV(history)}
  className="mb-6 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
>
  Exporter en CSV
</button>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[800px] text-sm bg-[#1c1c1c] rounded-xl">
            <thead>
              <tr className="bg-gray-800 text-left">
                <th className="p-4">Date</th>
                <th className="p-4">Email</th>
                <th className="p-4">Nom Playlist</th>
                <th className="p-4">Prompt</th>
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
                  <td className="p-4">{item.userEmail}</td>
                  <td className="p-4">{item.playlistName || "-"}</td>
                  <td className="p-4 max-w-xs whitespace-pre-wrap break-words">{item.prompt}</td>
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
        </div> 
      )}
    </div>
  );
}