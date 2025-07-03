import { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import nookies from "nookies";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "/components/builder/LanguageSwitcher";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        email,
        role: "particulier",
        credits: 2,
        createdAt: new Date(),
      }, { merge: true });

      await auth.signOut();

      toast.success("📧 A verification email has been sent. Please check your inbox (and spam folder).", {
  position: "top-center",
  autoClose: 8000, // ⏱️ slightly longer duration (8s)
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {
    fontSize: "1.1rem", // ⬆️ larger text
    fontWeight: "500",
    padding: "16px 20px",
    borderRadius: "12px",
    backgroundColor: "#1a1a1a", // black background matching your theme
    color: "#ffffff", // white text
    border: "1px solid #C800FF"
  },
});
setTimeout(() => router.push("/login-en"), 8000);
    } catch (err) {
      console.error(err);
      setError("An error occurred during registration.");
    }
  };

  return (
    <main className="overflow-x-hidden bg-black text-white min-h-screen flex flex-col relative">
      <ToastContainer />
      {/* Fond visuel */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-60" />
        <div className="absolute w-[300px] h-[300px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-50" />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 z-10 relative">
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

      {/* Formulaire */}
      <section className="relative z-10 px-4 py-8 flex-1 flex justify-center items-center w-full">
        <div className="flex flex-col items-center w-full max-w-md px-4">
          <div className="relative w-[350px] h-[194px] mb-4">
            <Image
              src="/Logo-app-header.png"
              alt="Sonarmo Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold mb-4">Create a Sonarmo account</h1>
          <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="px-4 py-2 rounded bg-white text-black"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 8 characters)"
              required
              className="px-4 py-2 rounded bg-white text-black"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              className="px-4 py-2 rounded bg-white text-black"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 rounded text-white">
              Register
            </button>
            <p className="text-sm text-gray-400 text-center">
              Do you already have an account?{" "}
              <Link href="/login-en" className="text-orange-400 hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
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
  );
}