export type RatingStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ServiceRating {
  uid: string;
  rating: number; // 1-5
  review?: string | null;
  timestamp: string; // ISO date
  userUid?: string; // Optional for public view
}

export interface ServiceRatingStats {
  averageRating: number;
  totalRatings: number;
}

export interface CreateRatingPayload {
  serviceUid: string;
  rating: number;
  review?: string;
}

export interface UpdateRatingPayload {
  rating?: number;
  review?: string;
}

export interface ApproveRatingPayload {
  uid: string;
  status: "APPROVED" | "REJECTED";
}

export interface ServiceRatingWithService extends ServiceRating {
  service?: {
    uid: string;
    name: string;
  };
  status?: RatingStatus;
}
