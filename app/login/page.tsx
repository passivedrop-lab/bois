export default function LoginPage() {
  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-wood-900 mb-2">Connexion / Inscription</h1>
          <p className="text-wood-600 mb-8">Connectez-vous à votre compte ou créez un nouveau compte</p>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-wood-900 mb-2">Email</label>
              <input 
                type="email" 
                placeholder="votre@email.com"
                className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-wood-900 mb-2">Mot de passe</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
              />
            </div>
            
            <button type="submit" className="w-full bg-fire-600 text-white py-2 rounded-lg hover:bg-fire-700 transition font-semibold">
              Se connecter
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-wood-200">
            <p className="text-sm text-wood-600 text-center">
              Pas encore inscrit? <a href="#" className="text-fire-600 hover:text-fire-700 font-semibold">Créer un compte</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
