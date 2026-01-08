import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

const BUCKET = process.env.SUPABASE_PRODUCT_BUCKET || 'product-images'

// Security: require ALLOW_DELETE_ALL=true and an admin token in header 'x-admin-delete-token'
export async function POST(request: NextRequest) {
  try {
    if (process.env.ALLOW_DELETE_ALL !== 'true') {
      return NextResponse.json({ error: 'Deletion disabled' }, { status: 403 })
    }

    const token = request.headers.get('x-admin-delete-token')
    const expected = process.env.ADMIN_DELETE_TOKEN
    if (!expected || token !== expected) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
    }

    const supabase = await createServerClient()

    // Try to delete all files in storage bucket used for products
    try {
      const { data: files } = await supabase.storage.from(BUCKET).list('', { limit: 1000 })
      if (files && files.length > 0) {
        const paths = files.map((f: any) => f.name)
        await supabase.storage.from(BUCKET).remove(paths)
      }
    } catch (e) {
      console.warn('Erreur suppression fichiers storage (ignoring):', e)
    }

    // Delete all rows in products table
    const { error } = await supabase.from('products').delete().neq('id', '')
    if (error) return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })

    return NextResponse.json({ success: true, message: 'Tous les produits ont été supprimés' })
  } catch (err) {
    console.error('POST /api/admin/products/delete-all error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
