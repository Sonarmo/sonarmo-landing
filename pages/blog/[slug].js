import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { db } from "/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import ReactMarkdown from "react-markdown";

export default function BlogPost({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="text-white p-10">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white font-[Poppins]">
      <Head>
        <title>{post?.title} | Sonarmo Blog</title>
        <meta
          name="description"
          content={post?.excerpt || post?.content?.slice(0, 150)}
        />
      </Head>

      <main className="max-w-3xl mx-auto px-6 py-12">
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

        <div className="prose prose-invert max-w-none text-white">
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

  // ✅ Convertir les objets non sérialisables comme Timestamp
  const post = {
    ...data,
    slug: params.slug,
    createdAt: data.createdAt?.toDate().toISOString() || null,
    date: data.date || data.createdAt?.toDate().toLocaleDateString("fr-FR"), // fallback affichable
  };

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
}