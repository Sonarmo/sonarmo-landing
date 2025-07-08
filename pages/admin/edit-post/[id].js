// pages/admin/edit-post/[id].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "/lib/firebase";
import Head from "next/head";

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const docRef = doc(db, "blogPosts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || "");
        setContent(data.content || "");
        setImageUrl(data.imageUrl || "");
        setDate(data.date || "");
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "blogPosts", id);
    await updateDoc(docRef, {
      title,
      content,
      imageUrl,
      date,
    });
    router.push("/admin/blog");
  };

  if (loading) return <p className="text-white p-6">Chargement...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-[Poppins]">
      <Head>
        <title>Modifier l&apos;article | Sonarmo Admin</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4">Modifier l&apos;article</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre"
          className="w-full p-2 bg-gray-800 rounded text-white"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contenu Markdown"
          rows={10}
          className="w-full p-2 bg-gray-800 rounded text-white"
          required
        ></textarea>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL de l&apos;image"
          className="w-full p-2 bg-gray-800 rounded text-white"
        />
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date"
          className="w-full p-2 bg-gray-800 rounded text-white"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-4 py-2 rounded text-white"
        >
          ✅ Mettre à jour
        </button>
      </form>
    </div>
  );
}