// pages/admin/users.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function AdminUsers() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user || user.email !== "arthur.fromont@sonarmo.com") {
                router.push("/");
                return;
            }

            try {
                const usersSnap = await getDocs(collection(db, "users"));
                const usersData = usersSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersData);
                setLoading(false);
            } catch (err) {
                console.error("Erreur de chargement des utilisateurs:", err);
            }
        });

        return () => unsubscribe();
    }, [router]);

    const updateUser = async (userId, newData) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, newData);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...newData } : u));
        } catch (err) {
            console.error("Erreur mise à jour utilisateur:", err);
        }
    };

    if (loading) {
        return <div className="text-white min-h-screen flex justify-center items-center">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white">
            <header className="bg-[#1c1c1c] px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h1 className="text-xl font-bold">Utilisateurs Sonarmo</h1>
                <Link href="/admin" className="text-sm hover:underline">Retour au dashboard</Link>
            </header>

            <main className="p-6 space-y-10">
                <section>
                    <div className="space-y-4">
                        {users.map(user => (
                            <div key={user.id} className="bg-[#1f1f1f] border border-gray-600 p-4 rounded">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-lg">{user.email || "Email inconnu"}</p>
                                        <p className="text-sm text-gray-400">Crédits : {user.credits ?? 0}</p>
                                        <p className="text-sm text-gray-400">Abonnement : {user.abonnementActif ? "✅ Actif" : "❌ Inactif"}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => updateUser(user.id, { credits: (user.credits ?? 0) + 1 })}
                                            className="text-xs bg-green-500 px-3 py-1 rounded hover:opacity-80">
                                            +1 Crédit
                                        </button>
                                        <button
                                            onClick={() => updateUser(user.id, { abonnementActif: !user.abonnementActif })}
                                            className="text-xs bg-blue-500 px-3 py-1 rounded hover:opacity-80">
                                            {user.abonnementActif ? "Désactiver Abonnement" : "Activer Abonnement"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}