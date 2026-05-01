'use client'

import { useState } from 'react'
import { useFinaryStore } from '@/lib/store'

export function useAI() {
  const [loading, setLoading] = useState(false)

  const sendMessage = async (messages: any[], financialContext: any, onChunk: (chunk: string) => void) => {
    setLoading(true)
    try {
      const { settings } = useFinaryStore.getState()
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages, 
          financialContext,
          apiKey: settings?.openrouterKey 
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || `Failed to send message (${response.status})`)
      }

      const reader = response.body?.getReader()
      if (!reader) return

      const decoder = new TextDecoder()
      let done = false
      let buffer = ''

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          const chunkValue = decoder.decode(value, { stream: !doneReading })
          buffer += chunkValue
          
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''
          
          for (const line of lines) {
            if (line.trim() === '') continue
            const message = line.replace(/^data: /, '')
            if (message === '[DONE]') break
            try {
              const parsed = JSON.parse(message)
              const content = parsed.choices[0]?.delta?.content || ''
              if (content) onChunk(content)
            } catch (e) {
              // Not JSON or partial JSON
            }
          }
        }
      }
    } catch (error: any) {
      console.error('AI Hook Error:', error)
      const { addToast } = useFinaryStore.getState()
      addToast(error.message || 'AI request failed', 'error')
      throw error // Re-throw to allow component-level handling
    } finally {
      setLoading(false)
    }
  }

  return { sendMessage, loading }
}
