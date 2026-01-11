'use client'

import { motion } from 'framer-motion'

interface CategoryHeroProps {
    title: string
    subtitle: string
    icon?: string
}

export default function CategoryHero({ title, subtitle, icon }: CategoryHeroProps) {
    return (
        <div className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 bg-gradient-to-br from-wood-950 via-wood-900 to-wood-800 text-white rounded-3xl mb-12 shadow-3xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-fire-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-wood-500/10 rounded-full blur-3xl" />

            {/* Texture Layer */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center">
                    {icon && (
                        <motion.div
                            initial={{ scale: 0, rotate: -20, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.2
                            }}
                            className="text-6xl md:text-8xl mb-8 select-none"
                        >
                            {icon}
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tighter mb-6 leading-none">
                            {title.split('').map((char, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.5 + (index * 0.03),
                                        ease: "easeOut"
                                    }}
                                    className="inline-block"
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </motion.span>
                            ))}
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                        className="max-w-2xl"
                    >
                        <p className="text-xl md:text-2xl text-wood-200 font-light leading-relaxed font-sans">
                            {subtitle}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                        className="w-24 h-1 bg-gradient-to-r from-transparent via-fire-500 to-transparent mt-12 mb-4"
                    />
                </div>
            </div>

            {/* Glassmorphism accent */}
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
    )
}
