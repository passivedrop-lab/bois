import CustomOrderSection from '@/components/CustomOrderSection'

export const metadata = {
    title: 'Индивидуальный заказ | Tsarstvo Dereva',
    description: 'Закажите мебель и древесину по вашим точным размерам. Выберите тип древесины, укажите размеры и получите мгновенный расчет стоимости.',
}

export default function CustomOrderPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-wood-50 to-white">
            {/* Hero Section */}
            <section className="py-12 md:py-16 bg-gradient-to-br from-fire-500 via-fire-600 to-wood-800">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4">
                            Индивидуальный заказ
                        </h1>
                        <p className="text-lg md:text-xl text-white/90">
                            Создайте идеальный продукт с точными размерами и характеристиками
                        </p>
                    </div>
                </div>
            </section>

            {/* Custom Order Configurator */}
            <CustomOrderSection />
        </main>
    )
}
