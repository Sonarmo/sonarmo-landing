// pages/admin/index.js

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user || user.email !== "arthur.fromont@sonarmo.com") {
                router.push("/");
                return;
            }

            try {
                const profilesSnap = await getDocs(collection(db, "profiles"));
                const profilesData = profilesSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProfiles(profilesData);

                const usersSnap = await getDocs(collection(db, "users"));
                const usersData = usersSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersData);

                setLoading(false);
            } catch (err) {
                console.error("Erreur de chargement des données :", err);
            }
        });

        return () => unsubscribe();
    }, [router]);

    const toggleGenerative = async (profileId, currentValue) => {
        try {
            const profileRef = doc(db, "profiles", profileId);
            await updateDoc(profileRef, {
                "mainPlaylist.isGenerative": !currentValue
            });
            setProfiles(prev => prev.map(p =>
                p.id === profileId ? {
                    ...p,
                    mainPlaylist: {
                        ...p.mainPlaylist,
                        isGenerative: !currentValue
                    }
                } : p
            ));
        } catch (err) {
            console.error("Erreur lors du changement de statut génératif:", err);
        }
    };

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
                <h1 className="text-xl font-bold">Sonarmo Admin</h1>
                <Link href="/" className="text-sm hover:underline">Retour au site</Link>
            </header>

            <main className="p-6 space-y-16">
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Profils clients (Playlists)</h2>
                    <div className="space-y-4">
                        {profiles.map(profile => (
                            <div key={profile.id} className="bg-[#1f1f1f] border border-gray-600 p-4 rounded">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-lg font-semibold">{profile.placeName || "Nom inconnu"}</p>
                                        <p className="text-sm text-gray-400">{profile.email}</p>
                                        {profile.mainPlaylist?.id && (
                                            <p className="text-sm mt-1">
                                                🎵 <a href={`https://open.spotify.com/playlist/${profile.mainPlaylist.id}`} target="_blank" rel="noreferrer" className="text-green-400 underline">Voir la playlist</a>
                                            </p>
                                        )}
                                        {profile.mainPlaylist?.lastUpdated && (
                                            <p className="text-xs text-gray-500 mt-1">Dernière mise à jour : {new Date(profile.mainPlaylist.lastUpdated).toLocaleString()}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-sm px-2 py-1 rounded ${profile.mainPlaylist?.isGenerative ? "bg-green-600" : "bg-gray-600"}`}>
                                            Génération : {profile.mainPlaylist?.isGenerative ? "Activée" : "Désactivée"}
                                        </span>
                                        <button
                                            onClick={() => toggleGenerative(profile.id, profile.mainPlaylist?.isGenerative)}
                                            className="text-xs px-3 py-1 bg-gradient-to-r from-[#F28500] to-[#FF00FF] rounded hover:opacity-90">
                                            {profile.mainPlaylist?.isGenerative ? "Désactiver" : "Activer"}
                                        </button>
                                        <Link href={`/admin/${profile.id}`}>
                                            <button className="text-xs bg-white text-black px-3 py-1 rounded hover:opacity-80">
                                                Voir / Modifier
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-6">Utilisateurs Sonarmo (Abonnement & crédits)</h2>
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