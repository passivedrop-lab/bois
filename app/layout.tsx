import type { Metadata } from 'next'
import '../app/globals.css'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'
import Toaster from '@/components/Toaster'
import TelegramFloat from '@/components/TelegramFloat'

export const metadata: Metadata = {
  title: 'TsarstvoDereva - Качественный лес и пиломатериалы',
  description: 'TsarstvoDereva — премиальные пиломатериалы: бревна, доска, брус, дрова, панели. Бесплатная доставка по России. Качество гарантировано.',
  keywords: 'TsarstvoDereva, бревно, доска, брус, пиломатериалы, дрова, бревна, древесина, лес',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106320300', 'ym');

            ym(106320300, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/106320300" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster />
          <TelegramFloat />
        </AuthProvider>
      </body>
    </html>
  )
}

