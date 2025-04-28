import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../../lib/firebase";

export default function Settings() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [router]);

    return (
        <main className="bg-[#121212] text-white min-h-screen p-10">
            <h1 className="text-3xl font-bold mb-6">⚙️ Réglages</h1>
            <p>Configure les paramètres de ton ambiance musicale.</p>
        </main>
    );
}
