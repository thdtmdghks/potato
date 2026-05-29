export type ReviewWriteState =
  | { type: "INVALID_LINK" }
  | { type: "AUTH_REQUIRED"; redirectTo: string }
  | { type: "UNAUTHORIZED" }
  | {
      type: "READY";
      id: string;
      initialData: { content: string; images: string[] } | null;
      isApproved: boolean;
      userProfile: { name?: string | null; image?: string | null };
    };

export interface ReviewWriteDeps {
  reviews: {
    getById: (id: string) => Promise<{
      id: string;
      kakao_id: string;
      status: string;
      content: string;
      images: string[];
    } | null>;
  };
  reviewEdits: {
    getById: (id: string) => Promise<{
      review_id: string;
      content: string;
      images: string[];
    } | null>;
  };
}
