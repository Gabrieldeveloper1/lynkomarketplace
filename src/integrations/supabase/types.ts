export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      appeals: {
        Row: {
          created_at: string;
          id: string;
          message: string;
          staff_reply: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          message: string;
          staff_reply?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          message?: string;
          staff_reply?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appeals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          description: string;
          display_mode: string;
          icon: string;
          image_url: string | null;
          name: string;
          position: number;
          slug: string;
        };
        Insert: {
          description?: string;
          display_mode?: string;
          icon?: string;
          image_url?: string | null;
          name: string;
          position?: number;
          slug: string;
        };
        Update: {
          description?: string;
          display_mode?: string;
          icon?: string;
          image_url?: string | null;
          name?: string;
          position?: number;
          slug?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          buyer_id: string;
          created_at: string;
          id: string;
          last_message_at: string;
          moderation_cancelled_at: string | null;
          moderation_note: string | null;
          moderation_requested: boolean;
          moderation_requested_by: string | null;
          moderation_status: string;
          moderation_updated_at: string | null;
          moderator_id: string | null;
          product_id: string | null;
          conversation_type: string;
          seller_id: string;
        };
        Insert: {
          buyer_id: string;
          created_at?: string;
          id?: string;
          last_message_at?: string;
          moderation_cancelled_at?: string | null;
          moderation_note?: string | null;
          moderation_requested?: boolean;
          moderation_requested_by?: string | null;
          moderation_status?: string;
          moderation_updated_at?: string | null;
          moderator_id?: string | null;
          product_id?: string | null;
          conversation_type?: string;
          seller_id: string;
        };
        Update: {
          buyer_id?: string;
          created_at?: string;
          id?: string;
          last_message_at?: string;
          moderation_cancelled_at?: string | null;
          moderation_note?: string | null;
          moderation_requested?: boolean;
          moderation_requested_by?: string | null;
          moderation_status?: string;
          moderation_updated_at?: string | null;
          moderator_id?: string | null;
          product_id?: string | null;
          conversation_type?: string;
          seller_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_moderation_requested_by_fkey";
            columns: ["moderation_requested_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_moderator_id_fkey";
            columns: ["moderator_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      delivery_items: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          product_id: string;
          seller_id: string;
          sold: boolean;
          variant_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          product_id: string;
          seller_id: string;
          sold?: boolean;
          variant_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          product_id?: string;
          seller_id?: string;
          sold?: boolean;
          variant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "delivery_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "delivery_items_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "delivery_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      favorites: {
        Row: {
          created_at: string;
          product_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          product_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          product_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "favorites_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      follows: {
        Row: {
          created_at: string;
          follower_id: string;
          seller_id: string;
        };
        Insert: {
          created_at?: string;
          follower_id: string;
          seller_id: string;
        };
        Update: {
          created_at?: string;
          follower_id?: string;
          seller_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey";
            columns: ["follower_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "follows_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      kyc_sessions: {
        Row: {
          created_at: string;
          decision: Json | null;
          id: string;
          last_event_id: string | null;
          session_id: string;
          status: string;
          updated_at: string;
          url: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          decision?: Json | null;
          id?: string;
          last_event_id?: string | null;
          session_id: string;
          status?: string;
          updated_at?: string;
          url?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          decision?: Json | null;
          id?: string;
          last_event_id?: string | null;
          session_id?: string;
          status?: string;
          updated_at?: string;
          url?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          body: string;
          conversation_id: string;
          created_at: string;
          hidden: boolean;
          id: string;
          kind: string;
          read_at: string | null;
          reply_to_id: string | null;
          sender_id: string;
        };
        Insert: {
          body: string;
          conversation_id: string;
          created_at?: string;
          hidden?: boolean;
          id?: string;
          kind?: string;
          read_at?: string | null;
          reply_to_id?: string | null;
          sender_id: string;
        };
        Update: {
          body?: string;
          conversation_id?: string;
          created_at?: string;
          hidden?: boolean;
          id?: string;
          kind?: string;
          read_at?: string | null;
          reply_to_id?: string | null;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_reply_to_id_fkey";
            columns: ["reply_to_id"];
            isOneToOne: false;
            referencedRelation: "messages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notification_preferences: {
        Row: {
          created_at: string;
          marketing: boolean;
          messages: boolean;
          orders: boolean;
          push_mediation: boolean;
          push_sales: boolean;
          reports: boolean;
          updated_at: string;
          user_id: string;
          verification: boolean;
          withdrawals: boolean;
        };
        Insert: {
          created_at?: string;
          marketing?: boolean;
          messages?: boolean;
          orders?: boolean;
          push_mediation?: boolean;
          push_sales?: boolean;
          reports?: boolean;
          updated_at?: string;
          user_id: string;
          verification?: boolean;
          withdrawals?: boolean;
        };
        Update: {
          created_at?: string;
          marketing?: boolean;
          messages?: boolean;
          orders?: boolean;
          push_mediation?: boolean;
          push_sales?: boolean;
          reports?: boolean;
          updated_at?: string;
          user_id?: string;
          verification?: boolean;
          withdrawals?: boolean;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          kind: string;
          link: string | null;
          read_at: string | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          body?: string;
          created_at?: string;
          id?: string;
          kind?: string;
          link?: string | null;
          read_at?: string | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          kind?: string;
          link?: string | null;
          read_at?: string | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      order_events: {
        Row: {
          created_at: string;
          id: string;
          label: string;
          order_id: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          label?: string;
          order_id: string;
          status: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          label?: string;
          order_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          amount_cents: number;
          base_price_cents: number;
          buyer_email: string | null;
          buyer_id: string | null;
          charge_id: string | null;
          created_at: string;
          delivered_content: string | null;
          fee_cents: number;
          id: string;
          paid_at: string | null;
          payment_provider: string;
          pix_copy_paste: string | null;
          pix_qrcode: string | null;
          product_id: string;
          protection: string;
          protection_fee_cents: number;
          quantity: number;
          seller_amount_cents: number;
          seller_id: string;
          status: string;
          txid: string | null;
          updated_at: string;
          variant_id: string | null;
          variant_name: string | null;
        };
        Insert: {
          amount_cents: number;
          base_price_cents?: number;
          buyer_email?: string | null;
          buyer_id?: string | null;
          charge_id?: string | null;
          created_at?: string;
          delivered_content?: string | null;
          fee_cents?: number;
          id?: string;
          paid_at?: string | null;
          payment_provider?: string;
          pix_copy_paste?: string | null;
          pix_qrcode?: string | null;
          product_id: string;
          protection?: string;
          protection_fee_cents?: number;
          quantity?: number;
          seller_amount_cents?: number;
          seller_id: string;
          status?: string;
          txid?: string | null;
          updated_at?: string;
          variant_id?: string | null;
          variant_name?: string | null;
        };
        Update: {
          amount_cents?: number;
          base_price_cents?: number;
          buyer_email?: string | null;
          buyer_id?: string | null;
          charge_id?: string | null;
          created_at?: string;
          delivered_content?: string | null;
          fee_cents?: number;
          id?: string;
          paid_at?: string | null;
          payment_provider?: string;
          pix_copy_paste?: string | null;
          pix_qrcode?: string | null;
          product_id?: string;
          protection?: string;
          protection_fee_cents?: number;
          quantity?: number;
          seller_amount_cents?: number;
          seller_id?: string;
          status?: string;
          txid?: string | null;
          updated_at?: string;
          variant_id?: string | null;
          variant_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: {
          active: boolean;
          created_at: string;
          description: string;
          id: string;
          name: string;
          position: number;
          price_cents: number;
          product_id: string;
          seller_id: string;
          stock: number;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          description?: string;
          id?: string;
          name: string;
          position?: number;
          price_cents: number;
          product_id: string;
          seller_id: string;
          stock?: number;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          description?: string;
          id?: string;
          name?: string;
          position?: number;
          price_cents?: number;
          product_id?: string;
          seller_id?: string;
          stock?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_variants_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          auto_delivery: boolean;
          category_slug: string;
          created_at: string;
          description: string;
          id: string;
          images: string[];
          price_cents: number;
          promoted: boolean;
          promoted_until: string | null;
          sales_count: number;
          seller_id: string;
          slug: string;
          status: string;
          stock: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          auto_delivery?: boolean;
          category_slug: string;
          created_at?: string;
          description?: string;
          id?: string;
          images?: string[];
          price_cents: number;
          promoted?: boolean;
          promoted_until?: string | null;
          sales_count?: number;
          seller_id: string;
          slug: string;
          status?: string;
          stock?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          auto_delivery?: boolean;
          category_slug?: string;
          created_at?: string;
          description?: string;
          id?: string;
          images?: string[];
          price_cents?: number;
          promoted?: boolean;
          promoted_until?: string | null;
          sales_count?: number;
          seller_id?: string;
          slug?: string;
          status?: string;
          stock?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_slug_fkey";
            columns: ["category_slug"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "products_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          balance_cents: number;
          ban_reason: string | null;
          banned: boolean;
          banned_at: string | null;
          banner_url: string | null;
          bio: string;
          created_at: string;
          display_name: string;
          id: string;
          last_seen_at: string | null;
          pending_cents: number;
          pix_key: string | null;
          staff_badge: boolean;
          updated_at: string;
          username: string;
          verif_business: string | null;
          verif_city: string | null;
          verif_country: string | null;
          verif_social: string | null;
          verif_social_network: string | null;
          verification_level: string;
          verified: boolean;
          verified_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          balance_cents?: number;
          ban_reason?: string | null;
          banned?: boolean;
          banned_at?: string | null;
          banner_url?: string | null;
          bio?: string;
          created_at?: string;
          display_name?: string;
          id: string;
          last_seen_at?: string | null;
          pending_cents?: number;
          pix_key?: string | null;
          staff_badge?: boolean;
          updated_at?: string;
          username: string;
          verif_business?: string | null;
          verif_city?: string | null;
          verif_country?: string | null;
          verif_social?: string | null;
          verif_social_network?: string | null;
          verification_level?: string;
          verified?: boolean;
          verified_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          balance_cents?: number;
          ban_reason?: string | null;
          banned?: boolean;
          banned_at?: string | null;
          banner_url?: string | null;
          bio?: string;
          created_at?: string;
          display_name?: string;
          id?: string;
          last_seen_at?: string | null;
          pending_cents?: number;
          pix_key?: string | null;
          staff_badge?: boolean;
          updated_at?: string;
          username?: string;
          verif_business?: string | null;
          verif_city?: string | null;
          verif_country?: string | null;
          verif_social?: string | null;
          verif_social_network?: string | null;
          verification_level?: string;
          verified?: boolean;
          verified_at?: string | null;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          auth: string;
          created_at: string;
          endpoint: string;
          id: string;
          p256dh: string;
          updated_at: string;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          auth: string;
          created_at?: string;
          endpoint: string;
          id?: string;
          p256dh: string;
          updated_at?: string;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          auth?: string;
          created_at?: string;
          endpoint?: string;
          id?: string;
          p256dh?: string;
          updated_at?: string;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          created_at: string;
          details: string;
          id: string;
          reason: string;
          reporter_id: string;
          resolution: string | null;
          status: string;
          target_id: string;
          target_type: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          details?: string;
          id?: string;
          reason: string;
          reporter_id: string;
          resolution?: string | null;
          status?: string;
          target_id: string;
          target_type: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          details?: string;
          id?: string;
          reason?: string;
          reporter_id?: string;
          resolution?: string | null;
          status?: string;
          target_id?: string;
          target_type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey";
            columns: ["reporter_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          buyer_id: string;
          comment: string;
          created_at: string;
          id: string;
          order_id: string;
          positive: boolean;
          product_id: string;
          rating: number | null;
          seller_id: string;
        };
        Insert: {
          buyer_id: string;
          comment?: string;
          created_at?: string;
          id?: string;
          order_id: string;
          positive: boolean;
          product_id: string;
          rating?: number | null;
          seller_id: string;
        };
        Update: {
          buyer_id?: string;
          comment?: string;
          created_at?: string;
          id?: string;
          order_id?: string;
          positive?: boolean;
          product_id?: string;
          rating?: number | null;
          seller_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: true;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      site_pages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          image_url: string | null;
          position: number;
          published: boolean;
          slug: string;
          summary: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          content?: string;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          position?: number;
          published?: boolean;
          slug: string;
          summary?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          position?: number;
          published?: boolean;
          slug?: string;
          summary?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      verifications: {
        Row: {
          business_name: string | null;
          city: string | null;
          country: string | null;
          cpf: string | null;
          created_at: string;
          document_number: string | null;
          document_path: string | null;
          document_type: string | null;
          document_url: string | null;
          full_name: string;
          id: string;
          level: string;
          note: string | null;
          phone: string | null;
          selfie_url: string | null;
          social_network: string | null;
          social_url: string | null;
          status: string;
          updated_at: string;
          user_id: string;
          selfie_path: string | null;
        };
        Insert: {
          business_name?: string | null;
          city?: string | null;
          country?: string | null;
          cpf?: string | null;
          created_at?: string;
          document_number?: string | null;
          document_path?: string | null;
          document_type?: string | null;
          document_url?: string | null;
          full_name: string;
          id?: string;
          level?: string;
          note?: string | null;
          phone?: string | null;
          selfie_url?: string | null;
          social_network?: string | null;
          social_url?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
          selfie_path?: string | null;
        };
        Update: {
          business_name?: string | null;
          city?: string | null;
          country?: string | null;
          cpf?: string | null;
          created_at?: string;
          document_number?: string | null;
          document_path?: string | null;
          document_type?: string | null;
          document_url?: string | null;
          full_name?: string;
          id?: string;
          level?: string;
          note?: string | null;
          phone?: string | null;
          selfie_url?: string | null;
          social_network?: string | null;
          social_url?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
          selfie_path?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "verifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      warnings: {
        Row: {
          active: boolean;
          created_at: string;
          details: string;
          id: string;
          issued_by: string | null;
          reason: string;
          severity: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          details?: string;
          id?: string;
          issued_by?: string | null;
          reason: string;
          severity?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          details?: string;
          id?: string;
          issued_by?: string | null;
          reason?: string;
          severity?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "warnings_issued_by_fkey";
            columns: ["issued_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "warnings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      withdrawal_events: {
        Row: {
          actor_id: string | null;
          actor_role: string;
          created_at: string;
          evidence_url: string | null;
          id: string;
          note: string | null;
          reason: string | null;
          status: string;
          withdrawal_id: string;
        };
        Insert: {
          actor_id?: string | null;
          actor_role?: string;
          created_at?: string;
          evidence_url?: string | null;
          id?: string;
          note?: string | null;
          reason?: string | null;
          status: string;
          withdrawal_id: string;
        };
        Update: {
          actor_id?: string | null;
          actor_role?: string;
          created_at?: string;
          evidence_url?: string | null;
          id?: string;
          note?: string | null;
          reason?: string | null;
          status?: string;
          withdrawal_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "withdrawal_events_withdrawal_id_fkey";
            columns: ["withdrawal_id"];
            isOneToOne: false;
            referencedRelation: "withdrawals";
            referencedColumns: ["id"];
          },
        ];
      };
      withdrawals: {
        Row: {
          amount_cents: number;
          created_at: string;
          evidence_url: string | null;
          id: string;
          note: string | null;
          pix_key: string;
          reason: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          seller_id: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          amount_cents: number;
          created_at?: string;
          evidence_url?: string | null;
          id?: string;
          note?: string | null;
          pix_key: string;
          reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          seller_id: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          amount_cents?: number;
          created_at?: string;
          evidence_url?: string | null;
          id?: string;
          note?: string | null;
          pix_key?: string;
          reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          seller_id?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "withdrawals_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_banned: { Args: { _user_id: string }; Returns: boolean };
      is_conversation_member: {
        Args: { _conversation_id: string; _user_id: string };
        Returns: boolean;
      };
      is_staff: { Args: { _user_id: string }; Returns: boolean };
      notify_user: {
        Args: {
          _body: string;
          _kind: string;
          _link: string;
          _title: string;
          _user_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      app_role: "admin" | "moderator" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const;
