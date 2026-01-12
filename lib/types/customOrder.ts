// Types pour les commandes sur mesure

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
    height: number // en mm
    width: number // en mm
    length: number // en mm
}

export interface CustomOrderConfig {
    woodType: WoodType | null
    dimensions: Dimensions
    finish: string
    options: string[]
    quantity: number
}

export interface PriceBreakdown {
    volume: number // en m³
    basePrice: number // prix du bois
    finishCost: number // coût des finitions
    optionsCost: number // coût des options
    customMarkup: number // majoration sur mesure (25%)
    subtotal: number
    total: number
}

export interface CustomQuote extends CustomOrderConfig {
    id?: string
    pricing: PriceBreakdown
    createdAt?: Date
}

// Types de bois disponibles
export const WOOD_TYPES: WoodType[] = [
    {
        id: 'pine',
        name: 'Pin',
        nameRu: 'Сосна',
        pricePerM3: 21000,
        description: 'Bois tendre polyvalent, excellent rapport qualité-prix',
        image: '/images-product/bois-massif-charpente-sapin-douglas.jpg',
        properties: {
            durability: 3,
            moisture_resistance: 2,
            color: 'Jaune clair'
        }
    },
    {
        id: 'spruce',
        name: 'Épicéa',
        nameRu: 'Ель',
        pricePerM3: 21000,
        description: 'Bois blanc, léger, idéal pour la construction',
        image: '/images-product/bois-ossature-epicea-douglas-c24.jpg',
        properties: {
            durability: 3,
            moisture_resistance: 2,
            color: 'Blanc crème'
        }
    },
    {
        id: 'larch',
        name: 'Mélèze',
        nameRu: 'Лиственница',
        pricePerM3: 33000,
        description: 'Très durable, résistant à l\'humidité',
        image: '/images-product/planche-terrasse-lisse-meleze-28x140x4000mm.jpg',
        properties: {
            durability: 5,
            moisture_resistance: 5,
            color: 'Brun rosé'
        }
    },
    {
        id: 'cedar',
        name: 'Cèdre',
        nameRu: 'Кедр',
        pricePerM3: 125000,
        description: 'Bois noble aromatique, propriétés thérapeutiques',
        image: '/images-product/lambris-bois-cedre-aromatique-14x140.jpg',
        properties: {
            durability: 5,
            moisture_resistance: 4,
            color: 'Rose-ocre'
        }
    },
    {
        id: 'linden',
        name: 'Tilleul',
        nameRu: 'Липа',
        pricePerM3: 38500,
        description: 'Idéal pour sauna, ne brûle pas la peau',
        image: '/images-product/lambris-bois-tilleul-sauna-extra.jpg',
        properties: {
            durability: 3,
            moisture_resistance: 3,
            color: 'Blanc crème'
        }
    },
    {
        id: 'alder',
        name: 'Aulne',
        nameRu: 'Ольха',
        pricePerM3: 23000,
        description: 'Bois noble, résistant à l\'humidité',
        image: '/images-product/lambris-bois-aulne-premium-sauna.jpg',
        properties: {
            durability: 4,
            moisture_resistance: 4,
            color: 'Cognac'
        }
    },
    {
        id: 'oak',
        name: 'Chêne',
        nameRu: 'Дуб',
        pricePerM3: 32500,
        description: 'Bois premium, très durable et noble',
        image: '/images-product/panneau-bois-massif-chene-prestige-40x600.jpg',
        properties: {
            durability: 5,
            moisture_resistance: 4,
            color: 'Brun doré'
        }
    },
    {
        id: 'birch',
        name: 'Bouleau',
        nameRu: 'Береза',
        pricePerM3: 16250,
        description: 'Bois clair, homogène, facile à travailler',
        image: '/images-product/panneau-contreplaque-batiment-10mm.jpg',
        properties: {
            durability: 3,
            moisture_resistance: 2,
            color: 'Blanc-jaune'
        }
    }
]

// Finitions disponibles
export const FINISHES = [
    { id: 'raw', name: 'Brut', nameRu: 'Необработанный', priceMultiplier: 0 },
    { id: 'planed', name: 'Raboté', nameRu: 'Строганный', priceMultiplier: 0.15 },
    { id: 'sanded', name: 'Poncé', nameRu: 'Шлифованный', priceMultiplier: 0.20 },
    { id: 'oiled', name: 'Huilé', nameRu: 'Промасленный', priceMultiplier: 0.25 },
    { id: 'varnished', name: 'Vernis', nameRu: 'Лакированный', priceMultiplier: 0.30 },
    { id: 'thermo', name: 'Thermottraité', nameRu: 'Термообработанный', priceMultiplier: 0.50 }
]

// Options supplémentaires
export const OPTIONS = [
    { id: 'kiln_dried', name: 'Séchage en chambre', nameRu: 'Камерная сушка', price: 3000 }, // par m³
    { id: 'antifungal', name: 'Traitement antifongique', nameRu: 'Антисептик', price: 2000 },
    { id: 'chamfer', name: 'Chanfreins', nameRu: 'Фаски', price: 1500 },
    { id: 'custom_profile', name: 'Profil personnalisé', nameRu: 'Индивидуальный профиль', price: 5000 }
]

// Majoration pour commande sur mesure
export const CUSTOM_ORDER_MARKUP = 0.25 // 25%
