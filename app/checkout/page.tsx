'use client'

import Link from 'next/link'
import { ArrowRight, ShoppingCart } from 'lucide-react'

export default function CheckoutPage() {
  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Passer la commande</h1>
        <p className="text-wood-600 mb-12">Finalisez votre achat en quelques étapes simples</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: Informations personnelles */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-wood-900 mb-4">1. Informations personnelles</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Prénom"
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
              </form>
            </div>

            {/* Section 2: Informations de livraison */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-wood-900 mb-4">2. Informations de livraison</h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Adresse complète"
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Ville"
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                  <input
                    type="text"
                    placeholder="Code postal"
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                </div>
                <textarea
                  placeholder="Instructions de livraison (optionnel)"
                  rows={3}
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                ></textarea>
              </form>
            </div>

            {/* Récapitulatif */}
            <div className="bg-wood-50 rounded-lg p-6 border border-wood-200">
              <h2 className="text-xl font-bold text-wood-900 mb-4">3. Récapitulatif de la commande</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-wood-700">
                  <span>Bois de construction (10m³)</span>
                  <span>45,000₽</span>
                </div>
                <div className="flex justify-between text-wood-700">
                  <span>Frais de livraison</span>
                  <span>5,000₽</span>
                </div>
                <div className="border-t border-wood-300 pt-3 flex justify-between font-bold text-wood-900">
                  <span>Total</span>
                  <span>50,000₽</span>
                </div>
              </div>
            </div>

            {/* Paiement */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-fire-200">
              <h2 className="text-xl font-bold text-wood-900 mb-4">4. Information de paiement</h2>
              <p className="text-wood-700 mb-6">
                <strong>Nous acceptons uniquement les virements bancaires instantanés.</strong>
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">Coordonnées bancaires pour virement:</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Bénéficiaire:</strong> TsarstvoDereva LLC</p>
                  <p><strong>IBAN:</strong> RU12 0456 1234 5678 9012 3456</p>
                  <p><strong>BIC:</strong> SBERRU33</p>
                  <p><strong>Montant:</strong> 50,000 RUB</p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-900 text-sm">
                  ⚠️ <strong>Important:</strong> Après avoir effectué le virement bancaire, téléversez une capture d'écran ou le reçu de votre transaction sur l'étape suivante. 
                  Votre commande ne sera validée que lorsque nous aurons reçu et accepté votre preuve de paiement.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Link
                href="/cart"
                className="px-6 py-3 border-2 border-wood-300 text-wood-900 rounded-lg hover:bg-wood-50 transition font-semibold"
              >
                Retour au panier
              </Link>
              <Link
                href="/checkout/payment"
                className="flex-1 px-6 py-3 bg-fire-600 text-white rounded-lg hover:bg-fire-700 transition font-semibold flex items-center justify-center gap-2"
              >
                Continuer vers le paiement
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Sidebar - Panier */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h3 className="text-lg font-bold text-wood-900 mb-4 flex items-center gap-2">
                <ShoppingCart size={20} className="text-fire-600" />
                Votre panier
              </h3>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-wood-200">
                <div className="flex justify-between text-sm">
                  <span className="text-wood-700">Bois de construction</span>
                  <span className="font-semibold">45,000₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-wood-700">Livraison</span>
                  <span className="font-semibold">5,000₽</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-wood-900 mb-6">
                <span>Total:</span>
                <span className="text-xl text-fire-600">50,000₽</span>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-900">
                ✓ Livraison gratuite pour les commandes supérieures à 100,000₽
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
