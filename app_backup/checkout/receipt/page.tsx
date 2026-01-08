'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Upload, CheckCircle, Clock, AlertCircle, FileText, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

function ReceiptUploadContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState<any>(null)
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [step, setStep] = useState<'upload' | 'success'>('upload')

    useEffect(() => {
        if (!orderId) {
            router.push('/profile/orders')
            return
        }

        const fetchOrder = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single()

            if (error || !data) {
                toast.error('Commande non trouvée')
                router.push('/profile/orders')
                return
            }

            setOrder(data)
        }

        fetchOrder()
    }, [orderId, router, supabase])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setPreviewUrl(URL.createObjectURL(selectedFile))
        }
    }

    const handleUpload = async () => {
        if (!file || !orderId) return
        setLoading(true)

        try {
            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${orderId}-${Math.random()}.${fileExt}`
            const filePath = `receipts/${fileName}`

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('receipts')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('receipts')
                .getPublicUrl(fileName)

            // 3. Update Order in Database
            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    receipt_url: publicUrl,
                    status: 'in_verification',
                    payment_status: 'pending_verification'
                })
                .eq('id', orderId)

            if (updateError) throw updateError

            // 4. Send Email Notification to Admin (simulated or simplified action)
            // Note: Idealement, ici on appellerait une API Route qui utilise Resend
            const response = await fetch('/api/admin/notify-receipt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    customerEmail: order.customer_email,
                    totalAmount: order.total_amount,
                    receiptUrl: publicUrl
                })
            }).catch(err => console.error('Email notification failed:', err))

            setStep('success')
            toast.success('Reçu téléversé avec succès !')
        } catch (error: any) {
            toast.error(error.message || 'Erreur lors du téléversement')
        } finally {
            setLoading(false)
        }
    }

    if (!order) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50 py-12">
                <div className="container mx-auto px-4 max-w-2xl text-center">
                    <div className="card-premium p-12">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <CheckCircle size={48} />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-wood-900 mb-4">Paiement en cours de vérification</h1>
                        <p className="text-wood-600 mb-8">
                            Nous avons bien reçu votre reçu de paiement. Notre équipe va procéder à la vérification manuelle de votre virement.
                            Vous recevrez une confirmation dès que votre commande sera validée.
                        </p>
                        <Link href="/profile/orders" className="btn-primary inline-flex items-center gap-2">
                            Voir mes commandes <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="card-premium p-8">
                    <h1 className="text-3xl font-serif font-bold text-wood-900 mb-2">Preuve de paiement</h1>
                    <p className="text-wood-600 mb-8">
                        Veuillez téléverser une capture d'écran ou une photo de votre reçu de virement bancaire pour la commande <span className="font-bold">#{orderId.slice(0, 8)}</span>.
                    </p>

                    <div className="bg-wood-50 rounded-xl p-6 mb-8 border border-wood-200">
                        <div className="flex justify-between items-center text-wood-900 font-bold text-xl">
                            <span>Montant à régler :</span>
                            <span className="text-fire-600">{(order.total_amount).toLocaleString('ru-RU')} ₽</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition ${file ? 'border-green-500 bg-green-50' : 'border-wood-300 hover:border-fire-500 bg-white'
                                }`}
                        >
                            {previewUrl ? (
                                <div className="space-y-4">
                                    <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                                    <button
                                        onClick={() => { setFile(null); setPreviewUrl(null); }}
                                        className="text-red-500 text-sm font-medium hover:underline"
                                    >
                                        Supprimer et choisir une autre photo
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer block">
                                    <div className="w-16 h-16 bg-wood-100 rounded-full flex items-center justify-center mx-auto mb-4 text-wood-500">
                                        <Upload size={32} />
                                    </div>
                                    <span className="block text-wood-900 font-semibold mb-1">Cliquer pour téléverser</span>
                                    <span className="block text-wood-500 text-sm">JPG, PNG ou PDF (max. 5 Mo)</span>
                                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <>Chargement...</>
                            ) : (
                                <>
                                    <FileText size={24} />
                                    Envoyer mon reçu
                                </>
                            )}
                        </button>

                        <div className="flex items-center gap-3 text-sm text-wood-500 bg-blue-50 p-4 rounded-lg">
                            <Clock size={18} className="text-blue-600 shrink-0" />
                            <p>La vérification manuelle prend généralement entre 2 et 24 heures.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ReceiptUploadPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <ReceiptUploadContent />
        </Suspense>
    )
}
