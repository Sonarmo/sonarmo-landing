import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import Link from "next/link";
import Select from "react-select";

export default function AdminEditProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    placeName: "",
    email: "",
    ambianceDefault: "",
    ambianceDetails: {
      mood: "",
      decoration: "",
      clientele: "",
      goal: "",
      happyHourStart: "",
      happyHourEnd: "",
      genres: [],
      referenceArtists: [],
      tempo: "",
      vocals: "",
      languages: [],
      type: "",
      size: "",
      hours: "",
      affluence: "",
      specialMoments: "",
      identityNotes: ""
    }
  });

  const genreOptions = [
    { value: "jazz", label: "Jazz" },
    { value: "pop", label: "Pop" },
    { value: "house", label: "House" },
    { value: "lofi", label: "Lo-fi" },
    { value: "rock", label: "Rock" },
    { value: "electronic", label: "Electronic" }
  ];

  const languageOptions = [
    { value: "fr", label: "Français" },
    { value: "en", label: "Anglais" },
    { value: "es", label: "Espagnol" },
    { value: "it", label: "Italien" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user || user.email !== "arthur.fromont@sonarmo.com") {
        router.push("/");
        return;
      }

      if (typeof id === "string") {
        try {
          const docRef = doc(db, "profiles", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile({
              placeName: data.placeName || "",
              email: data.email || "",
              ambianceDefault: data.ambianceDefault || "",
              ambianceDetails: {
                mood: data.ambianceDetails?.mood || "",
                decoration: data.ambianceDetails?.decoration || "",
                clientele: data.ambianceDetails?.clientele || "",
                goal: data.ambianceDetails?.goal || "",
                happyHourStart: data.ambianceDetails?.happyHourStart || "",
                happyHourEnd: data.ambianceDetails?.happyHourEnd || "",
                genres: data.ambianceDetails?.genres || [],
                referenceArtists: data.ambianceDetails?.referenceArtists || [],
                tempo: data.ambianceDetails?.tempo || "",
                vocals: data.ambianceDetails?.vocals || "",
                languages: data.ambianceDetails?.languages || [],
                type: data.ambianceDetails?.type || "",
                size: data.ambianceDetails?.size || "",
                hours: data.ambianceDetails?.hours || "",
                affluence: data.ambianceDetails?.affluence || "",
                specialMoments: data.ambianceDetails?.specialMoments || "",
                identityNotes: data.ambianceDetails?.identityNotes || ""
              }
            });
          }
        } catch (error) {
          console.error("Erreur de chargement du profil:", error);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("ambianceDetails.")) {
      const field = name.split(".")[1];
      setProfile(prev => ({
        ...prev,
        ambianceDetails: {
          ...prev.ambianceDetails,
          [field]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelectChange = (field, selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    setProfile(prev => ({
      ...prev,
      ambianceDetails: {
        ...prev.ambianceDetails,
        [field]: values
      }
    }));
  };

  const handleSave = async () => {
    if (typeof id === "string") {
      try {
        await setDoc(doc(db, "profiles", id), profile, { merge: true });
        alert("Profil mis à jour ✅");
      } catch (error) {
        console.error("Erreur lors de l'enregistrement:", error);
        alert("Une erreur est survenue lors de l'enregistrement ❌");
      }
    }
  };

  const handleGeneratePlaylist = async () => {
    if (!id) return alert("ID de profil introuvable.");

    try {
      const res = await fetch(`/api/generate-playlist?id=${id}`);
      const data = await res.json();

      if (res.ok) {
        alert("✅ Playlist créée avec succès !");
        console.log("Playlist générée :", data.playlist);
      } else {
        alert("❌ Erreur lors de la création de la playlist : " + data.error);
      }
    } catch (err) {
      console.error("Erreur lors de la requête :", err);
      alert("❌ Une erreur inattendue s'est produite.");
    }
  };

  if (loading) {
    return <div className="text-white min-h-screen flex items-center justify-center">Chargement du profil...</div>;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <header className="bg-[#1c1c1c] px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        <Link href="/admin" className="text-xl font-bold text-white hover:text-gray-300">Sonarmo Admin</Link>
        <nav className="flex gap-6 text-sm">
          <Link href="/admin" className="hover:text-gray-300">Dashboard</Link>
          <Link href="/" className="hover:text-gray-300">Retour au site</Link>
        </nav>
      </header>

      <main className="p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6">Modifier le profil du lieu</h1>

        <div className="space-y-6 max-w-xl">
          <input name="placeName" value={profile.placeName} onChange={handleChange} placeholder="Nom du lieu" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <input name="email" value={profile.email} onChange={handleChange} placeholder="Email" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <input name="ambianceDefault" value={profile.ambianceDefault} onChange={handleChange} placeholder="Ambiance par défaut" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <textarea name="ambianceDetails.mood" value={profile.ambianceDetails.mood} onChange={handleChange} placeholder="Humeur musicale souhaitée" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <Select isMulti options={genreOptions} value={genreOptions.filter(opt => profile.ambianceDetails.genres.includes(opt.value))} onChange={opts => handleMultiSelectChange("genres", opts)} className="text-black" />
          <Select isMulti options={languageOptions} value={languageOptions.filter(opt => profile.ambianceDetails.languages.includes(opt.value))} onChange={opts => handleMultiSelectChange("languages", opts)} className="text-black" />
          <input name="ambianceDetails.referenceArtists" value={profile.ambianceDetails.referenceArtists} onChange={handleChange} placeholder="Artistes ou morceaux de référence" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <input name="ambianceDetails.tempo" value={profile.ambianceDetails.tempo} onChange={handleChange} placeholder="Tempo souhaité (lent, modéré, rapide)" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <input name="ambianceDetails.vocals" value={profile.ambianceDetails.vocals} onChange={handleChange} placeholder="Présence vocale (instrumental, mixte, vocal)" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <input name="ambianceDetails.decoration" value={profile.ambianceDetails.decoration} onChange={handleChange} placeholder="Style de décoration" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <input name="ambianceDetails.clientele" value={profile.ambianceDetails.clientele} onChange={handleChange} placeholder="Type de clientèle" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <input name="ambianceDetails.goal" value={profile.ambianceDetails.goal} onChange={handleChange} placeholder="Objectif de la musique" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <input name="ambianceDetails.type" value={profile.ambianceDetails.type} onChange={handleChange} placeholder="Type de lieu" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <input name="ambianceDetails.size" value={profile.ambianceDetails.size} onChange={handleChange} placeholder="Taille du lieu" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <input name="ambianceDetails.hours" value={profile.ambianceDetails.hours} onChange={handleChange} placeholder="Horaires d'ouverture" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <input name="ambianceDetails.affluence" value={profile.ambianceDetails.affluence} onChange={handleChange} placeholder="Affluence moyenne" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <input name="ambianceDetails.specialMoments" value={profile.ambianceDetails.specialMoments} onChange={handleChange} placeholder="Moments clés à souligner" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <input name="ambianceDetails.identityNotes" value={profile.ambianceDetails.identityNotes} onChange={handleChange} placeholder="Éléments identitaires sonores" className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
          <div className="flex gap-4">
            <input name="ambianceDetails.happyHourStart" value={profile.ambianceDetails.happyHourStart} onChange={handleChange} type="time" className="bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded w-1/2" />
            <input name="ambianceDetails.happyHourEnd" value={profile.ambianceDetails.happyHourEnd} onChange={handleChange} type="time" className="bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded w-1/2" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button onClick={handleSave} className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-6 py-2 rounded text-white font-semibold">Enregistrer les modifications</button>
            <button onClick={handleGeneratePlaylist} className="bg-blue-600 px-6 py-2 rounded text-white font-semibold">Générer une playlist</button>
          </div>
        </div>
      </main>
    </div>
  );
}
