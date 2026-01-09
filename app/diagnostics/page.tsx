'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'

export default function DiagnosticsPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    setResults([])
    const logs: any[] = []

    const addLog = (name: string, status: 'success' | 'error' | 'info', message: any) => {
      logs.push({ name, status, message: typeof message === 'string' ? message : JSON.stringify(message, null, 2) })
      setResults([...logs])
    }

    // 1. Check Auth
    if (!user) {
      addLog('Auth Check', 'error', 'User not authenticated')
      setLoading(false)
      return
    }
    addLog('Auth Check', 'success', `Logged in as ${user.email} (${user.id})`)

    // 2. Check Profile exists
    addLog('Profile Fetch', 'info', 'Checking if profile exists in database...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      addLog('Profile Fetch', 'error', profileError)
    } else {
      addLog('Profile Fetch', 'success', profile)
    }

    // 3. Test Order Item Types (Dry run check)
    addLog('Schema Test', 'info', 'Testing order_items product_id type...')
    const testItemId = 'test-' + Date.now()
    const { error: insertError } = await supabase
      .from('order_items')
      .insert({
        order_id: 0, // Should probably fail foreign key if not handled, but we check the TYPE error first
        product_id: 'test-id-string',
        quantity: 1,
        price: 0
      })

    if (insertError) {
      // If code is 42804, it means type mismatch (integer vs text)
      // If code is 23503, it means foreign key violation (which is expected here since order_id 0 doesn't exist)
      addLog('Schema Test Result', insertError.code === '42804' ? 'error' : 'info', {
        code: insertError.code,
        message: insertError.message,
        hint: 'If code is 42804, product_id is still an INTEGER in the database.'
      })
    }

    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Diagnostics de Commande</h1>
      <button
        onClick={runDiagnostics}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Exécution...' : 'Lancer les diagnostics'}
      </button>

      <div className="mt-8 space-y-4">
        {results.map((res, i) => (
          <div key={i} className={`p-4 border rounded ${res.status === 'success' ? 'bg-green-50' : res.status === 'error' ? 'bg-red-50' : 'bg-blue-50'}`}>
            <h3 className="font-bold">{res.name}</h3>
            <pre className="text-sm mt-2 whitespace-pre-wrap">{res.message}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
