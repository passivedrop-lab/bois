import { Flame, Award, Users, Truck, Shield, Heart } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-wood-900 via-wood-800 to-fire-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-fire-500/20 backdrop-blur-sm rounded-full p-4 mb-6">
              <Flame size={48} className="text-fire-400" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              О компании ДРОВА ПРЕМИУМ
            </h1>
            <p className="text-xl md:text-2xl text-wood-200 mb-8">
              Ваш надежный партнер в обеспечении тепла и уюта
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Our Story */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-8 text-center">
              Наша история
            </h2>
            <div className="card-premium p-8 md:p-12">
              <p className="text-lg text-wood-700 mb-6 leading-relaxed">
                <strong className="text-wood-900">ДРОВА ПРЕМИУМ</strong> — это компания с многолетним опытом работы на рынке отопительных материалов. Мы начали свою деятельность с простой идеи: обеспечить каждого клиента качественными дровами и отопительным оборудованием по доступным ценам.
              </p>
              <p className="text-lg text-wood-700 mb-6 leading-relaxed">
                За годы работы мы зарекомендовали себя как надежный поставщик премиальных дров, пеллет, печей и котлов. Наша команда состоит из профессионалов, которые знают все тонкости отопительной индустрии и всегда готовы помочь вам выбрать оптимальное решение.
              </p>
              <p className="text-lg text-wood-700 leading-relaxed">
                Мы гордимся тем, что тысячи довольных клиентов по всей России выбирают нас для обеспечения тепла в своих домах. Качество, надежность и забота о клиентах — это наши главные принципы.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-12 text-center">
            Наши ценности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-wood-900 mb-4">Качество</h3>
              <p className="text-wood-600">
                Мы предлагаем только премиальные материалы, прошедшие строгий контроль качества
              </p>
            </div>

            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-wood-900 mb-4">Надежность</h3>
              <p className="text-wood-600">
                Мы гарантируем выполнение всех обязательств и своевременную доставку
              </p>
            </div>

            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-wood-900 mb-4">Забота</h3>
              <p className="text-wood-600">
                Каждый клиент важен для нас, мы всегда готовы помочь и ответить на вопросы
              </p>
            </div>

            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-wood-900 mb-4">Доступность</h3>
              <p className="text-wood-600">
                Доставка по всей России, удобные способы оплаты и гибкие условия сотрудничества
              </p>
            </div>

            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-wood-900 mb-4">Профессионализм</h3>
              <p className="text-wood-600">
                Наша команда состоит из опытных специалистов, готовых дать профессиональную консультацию
              </p>
            </div>

            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Flame className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-wood-900 mb-4">Экологичность</h3>
              <p className="text-wood-600">
                Мы заботимся об окружающей среде и предлагаем экологически чистые материалы
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-12 text-center">
              Почему выбирают нас
            </h2>
            <div className="card-premium p-8 md:p-12">
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-wood-900 mb-2">Широкий ассортимент</h3>
                    <p className="text-wood-600">
                      Мы предлагаем полный спектр отопительных материалов: дрова различных пород, пеллеты, печи, котлы и аксессуары
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-wood-900 mb-2">Контроль качества</h3>
                    <p className="text-wood-600">
                      Все наши товары проходят тщательную проверку перед отправкой клиентам
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-wood-900 mb-2">Быстрая доставка</h3>
                    <p className="text-wood-600">
                      Мы доставляем заказы по всей России в кратчайшие сроки с соблюдением всех условий транспортировки
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-wood-900 mb-2">Конкурентные цены</h3>
                    <p className="text-wood-600">
                      Мы предлагаем лучшие цены на рынке без ущерба для качества продукции
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-wood-900 mb-2">Профессиональная поддержка</h3>
                    <p className="text-wood-600">
                      Наши специалисты всегда готовы помочь с выбором и ответить на любые вопросы
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="card-premium p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-6">
              Готовы начать сотрудничество?
            </h2>
            <p className="text-lg text-wood-600 mb-8">
              Свяжитесь с нами или просмотрите наш каталог товаров
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary">
                Перейти к каталогу
              </Link>
              <Link href="/contact" className="btn-outline">
                Связаться с нами
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
