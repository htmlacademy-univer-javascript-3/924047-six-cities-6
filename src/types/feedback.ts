import { User } from './user.ts';

export type Feedback = {
  id: number;
  user: User;
  stars: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: Date;
};
