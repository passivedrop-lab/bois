import { create } from 'zustand'
import {
    WoodType,
    Dimensions,
    CustomOrderConfig,
    PriceBreakdown,
    CustomQuote,
    FINISHES,
    OPTIONS,
    CUSTOM_ORDER_MARKUP
} from '@/lib/types/customOrder'

interface CustomOrderStore extends CustomOrderConfig {
    // Actions
    setWoodType: (type: WoodType | null) => void
    setDimensions: (dims: Partial<Dimensions>) => void
    setFinish: (finish: string) => void
    toggleOption: (option: string) => void
    setQuantity: (qty: number) => void

    // Calculateurs
    calculateVolume: () => number
    calculatePrice: () => PriceBreakdown
    generateQuote: () => CustomQuote

    // Validation
    isValid: () => boolean

    // Réinitialisation
    reset: () => void
}

const initialState: CustomOrderConfig = {
    woodType: null,
    dimensions: {
        height: 100,
        width: 100,
        length: 3000
    },
    finish: 'raw',
    options: [],
    quantity: 1
}

export const useCustomOrderStore = create<CustomOrderStore>((set, get) => ({
    ...initialState,

    setWoodType: (type) => set({ woodType: type }),

    setDimensions: (dims) => set((state) => ({
        dimensions: { ...state.dimensions, ...dims }
    })),

    setFinish: (finish) => set({ finish }),

    toggleOption: (option) => set((state) => ({
        options: state.options.includes(option)
            ? state.options.filter(o => o !== option)
            : [...state.options, option]
    })),

    setQuantity: (qty) => set({ quantity: Math.max(1, qty) }),

    calculateVolume: () => {
        const { dimensions } = get()
        // Convertir mm en m et calculer le volume
        const volumeM3 = (dimensions.height / 1000) * (dimensions.width / 1000) * (dimensions.length / 1000)
        return volumeM3
    },

    calculatePrice: () => {
        const { woodType, finish, options, quantity } = get()

        if (!woodType) {
            return {
                volume: 0,
                basePrice: 0,
                finishCost: 0,
                optionsCost: 0,
                customMarkup: 0,
                subtotal: 0,
                total: 0
            }
        }

        const volume = get().calculateVolume()
        const totalVolume = volume * quantity

        // Prix de base du bois
        const basePrice = woodType.pricePerM3 * totalVolume

        // Coût de la finition (pourcentage du prix de base)
        const finishData = FINISHES.find(f => f.id === finish)
        const finishCost = finishData ? basePrice * finishData.priceMultiplier : 0

        // Coût des options (prix fixe par m³)
        const optionsCost = options.reduce((total, optionId) => {
            const option = OPTIONS.find(o => o.id === optionId)
            return total + (option ? option.price * totalVolume : 0)
        }, 0)

        // Sous-total avant majoration
        const subtotal = basePrice + finishCost + optionsCost

        // Majoration pour commande sur mesure (25%)
        const customMarkup = subtotal * CUSTOM_ORDER_MARKUP

        // Total final
        const total = subtotal + customMarkup

        return {
            volume: totalVolume,
            basePrice,
            finishCost,
            optionsCost,
            customMarkup,
            subtotal,
            total
        }
    },

    generateQuote: () => {
        const state = get()
        return {
            woodType: state.woodType,
            dimensions: state.dimensions,
            finish: state.finish,
            options: state.options,
            quantity: state.quantity,
            pricing: state.calculatePrice(),
            createdAt: new Date()
        }
    },

    isValid: () => {
        const { woodType, dimensions } = get()
        return (
            woodType !== null &&
            dimensions.height > 0 &&
            dimensions.width > 0 &&
            dimensions.length > 0
        )
    },

    reset: () => set(initialState)
}))
