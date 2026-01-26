import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Page() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-wood-900 mb-8">Контакты</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-wood-900 mb-4">Свяжитесь с нами</h2>
            <p className="text-wood-600 mb-8">
              Наша команда готова ответить на любые ваши вопросы и помочь с выбором.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-wood-100 p-3 rounded-lg">
                  <MapPin className="text-wood-900" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-wood-900">Наш офис</h3>
                  <p className="text-wood-600">Россия, Вологодская обл., г. Никольск, ул. Ленина, д. 12</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-wood-100 p-3 rounded-lg">
                  <Phone className="text-wood-900" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-wood-900">Телефон</h3>
                  <p className="text-wood-600">+7 (81754) 2-18-35</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-wood-100 p-3 rounded-lg">
                  <Mail className="text-wood-900" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-wood-900">Email</h3>
                  <p className="text-wood-600">seles95@yandex.ru</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-wood-100 p-3 rounded-lg">
                  <Clock className="text-wood-900" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-wood-900">Режим работы</h3>
                  <p className="text-wood-600">Пн - Вс: 09:00 - 20:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-wood-50 p-8 rounded-xl border border-wood-100">
            <h2 className="text-2xl font-bold text-wood-900 mb-6">Напишите нам</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-wood-700 mb-1">Ваше имя</label>
                <input type="text" className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wood-700 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wood-700 mb-1">Сообщение</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"></textarea>
              </div>
              <button type="button" className="w-full bg-fire-600 text-white py-3 rounded-lg hover:bg-fire-700 transition font-semibold">
                Отправить
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
