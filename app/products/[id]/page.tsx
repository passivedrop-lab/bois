import { PRODUCTS } from '@/lib/data/products'
import ProductDetailClient from '@/components/ProductDetailClient'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
    params: { id: string }
}

export async function generateStaticParams() {
    return PRODUCTS.map((product) => ({
        id: product.id,
    }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const product = PRODUCTS.find((p) => p.id === params.id)

    if (!product) {
        return {
            title: 'Товар не найден',
        }
    }

    return {
        title: `${product.name} | Купить по выгодной цене`,
        description: `Купить ${product.name} в интернет-магазине. ${product.description.slice(0, 150)}...`,
        openGraph: {
            title: product.name,
            description: product.description.slice(0, 200),
            images: [product.image],
        },
    }
}

export default function ProductPage({ params }: Props) {
    const product = PRODUCTS.find((p) => p.id === params.id)

    if (!product) {
        notFound()
    }

    return <ProductDetailClient product={product} />
}
