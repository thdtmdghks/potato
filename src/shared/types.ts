export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          images: string[];
          created_by: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          image: string;
          features: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      inquiries: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          type: string;
          address: string;
          content: string;
          status: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["inquiries"]["Row"],
          "id" | "created_at" | "status"
        >;
        Update: Partial<Database["public"]["Tables"]["inquiries"]["Insert"]> & { status?: string };
      };
      push_subscriptions: {
        Row: {
          id: string;
          endpoint: string;
          keys: Record<string, string>;
          user_id: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["push_subscriptions"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["push_subscriptions"]["Insert"]>;
      };
    };
  };
}

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
