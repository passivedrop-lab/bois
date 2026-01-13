// Типы для индивидуальных заказов

export interface WoodType {
    id: string
    name: string
    nameRu: string
    pricePerM3: number
    description: string
    image: string
    properties: {
        durability: number // 1-5
        moisture_resistance: number // 1-5
        color: string
    }
}

export interface Dimensions {
    height: number // в мм
    width: number // в мм
    length: number // в мм
}

export interface CustomOrderConfig {
    woodType: WoodType | null
    dimensions: Dimensions
    finish: string
    options: string[]
    quantity: number
}

export interface PriceBreakdown {
    volume: number // в м³
    basePrice: number // стоимость древесины
    finishCost: number // стоимость отделки
    optionsCost: number // стоимость опций
    customMarkup: number // наценка за индивидуальный заказ (25%)
    subtotal: number
    total: number
}

export interface CustomQuote extends CustomOrderConfig {
    id?: string
    pricing: PriceBreakdown
    createdAt?: Date
}

// Доступные типы древесины
export const WOOD_TYPES: WoodType[] = [
    {
        id: 'pine',
        name: 'Сосна',
        nameRu: 'Сосна',
        pricePerM3: 21000,
        description: 'Универсальная мягкая древесина, отличное соотношение цены и качества',
        image: '/images-product/bois-massif-charpente-sapin-douglas.jpg',
        properties: {
            durability: 3,
            moisture_resistance: 2,
            color: 'Светло-желтый'
        }
    },
    {
        id: 'spruce',
        name: 'Ель',
        nameRu: 'Ель',
        pricePerM3: 21000,
        description: 'Белая древесина, легкая, идеально подходит для строительства',
        image: '/images-product/bois-ossature-epicea-douglas-c24.jpg',
        properties: {
            durability: 3,
            moisture_resistance: 2,
            color: 'Кремово-белый'
        }
    },
    {
        id: 'larch',
        name: 'Лиственница',
        nameRu: 'Лиственница',
        pricePerM3: 33000,
        description: 'Очень прочная, устойчивая к влаге',
        image: '/images-product/planche-terrasse-lisse-meleze-28x140x4000mm.jpg',
        properties: {
            durability: 5,
            moisture_resistance: 5,
            color: 'Розовато-коричневый'
        }
    },
    {
        id: 'cedar',
        name: 'Кедр',
        nameRu: 'Кедр',
        pricePerM3: 125000,
        description: 'Благородная ароматная древесина, терапевтические свойства',
        image: '/images-product/lambris-bois-cedre-aromatique-14x140.jpg',
        properties: {
            durability: 5,
            moisture_resistance: 4,
            color: 'Розово-охристый'
        }
    },
    {
        id: 'linden',
        name: 'Липа',
        nameRu: 'Липа',
        pricePerM3: 38500,
        description: 'Идеально для сауны, не обжигает кожу',
        image: '/images-product/lambris-bois-tilleul-sauna-extra.jpg',
        properties: {
            durability: 3,
            moisture_resistance: 3,
            color: 'Слоновая кость'
        }
    },
    {
        id: 'alder',
        name: 'Ольха',
        nameRu: 'Ольха',
        pricePerM3: 23000,
        description: 'Благородная древесина, влагостойкая',
        image: '/images-product/lambris-bois-aulne-premium-sauna.jpg',
        properties: {
            durability: 4,
            moisture_resistance: 4,
            color: 'Коньячный'
        }
    },
    {
        id: 'oak',
        name: 'Дуб',
        nameRu: 'Дуб',
        pricePerM3: 32500,
        description: 'Премиальная древесина, очень прочная и благородная',
        image: '/images-product/panneau-bois-massif-chene-prestige-40x600.jpg',
        properties: {
            durability: 5,
            moisture_resistance: 4,
            color: 'Золотисто-коричневый'
        }
    },
    {
        id: 'birch',
        name: 'Береза',
        nameRu: 'Береза',
        pricePerM3: 16250,
        description: 'Светлая древесина, однородная, легко обрабатывается',
        image: '/images-product/panneau-contreplaque-batiment-10mm.jpg',
        properties: {
            durability: 3,
            moisture_resistance: 2,
            color: 'Бело-желтый'
        }
    }
]

// Доступные варианты отделки
export const FINISHES = [
    { id: 'raw', name: 'Необработанный', nameRu: 'Необработанный', priceMultiplier: 0 },
    { id: 'planed', name: 'Строганный', nameRu: 'Строганный', priceMultiplier: 0.15 },
    { id: 'sanded', name: 'Шлифованный', nameRu: 'Шлифованный', priceMultiplier: 0.20 },
    { id: 'oiled', name: 'Промасленный', nameRu: 'Промасленный', priceMultiplier: 0.25 },
    { id: 'varnished', name: 'Лакированный', nameRu: 'Лакированный', priceMultiplier: 0.30 },
    { id: 'thermo', name: 'Термообработанный', nameRu: 'Термообработанный', priceMultiplier: 0.50 }
]

// Дополнительные опции
export const OPTIONS = [
    { id: 'kiln_dried', name: 'Камерная сушка', nameRu: 'Камерная сушка', price: 3000 }, // за м³
    { id: 'antifungal', name: 'Антисептик', nameRu: 'Антисептик', price: 2000 },
    { id: 'chamfer', name: 'Фаски', nameRu: 'Фаски', price: 1500 },
    { id: 'custom_profile', name: 'Индивидуальный профиль', nameRu: 'Индивидуальный профиль', price: 5000 }
]

// Наценка за индивидуальный заказ
export const CUSTOM_ORDER_MARKUP = 0.25 // 25%
