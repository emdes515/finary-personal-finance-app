import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages, financialContext, apiKey: customApiKey } = await req.json()
    const apiKey = customApiKey || process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API Key not configured. Please add it in Settings.' }, { status: 401 })
    }

    const systemPrompt = `You are Finary, a personal finance AI assistant.
User's financial data:
${JSON.stringify(financialContext, null, 2)}

Give specific, actionable advice based on THEIR real data.
Be conversational, warm, and encouraging. Use emojis sparingly.
Keep responses under 150 words unless analysis is requested.
If they ask about specific transactions or patterns, analyze the data provided.
Current date: ${new Date().toISOString().split('T')[0]}`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://finary.vercel.app',
        'X-Title': 'Finary AI',
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json({ error: errorData.error?.message || `OpenRouter API Error: ${response.status}` }, { status: response.status })
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('AI Route Error:', error)
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 })
  }
}
