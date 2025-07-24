// pages/admin/index.js
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <header className="bg-[#1c1c1c] px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold">Sonarmo Admin</h1>
        <Link href="/" className="text-sm hover:underline">Retour au site</Link>
      </header>

      <main className="p-8 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        <AdminCard
          title="📓 Blog"
          href="/admin/blog"
          description="Créer et gérer les articles du blog musical."
        />
        <AdminCard
          title="👤 Utilisateurs"
          href="/admin/users"
          description="Gérer crédits & abonnements individuels."
        />
        <AdminCard
          title="🏢 Clients Pro"
          href="/admin/clients"
          description="Configurer les lieux & playlists principales."
        />
        <AdminCard
          title="📜 Historique"
          href="/admin/history"
          description="Consulter les playlists générées."
        />
        <AdminCard
          title="🎵 Artistes App"
          href="/admin/artists"
          description="Ajouter, modifier ou supprimer des artistes."
        />
      </main>
    </div>
  );
}

function AdminCard({ title, href, description }) {
  return (
    <Link href={href}>
      <div className="bg-[#1f1f1f] border border-gray-600 rounded-xl p-6 hover:border-[#F28500] transition cursor-pointer shadow-md">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </Link>
  );
}