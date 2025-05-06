import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            await auth.signOut();
            router.push("/login");
        };

        logout();
    }, [router]);

    return (
        <main className="bg-[#121212] text-white min-h-screen flex items-center justify-center font-[Poppins]">
            <p className="text-xl">Déconnexion en cours...</p>
        </main>
    );
}
