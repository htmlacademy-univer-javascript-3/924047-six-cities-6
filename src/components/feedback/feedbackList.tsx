import react, {Fragment} from 'react';
import {Feedback} from '../../types/feedback.ts';
import FeedbackCard from './feedbackCard.tsx';


type FeedbackListProps = {
  feedbackList: Feedback[];
}

function FeedbackList({feedbackList}: FeedbackListProps): react.JSX.Element {
  return (
    <Fragment>
      <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{feedbackList.length}</span></h2>
      <ul className="reviews__list">
        {feedbackList.map((feedback) => (<FeedbackCard key={feedback.id} feedback={feedback}/>))}
      </ul>
    </Fragment>
  );
}

export default FeedbackList;
