import { User } from './user.ts';

export type FeedbackData = {
  comment: string;
  rating: number;
};

export type Feedback = {
  id: number;
  date: string;
  user: User;
  comment: string;
  rating: 1 | 2 | 3 | 4 | 5;
};
