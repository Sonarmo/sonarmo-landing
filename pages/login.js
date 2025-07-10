import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import nookies from "nookies";
import Head from "next/head";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import LanguageSwitcher from "/components/builder/LanguageSwitcher";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "/components/layout/Footer";
import Header from "/components/layout/Header";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showResend, setShowResend] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!user.emailVerified) {
          setShowResend(true);
          return;
        }

        const token = await user.getIdToken();
        nookies.set(undefined, "token", token, {
          maxAge: 60 * 60 * 24,
          path: "/",
        });
        router.push("/generateur");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("pendingVerification")) {
      alert("📩 Un e-mail de vérification vous a été envoyé. Veuillez confirmer votre adresse.");
      localStorage.removeItem("pendingVerification");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setShowResend(true);
        return;
      }

      const token = await user.getIdToken();
      nookies.set(undefined, "token", token, {
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      router.push("/generateur");
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    }
  };

  const resendVerificationEmail = async () => {
  if (auth.currentUser) {
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("📩 E-mail de vérification renvoyé avec succès !", {
        position: "top-center",
        autoClose: 6000,
        style: {
          fontSize: "1.1rem",
          fontWeight: "500",
          padding: "14px 18px",
          borderRadius: "12px",
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          border: "1px solid #F28500",
        },
      });
    } catch (err) {
      console.error("Erreur renvoi vérification :", err);
      toast.error("❌ Une erreur est survenue lors de l&apos;envoi de l&apos;e-mail.", {
        position: "top-center",
        autoClose: 6000,
        style: {
          fontSize: "1.1rem",
          fontWeight: "500",
          padding: "14px 18px",
          borderRadius: "12px",
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          border: "1px solid #FF0033",
        },
      });
    }
  }
};

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      nookies.set(undefined, "token", token, {
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      const db = getFirestore();
      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: result.user.email || "",
          role: "particulier",
          credits: 2,
          createdAt: new Date(),
        });
      }

      const updatedSnap = await getDoc(userRef);
      const role = updatedSnap.data()?.role || "particulier";

      if (role === "pro") {
        router.push("/dashboard");
      } else {
        window.location.href = "/generateur"; // force un vrai reload
      }
    } catch (err) {
      console.error("Erreur connexion Google :", err);
      setError("Échec de la connexion avec Google.");
    }
  };

  return (
    <>
      <Head>
        <title>Sonarmo - Se connecter</title>
        <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
      </Head>
      <main className="overflow-x-hidden bg-black text-white min-h-screen flex flex-col">
       <ToastContainer />
        <Header />

        <section className="relative px-4 py-8 flex-1 flex justify-center items-center w-full">
          <div className="absolute inset-0 z-0">
            <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-60" />
            <div className="absolute w-[300px] h-[300px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-50" />
          </div>
          <div className="relative z-6 flex flex-col items-center w-full max-w-md px-4">
            <div className="relative w-[350px] h-[194px] mb-4">
              <Image src="/Logo-app-header.png" alt="Sonarmo Logo" fill className="object-contain" priority />
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full text-left">
              <label className="text-sm">Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1" />
              </label>
              <label className="text-sm">Mot de passe
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1" />
              </label>
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {showResend && (
                <button
                  type="button"
                  onClick={resendVerificationEmail}
                  className="text-sm text-pink-400 hover:text-white underline"
                >
                  Renvoyer l&apos;e-mail de vérification
                </button>
              )}

              <button type="submit" className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-6 py-2 rounded text-white font-semibold">Se connecter</button>
              <button type="button" onClick={() => router.push("/register")} className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-6 py-2 rounded text-white font-semibold">Créer un compte</button>
              <div className="relative my-4 text-center">
                <span className="text-gray-400 text-sm">ou</span>
              </div>
              <button type="button" onClick={signInWithGoogle} className="bg-white text-black px-6 py-2 rounded font-semibold flex items-center justify-center gap-2 shadow">
                <Image src="/icons/google.png" alt="Google" width={60} height={60} />
                Se connecter avec Google
              </button>
              <div className="text-sm text-gray-400 flex flex-col gap-1 mt-2">
                <Link href="/forgot-password" className="hover:text-white">Mot de passe oublié ?</Link>
              </div>
            </form>
          </div>
        </section>
<Footer />
            </main>
        </>
    );
}
