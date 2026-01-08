import { Shield, CheckCircle, Award, HeadphonesIcon } from 'lucide-react'
import Link from 'next/link'

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-wood-900 via-wood-800 to-fire-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-fire-500/20 backdrop-blur-sm rounded-full p-4 mb-6">
              <Shield size={48} className="text-fire-400" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Гарантия качества
            </h1>
            <p className="text-xl md:text-2xl text-wood-200">
              Мы гарантируем качество всей нашей продукции
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Warranty Terms */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-12 text-center">
            Гарантийные обязательства
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-premium p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-lg flex items-center justify-center">
                  <Award className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-wood-900">Гарантия на дрова</h3>
                  <p className="text-wood-600 text-sm">Качество и соответствие</p>
                </div>
              </div>
              <p className="text-wood-600 mb-4">
                Мы гарантируем соответствие дров заявленным характеристикам: порода дерева, влажность, размеры. Гарантия действует в течение 30 дней с момента получения товара.
              </p>
              <ul className="space-y-2 text-wood-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Влажность не более 25%</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Соответствие породе</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Правильные размеры</span>
                </li>
              </ul>
            </div>

            <div className="card-premium p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-lg flex items-center justify-center">
                  <Shield className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-wood-900">Гарантия на оборудование</h3>
                  <p className="text-wood-600 text-sm">Печи, котлы, аксессуары</p>
                </div>
              </div>
              <p className="text-wood-600 mb-4">
                На все отопительное оборудование предоставляется официальная гарантия производителя. Срок гарантии указан в документации к каждому товару.
              </p>
              <ul className="space-y-2 text-wood-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Гарантия от производителя</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Сервисное обслуживание</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Замена при браке</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quality Assurance */}
        <section className="mb-16">
          <div className="card-premium p-8 md:p-12 bg-gradient-to-br from-fire-50 to-wood-50">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-8 text-center">
                Контроль качества
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-wood-900 mb-2">Входной контроль</h3>
                    <p className="text-wood-600">
                      Все товары проходят тщательную проверку перед поступлением на склад. Мы проверяем качество, соответствие стандартам и заявленным характеристикам.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-wood-900 mb-2">Правильное хранение</h3>
                    <p className="text-wood-600">
                      Все товары хранятся в специально оборудованных складах с соблюдением условий хранения, что гарантирует сохранение качества до момента доставки.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-wood-900 mb-2">Контроль перед отправкой</h3>
                    <p className="text-wood-600">
                      Перед отправкой каждый заказ проверяется на соответствие заказанным товарам, целостность упаковки и качество продукции.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Return Policy */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-12 text-center">
            Возврат и обмен
          </h2>
          <div className="card-premium p-8 md:p-12">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-wood-900 mb-4">Условия возврата</h3>
                <p className="text-wood-600 mb-4">
                  Вы можете вернуть товар в течение 14 дней с момента получения, если он не был в употреблении, сохранены его товарный вид, потребительские свойства и упаковка.
                </p>
                <ul className="space-y-2 text-wood-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-fire-600 mt-1" size={16} />
                    <span>Товар не был в употреблении</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-fire-600 mt-1" size={16} />
                    <span>Сохранены товарный вид и упаковка</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-fire-600 mt-1" size={16} />
                    <span>Наличие документов на покупку</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-wood-900 mb-4">Обмен товара</h3>
                <p className="text-wood-600">
                  Если вы обнаружили брак или несоответствие заказанному товару, мы гарантируем бесплатную замену или возврат средств. Свяжитесь с нами в течение 7 дней с момента получения товара.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="mb-16">
          <div className="card-premium p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-fire-600 rounded-full mb-6">
              <HeadphonesIcon className="text-white" size={40} />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-6">
              Служба поддержки
            </h2>
            <p className="text-lg text-wood-600 mb-8 max-w-2xl mx-auto">
              Наша команда поддержки всегда готова помочь вам с любыми вопросами по гарантии, возврату или качеству товаров.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+79991234567" className="btn-primary">
                Позвонить нам
              </a>
              <Link href="/contact" className="btn-outline">
                Написать нам
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="card-premium p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-6">
              Покупайте с уверенностью
            </h2>
            <p className="text-lg text-wood-600 mb-8">
              Мы гарантируем качество и предоставляем полную поддержку
            </p>
            <Link href="/products" className="btn-primary inline-block">
              Перейти к каталогу
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}


