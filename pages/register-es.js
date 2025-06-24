import { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import nookies from "nookies";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "/components/builder/LanguageSwitcher";

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
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
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
        credits: 2,
        createdAt: new Date(),
      }, { merge: true });

      // Déconnexion immédiate
      await auth.signOut();

      // Message et redirection
      alert("Se ha enviado un correo de verificación. Por favor, confirma tu dirección antes de iniciar sesión.");
      router.push("/login-es");
    } catch (err) {
      console.error(err);
      setError("Error al registrarse.");
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
        <Link href="/index-es" className="flex items-center gap-2">
          <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
          <span className="text-white text-lg font-semibold italic">Sonarmo</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <Link href="/explique-generation-es" className="hover:text-gray-300">PLAYLIST GENERADOR</Link>
          <Link href="/experience-es" className="hover:text-gray-300">SONARMO PRO</Link>
          <Link href="/contact-es" className="hover:text-gray-300">CONTÁCTANOS</Link>
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
          <h1 className="text-2xl font-bold mb-4">Crear una cuenta Sonarmo</h1>
          <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
              className="px-4 py-2 rounded bg-white text-black"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña (mín. 8 caracteres)"
              required
              className="px-4 py-2 rounded bg-white text-black"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              required
              className="px-4 py-2 rounded bg-white text-black"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 rounded text-white">
              Registrarse
            </button>
            <p className="text-sm text-gray-400 text-center">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login-es" className="text-orange-400 hover:underline">Inicia sesión</Link>
            </p>
          </form>
        </div>
      </section>

      <footer className="bg-black text-sm text-gray-400 px-6 py-10 mt-20 w-full relative z-10">
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-8 w-full">

    {/* Bloc gauche + logo FT (sur une ligne en desktop, stack en mobile) */}
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
        <Link href="/sonarmo-team" className="hover:text-white">Equipo Sonarmo</Link>
        <Link href="/about" className="hover:text-white">Sobre nosotros</Link>
        <Link href="/contact-es" className="hover:text-white">Contáctenos</Link>
      </div>

      {/* Logo French Tech Est */}
      <div className="mt-4 sm:mt-0 sm:ml-3 flex justify-center sm:justify-start">
        <Image
          src="/icons/Logo_FT.png"
          alt="Logo French Tech Est"
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
      <Link href="/cgu" className="text-sm hover:underline">Condiciones de uso y política de privacidad</Link>
      <Link href="/mentions-legales" className="text-sm hover:underline">Términos y Condiciones</Link>
      <Link href="/conditions-vente" className="text-sm hover:underline">Política de privacidad</Link>
    </div>
  </div>
</footer>
    </main>
  );
}