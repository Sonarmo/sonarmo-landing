export function MainPlaylistBadge({ lastUpdated, spotifyUrl }) {
    return (
        <div className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] p-4 rounded-xl border border-gray-700 shadow-xl text-white flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded uppercase">Playlist principale</span>
                <span className="text-sm text-gray-300">mise à jour automatiquement</span>
            </div>
            {lastUpdated && (
                <p className="text-xs text-gray-400">Dernière mise à jour : {new Date(lastUpdated).toLocaleString()}</p>
            )}
            {spotifyUrl && (
                <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline text-green-400">
                    Voir la playlist sur Spotify
                </a>
            )}
        </div>
    );
}
