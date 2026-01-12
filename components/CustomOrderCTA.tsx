'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Hammer, ArrowRight, Sparkles } from 'lucide-react'

export default function CustomOrderCTA() {
    return (
        <section className="py-12 md:py-16 bg-gradient-to-br from-fire-500 via-fire-600 to-wood-800 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                        <Sparkles className="text-white" size={18} />
                        <span className="text-sm font-medium text-white">Индивидуальный подход</span>
                    </div>

                    {/* Titre */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                        Закажите мебель и древесину
                        <br />
                        по вашим размерам
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Укажите тип древесины, точные размеры и желаемую отделку.
                        Мы рассчитаем стоимость мгновенно и изготовим именно то, что вам нужно.
                    </p>

                    {/* CTA Button */}
                    <Link
                        href="/commande-sur-mesure"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-fire-600 rounded-xl font-bold text-lg hover:bg-wood-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                        <Hammer size={24} />
                        Создать индивидуальный заказ
                        <ArrowRight size={20} />
                    </Link>

                    {/* Avantages rapides */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 pt-8 border-t border-white/20">
                        <div>
                            <div className="text-3xl mb-2">✨</div>
                            <p className="text-sm md:text-base text-white font-medium">Точные размеры</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-2">🎯</div>
                            <p className="text-sm md:text-base text-white font-medium">Премиум качество</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-2">⚡</div>
                            <p className="text-sm md:text-base text-white font-medium">От 7 дней</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
