// pages/admin/artists.js
import { useEffect, useState } from "react";
import { db } from "/lib/firebase"; // ✅ adapte si ton chemin est différent
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import Link from "next/link";

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      const snapshot = await getDocs(collection(db, "hasard_artists"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArtists(data);
    };

    fetchArtists();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Supprimer cet artiste ?")) {
      await deleteDoc(doc(db, "hasard_artists", id));
      setArtists(prev => prev.filter(artist => artist.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">🎵 Gestion des artistes</h1>
        <Link
          href="/admin/new"
          className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] text-white px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          + Ajouter un artiste
        </Link>
      </header>

      {artists.length === 0 ? (
        <p className="text-gray-400">Aucun artiste pour l&apos;instant.</p>
      ) : (
        <div className="space-y-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-700 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{artist.name}</h2>
                <p className="text-sm text-gray-400 truncate w-64">{artist.description}</p>
              </div>
              <div className="flex gap-4">
                <Link
                  href={`/admin/artists/${artist.id}`}
                  className="text-sm text-blue-400 hover:underline"
                >
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(artist.id)}
                  className="text-sm text-red-400 hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}