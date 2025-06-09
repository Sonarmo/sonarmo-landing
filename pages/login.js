import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import nookies from "nookies"; // ← ajouté ici
import Head from "next/head";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // 🔐 Ajoute le token dans un cookie pour les API routes
                const token = await user.getIdToken();
                nookies.set(undefined, "token", token, {
                    maxAge: 60 * 60 * 24, // 1 jour
                    path: "/",
                });
                router.push("/dashboard"); // Rediriger automatiquement si déjà connecté
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 🔐 Récupère le token Firebase et le stocke en cookie
            const token = await user.getIdToken();
            nookies.set(undefined, "token", token, {
                maxAge: 60 * 60 * 24, // 1 jour
                path: "/",
            });

            console.log("Connexion réussie");
            router.push("/dashboard"); // Rediriger après connexion
        } catch (err) {
            setError("Email ou mot de passe incorrect.");
        }
    };

    return (
    <>
            <Head>
                <title>Sonarmo - Se connecter</title>
                <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
                {/* Google Analytics */}
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-PTGDLQ7W2N"></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-PTGDLQ7W2N');
      `,
                    }}
                />
            </Head>
        <main className="overflow-x-hidden bg-black text-white min-h-screen flex flex-col">
            {/* HEADER */}
            <header className="flex justify-between items-center px-6 py-4">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/sonarmo-experience.png" alt="Logo" width={32} height={32} />
                    <span className="text-white text-lg font-semibold italic">Sonarmo</span>
                </Link>
                <nav className="hidden md:flex gap-6 text-sm items-center">
                    <Link href="/experience" className="hover:text-gray-300">L’EXPÉRIENCE SONARMO</Link>
                    <Link href="/contact" className="hover:text-gray-300">CONTACTEZ-NOUS</Link>
                </nav>
            </header>

            {/* LOGIN FORM */}
            <section className="relative px-4 py-8 flex-1 flex justify-center items-center w-full">
                <div className="absolute inset-0 z-0">
                    <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-60" />
                    <div className="absolute w-[300px] h-[300px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-50" />
                </div>
                <div className="relative z-6 flex flex-col items-center w-full max-w-md px-4">
                    <div className="relative w-[350px] h-[194px] mb-4">
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
            <footer className="bg-black text-sm text-gray-400 border-t border-gray-700 px-6 py-10 w-full">
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
        </>
    );
}
