export const prerender = false

import type { APIRoute } from 'astro'
import Anthropic from '@anthropic-ai/sdk'

export const POST: APIRoute = async ({ request }) => {
  const { prompt } = (await request.json()) as { prompt: string }
  const apiKey = import.meta.env.ANTHROPIC_API_KEY
  const anthropic = new Anthropic({ apiKey })
  const msg = await anthropic.messages.create({
    max_tokens: 8192,
    messages: [
      {
        content: [
          {
            text: prompt,
            type: 'text',
          },
        ],
        role: 'user',
      },
    ],
    model: 'claude-3-5-haiku-20241022',
    system:
      'You are a video-game narrator in a horror world. You will be provided a set of data which describes an "encounter". You are to write a single paragraph setting the scene and describing what happens/the player sees.',
    temperature: 0,
  })

  return new Response(
    JSON.stringify({
      text: msg.content[0].text,
    })
  )
}
