export default function Page() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-wood-900 mb-6">Доставка и Оплата</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-wood-900 mb-4">Доставка</h2>
            <ul className="space-y-4 text-wood-700">
              <li>
                <strong>География:</strong> Мы доставляем товары по всей территории Российской Федерации.
              </li>
              <li>
                <strong>Сроки:</strong> От 2 до 5 рабочих дней в зависимости от удаленности региона.
              </li>
              <li>
                <strong>Стоимость:</strong> Рассчитывается индивидуально при оформлении заказа.
              </li>
              <li className="bg-fire-50 p-4 rounded-lg border border-fire-100 text-fire-800">
                <strong>Акция:</strong> Бесплатная доставка при заказе от 100 000 ₽.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-wood-900 mb-4">Оплата</h2>
            <p className="text-wood-700 mb-4">
              Мы работаем официально и принимаем оплату банковским переводом для обеспечения безопасности сделки.
            </p>
            <ul className="space-y-2 text-wood-700">
              <li>• Оплата по счету для юридических лиц</li>
              <li>• Банковский перевод для физических лиц</li>
            </ul>
            <p className="mt-4 text-sm text-wood-500">
              Все необходимые документы (накладная, чек, гарантийный талон) предоставляются при получении товара.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
