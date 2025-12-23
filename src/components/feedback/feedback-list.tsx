import react, {Fragment} from 'react';
import {Feedback} from '../../types/feedback.ts';
import FeedbackCard from './feedback-card.tsx';
import {OfferLimits} from '../../const/validation.ts';


type FeedbackListProps = {
  feedbackList: Feedback[];
}

function FeedbackList({feedbackList}: FeedbackListProps): react.JSX.Element {
  const sortedFeedbacks = [...feedbackList]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, OfferLimits.MaxFeedbacks);

  return (
    <Fragment>
      <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{sortedFeedbacks.length}</span></h2>
      <ul className="reviews__list">
        {sortedFeedbacks.map((feedback) => (<FeedbackCard key={feedback.id} feedback={feedback}/>))}
      </ul>
    </Fragment>
  );
}

export default FeedbackList;
