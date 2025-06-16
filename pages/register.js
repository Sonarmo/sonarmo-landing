import { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import nookies from "nookies";
import Link from "next/link";
import Image from "next/image";

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
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Envoi de l'email de vérification
      await sendEmailVerification(user);

      // Création du document utilisateur
      await setDoc(doc(db, "users", user.uid), {
        email,
        role: "particulier",
        credits: 1,
        createdAt: new Date(),
      }, { merge: true });

      // Déconnexion immédiate
      await auth.signOut();

      // Message et redirection
      alert("Un email de vérification a été envoyé. Veuillez confirmer votre adresse avant de vous connecter.");
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'inscription.");
    }
  };

  return (
    <main className="overflow-x-hidden bg-black text-white min-h-screen flex flex-col relative">
      {/* Fond visuel */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-60" />
        <div className="absolute w-[300px] h-[300px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-50" />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 z-10 relative">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
          <span className="text-white text-lg font-semibold italic">Sonarmo</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <Link href="/explique-generation" className="hover:text-gray-300">GENERATEUR DE PLAYLIST</Link>
          <Link href="/experience" className="hover:text-gray-300">SONARMO PRO</Link>
          <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
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
          <h1 className="text-2xl font-bold mb-4">Créer un compte Sonarmo</h1>
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
              placeholder="Mot de passe (min. 8 caractères)"
              required
              className="px-4 py-2 rounded bg-white text-black"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez le mot de passe"
              required
              className="px-4 py-2 rounded bg-white text-black"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 rounded text-white">
              S&apos;inscrire
            </button>
            <p className="text-sm text-gray-400 text-center">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-orange-400 hover:underline">Se connecter</Link>
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-sm text-gray-400 border-t border-gray-700 px-6 py-10 w-full z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col gap-2 mb-6 md:mb-0">
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/sonarmo_music/?hl=fr" target="_blank" rel="noopener noreferrer">
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
            <Link href="/about" className="hover:text-white">À propos de nous</Link>
            <Link href="/contact" className="hover:text-white">Nous contacter</Link>
          </div>
          <div className="flex flex-col items-end text-right gap-2">
            <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
            <p className="text-xs">&copy;2025 Sonarmo Team. Tous droits réservés</p>
            <p className="text-xs">Conditions d&apos;utilisation &amp; Politique de confidentialité</p>
          </div>
        </div>
      </footer>
    </main>
  );
}