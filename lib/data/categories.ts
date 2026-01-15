export interface Category {
    name: string
    href: string
    icon?: string
}

export const CATEGORIES: Category[] = [
    { name: 'Строительная древесина', href: '/katalog/stroitelnyi-les', icon: '🏗️' },
    { name: 'Пиломатериалы', href: '/katalog/pilomaterialy', icon: '🪵' },
    { name: 'Дрова и биотопливо', href: '/katalog/drova', icon: '🔥' },
    { name: 'Древесина для сауны', href: '/katalog/materialy-dlya-bani', icon: '🧖' },
    { name: 'Декоративная древесина', href: '/katalog/dekorativnaya-otdelka', icon: '✨' },
    { name: 'Панели и плиты', href: '/katalog/paneli', icon: '📦' },
    { name: 'Дерево для наружных работ', href: '/katalog/fasadnye-sistemy', icon: '🌲' },
    { name: 'Техническая / индустриальная древесина', href: '/katalog/tekhnicheskoe-derevo', icon: '⚙️' },
]
