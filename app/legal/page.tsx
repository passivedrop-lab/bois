export default function LegalPage() {
  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-wood-900 mb-8">Правовая информация</h1>
          
          <div className="space-y-8 text-wood-700">
            {/* Entreprise */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-wood-900 mb-4">О компании</h2>
              <p className="mb-2"><strong>Nom:</strong> TsarstvoDereva</p>
              <p className="mb-2"><strong>Adresse:</strong> Москва, ул. Лесная, д. 15</p>
              <p className="mb-2"><strong>Téléphone:</strong> +7 (999) 123-45-67</p>
              <p><strong>Email:</strong> info@tsarstvadereva.ru</p>
            </section>

            {/* Droits de vente */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-wood-900 mb-4">Права на реализацию и юридическое соответствие</h2>
              <p className="mb-4">
                TsarstvoDereva est pleinement agréée et autorisée à commercialiser l'ensemble des produits listés sur notre plateforme. 
                Notre entreprise possède toutes les certifications, permis et autorisations nécessaires pour la vente de bois et piolomatériaux.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Agréation commerciale complète pour la vente de piolomatériaux</li>
                <li>Certificats de conformité pour tous les produits</li>
                <li>Respecte les normes environnementales et de qualité (GOST, ISO)</li>
                <li>Enregistrement auprès des autorités fédérales de la Fédération de Russie</li>
                <li>Conformité complète avec la législation sur la protection des consommateurs</li>
                <li>Respect des normes d'exploitation forestière durable</li>
              </ul>
            </section>

            {/* Условия продажи */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-wood-900 mb-4">Условия продажи</h2>
              <p className="mb-4">
                En passant une commande sur notre plateforme, vous acceptez nos conditions de vente générales.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Les prix affichés sont en Roubles russes (RUB) TTC</li>
                <li>Les stocks sont limités et réservés selon l'ordre des commandes</li>
                <li>Les délais de livraison sont indicatifs et dépendent de votre localisation</li>
                <li>Le client accepte de vérifier l'état du colis à la réception</li>
                <li>Toute réclamation doit être faite dans les 14 jours suivant la livraison</li>
              </ul>
            </section>

            {/* Paiement */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-wood-900 mb-4">Условия оплаты</h2>
              <p className="mb-4">
                Nous acceptons uniquement les virements bancaires instantanés. Le processus est sécurisé et transparent :
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Confirmation du panier et de l'adresse de livraison</li>
                <li>Reçu des coordonnées bancaires pour virement</li>
                <li>Effectuez le virement instantané</li>
                <li>Téléversez le reçu de virement sur notre plateforme</li>
                <li>Validation et traitement de votre commande</li>
              </ol>
              <p className="mt-4 text-sm text-wood-600">
                <strong>Important:</strong> Les commandes ne sont traitées que après réception et validation du reçu de virement.
              </p>
            </section>

            {/* Responsabilité */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-wood-900 mb-4">Ограничение ответственности</h2>
              <p className="mb-4">
                TsarstvoDereva décline toute responsabilité pour:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Les dommages causés pendant le transport</li>
                <li>Les pertes de données ou d'accès au site</li>
                <li>Les interruptions du service dues à des circonstances extérieures</li>
                <li>L'utilisation abusive des produits achetés</li>
              </ul>
            </section>

            {/* Protection des données */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-wood-900 mb-4">Защита личных данных</h2>
              <p className="mb-4">
                Vos données personnelles sont collectées et traitées conformément à la législation applicable en matière de protection des données. 
                Nous ne partagerons jamais vos informations avec des tiers sans votre consentement explicite.
              </p>
              <p>
                Pour toute question concernant vos données personnelles, contactez-nous à: <strong>privacy@tsarstvadereva.ru</strong>
              </p>
            </section>

            {/* Contact */}
            <section className="bg-fire-50 rounded-lg p-6 border border-fire-200">
              <h2 className="text-xl font-bold text-wood-900 mb-2">Дополнительные вопросы?</h2>
              <p>
                Contactez notre service client pour toute question concernant ces mentions légales.
              </p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:legal@tsarstvadereva.ru" className="text-fire-600 hover:text-fire-700">legal@tsarstvadereva.ru</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
