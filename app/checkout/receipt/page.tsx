'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

export default function ReceiptPage() {
  const [file, setFile] = useState<File | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    if (file) {
      setShowSuccess(true)
      setTimeout(() => {
        window.location.href = '/profile/orders'
      }, 3000)
    }
  }

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Téléversez votre reçu</h1>
        <p className="text-wood-600 mb-12">Dernière étape pour valider votre commande</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Zone de téléversement */}
          <div className="lg:col-span-2">
            {!showSuccess ? (
              <>
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold text-wood-900 mb-6">Téléversez votre preuve de paiement</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <AlertCircle size={20} />
                      Que téléverser?
                    </h3>
                    <ul className="text-blue-900 text-sm space-y-2 list-disc list-inside">
                      <li>Une capture d'écran du reçu de virement bancaire</li>
                      <li>Ou un PDF du reçu reçu par email de votre banque</li>
                      <li>Le reçu doit montrer clairement: montant, bénéficiaire, date et heure</li>
                    </ul>
                  </div>

                  {/* Drag & Drop */}
                  <div className="border-2 border-dashed border-fire-300 rounded-lg p-12 text-center bg-fire-50 mb-6 cursor-pointer hover:bg-fire-100 transition"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const files = e.dataTransfer.files
                      if (files.length > 0) {
                        setFile(files[0])
                      }
                    }}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Upload size={48} className="mx-auto mb-4 text-fire-600" />
                    <p className="text-lg font-semibold text-wood-900 mb-2">
                      Glissez votre fichier ici ou cliquez pour parcourir
                    </p>
                    <p className="text-sm text-wood-600">
                      Formats acceptés: PNG, JPG, PDF (Max 10 Mo)
                    </p>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/png,image/jpeg,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Fichier sélectionné */}
                  {file && (
                    <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6 flex items-center gap-3">
                      <CheckCircle size={24} className="text-green-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-green-900">Fichier sélectionné:</p>
                        <p className="text-sm text-green-800">{file.name}</p>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-green-700 hover:text-green-900 font-semibold"
                      >
                        Modifier
                      </button>
                    </div>
                  )}

                  {/* Bouton valider */}
                  <button
                    onClick={handleSubmit}
                    disabled={!file}
                    className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                      file
                        ? 'bg-fire-600 text-white hover:bg-fire-700 cursor-pointer'
                        : 'bg-wood-200 text-wood-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle size={20} />
                    Valider ma commande
                  </button>

                  <p className="text-xs text-wood-600 mt-4 text-center">
                    En cliquant sur "Valider ma commande", vous confirmez que le reçu fourni est authentique et correspond à votre transaction.
                  </p>
                </div>

                {/* Informations complémentaires */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
                  <h3 className="font-bold text-yellow-900 mb-3">⏱️ Délai de validation</h3>
                  <p className="text-yellow-800 text-sm mb-3">
                    Une fois votre reçu téléversé, notre équipe examinera votre paiement dans un délai de 2-4 heures (jours ouvrables).
                  </p>
                  <p className="text-yellow-800 text-sm">
                    Vous recevrez une confirmation par email une fois votre commande validée et en cours de préparation.
                  </p>
                </div>
              </>
            ) : (
              /* Écran de succès */
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 rounded-full p-4">
                    <CheckCircle size={64} className="text-green-600" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-green-900 mb-4">Téléversement réussi!</h2>

                <p className="text-green-800 text-lg mb-8">
                  Votre reçu a été téléversé avec succès. Nous allons maintenant vérifier votre paiement.
                </p>

                <div className="bg-white rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-wood-900 mb-4">Prochaines étapes:</h3>
                  <ol className="text-left text-wood-700 space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                      <span>Notre équipe examinera votre paiement (2-4 heures)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                      <span>Vous recevrez une confirmation par email</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                      <span>Votre commande sera préparée et expédiée</span>
                    </li>
                  </ol>
                </div>

                <p className="text-wood-600 text-sm mb-6">
                  Redirection vers votre historique de commandes dans 3 secondes...
                </p>

                <Link
                  href="/profile/orders"
                  className="inline-block bg-fire-600 text-white px-8 py-3 rounded-lg hover:bg-fire-700 transition font-semibold"
                >
                  Voir mes commandes
                </Link>
              </div>
            )}
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h3 className="text-lg font-bold text-wood-900 mb-6">Récapitulatif commande</h3>

              <div className="space-y-4 pb-6 border-b border-wood-200">
                <div>
                  <p className="text-sm text-wood-600">Montant payé</p>
                  <p className="text-2xl font-bold text-fire-600">50,000₽</p>
                </div>

                <div>
                  <p className="text-sm text-wood-600">Statut</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <p className="font-semibold text-yellow-700">En attente de vérification</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-xs text-green-900 font-semibold mb-2">✓ Statut après vérification:</p>
                <p className="text-xs text-green-800">
                  Votre commande passera à "En cours de préparation" une fois validée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
