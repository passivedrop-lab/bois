export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: string
          shipping_city: string
          shipping_postal_code: string
          shipping_country: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: string
          shipping_city: string
          shipping_postal_code: string
          shipping_country: string
        }
        Update: {
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: number
          product_name: string
          price: number
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: number
          product_name: string
          price: number
          quantity: number
        }
      }
      user_cart: {
        Row: {
          id: string
          user_id: string
          product_id: number
          product_name: string
          price: number
          quantity: number
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: number
          product_name: string
          price: number
          quantity: number
        }
        Update: {
          quantity?: number
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          product_id: number
          product_name: string
          price: number
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: number
          product_name: string
          price: number
        }
      }
    }
  }
}



