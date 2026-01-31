export type SubscriptionTier = "free" | "pro";

export type AlertType = "price_threshold" | "budget_limit" | "percentage_change";

export type AlertStatus = "active" | "triggered" | "disabled";

export interface User {
  id: string;
  email: string;
  created_at: string;
  subscription_tier: SubscriptionTier;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

export interface ApiProvider {
  id: string;
  user_id: string;
  provider_name: string;
  api_key_encrypted: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_synced_at?: string;
}

export interface UsageLog {
  id: string;
  provider_id: string;
  date: string;
  requests_count: number;
  tokens_used?: number;
  cost_usd: number;
  endpoint?: string;
  model?: string;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  provider_id?: string;
  name: string;
  type: AlertType;
  threshold_amount: number;
  status: AlertStatus;
  last_triggered_at?: string;
  created_at: string;
  updated_at: string;
}

// Supabase database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Partial<User> & { email: string };
        Update: Partial<User>;
      };
      api_providers: {
        Row: ApiProvider;
        Insert: Partial<ApiProvider> & { user_id: string; provider_name: string; api_key_encrypted: string };
        Update: Partial<ApiProvider>;
      };
      usage_logs: {
        Row: UsageLog;
        Insert: Partial<UsageLog> & { provider_id: string; date: string; cost_usd: number };
        Update: Partial<UsageLog>;
      };
      alerts: {
        Row: Alert;
        Insert: Partial<Alert> & { user_id: string; name: string; type: AlertType; threshold_amount: number; status: AlertStatus };
        Update: Partial<Alert>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
