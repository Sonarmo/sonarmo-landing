import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../../lib/firebase";

export default function Analytics() {
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
            <h1 className="text-3xl font-bold mb-6">📈 Analyses</h1>
            <p>Visualise l&apos;impact de ta musique sur l&apos;ambiance de ton lieu.</p>
        </main>
    );
}
