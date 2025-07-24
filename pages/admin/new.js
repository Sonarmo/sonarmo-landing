// pages/admin/artists/new.js
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";

export default function NewArtistPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    spotify: "",
    deezer: "",
    appleMusic: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "hasard_artists"), form);
      router.push("/admin/artists");
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Erreur lors de l'ajout de l'artiste.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">➕ Nouvel artiste</h1>
        <Link href="/admin/artists" className="text-sm text-gray-400 hover:underline">
          ← Retour à la liste
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        {["name", "description", "image", "spotify", "deezer", "appleMusic"].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize text-sm text-gray-300" htmlFor={field}>
              {field === "image" ? "URL de l’image (Firebase ou externe)" : field}
            </label>
            <input
              id={field}
              name={field}
              type="text"
              required={field === "name" || field === "description"}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-2 bg-[#1f1f1f] border border-gray-600 rounded-md text-white"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-6 py-2 rounded-md text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Créer l’artiste"}
        </button>
      </form>
    </div>
  );
}