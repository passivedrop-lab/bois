/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  async redirects() {
    return [
      { source: '/a-propos', destination: '/o-nas', permanent: true },
      { source: '/catalogue', destination: '/katalog', permanent: true },
      { source: '/catalogue/:path*', destination: '/katalog/:path*', permanent: true },
      { source: '/cart', destination: '/korzina', permanent: true },
      { source: '/checkout', destination: '/oformlenie-zakaza', permanent: true },
      { source: '/checkout/receipt', destination: '/oformlenie-zakaza/receipt', permanent: true },
      { source: '/contacts', destination: '/kontakty', permanent: true },
      { source: '/favorites', destination: '/izbrannoe', permanent: true },
      { source: '/login', destination: '/vhod', permanent: true },
      { source: '/livraison', destination: '/dostavka', permanent: true },
      { source: '/legal', destination: '/pravovaya-informaciya', permanent: true },
      { source: '/services', destination: '/uslugi', permanent: true },
    ]
  },
}

module.exports = nextConfig


