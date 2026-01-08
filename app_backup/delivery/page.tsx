import { Truck, MapPin, Clock, Package, Shield } from 'lucide-react'
import Link from 'next/link'

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-wood-900 via-wood-800 to-fire-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-fire-500/20 backdrop-blur-sm rounded-full p-4 mb-6">
              <Truck size={48} className="text-fire-400" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Доставка дров
            </h1>
            <p className="text-xl md:text-2xl text-wood-200">
              Быстрая и надежная доставка по всей России
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Delivery Options */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-12 text-center">
            Варианты доставки
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-premium p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mb-6">
                <Truck className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-wood-900 mb-4">Стандартная доставка</h3>
              <p className="text-wood-600 mb-4">
                Доставка в течение 5-10 рабочих дней. Стоимость рассчитывается индивидуально в зависимости от региона и объема заказа.
              </p>
              <p className="text-fire-600 font-semibold">От 500 ₽</p>
            </div>

            <div className="card-premium p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mb-6">
                <Clock className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-wood-900 mb-4">Экспресс доставка</h3>
              <p className="text-wood-600 mb-4">
                Срочная доставка в течение 2-3 рабочих дней. Доступна для крупных городов и близлежащих регионов.
              </p>
              <p className="text-fire-600 font-semibold">От 1500 ₽</p>
            </div>

            <div className="card-premium p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mb-6">
                <Package className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-wood-900 mb-4">Самовывоз</h3>
              <p className="text-wood-600 mb-4">
                Заберите заказ самостоятельно с нашего склада. Бесплатно и в удобное для вас время.
              </p>
              <p className="text-fire-600 font-semibold">Бесплатно</p>
            </div>
          </div>
        </section>

        {/* Free Delivery */}
        <section className="mb-16">
          <div className="card-premium p-8 md:p-12 bg-gradient-to-br from-fire-50 to-wood-50">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-fire-600 rounded-full mb-6">
                <Shield className="text-white" size={40} />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-6">
                Бесплатная доставка
              </h2>
              <p className="text-xl text-wood-700 mb-4">
                При заказе от <span className="text-fire-600 font-bold">10 000 рублей</span> доставка по всей России бесплатная!
              </p>
              <p className="text-wood-600">
                Экономите на доставке и получаете качественные товары по выгодным ценам.
              </p>
            </div>
          </div>
        </section>

        {/* Delivery Regions */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-12 text-center">
            Регионы доставки
          </h2>
          <div className="card-premium p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-fire-600" size={24} />
                  <h3 className="text-xl font-semibold text-wood-900">Центральный регион</h3>
                </div>
                <p className="text-wood-600 mb-4">
                  Доставка в Москву, Московскую область и близлежащие регионы осуществляется в течение 1-3 дней.
                </p>
                <ul className="space-y-2 text-wood-600">
                  <li>• Москва и МО</li>
                  <li>• Тверская область</li>
                  <li>• Калужская область</li>
                  <li>• Тульская область</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-fire-600" size={24} />
                  <h3 className="text-xl font-semibold text-wood-900">Вся Россия</h3>
                </div>
                <p className="text-wood-600 mb-4">
                  Доставляем заказы во все регионы Российской Федерации. Сроки доставки зависят от удаленности региона.
                </p>
                <ul className="space-y-2 text-wood-600">
                  <li>• Северо-Западный регион</li>
                  <li>• Поволжье</li>
                  <li>• Урал и Сибирь</li>
                  <li>• Дальний Восток</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Terms */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-12 text-center">
            Условия доставки
          </h2>
          <div className="card-premium p-8 md:p-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-wood-900 mb-2">Оформление заказа</h3>
                  <p className="text-wood-600">
                    После оформления заказа наш менеджер свяжется с вами в течение 24 часов для подтверждения и уточнения деталей доставки.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-wood-900 mb-2">Подготовка заказа</h3>
                  <p className="text-wood-600">
                    Заказ готовится к отправке в течение 1-2 рабочих дней. Мы тщательно упаковываем товары для безопасной транспортировки.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-wood-900 mb-2">Транспортировка</h3>
                  <p className="text-wood-600">
                    Доставка осуществляется специализированным транспортом с соблюдением всех условий хранения и транспортировки.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-fire-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-wood-900 mb-2">Получение заказа</h3>
                  <p className="text-wood-600">
                    Перед доставкой курьер свяжется с вами для согласования времени. При получении проверьте целостность упаковки и соответствие заказа.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="card-premium p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-6">
              Готовы оформить заказ?
            </h2>
            <p className="text-lg text-wood-600 mb-8">
              Выберите товары и мы доставим их в удобное для вас время
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


