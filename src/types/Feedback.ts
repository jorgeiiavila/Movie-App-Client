export type FeedbackStatus = "pending" | "accepted" | "rejected";

type Feedback = {
  _id?: string;
  title: string;
  poster_path: string;
  created_at?: Date;
  userID?: string;
  rating: number;
  review: string;
  status: FeedbackStatus;
  filmID: number;
};

export default Feedback;
