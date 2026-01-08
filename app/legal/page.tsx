export default function LegalPage() {
  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-wood-900 mb-8">Правовая информация</h1>

          <div className="space-y-8 text-wood-700">
            {/* Компания */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-wood-900 mb-4">О компании</h2>
              <p className="mb-2"><strong>Название:</strong> TsarstvoDereva</p>
              <p className="mb-2"><strong>Адрес:</strong> Москва, ул. Лесная, д. 15</p>
              <p className="mb-2"><strong>Телефон:</strong> +7 (999) 123-45-67</p>
              <p><strong>Email:</strong> info@tsarstvadereva.ru</p>
            </section>

            {/* Права */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-wood-900 mb-4">Лицензии и сертификаты</h2>
              <p className="mb-4">
                TsarstvoDereva имеет все необходимые лицензии и разрешения на продажу лесоматериалов.
                Наша компания соблюдает все стандарты качества и экологические нормы.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Полная коммерческая лицензия на торговлю пиломатериалами</li>
                <li>Сертификаты соответствия на всю продукцию</li>
                <li>Соблюдение экологических стандартов и норм (ГОСТ, ISO)</li>
                <li>Регистрация в федеральных органах РФ</li>
                <li>Полное соблюдение законодательства о защите прав потребителей</li>
                <li>Соблюдение норм устойчивого лесопользования</li>
              </ul>
            </section>

            {/* Условия продажи */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-wood-900 mb-4">Условия продажи</h2>
              <p className="mb-4">
                Оформляя заказ на нашей платформе, вы соглашаетесь с нашими общими условиями продажи.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Цены указаны в российских рублях (RUB) с учетом НДС</li>
                <li>Количество товара ограничено и резервируется в порядке поступления заказов</li>
                <li>Сроки доставки являются ориентировочными и зависят от вашего местоположения</li>
                <li>Клиент обязуется проверить состояние груза при получении</li>
                <li>Любые претензии принимаются в течение 14 дней после доставки</li>
              </ul>
            </section>

            {/* Оплата */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-wood-900 mb-4">Условия оплаты</h2>
              <p className="mb-4">
                Мы принимаем оплату только банковским переводом. Это безопасный и прозрачный процесс:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Подтверждение корзины и адреса доставки</li>
                <li>Получение банковских реквизитов для перевода</li>
                <li>Осуществление перевода</li>
                <li>Загрузка подтверждения платежа (квитанции) на платформу</li>
                <li>Подтверждение и обработка вашего заказа менеджером</li>
              </ol>
              <p className="mt-4 text-sm text-wood-600">
                <strong>Важно:</strong> Заказы обрабатываются только после получения и подтверждения оплаты.
              </p>
            </section>

            {/* Ответственность */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-wood-900 mb-4">Ограничение ответственности</h2>
              <p className="mb-4">
                TsarstvoDereva не несет ответственности за:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Повреждения, возникшие по вине транспортной компании (если доставка не наша)</li>
                <li>Потерю данных или доступа к сайту по техническим причинам</li>
                <li>Прерывание обслуживания из-за форс-мажорных обстоятельств</li>
                <li>Неправильное использование приобретенной продукции</li>
              </ul>
            </section>

            {/* Защита данных */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-wood-900 mb-4">Защита персональных данных</h2>
              <p className="mb-4">
                Ваши персональные данные собираются и обрабатываются в соответствии с законодательством РФ.
                Мы никогда не передаем вашу информацию третьим лицам без вашего явного согласия.
              </p>
              <p>
                По вопросам обработки персональных данных обращайтесь по адресу: <strong>privacy@tsarstvadereva.ru</strong>
              </p>
            </section>

            {/* Контакты */}
            <section className="bg-fire-50 rounded-lg p-6 border border-fire-200">
              <h2 className="text-xl font-bold text-wood-900 mb-2">Остались вопросы?</h2>
              <p>
                Свяжитесь с нашей службой поддержки для получения дополнительной информации.
              </p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:legal@tsarstvadereva.ru" className="text-fire-600 hover:text-fire-700">legal@tsarstvadereva.ru</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
