import { useState } from "react";
import { useRouter } from "next/router";
import { db, auth } from "/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

export default function CreateBlogPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImageViaApi = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64 = reader.result;
          const res = await fetch("/api/upload-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: base64, fileName: file.name }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          resolve(data.url);
        } catch (err) {
          console.error("Erreur API upload:", err);
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user || user.email !== "arthur.fromont@sonarmo.com") {
        router.push("/");
        return;
      }

      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageViaApi(imageFile);
        console.log("✅ Image uploadée via API :", imageUrl);
      }

      await addDoc(collection(db, "blogPosts"), {
        title,
        content,
        imageUrl,
        createdAt: serverTimestamp(),
        author: user.email,
        date: new Date().toLocaleDateString("fr-FR"),
      });

      alert("✅ Article créé !");
      router.push("/admin/blog");
    } catch (err) {
      console.error("Erreur création article:", err);
      alert("❌ Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Créer un nouvel article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          className="w-full bg-[#1c1c1c] border border-gray-700 px-4 py-2 rounded"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="rounded overflow-hidden">
          <SimpleMDE
            key="simplemde"
            value={content}
            onChange={setContent}
            options={{
              spellChecker: false,
              autofocus: true,
              placeholder: "Écris ton article ici...",
              status: false,
              toolbar: ["bold", "italic", "heading", "|", "quote", "code", "|", "preview", "side-by-side", "fullscreen"],
            }}
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] text-white px-6 py-2 rounded font-semibold"
        >
          {loading ? "Enregistrement..." : "Créer l'article"}
        </button>
      </form>
    </div>
  );
}