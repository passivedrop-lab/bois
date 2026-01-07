import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  isSyncing: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>
  removeItem: (id: number) => Promise<void>
  updateQuantity: (id: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  syncWithSupabase: (userId: string) => Promise<void>
  loadFromSupabase: (userId: string) => Promise<void>
  getTotal: () => number
  getItemCount: () => number
}

const supabase = createClient()

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isSyncing: false,
      
      addItem: async (item) => {
        const existingItem = get().items.find((i) => i.id === item.id)
        const newItems = existingItem
          ? get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          : [...get().items, { ...item, quantity: 1 }]
        
        set({ items: newItems })
        
        // Sync with Supabase if user is logged in
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          try {
            const cartItem = newItems.find(i => i.id === item.id)
            if (cartItem) {
              const { error } = await supabase
                .from('user_cart')
                .upsert({
                  user_id: user.id,
                  product_id: item.id,
                  product_name: item.name,
                  price: item.price,
                  quantity: cartItem.quantity,
                }, {
                  onConflict: 'user_id,product_id'
                })
              
              if (error) throw error
            }
          } catch (error) {
            console.error('Error syncing cart to Supabase:', error)
          }
        }
      },
      
      removeItem: async (id) => {
        const newItems = get().items.filter((i) => i.id !== id)
        set({ items: newItems })
        
        // Remove from Supabase if user is logged in
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          try {
            const { error } = await supabase
              .from('user_cart')
              .delete()
              .eq('user_id', user.id)
              .eq('product_id', id)
            
            if (error) throw error
          } catch (error) {
            console.error('Error removing item from Supabase:', error)
          }
        }
      },
      
      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(id)
          return
        }
        
        const newItems = get().items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        )
        set({ items: newItems })
        
        // Update in Supabase if user is logged in
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          try {
            const { error } = await supabase
              .from('user_cart')
              .update({ quantity })
              .eq('user_id', user.id)
              .eq('product_id', id)
            
            if (error) throw error
          } catch (error) {
            console.error('Error updating quantity in Supabase:', error)
          }
        }
      },
      
      clearCart: async () => {
        set({ items: [] })
        
        // Clear from Supabase if user is logged in
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          try {
            const { error } = await supabase
              .from('user_cart')
              .delete()
              .eq('user_id', user.id)
            
            if (error) throw error
          } catch (error) {
            console.error('Error clearing cart from Supabase:', error)
          }
        }
      },
      
      syncWithSupabase: async (userId: string) => {
        if (get().isSyncing) return
        set({ isSyncing: true })
        
        try {
          const localItems = get().items
          
          // Get items from Supabase
          const { data: supabaseItems, error } = await supabase
            .from('user_cart')
            .select('*')
            .eq('user_id', userId)
          
          if (error) throw error
          
          // Merge strategy: Supabase takes precedence for logged-in users
          if (supabaseItems && supabaseItems.length > 0) {
            const mergedItems: CartItem[] = supabaseItems.map((item) => ({
              id: item.product_id,
              name: item.product_name,
              price: item.price,
              quantity: item.quantity,
            }))
            set({ items: mergedItems })
          } else if (localItems.length > 0) {
            // If Supabase is empty but local has items, sync local to Supabase
            for (const item of localItems) {
              await supabase
                .from('user_cart')
                .upsert({
                  user_id: userId,
                  product_id: item.id,
                  product_name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                }, {
                  onConflict: 'user_id,product_id'
                })
            }
          }
        } catch (error) {
          console.error('Error syncing cart with Supabase:', error)
        } finally {
          set({ isSyncing: false })
        }
      },
      
      loadFromSupabase: async (userId: string) => {
        try {
          const { data, error } = await supabase
            .from('user_cart')
            .select('*')
            .eq('user_id', userId)
          
          if (error) throw error
          
          if (data && data.length > 0) {
            const items: CartItem[] = data.map((item) => ({
              id: item.product_id,
              name: item.product_name,
              price: item.price,
              quantity: item.quantity,
            }))
            set({ items })
          }
        } catch (error) {
          console.error('Error loading cart from Supabase:', error)
        }
      },
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
