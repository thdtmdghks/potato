import type { ReviewStatus } from "./constants";

export type ProjectRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  created_by: string;
  created_at: string;
};

export type ReviewRow = {
  id: string;
  kakao_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  images: string[];
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
};

export type ReviewEditRow = {
  review_id: string;
  content: string;
  images: string[];
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          images: string[];
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          images?: string[];
          created_by?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: ReviewRow;
        Insert: {
          id: string;
          kakao_id: string;
          author_name: string;
          author_avatar: string;
          content: string;
          images?: string[];
          status?: ReviewStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kakao_id?: string;
          author_name?: string;
          author_avatar?: string;
          content?: string;
          images?: string[];
          status?: ReviewStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      review_edits: {
        Row: ReviewEditRow;
        Insert: {
          review_id: string;
          content: string;
          images?: string[];
          created_at?: string;
        };
        Update: {
          review_id?: string;
          content?: string;
          images?: string[];
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "review_edits_review_id_fkey";
            columns: ["review_id"];
            referencedRelation: "reviews";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Project = ProjectRow;
export type Review = ReviewRow;
export type ReviewEdit = ReviewEditRow;
