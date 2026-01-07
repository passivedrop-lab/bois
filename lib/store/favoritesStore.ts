import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

export interface FavoriteItem {
  id: number
  name: string
  price: number
  image?: string
}

interface FavoritesStore {
  items: FavoriteItem[]
  isSyncing: boolean
  addFavorite: (item: FavoriteItem) => Promise<void>
  removeFavorite: (id: number) => Promise<void>
  isFavorite: (id: number) => boolean
  toggleFavorite: (item: FavoriteItem) => Promise<void>
  syncWithSupabase: (userId: string) => Promise<void>
  loadFromSupabase: (userId: string) => Promise<void>
}

const supabase = createClient()

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      isSyncing: false,
      
      addFavorite: async (item) => {
        if (!get().isFavorite(item.id)) {
          const newItems = [...get().items, item]
          set({ items: newItems })
          
          // Sync with Supabase if user is logged in
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            try {
              const { error } = await supabase
                .from('user_favorites')
                .upsert({
                  user_id: user.id,
                  product_id: item.id,
                  product_name: item.name,
                  price: item.price,
                }, {
                  onConflict: 'user_id,product_id'
                })
              
              if (error) throw error
            } catch (error) {
              console.error('Error syncing favorite to Supabase:', error)
            }
          }
        }
      },
      
      removeFavorite: async (id) => {
        const newItems = get().items.filter((i) => i.id !== id)
        set({ items: newItems })
        
        // Remove from Supabase if user is logged in
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          try {
            const { error } = await supabase
              .from('user_favorites')
              .delete()
              .eq('user_id', user.id)
              .eq('product_id', id)
            
            if (error) throw error
          } catch (error) {
            console.error('Error removing favorite from Supabase:', error)
          }
        }
      },
      
      isFavorite: (id) => {
        return get().items.some((i) => i.id === id)
      },
      
      toggleFavorite: async (item) => {
        if (get().isFavorite(item.id)) {
          await get().removeFavorite(item.id)
        } else {
          await get().addFavorite(item)
        }
      },
      
      syncWithSupabase: async (userId: string) => {
        if (get().isSyncing) return
        set({ isSyncing: true })
        
        try {
          const localItems = get().items
          
          // Get items from Supabase
          const { data: supabaseItems, error } = await supabase
            .from('user_favorites')
            .select('*')
            .eq('user_id', userId)
          
          if (error) throw error
          
          // Merge strategy: Supabase takes precedence for logged-in users
          if (supabaseItems && supabaseItems.length > 0) {
            const mergedItems: FavoriteItem[] = supabaseItems.map((item) => ({
              id: item.product_id,
              name: item.product_name,
              price: item.price,
            }))
            set({ items: mergedItems })
          } else if (localItems.length > 0) {
            // If Supabase is empty but local has items, sync local to Supabase
            for (const item of localItems) {
              await supabase
                .from('user_favorites')
                .upsert({
                  user_id: userId,
                  product_id: item.id,
                  product_name: item.name,
                  price: item.price,
                }, {
                  onConflict: 'user_id,product_id'
                })
            }
          }
        } catch (error) {
          console.error('Error syncing favorites with Supabase:', error)
        } finally {
          set({ isSyncing: false })
        }
      },
      
      loadFromSupabase: async (userId: string) => {
        try {
          const { data, error } = await supabase
            .from('user_favorites')
            .select('*')
            .eq('user_id', userId)
          
          if (error) throw error
          
          if (data && data.length > 0) {
            const items: FavoriteItem[] = data.map((item) => ({
              id: item.product_id,
              name: item.product_name,
              price: item.price,
            }))
            set({ items })
          }
        } catch (error) {
          console.error('Error loading favorites from Supabase:', error)
        }
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
