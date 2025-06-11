import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      ...messages,
      {
        role: 'system',
        content: 'Tu es une IA musicale. Quand on te décrit une ambiance ou un public, tu proposes une playlist de 10 morceaux cohérents avec cette ambiance. Ensuite, tu expliques brièvement ton choix.'
      }
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}