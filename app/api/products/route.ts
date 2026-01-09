import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

const BUCKET = process.env.SUPABASE_PRODUCT_BUCKET || 'product-images'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')

        // We use server client to be able to sign URLs if needed
        const supabase = await createServerClient()

        let query = supabase.from('products').select('*').order('created_at', { ascending: false })

        if (category) {
            query = query.eq('category', category)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching products:', error)
            return NextResponse.json({ error: 'Erreur lecture produits' }, { status: 500 })
        }

        // Generate signed URLs for images
        const products = await Promise.all(
            (data || []).map(async (p: any) => {
                if (p.image_path) {
                    try {
                        if (p.image_path.startsWith('http') || p.image_path.startsWith('/')) {
                            p.image_url = p.image_path
                        } else {
                            const { data: urlData, error: urlError } = await supabase.storage
                                .from(BUCKET)
                                .createSignedUrl(p.image_path, 60 * 60) // 1 hour

                            if (!urlError && urlData) {
                                p.image_url = urlData.signedUrl
                            }
                        }
                    } catch (e) {
                        // ignore
                    }
                }
                return p
            })
        )

        return NextResponse.json({ products })
    } catch (err) {
        console.error('GET /api/products error:', err)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
