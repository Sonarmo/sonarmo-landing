import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { updatePassword as firebaseUpdatePassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ProfilePage() {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        placeName: "",
        email: "",
        phone: "",
        address: "",
        ambianceDefault: "Lounge Chill 🌙",
    });
    const [collaboratorEmail, setCollaboratorEmail] = useState("");
    const [collaborators, setCollaborators] = useState([]);
    const [newPassword, setNewPassword] = useState("");
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                router.push("/login");
            } else {
                setUserId(user.uid);
                const docRef = doc(db, "profiles", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setForm({
                        placeName: data.placeName || "",
                        email: data.email || user.email,
                        phone: data.phone || "",
                        address: data.address || "",
                        ambianceDefault: data.ambianceDefault || "Lounge Chill 🌙",
                    });
                    setCollaborators(data.collaborators || []);
                } else {
                    setForm((prev) => ({ ...prev, email: user.email }));
                }
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) return;
        try {
            await setDoc(doc(db, "profiles", userId), {
                ...form,
                collaborators,
            });
            alert("Modifications enregistrées avec succès ✅");
        } catch (error) {
            console.error("Erreur de sauvegarde :", error);
            alert("Une erreur est survenue lors de l'enregistrement");
        }
    };

    const addCollaborator = () => {
        if (collaboratorEmail && !collaborators.includes(collaboratorEmail)) {
            setCollaborators([...collaborators, collaboratorEmail]);
            setCollaboratorEmail("");
        }
    };

    const removeCollaborator = (email) => {
        setCollaborators(collaborators.filter(c => c !== email));
    };

    const handlePasswordUpdate = async () => {
        const user = auth.currentUser;
        if (user && newPassword.length >= 6) {
            try {
                await firebaseUpdatePassword(user, newPassword);
                alert("Mot de passe mis à jour avec succès");
                setShowPasswordInput(false);
                setNewPassword("");
            } catch (err) {
                alert("Erreur lors de la mise à jour du mot de passe : " + err.message);
            }
        } else {
            alert("Le mot de passe doit contenir au moins 6 caractères");
        }
    };

    if (loading) {
        return <div className="text-white min-h-screen flex items-center justify-center">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#1c1c1c] text-gray-300 p-6 flex flex-col gap-8">
                <Link href="/dashboard" className="flex items-center gap-3 mb-8">
                    <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={140} height={40} />
                </Link>
                <nav className="flex flex-col gap-6 text-sm">
                    <Link href="/dashboard" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard" ? "text-white" : ""}`}>
                        <Image src="/icons/home.png" alt="Home" width={24} height={24} /> Dashboard
                    </Link>
                    <Link href="/dashboard/music" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/music" ? "text-white" : ""}`}>
                        <Image src="/icons/music.png" alt="Music" width={24} height={24} /> Musique
                    </Link>
                    <Link href="/dashboard/analytics" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/analytics" ? "text-white" : ""}`}>
                        <Image src="/icons/analytics.png" alt="Analytics" width={24} height={24} /> Analyses
                    </Link>
                    <Link href="/dashboard/settings" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/settings" ? "text-white" : ""}`}>
                        <Image src="/icons/settings.png" alt="Settings" width={24} height={24} /> Réglages
                    </Link>
                    <Link href="/dashboard/profile" className={`flex items-center gap-4 hover:text-white ${pathname === "/dashboard/profile" ? "text-white" : ""}`}>
                        <Image src="/icons/profile.png" alt="Profile" width={24} height={24} /> Profil
                    </Link>
                    <Link href="/logout" className="flex items-center gap-4 hover:text-white mt-8">
                        <Image src="/icons/logout.png" alt="Logout" width={24} height={24} /> Déconnexion
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 text-white">
                <h1 className="text-3xl font-bold mb-8">Profil du Lieu 👤</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm mb-1">Nom du lieu</label>
                        <input name="placeName" value={form.placeName} onChange={handleChange} className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input name="email" value={form.email} onChange={handleChange} className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Téléphone</label>
                        <input name="phone" value={form.phone} onChange={handleChange} className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Adresse</label>
                        <input name="address" value={form.address} onChange={handleChange} className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Ambiance par défaut</label>
                        <select name="ambianceDefault" value={form.ambianceDefault} onChange={handleChange} className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded">
                            <option value="Lounge Chill 🌙">Lounge Chill 🌙</option>
                            <option value="Apéro Festif 🍹">Apéro Festif 🍹</option>
                            <option value="Night Club 🔥">Night Club 🔥</option>
                            <option value="Café Cosy ☕">Café Cosy ☕</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-2">Ajouter un collaborateur</label>
                        <div className="flex gap-2 mb-2">
                            <input type="email" placeholder="email@exemple.com" value={collaboratorEmail} onChange={(e) => setCollaboratorEmail(e.target.value)} className="flex-1 bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
                            <button type="button" onClick={addCollaborator} className="bg-[#F28500] text-white px-4 py-2 rounded">Ajouter</button>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-1">
                            {collaborators.map((email, idx) => (
                                <li key={idx} className="flex justify-between items-center bg-[#1c1c1c] px-4 py-2 rounded">
                                    <span>{email}</span>
                                    <button type="button" onClick={() => removeCollaborator(email)} className="text-red-400 hover:text-red-600 text-xs">Supprimer</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                        <button type="submit" className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] text-white font-semibold px-6 py-2 rounded shadow-md">Enregistrer</button>
                        <button type="button" onClick={() => setShowPasswordInput(!showPasswordInput)} className="text-sm text-blue-400 hover:underline">Modifier le mot de passe</button>
                    </div>

                    {showPasswordInput && (
                        <div className="mt-4 space-y-2">
                            <label className="block text-sm mb-1">Nouveau mot de passe</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#1c1c1c] border border-gray-600 px-4 py-2 rounded" />
                            <button type="button" onClick={handlePasswordUpdate} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Confirmer</button>
                        </div>
                    )}
                </form>
            </main>
        </div>
    );
}