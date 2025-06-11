'use client'

import { useChat } from 'ai/react'

export default function IAComposer() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/playlist-chat'
  })

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <textarea
        className="w-full bg-[#1c1c1c] p-4 text-white rounded-xl"
        placeholder="Décris l’ambiance ou l’envie du moment…"
        value={input}
        onChange={handleInputChange}
      />
      <button className="mt-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl">
        Générer une playlist
      </button>

      <div className="mt-4">
        {messages.map(m => (
          <p key={m.id} className="text-sm text-gray-400">{m.role === 'user' ? '👤' : '🎵'} {m.content}</p>
        ))}
      </div>
    </form>
  )
}