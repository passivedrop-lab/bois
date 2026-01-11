'use client'

import { Send } from 'lucide-react'

export default function TelegramFloat() {
    return (
        <a
            href="https://t.me/TSARSTVODEREVA"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[100] bg-blue-500 text-white p-4 rounded-full shadow-2xl hover:bg-blue-600 hover:scale-110 transition-all duration-300 group flex items-center gap-2"
            aria-label="Связаться с нами в Telegram"
        >
            <div className="relative">
                <Send size={24} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm">
                @TSARSTVODEREVA
            </span>
        </a>
    )
}
