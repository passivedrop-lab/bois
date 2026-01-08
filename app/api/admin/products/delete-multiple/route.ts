import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

const BUCKET = process.env.SUPABASE_PRODUCT_BUCKET || 'product-images'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const ids: string[] = body.ids || []
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids requis' }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get image paths
    const { data: rows, error: selErr } = await supabase.from('products').select('id, image_path').in('id', ids)
    if (selErr) return NextResponse.json({ error: 'Erreur lecture produits' }, { status: 500 })

    const imagePaths = (rows || []).map((r: any) => r.image_path).filter(Boolean)

    // Delete files from storage
    try {
      if (imagePaths.length > 0) {
        await supabase.storage.from(BUCKET).remove(imagePaths)
      }
    } catch (e) {
      console.warn('Erreur suppression fichiers storage (ignoring):', e)
    }

    // Delete product rows
    const { error } = await supabase.from('products').delete().in('id', ids)
    if (error) return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })

    return NextResponse.json({ success: true, deleted: ids.length, message: `${ids.length} produits supprimés` })
  } catch (err) {
    console.error('POST /api/admin/products/delete-multiple error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
