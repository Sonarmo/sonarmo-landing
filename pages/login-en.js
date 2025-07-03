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
        router.push("/generateur-en");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("pendingVerification")) {
      alert("📩 A verification email has been sent to you. Please confirm your address.");
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
      router.push("/generateur-en");
    } catch (err) {
      setError("Incorrect email or password.");
    }
  };

  const resendVerificationEmail = async () => {
  if (auth.currentUser) {
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("📩 Verification email has been resent successfully!", {
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
      console.error("Error resending verification:", err);
      toast.error("❌ An error occurred while sending the verification email.", {
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
        window.location.href = "/generateur-en";
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Failed to sign in with Google.");
    }
  };

    return (
        <>
            <Head>
                <title>Sonarmo - Login</title>
                <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
            </Head>
            <main className="overflow-x-hidden bg-black text-white min-h-screen flex flex-col">
                <ToastContainer />
                <header className="flex justify-between items-center px-6 py-4">
                    <Link href="/index-en" className="flex items-center gap-2">
                        <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
                        <span className="text-white text-lg font-semibold italic">Sonarmo</span>
                    </Link>
                    <nav className="hidden md:flex gap-6 text-sm items-center">
                        <Link href="/explique-generation-en" className="hover:text-gray-300">PLAYLIST GENERATOR</Link>
                        <Link href="/experience-en" className="hover:text-gray-300">SONARMO PRO</Link>
                        <Link href="/contact-en" className="hover:text-gray-300">CONTACT US</Link>
                        <LanguageSwitcher />
                    </nav>
                </header>

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
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1" /></label>
                            <label className="text-sm">Password
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1" /></label>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-6 py-2 rounded text-white font-semibold">Login</button>
                            <button type="button" onClick={() => router.push("/register-en")} className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-6 py-2 rounded text-white font-semibold">Create an account</button>
                            <div className="relative my-4 text-center">
                                <span className="text-gray-400 text-sm">ou</span>
                            </div>
                            <button type="button" onClick={signInWithGoogle} className="bg-white text-black px-6 py-2 rounded font-semibold flex items-center justify-center gap-2 shadow">
                                <Image src="/icons/google.png" alt="Google" width={60} height={60} />
                                Login with Google
                            </button>
                            <div className="text-sm text-gray-400 flex flex-col gap-1 mt-2">
                                <Link href="/forgot-password-en" className="hover:text-white">Forgot your password?</Link>
                            </div>
                        </form>
                    </div>
                </section>

                <footer className="bg-black text-sm text-gray-400 px-6 py-10 w-full mt-20 relative z-10">
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-8 w-full">

    {/* Bloc gauche + logo FT (responsive alignement) */}
    <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 items-center text-center sm:text-left">

      {/* Réseaux + Liens */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-center sm:justify-start gap-4">
          <a href="https://www.instagram.com/sonarmo_ia/?hl=fr" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/instagram.png" alt="Instagram" width={24} height={24} className="hover:opacity-70 transition" />
          </a>
          <a href="https://www.linkedin.com/company/sonarmo/" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/linkedin.png" alt="LinkedIn" width={24} height={24} className="hover:opacity-70 transition" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61574580608705" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/facebook.png" alt="Facebook" width={24} height={24} className="hover:opacity-70 transition" />
          </a>
        </div>
        <Link href="/sonarmo-team" className="hover:text-white">Sonarmo Team</Link>
        <Link href="/about-en" className="hover:text-white">About us</Link>
        <Link href="/contact-en" className="hover:text-white">Contact us</Link>
      </div>

      {/* Logo French Tech Est */}
      <div className="mt-4 sm:mt-0 sm:ml-3 flex justify-center sm:justify-start">
        <Image
          src="/icons/Logo_FT.png"
          alt="French Tech Est Logo"
          width={80}
          height={80}
          className="opacity-90"
        />
      </div>

    </div>

    {/* Bloc droit : Logo Sonarmo + Mentions */}
    <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2">
      <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
      <p className="text-xs">Sonarmo™</p>
      <p className="text-xs hover:underline">Terms &amp; Conditions of Use &amp; Privacy Policy</p>
    </div>
  </div>
</footer>
            </main>
        </>
    );
}
