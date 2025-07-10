import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "/lib/firebase"; // 🔁 Assure-toi que le chemin est bon
import { useState } from "react";
import { Menu, X } from "lucide-react"; // ou Heroicons si tu préfères
import Footer from "/components/layout/Footer";

export default function BlogHome({ posts }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-black text-white font-[Poppins]">
      <Head>
        <title>Blog Sonarmo | Musique, Ambiance & IA</title>
        <meta name="description" content="Explorez nos articles autour de l'ambiance musicale, des lieux inspirants et de l'intelligence atmosphérique." />
      </Head>

      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-700">
  <div className="flex justify-between items-center">
    <Link href="/" className="flex items-center gap-2 cursor-pointer">
<Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
  <span className="text-white text-lg font-semibold italic">Sonarmo</span>
</Link>

    {/* Desktop menu */}
    <nav className="hidden md:flex gap-6 text-sm items-center">
      <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
      <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
      <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
      <Link href="/blog" className="hover:text-gray-300">BLOG</Link>
      <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
        <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
        SE CONNECTER
      </Link>
    </nav>

    {/* Mobile burger */}
    <button
      className="md:hidden text-white"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Toggle menu"
    >
      {menuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  </div>

  {/* Mobile dropdown */}
  {menuOpen && (
    <div className="md:hidden mt-4 space-y-3 text-sm">
      <Link href="/explique-generation" className="block text-white hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
      <Link href="/experience" className="block text-white hover:text-gray-300">SONARMO PRO</Link>
      <Link href="/contact" className="block text-white hover:text-gray-300">CONTACTEZ-NOUS</Link>
      <Link href="/blog" className="hover:text-gray-300">BLOG</Link>
      <Link href="/login" className="block text-white hover:text-gray-300 flex items-center gap-1">
        <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
        SE CONNECTER
      </Link>
    </div>
  )}
</header>

      {/* Blog */}
      <main className="px-6 py-10">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#F28500] via-[#A300FF] to-[#3400B3] leading-snug drop-shadow-[0_1px_2px_rgba(255,0,255,0.3)]">
  Le Blog Sonarmo
</h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
  {posts.map((post) => (
    <Link key={post.slug} href={`/blog/${post.slug}`}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="bg-[#1c1c1c] rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all border border-gray-700 hover:border-[#F28500]"
      >
        {post.imageUrl && (
          <div className="mb-4 w-full h-48 relative">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <h2 className="text-xl font-semibold mb-2 text-white">
          {post.title}
        </h2>
        <p className="text-gray-400 text-sm mb-1">{post.date}</p>
        <p className="text-gray-300 text-sm line-clamp-3">
          {post.excerpt}
        </p>
      </motion.div>
    </Link>
  ))}
</div>
      </main>

      <Footer />
    </div>
  );
}

export async function getServerSideProps() {
  const snapshot = await getDocs(collection(db, "blogPosts"));

  const posts = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      slug: doc.id,
      title: data.title || "Sans titre",
      date: data.date || "",
      excerpt: data.content?.slice(0, 150).replace(/\n/g, " ") || "",
      imageUrl: data.imageUrl || null, // ✅ on l'ajoute ici
    };
  });

  return {
    props: {
      posts,
    },
  };
}