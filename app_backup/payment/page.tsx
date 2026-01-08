import { CreditCard, Wallet, Banknote, Shield, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-wood-900 via-wood-800 to-fire-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-fire-500/20 backdrop-blur-sm rounded-full p-4 mb-6">
              <CreditCard size={48} className="text-fire-400" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Способы оплаты
            </h1>
            <p className="text-xl md:text-2xl text-wood-200">
              Удобные и безопасные способы оплаты заказов
            </p>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <div className="container mx-auto px-4 py-16">
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-12 text-center">
            Доступные способы оплаты
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-premium p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-lg flex items-center justify-center">
                  <CreditCard className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-wood-900">Банковская карта онлайн</h3>
                  <p className="text-wood-600 text-sm">Visa, MasterCard, МИР</p>
                </div>
              </div>
              <p className="text-wood-600 mb-4">
                Оплата банковской картой через защищенный платежный шлюз. Все транзакции защищены протоколом SSL.
              </p>
              <ul className="space-y-2 text-wood-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Мгновенное подтверждение платежа</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Безопасные платежи</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Поддержка всех основных карт</span>
                </li>
              </ul>
            </div>

            <div className="card-premium p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-lg flex items-center justify-center">
                  <Banknote className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-wood-900">Наличными при получении</h3>
                  <p className="text-wood-600 text-sm">Оплата курьеру</p>
                </div>
              </div>
              <p className="text-wood-600 mb-4">
                Оплата наличными при получении заказа. Доступна для доставки по Москве и Московской области.
              </p>
              <ul className="space-y-2 text-wood-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Удобно и безопасно</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Оплата после проверки товара</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Без комиссий</span>
                </li>
              </ul>
            </div>

            <div className="card-premium p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-lg flex items-center justify-center">
                  <Wallet className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-wood-900">Электронные кошельки</h3>
                  <p className="text-wood-600 text-sm">ЮMoney, Qiwi, WebMoney</p>
                </div>
              </div>
              <p className="text-wood-600 mb-4">
                Оплата через популярные электронные платежные системы. Быстро и удобно.
              </p>
              <ul className="space-y-2 text-wood-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Мгновенная оплата</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Без комиссий</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Удобный интерфейс</span>
                </li>
              </ul>
            </div>

            <div className="card-premium p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-lg flex items-center justify-center">
                  <Shield className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-wood-900">Безналичный расчет</h3>
                  <p className="text-wood-600 text-sm">Для юридических лиц</p>
                </div>
              </div>
              <p className="text-wood-600 mb-4">
                Оплата по безналичному расчету для юридических лиц и индивидуальных предпринимателей.
              </p>
              <ul className="space-y-2 text-wood-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Работа с НДС</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Отсрочка платежа</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-fire-600" size={16} />
                  <span>Индивидуальные условия</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="mb-16">
          <div className="card-premium p-8 md:p-12 bg-gradient-to-br from-fire-50 to-wood-50">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Shield className="text-fire-600" size={48} />
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900">
                  Безопасность платежей
                </h2>
              </div>
              <p className="text-lg text-wood-700 mb-6 text-center">
                Мы гарантируем полную безопасность всех платежных операций
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-fire-600 mb-2">SSL</div>
                  <p className="text-wood-600">Шифрование данных</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fire-600 mb-2">PCI DSS</div>
                  <p className="text-wood-600">Стандарт безопасности</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fire-600 mb-2">3D Secure</div>
                  <p className="text-wood-600">Дополнительная защита</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Process */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-12 text-center">
            Процесс оплаты
          </h2>
          <div className="card-premium p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-fire-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="font-semibold text-wood-900 mb-2">Выбор товаров</h3>
                <p className="text-sm text-wood-600">Добавьте товары в корзину</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-fire-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="font-semibold text-wood-900 mb-2">Оформление заказа</h3>
                <p className="text-sm text-wood-600">Заполните данные доставки</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-fire-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="font-semibold text-wood-900 mb-2">Выбор оплаты</h3>
                <p className="text-sm text-wood-600">Выберите удобный способ</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-fire-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">4</span>
                </div>
                <h3 className="font-semibold text-wood-900 mb-2">Подтверждение</h3>
                <p className="text-sm text-wood-600">Получите подтверждение</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="card-premium p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-6">
              Готовы сделать заказ?
            </h2>
            <p className="text-lg text-wood-600 mb-8">
              Выберите удобный способ оплаты и оформите заказ
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


