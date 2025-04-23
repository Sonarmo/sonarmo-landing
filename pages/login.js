import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Connexion réussie");
            // Redirection possible ici vers le dashboard par exemple
        } catch (err) {
            setError("Email ou mot de passe incorrect.");
        }
    };

    return (
        <main className="bg-[#121212] text-white font-[Poppins] min-h-screen flex flex-col">
            {/* HEADER */}
            <header className="flex justify-between items-center px-6 py-4">
                <Link href="/">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <Image src="/Logo-app-header.png" alt="Logo" width={140} height={30} />
                    </div>
                </Link>
                <nav className="hidden md:flex gap-6 text-sm items-center">
                    <Link href="/experience" className="hover:text-gray-300">L’EXPÉRIENCE SONARMO</Link>
                    <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
                </nav>
            </header>

            {/* LOGIN FORM */}
            <section className="relative px-4 py-20 flex-1 flex justify-center items-center w-full">
                <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-gradient-to-br from-[#F28500] to-[#FF00FF] rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3 z-0" />
                <div className="relative z-10 flex flex-col items-center w-full max-w-md px-4">
                    <div className="relative w-[220px] h-[100px] mb-8">
                        <Image
                            src="/Logo-app-header.png"
                            alt="Sonarmo Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full text-left">
                        <label className="text-sm">Email
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1" /></label>
                        <label className="text-sm">Mot de passe
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1" /></label>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-6 py-2 rounded text-white font-semibold">Se connecter</button>
                        <div className="text-sm text-gray-400 flex flex-col gap-1 mt-2">
                            <Link href="#" className="hover:text-white">Mot de passe oublié ?</Link>
                        </div>
                    </form>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#121212] text-sm text-gray-400 border-t border-gray-700 px-6 py-10 w-full">
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
                        <p>Sonarmo Team</p>
                        <Link href="/" className="hover:text-white">A propos de nous</Link>
                        <Link href="/contact" className="hover:text-white">Nous contacter</Link>
                    </div>
                    <div className="flex flex-col items-end text-right gap-2">
                        <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
                        <p className="text-xs">&copy;2025 Sonarmo Team. All Rights Reserved</p>
                        <p className="text-xs">Terms of Use &amp; Privacy Policy</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
