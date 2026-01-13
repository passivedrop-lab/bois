'use client'

import { motion } from 'framer-motion'
import { Hammer } from 'lucide-react'
import WoodTypeSelector from './WoodTypeSelector'
import DimensionsInput from './DimensionsInput'
import FinishSelector from './FinishSelector'
import QuoteDisplay from './QuoteDisplay'

export default function CustomOrderSection() {
    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Основной конфигуратор */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid lg:grid-cols-3 gap-8"
                >
                    {/* Левая колонка: Конфигуратор */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Карточка конфигурации */}
                        <div className="bg-white rounded-2xl shadow-lg border border-wood-200 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-wood-200">
                                <div className="p-3 bg-fire-100 rounded-xl">
                                    <Hammer className="text-fire-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-wood-900">Конфигуратор заказа</h3>
                                    <p className="text-sm text-wood-600">Шаг за шагом создайте идеальный продукт</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Шаг 1: Тип древесины */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-fire-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            1
                                        </div>
                                        <h4 className="text-lg font-semibold text-wood-900">Выберите тип древесины</h4>
                                    </div>
                                    <WoodTypeSelector />
                                </div>

                                {/* Шаг 2: Размеры */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-fire-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            2
                                        </div>
                                        <h4 className="text-lg font-semibold text-wood-900">Укажите размеры</h4>
                                    </div>
                                    <DimensionsInput />
                                </div>

                                {/* Шаг 3: Отделка */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-fire-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            3
                                        </div>
                                        <h4 className="text-lg font-semibold text-wood-900">Выберите отделку и опции</h4>
                                    </div>
                                    <FinishSelector />
                                </div>
                            </div>
                        </div>

                        {/* Преимущества индивидуального заказа */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-gradient-to-br from-fire-50 to-wood-50 rounded-xl border border-fire-200">
                                <div className="text-2xl mb-2">✨</div>
                                <h5 className="font-semibold text-wood-900 mb-1">Точность</h5>
                                <p className="text-xs text-wood-600">Изготовим по вашим точным размерам</p>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-fire-50 to-wood-50 rounded-xl border border-fire-200">
                                <div className="text-2xl mb-2">🎯</div>
                                <h5 className="font-semibold text-wood-900 mb-1">Качество</h5>
                                <p className="text-xs text-wood-600">Отборная древесина премиум класса</p>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-fire-50 to-wood-50 rounded-xl border border-fire-200">
                                <div className="text-2xl mb-2">⚡</div>
                                <h5 className="font-semibold text-wood-900 mb-1">Быстро</h5>
                                <p className="text-xs text-wood-600">Производство от 7 рабочих дней</p>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка: Расчет */}
                    <div className="lg:col-span-1">
                        <QuoteDisplay />
                    </div>
                </motion.div>

                {/* Примечание */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <p className="text-sm text-wood-600 max-w-2xl mx-auto">
                        <strong>Как это работает:</strong> После добавления в корзину и оформления заказа,
                        наши специалисты свяжутся с вами для уточнения всех деталей и согласования сроков производства.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
