'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-wood-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-wood-900 mb-4">Une erreur critique s'est produite</h2>
            <p className="text-wood-600 mb-4">{error.message}</p>
            <button
              onClick={reset}
              className="btn-primary"
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}


