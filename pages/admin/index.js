// pages/admin/index.js

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user || user.email !== "arthur.fromont@sonarmo.com") {
                router.push("/");
                return;
            }

            try {
                const snapshot = await getDocs(collection(db, "profiles"));
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProfiles(data);
                setLoading(false);
            } catch (err) {
                console.error("Erreur de chargement des profils :", err);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return <div className="text-white min-h-screen flex justify-center items-center">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white">
            <header className="bg-[#1c1c1c] px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h1 className="text-xl font-bold">Sonarmo Admin</h1>
                <Link href="/" className="text-sm hover:underline">Retour au site</Link>
            </header>

            <main className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Profils clients</h2>
                <div className="space-y-4">
                    {profiles.map(profile => (
                        <div key={profile.id} className="bg-[#1f1f1f] border border-gray-600 p-4 rounded">
                            <p className="text-lg font-semibold">{profile.placeName || "Nom inconnu"}</p>
                            <p className="text-sm text-gray-400">{profile.email}</p>
                            <Link href={`/admin/${profile.id}`}>
                                <button className="mt-2 bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-4 py-1 rounded text-white text-sm">
                                    Voir / Modifier
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
