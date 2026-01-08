'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "Quels types de bois proposez-vous?",
      answer: "Nous proposons une large gamme de piolomatériaux: bois de construction, bois scié, bois de chauffage, bois sauna, bois décoratif, panneaux, bois d'extérieur et bois brut/industriel. Consultez notre catalogue complet pour voir tous les produits disponibles."
    },
    {
      question: "Livrez-vous en France?",
      answer: "Notre service de livraison couvre actuellement la Fédération de Russie. Pour les demandes de livraison internationale, veuillez nous contacter directement."
    },
    {
      question: "Comment passer une commande?",
      answer: "1. Sélectionnez vos produits et ajoutez-les au panier. 2. Cliquez sur 'Passer la commande'. 3. Remplissez vos informations de livraison et personnelles. 4. Recevez les coordonnées bancaires pour le virement. 5. Effectuez le virement et téléversez le reçu. 6. Votre commande sera validée et traitée."
    },
    {
      question: "Quelles sont vos modalités de paiement?",
      answer: "Nous acceptons uniquement les virements bancaires instantanés. C'est un processus sécurisé et transparent qui vous permet de recevoir une preuve de paiement immédiatement."
    },
    {
      question: "Comment fonctionne le virement bancaire?",
      answer: "Après confirmation de votre panier et adresse de livraison, vous recevrez les coordonnées bancaires pour effectuer un virement instantané. Vous devez téléverser le reçu du virement sur notre plateforme pour que nous valitions et traitions votre commande."
    },
    {
      question: "Combien de temps prend la livraison?",
      answer: "Les délais de livraison varient selon votre localisation et le volume de commande. Généralement, les livraisons sont effectuées dans un délai de 5 à 14 jours ouvrables. Un délai précis sera communiqué lors de la confirmation de votre commande."
    },
    {
      question: "Que faire en cas de problème avec ma commande?",
      answer: "En cas de problème ou de dommage lors de la livraison, veuillez nous contacter dans les 14 jours suivant la réception du colis avec photos à l'appui. Notre équipe analysera votre réclamation et trouvera une solution appropriée."
    },
    {
      question: "Puis-je annuler ou modifier ma commande?",
      answer: "Vous pouvez annuler votre commande avant que le paiement ne soit validé. Une fois le reçu de virement accepté et la commande en traitement, les modifications ne sont plus possibles. Pour les annulations, contactez notre service client."
    },
    {
      question: "Avez-vous des certifications de qualité?",
      answer: "Oui, tous nos produits respectent les normes GOST et ISO. TsarstvoDereva est pleinement agréée et autorisée à commercialiser l'ensemble de nos piolomatériaux. Consultez nos mentions légales pour plus de détails sur nos certifications."
    },
    {
      question: "Comment puis-je suivre ma commande?",
      answer: "Une fois votre commande validée, vous pouvez suivre son statut dans votre profil, section 'Mes Commandes'. Vous verrez l'évolution: En attente de vérification → En cours de préparation → Expédiée → Livrée."
    },
    {
      question: "Y a-t-il des frais de livraison?",
      answer: "Les frais de livraison dépendent de votre localisation et du volume de la commande. Ils vous seront communiqués avant confirmation du paiement."
    },
    {
      question: "Qui puis-je contacter pour d'autres questions?",
      answer: "Notre équipe est disponible par email à info@tsarstvadereva.ru ou par téléphone au +7 (999) 123-45-67. Nous répondons généralement dans les 24 heures."
    }
  ]

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-wood-900 mb-4">Questions Fréquemment Posées</h1>
          <p className="text-lg text-wood-600 mb-12">
            Trouvez les réponses à vos questions sur nos produits, livraisons et processus de commande.
          </p>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-wood-50 transition text-left"
                >
                  <h3 className="font-semibold text-wood-900">{faq.question}</h3>
                  <ChevronDown
                    size={20}
                    className={`text-fire-600 flex-shrink-0 transition-transform ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="px-6 py-4 bg-wood-50 border-t border-wood-200">
                    <p className="text-wood-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 bg-fire-50 rounded-lg p-8 border border-fire-200 text-center">
            <h2 className="text-2xl font-bold text-wood-900 mb-4">Vous ne trouvez pas votre réponse?</h2>
            <p className="text-wood-700 mb-6">
              Notre équipe est prête à vous aider. Contactez-nous par email ou téléphone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@tsarstvadereva.ru"
                className="bg-fire-600 text-white px-6 py-2 rounded-lg hover:bg-fire-700 transition font-semibold"
              >
                Envoyer un email
              </a>
              <a
                href="tel:+79991234567"
                className="bg-white border-2 border-fire-600 text-fire-600 px-6 py-2 rounded-lg hover:bg-fire-50 transition font-semibold"
              >
                Appeler
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
