'use client'

import { useEffect, useState } from 'react'

/**
 * Page de diagnostic pour tester la connexion Supabase
 * et identifier les erreurs de création de produit
 */
export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<any>({
    loading: true,
    tables: [],
    bucket: null,
    testProduct: null,
    error: null,
  })

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    try {
      setDiagnostics(prev => ({ ...prev, loading: true }))
      
      // Test 1: Vérifier les tables
      console.log('[TEST 1] Vérification des tables...')
      const tablesRes = await fetch('/api/admin/products')
      const tablesData = await tablesRes.json()
      
      if (!tablesRes.ok) {
        throw new Error(`Tables inaccessible: ${tablesData.error}`)
      }
      
      console.log('[SUCCESS] Tables accessibles, produits:', tablesData.products?.length || 0)
      
      setDiagnostics(prev => ({
        ...prev,
        loading: false,
        tables: tablesData.products || [],
      }))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('[DIAGNOSTIC ERROR]', errorMsg)
      setDiagnostics(prev => ({
        ...prev,
        loading: false,
        error: errorMsg,
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Diagnostic Supabase</h1>
        
        {diagnostics.error && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-red-800">❌ Erreur Trouvée</h2>
            <p className="text-red-700 mt-2 font-mono">{diagnostics.error}</p>
            
            <div className="mt-4 p-4 bg-red-100 rounded text-sm text-red-900">
              <strong>Solution:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Allez dans <a href="https://app.supabase.com" className="underline">Supabase Console</a></li>
                <li>Sélectionnez votre projet</li>
                <li>Allez dans <strong>SQL Editor</strong></li>
                <li>Copiez le contenu de <code className="bg-red-200 px-1">supabase-schema.sql</code></li>
                <li>Collez dans l'éditeur SQL et cliquez <strong>Run</strong></li>
                <li>Créez le bucket <code className="bg-red-200 px-1">product-images</code> en tant que Private</li>
                <li>Revenez ici et rafraîchissez</li>
              </ol>
            </div>
          </div>
        )}
        
        {!diagnostics.error && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-green-800">✅ Configuration OK</h2>
            <p className="text-green-700 mt-2">
              Supabase est connecté et les tables sont accessibles.
            </p>
            <div className="mt-4">
              <p className="font-semibold">📊 Produits actuels: <span className="text-xl">{diagnostics.tables.length}</span></p>
              {diagnostics.tables.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {diagnostics.tables.map((p: any) => (
                    <li key={p.id} className="text-sm p-2 bg-green-100 rounded">
                      <strong>{p.name}</strong> - {p.category} - ${p.price}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">📋 Étapes de Configuration</h2>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">1</span>
              <div>
                <p className="font-semibold">Créer les tables Supabase</p>
                <p className="text-gray-600 text-sm">Exécutez le schéma SQL dans Supabase Console</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">2</span>
              <div>
                <p className="font-semibold">Créer le bucket de stockage</p>
                <p className="text-gray-600 text-sm">Nommez-le <code className="bg-gray-200 px-1">product-images</code> et définissez-le comme Private</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">3</span>
              <div>
                <p className="font-semibold">Tester la création</p>
                <p className="text-gray-600 text-sm">Allez à <code className="bg-gray-200 px-1">/admin/products/new</code> et créez un produit</p>
              </div>
            </li>
          </ol>
        </div>
        
        <div className="mt-8 flex gap-4">
          <button
            onClick={runDiagnostics}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            🔄 Actualiser le diagnostic
          </button>
          <a
            href="/admin/products/new"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            ➕ Créer un produit
          </a>
        </div>
      </div>
    </div>
  )
}
