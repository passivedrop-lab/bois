import Link from 'next/link'
import { Phone, Mail, MapPin, Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-wood-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-fire-600 text-white p-1.5 sm:p-2 rounded-lg">
                <span className="text-lg sm:text-xl font-bold">TS</span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold">TsarstvoDereva</h3>
            </div>
            <p className="text-sm sm:text-base text-wood-300 mb-3 sm:mb-4">
              TsarstvoDereva — премиальные пиломатериалы и лесопродукты с доставкой по всей России. Брус, доска, бревна, дрова, панели и декоративный лес высочайшего качества.
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-wood-500 uppercase tracking-wider font-bold">Мы в Telegram</p>
              <a
                href="https://t.me/TSARSTVODEREVA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-400 Transition text-blue-400 font-semibold"
              >
                <Send size={18} />
                <span>@TSARSTVODEREVA</span>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Контакты</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-wood-300">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-fire-400 mt-0.5 flex-shrink-0 sm:w-4.5 sm:h-4.5" />
                <span>Россия, Вологодская область, Никольский район, деревня Кумбисер, д. 2а</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="text-fire-400 mt-0.5 flex-shrink-0 sm:w-4.5 sm:h-4.5" />
                <a href="mailto:LES3514008268@MAIL.RU" className="hover:text-fire-400 transition break-all">
                  LES3514008268@MAIL.RU
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Наши услуги</h4>
            <ul className="space-y-2 text-sm sm:text-base text-wood-300">
              <li>
                <Link href="/uslugi#consultation" className="hover:text-fire-400 transition">
                  Консультация
                </Link>
              </li>
              <li>
                <Link href="/uslugi#cutting" className="hover:text-fire-400 transition">
                  Распил и обработка
                </Link>
              </li>
              <li>
                <Link href="/dostavka" className="hover:text-fire-400 transition">
                  Доставка и логистика
                </Link>
              </li>
              <li>
                <Link href="/uslugi#wholesale" className="hover:text-fire-400 transition">
                  Оптовые поставки
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Информация</h4>
            <ul className="space-y-2 text-sm sm:text-base text-wood-300">
              <li>
                <Link href="/o-nas" className="hover:text-fire-400 transition">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="/rekvizity" className="hover:text-fire-400 transition">
                  Юридическая информация
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-fire-400 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-wood-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-wood-400 text-xs sm:text-sm">
          <p>&copy; 2025 TsarstvoDereva. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

