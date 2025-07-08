// pages/admin/blog.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "/lib/firebase";
import { useRouter } from "next/router";

export default function BlogAdminPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user || user.email !== "arthur.fromont@sonarmo.com") {
        router.push("/");
        return;
      }

      const querySnapshot = await getDocs(collection(db, "blogPosts"));
      const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArticles(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id) => {
    if (confirm("Supprimer cet article ?")) {
      await deleteDoc(doc(db, "blogPosts", id));
      setArticles((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion du blog</h1>
        <Link href="/admin/blog/create" className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] text-white px-4 py-2 rounded">
          ➕ Nouvel article
        </Link>
      </header>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-[#1c1c1c] border border-gray-700 rounded p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{article.title}</h2>
                  <p className="text-gray-400 text-sm mt-1">{article.date}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/edit-post/${article.id}`}
                    className="bg-white text-black px-3 py-1 rounded text-sm"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="bg-red-600 px-3 py-1 rounded text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}