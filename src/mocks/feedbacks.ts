import {Feedback} from '../types/feedback.ts';
import {User} from '../types/user.ts';

export const usersMockData: User[] = [
  {
    name: 'Max',
    avatarUrl: 'img/avatar-max.jpg',
    isPro: false,
  },
  {
    name: 'Angelina',
    avatarUrl: 'img/avatar-angelina.jpg',
    isPro: true,
  },
];

export const feedbacksMockData: Feedback[] = [
  {
    id: 0,
    stars: 4,
    user: usersMockData[0],
    text: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
    date: new Date('2019-07-12'),
  },
  {
    id: 1,
    stars: 3,
    user: usersMockData[1],
    text: 'Not bad',
    date: new Date('2020-10-10'),
  }
];
