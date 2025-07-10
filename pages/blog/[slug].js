import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { db } from "/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useState } from "react";
import Footer from "/components/layout/Footer";
import Header from "/components/layout/Header";

export default function BlogPost({ post }) {
  const router = useRouter();
 

  if (router.isFallback) {
    return <div className="text-white p-10">Chargement...</div>;
  }

  return (
    <>
    <Header />
    <div className="min-h-screen bg-black text-white font-[Poppins]">
      
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

       <ReactMarkdown
  components={{
    h1: ({ node, ...props }) => (
      <h1 className="text-3xl font-bold mt-10 mb-4 text-white" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-2xl font-bold mt-8 mb-3 text-white" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-xl font-semibold mt-6 mb-2 text-white" {...props} />
    ),
    p: ({ node, ...props }) => (
      <p className="mb-6 leading-relaxed" {...props} />
    ),
    li: ({ node, ...props }) => (
      <li className="mb-3 ml-4 list-disc" {...props} />
    ),
  }}
>
  {post.content}
</ReactMarkdown>
      </main>
    </div>
<Footer />
    </>
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