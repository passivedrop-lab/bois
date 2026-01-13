/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  async redirects() {
    return [
      { source: '/about', destination: '/o-nas', permanent: true },
      { source: '/a-propos', destination: '/o-nas', permanent: true },
      { source: '/catalogue', destination: '/katalog', permanent: true },
      { source: '/catalogue/:path*', destination: '/katalog/:path*', permanent: true },
      { source: '/cart', destination: '/korzina', permanent: true },
      { source: '/checkout', destination: '/oformlenie-zakaza', permanent: true },
      { source: '/checkout/receipt', destination: '/oformlenie-zakaza/receipt', permanent: true },
      { source: '/contact', destination: '/kontakty', permanent: true },
      { source: '/contacts', destination: '/kontakty', permanent: true },
      { source: '/delivery', destination: '/dostavka', permanent: true },
      { source: '/favorites', destination: '/izbrannoe', permanent: true },
      { source: '/login', destination: '/vhod', permanent: true },
      { source: '/livraison', destination: '/dostavka', permanent: true },
      { source: '/legal', destination: '/pravovaya-informaciya', permanent: true },
      { source: '/payment', destination: '/oformlenie-zakaza/receipt', permanent: true },
      { source: '/services', destination: '/uslugi', permanent: true },
      { source: '/warranty', destination: '/pravovaya-informaciya', permanent: true },
      { source: '/wholesale', destination: '/uslugi', permanent: true },
      { source: '/products/accessories', destination: '/katalog', permanent: true },
      { source: '/products/boilers', destination: '/katalog/materialy-dlya-bani', permanent: true },
      { source: '/products/firewood', destination: '/katalog/drova', permanent: true },
      { source: '/products/pellets', destination: '/katalog/drova', permanent: true },
      { source: '/products/stoves', destination: '/katalog/materialy-dlya-bani', permanent: true },
      { source: '/products', destination: '/katalog', permanent: true },
    ]
  },
}

module.exports = nextConfig


