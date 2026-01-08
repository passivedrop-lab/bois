import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

const BUCKET = process.env.SUPABASE_PRODUCT_BUCKET || 'product-images'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: 'Erreur lecture produits' }, { status: 500 })

    // For private buckets, generate signed URLs for images
    const products = await Promise.all(
      (data || []).map(async (p: any) => {
        if (p.image_path) {
          try {
            const { data: urlData, error: urlError } = await supabase.storage
              .from(BUCKET)
              .createSignedUrl(p.image_path, 60 * 60) // 1 hour
            if (!urlError && urlData) p.image_url = urlData.signedURL
          } catch (e) {
            // ignore
          }
        }
        return p
      })
    )

    return NextResponse.json({ products })
  } catch (err) {
    console.error('GET /api/admin/products error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    const supabase = await createServerClient()

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData()
      const name = form.get('name') as string
      const category = form.get('category') as string
      const price = Number(form.get('price')) || 0
      const promoPrice = form.get('promoPrice') ? Number(form.get('promoPrice')) : null
      const description = form.get('description') as string
      const vedette = form.get('vedette') === 'true'
      const file = form.get('image') as File | null

      let image_path: string | null = null
      if (file && file.name) {
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
        const fileBuffer = Buffer.from(await file.arrayBuffer())
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(fileName, fileBuffer, { upsert: false })
        if (uploadError) throw uploadError
        image_path = fileName
      }

      const payload: any = {
        name,
        category,
        price,
        promo_price: promoPrice,
        description,
        image_path,
        vedette,
      }

      const { data: inserted, error: insertError } = await supabase.from('products').insert([payload]).select().single()
      if (insertError) throw insertError
      return NextResponse.json({ product: inserted })
    }

    // JSON fallback - support update (id present) or insert
    const body = await request.json()
    if (body.id && (body.vedette !== undefined || body.name || body.category)) {
      const updates: any = {}
      if (body.vedette !== undefined) updates.vedette = body.vedette
      if (body.name) updates.name = body.name
      if (body.category) updates.category = body.category
      if (body.price !== undefined) updates.price = body.price
      if (body.promo_price !== undefined) updates.promo_price = body.promo_price
      if (body.description !== undefined) updates.description = body.description

      const { data: updated, error: updateError } = await supabase.from('products').update(updates).eq('id', body.id).select().single()
      if (updateError) return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 })
      return NextResponse.json({ product: updated })
    }

    const { data, error } = await supabase.from('products').insert([body]).select().single()
    if (error) return NextResponse.json({ error: 'Erreur création produit' }, { status: 500 })
    return NextResponse.json({ product: data })
  } catch (err) {
    console.error('POST /api/admin/products error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })

    const supabase = await createServerClient()
    const { data: existing, error: selErr } = await supabase.from('products').select('image_path').eq('id', id).single()
    if (selErr) console.warn('Produit non trouvé ou erreur lecture image_path', selErr)

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })

    // Try to delete image from storage if exists
    if (existing && existing.image_path) {
      try {
        await supabase.storage.from(BUCKET).remove([existing.image_path])
      } catch (e) {
        console.warn('Impossible de supprimer le fichier de storage', e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/products error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
