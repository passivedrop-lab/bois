import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

const BUCKET = process.env.SUPABASE_PRODUCT_BUCKET || 'product-images'

// Note: Using server client to ensure we can access storage if needed, 
// though for public data usually anon key + correct RLS on buckets is enough.
// We use signed URLs here to match the admin pattern.

export async function GET() {
    try {
        const supabase = await createServerClient()

        // Fetch products marked as vedette
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('vedette', true)
            .limit(6) // Limit to 6 items for the homepage

        if (error) {
            console.error('Error fetching featured products:', error)
            return NextResponse.json({ error: 'Erreur lecture produits' }, { status: 500 })
        }

        // Generate signed URLs for images
        const products = await Promise.all(
            (data || []).map(async (p: any) => {
                if (p.image_path) {
                    try {
                        // Check if path is a full URL (if some were migrated or external)
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
                        console.warn('Error signing url for product', p.id)
                    }
                }
                return p
            })
        )

        return NextResponse.json({ products })
    } catch (err) {
        console.error('GET /api/products/featured error:', err)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
