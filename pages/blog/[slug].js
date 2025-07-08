import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { db } from "/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useState } from "react";

export default function BlogPost({ post }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (router.isFallback) {
    return <div className="text-white p-10">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white font-[Poppins]">
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-700 relative z-50">
  <Link href="/" className="flex items-center gap-2">
    <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
    <span className="text-white text-lg font-semibold italic">Sonarmo</span>
  </Link>

  {/* Menu desktop */}
  <nav className="hidden md:flex gap-6 text-sm items-center">
    <Link href="/explique-generation" className="hover:text-gray-300">GÉNÉRATEUR DE PLAYLIST</Link>
    <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
    <Link href="/contact" className="hover:text-gray-300">CONTACT</Link>
    <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
      <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
      SE CONNECTER
    </Link>
  </nav>

  {/* Menu mobile */}
  <div className="md:hidden">
    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="text-white focus:outline-none text-xl"
    >
      ☰
    </button>
  </div>

  {/* Drawer menu mobile */}
  {mobileMenuOpen && (
    <div className="absolute top-full right-4 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-lg z-50 flex flex-col w-56 p-4 space-y-2">
      <Link href="/explique-generation" className="text-sm text-white hover:text-[#F28500]">Générateur</Link>
      <Link href="/experience" className="text-sm text-white hover:text-[#F28500]">Sonarmo Pro</Link>
      <Link href="/contact" className="text-sm text-white hover:text-[#F28500]">Contact</Link>
      <Link href="/login" className="text-sm text-white hover:text-[#F28500]">Connexion</Link>
    </div>
  )}
</header>
      <Head>
        <title>{post?.title} | Sonarmo Blog</title>
        <meta
          name="description"
          content={post?.excerpt || post?.content?.slice(0, 150)}
        />
      </Head>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-4">
  <button
    onClick={() => router.push("/blog")}
    className="text-sm text-white border border-gray-600 rounded-full px-4 py-2 hover:border-[#F28500] hover:text-[#F28500] transition-all"
  >
    ← Retour au blog
  </button>
</div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F28500] to-[#FF00FF] mb-6">
          {post.title}
        </h1>
        <p className="text-sm text-gray-400 mb-4">{post.date}</p>

        {post.imageUrl && (
          <div className="mb-6">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={1000}
              height={500}
              className="rounded-xl border border-gray-700"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}

        <div className="prose prose-invert max-w-none text-white leading-relaxed tracking-wide text-[17px] prose-p:mb-4 prose-li:mb-2 prose-img:rounded-xl prose-img:border prose-img:border-gray-700">
  <ReactMarkdown>{post.content}</ReactMarkdown>
</div>
      </main>
    </div>
  );
}

export async function getStaticPaths() {
  const snapshot = await getDocs(collection(db, "blogPosts"));
  const paths = snapshot.docs.map((doc) => ({
    params: { slug: doc.id },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const docRef = doc(db, "blogPosts", params.slug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {
      notFound: true,
    };
  }

  const data = docSnap.data();

  // ✅ On ne garde que les champs sérialisables
  const post = {
    slug: params.slug,
    title: data.title || "",
    content: data.content || "",
    imageUrl: data.imageUrl || null,
    excerpt: data.excerpt || "",
    date: data.date || data.createdAt?.toDate().toLocaleDateString("fr-FR"),
    createdAt: data.createdAt?.toDate().toISOString() || null,
    author: data.author || "",
  };

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
}