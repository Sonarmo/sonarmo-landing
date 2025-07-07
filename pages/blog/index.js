import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "/lib/firebase"; // 🔁 Assure-toi que le chemin est bon

export default function BlogHome({ posts }) {
  return (
    <div className="min-h-screen bg-black text-white font-[Poppins]">
      <Head>
        <title>Blog Sonarmo | Musique, Ambiance & IA</title>
        <meta name="description" content="Explorez nos articles autour de l'ambiance musicale, des lieux inspirants et de l'intelligence atmosphérique." />
      </Head>

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
          <span className="text-white text-lg font-semibold italic">Sonarmo</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
          <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
          <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
          <Link href="/login" className="hover:text-gray-300 flex items-center gap-1">
            <Image src="/sonarmo-experience.png" alt="Mini Logo" width={20} height={20} />
            SE CONNECTER
          </Link>
        </nav>
      </header>

      {/* Blog */}
      <main className="px-6 py-10">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#F28500] to-[#FF00FF]">
          Le Blog Sonarmo
        </h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-[#1c1c1c] rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-700 hover:border-[#F28500]"
              >
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

      {/* Footer */}
      <footer className="bg-black text-sm text-gray-400 px-6 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 items-center text-center sm:text-left">
            <div className="flex flex-col gap-2">
              <div className="flex justify-center sm:justify-start gap-4">
                <a href="https://www.instagram.com/sonarmo_ia/?hl=fr" target="_blank" rel="noopener noreferrer">
                  <Image src="/icons/instagram.png" alt="Instagram" width={24} height={24} />
                </a>
                <a href="https://www.linkedin.com/company/sonarmo/" target="_blank" rel="noopener noreferrer">
                  <Image src="/icons/linkedin.png" alt="LinkedIn" width={24} height={24} />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61574580608705" target="_blank" rel="noopener noreferrer">
                  <Image src="/icons/facebook.png" alt="Facebook" width={24} height={24} />
                </a>
              </div>
              <Link href="/sonarmo-team" className="hover:text-white">Sonarmo Team</Link>
              <Link href="/about" className="hover:text-white">À propos de nous</Link>
              <Link href="/contact" className="hover:text-white">Nous contacter</Link>
            </div>
            <div className="mt-5 sm:mt-0 sm:ml-3 flex justify-center sm:justify-start">
              <Image src="/icons/Logo_FT.png" alt="Logo French Tech Est" width={80} height={80} className="opacity-90" />
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2">
            <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
            <p className="text-xs">Sonarmo™</p>
            <Link href="/cgu" className="text-sm hover:underline">Conditions d&apos;utilisation &amp; Politique de confidentialité</Link>
            <Link href="/mentions-legales" className="text-sm hover:underline">Mentions légales</Link>
            <Link href="/conditions-vente" className="text-sm hover:underline">Conditions de vente</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const snapshot = await getDocs(collection(db, "blogPosts"));

  const posts = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      slug: doc.id,
      title: data.title || "Sans titre",
      date: data.date || "",
      excerpt: data.content?.slice(0, 150).replace(/\n/g, " ") || "",
    };
  });

  return {
    props: {
      posts,
    },
    revalidate: 60, // Mise à jour automatique
  };
}