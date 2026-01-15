export default function Page() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-wood-900 mb-6">Наши услуги</h1>
        <div className="prose max-w-none text-wood-700">
          <p className="mb-6 text-lg">Мы предлагаем полный спектр услуг для частных лиц и бизнеса:</p>

          <div className="space-y-12">
            <section id="consultation" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-wood-900 mb-2">Профессиональная консультация</h2>
              <p>Наши эксперты помогут вам выбрать идеальную древесину для ваших целей. Мы учитываем условия эксплуатации, бюджет и эстетические предпочтения.</p>
            </section>

            <section id="cutting" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-wood-900 mb-2">Распил и обработка</h2>
              <p>Подготовим материалы под ваши точные размеры. Наше оборудование позволяет выполнять распил с высокой точностью, а также строгание и шлифовку.</p>
            </section>

            <section id="delivery" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-wood-900 mb-2">Доставка</h2>
              <p>Оперативная доставка собственным транспортом по всей России. Мы гарантируем сохранность груза и соблюдение сроков.</p>
            </section>

            <section id="wholesale" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-wood-900 mb-2">Оптовые поставки</h2>
              <p>Специальные условия для строительных компаний и крупных заказчиков. Гибкая система скидок и приоритетное обслуживание.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
