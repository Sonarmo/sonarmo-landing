import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../../lib/firebase";

export default function Profile() {
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
            <h1 className="text-3xl font-bold mb-6">👤 Profil</h1>
            <p>Gère ton compte et les informations liées à ton lieu.</p>
        </main>
    );
}
