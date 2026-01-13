export default function Page() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-wood-900 mb-6">Наши услуги</h1>
        <div className="prose max-w-none text-wood-700">
          <p className="mb-6">Мы предлагаем полный спектр услуг для частных лиц и бизнеса:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Профессиональная консультация:</strong> Помощь в выборе древесины для любых целей.</li>
            <li><strong>Распил и обработка:</strong> Подготовка материалов под ваши точные размеры.</li>
            <li><strong>Доставка:</strong> Оперативная доставка собственным транспортом по всей России.</li>
            <li><strong>Разгрузка:</strong> Помощь в выгрузке и укладке материалов (по предварительной договоренности).</li>
            <li><strong>Оптовые поставки:</strong> Специальные условия для строительных компаний и крупных заказчиков.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
