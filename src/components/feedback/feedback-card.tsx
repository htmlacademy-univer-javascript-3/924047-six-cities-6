import react from 'react';
import {Feedback} from '../../types/feedback.ts';
import {RatingDisplay} from '../../const/validation.ts';


type FeedbackCardProps = {
  feedback: Feedback;
}

function FeedbackCard({feedback}: FeedbackCardProps): react.JSX.Element {
  const {rating, comment, date, user} = feedback;
  const dateData = new Date(date);

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img className="reviews__avatar user__avatar" src={user.avatarUrl} width="54" height="54"
            alt="Reviews avatar"
          />
        </div>
        <span className="reviews__user-name">{user.name}</span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{width: `${RatingDisplay.StarPercentage * rating}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">{comment}</p>
        <time className="reviews__time" dateTime={dateData.toISOString().split('T')[0]}>
          {dateData.toLocaleString('en', {month: 'long'})} {dateData.getFullYear()}
        </time>
      </div>
    </li>
  );
}

export default FeedbackCard;
