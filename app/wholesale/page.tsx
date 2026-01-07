import { Users, TrendingUp, Award, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export default function WholesalePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-wood-900 via-wood-800 to-fire-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-fire-500/20 backdrop-blur-sm rounded-full p-4 mb-6">
              <Users size={48} className="text-fire-400" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Оптовые поставки
            </h1>
            <p className="text-xl md:text-2xl text-wood-200">
              Выгодные условия для оптовых покупателей
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-12 text-center">
            Преимущества оптовых закупок
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-wood-900 mb-4">Выгодные цены</h3>
              <p className="text-wood-600">
                Специальные оптовые цены, которые делают вашу торговлю более прибыльной
              </p>
            </div>

            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-wood-900 mb-4">Гарантия качества</h3>
              <p className="text-wood-600">
                Мы гарантируем стабильное качество продукции для всех оптовых партий
              </p>
            </div>

            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-wood-900 mb-4">Персональный менеджер</h3>
              <p className="text-wood-600">
                Каждому оптовому клиенту назначается персональный менеджер для оперативного решения вопросов
              </p>
            </div>

            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-wood-900 mb-4">Гибкие условия</h3>
              <p className="text-wood-600">
                Индивидуальные условия оплаты, доставки и отсрочки платежа
              </p>
            </div>
          </div>
        </section>

        {/* Conditions */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-12 text-center">
            Условия сотрудничества
          </h2>
          <div className="card-premium p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-wood-900 mb-6">Минимальный заказ</h3>
                <p className="text-wood-600 mb-4">
                  Минимальная сумма оптового заказа составляет <strong className="text-wood-900">50 000 рублей</strong>. Для постоянных клиентов возможны индивидуальные условия.
                </p>
                <ul className="space-y-2 text-wood-600">
                  <li>• Минимальная партия: от 10 м³ дров</li>
                  <li>• Смешанные заказы приветствуются</li>
                  <li>• Возможность заказа разных категорий товаров</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-wood-900 mb-6">Способы оплаты</h3>
                <p className="text-wood-600 mb-4">
                  Для оптовых клиентов доступны различные способы оплаты с гибкими условиями.
                </p>
                <ul className="space-y-2 text-wood-600">
                  <li>• Безналичный расчет с НДС</li>
                  <li>• Отсрочка платежа до 30 дней</li>
                  <li>• Предоплата со скидкой</li>
                  <li>• Индивидуальные условия</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-wood-900 mb-6">Доставка</h3>
                <p className="text-wood-600 mb-4">
                  Организуем доставку оптовых партий по всей России с соблюдением всех условий транспортировки.
                </p>
                <ul className="space-y-2 text-wood-600">
                  <li>• Доставка собственным транспортом</li>
                  <li>• Работа с транспортными компаниями</li>
                  <li>• Возможность самовывоза</li>
                  <li>• Расчет стоимости доставки индивидуально</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-wood-900 mb-6">Скидки и бонусы</h3>
                <p className="text-wood-600 mb-4">
                  Система скидок зависит от объема заказа и регулярности сотрудничества.
                </p>
                <ul className="space-y-2 text-wood-600">
                  <li>• Скидка от объема заказа</li>
                  <li>• Бонусы для постоянных клиентов</li>
                  <li>• Специальные предложения</li>
                  <li>• Сезонные акции</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Who Can Buy */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-12 text-center">
            Кто может покупать оптом
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-wood-900 mb-3">Розничные магазины</h3>
              <p className="text-wood-600">
                Магазины строительных материалов, хозяйственных товаров и специализированные точки продажи дров и отопительных материалов.
              </p>
            </div>
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-wood-900 mb-3">Строительные компании</h3>
              <p className="text-wood-600">
                Компании, занимающиеся строительством и нуждающиеся в регулярных поставках отопительных материалов.
              </p>
            </div>
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-wood-900 mb-3">Частные предприниматели</h3>
              <p className="text-wood-600">
                ИП, занимающиеся продажей дров и отопительных материалов, а также предоставлением услуг по отоплению.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-16">
          <div className="card-premium p-8 md:p-12 bg-gradient-to-br from-fire-50 to-wood-50">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-6">
                Станьте нашим оптовым партнером
              </h2>
              <p className="text-lg text-wood-700 mb-8">
                Свяжитесь с нашим отделом оптовых продаж для получения индивидуального коммерческого предложения
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="card-premium p-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Phone className="text-fire-600" size={24} />
                    <h3 className="text-lg font-semibold text-wood-900">Телефон</h3>
                  </div>
                  <a href="tel:+79991234567" className="text-fire-600 hover:text-fire-700 font-medium">
                    +7 (999) 123-45-67
                  </a>
                  <p className="text-sm text-wood-600 mt-2">Пн-Пт: 9:00 - 18:00</p>
                </div>
                <div className="card-premium p-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Mail className="text-fire-600" size={24} />
                    <h3 className="text-lg font-semibold text-wood-900">Email</h3>
                  </div>
                  <a href="mailto:wholesale@drovapremium.ru" className="text-fire-600 hover:text-fire-700 font-medium">
                    wholesale@drovapremium.ru
                  </a>
                  <p className="text-sm text-wood-600 mt-2">Ответим в течение 24 часов</p>
                </div>
              </div>
              <Link href="/contact" className="btn-primary inline-block">
                Отправить запрос
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="card-premium p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-6">
              Начните сотрудничество с нами
            </h2>
            <p className="text-lg text-wood-600 mb-8">
              Получите выгодные условия и стабильные поставки качественной продукции
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+79991234567" className="btn-primary">
                Позвонить нам
              </a>
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

