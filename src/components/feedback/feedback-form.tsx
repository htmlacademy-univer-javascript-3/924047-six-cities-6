import react, {FormEventHandler, Fragment, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/typed-hooks.ts';
import React from 'react';
import {submitOfferComment} from '../../store/offers/api.ts';

function FeedbackForm(): react.JSX.Element {
  const dispatch = useAppDispatch();

  const { currentOffer, isSubmitting } = useAppSelector((state) => ({
    currentOffer: state.offers.currentOffer,
    isSubmitting: state.offers.isCommentSubmitting,
  }));

  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentOffer) {
      return;
    }

    dispatch(
      submitOfferComment({
        offerId: currentOffer.id,
        feedbackData: {
          comment: reviewText,
          rating: stars,
        },
      })
    )
      .unwrap()
      .then(() => {
        setStars(0);
        setReviewText('');
      })
      .catch(() => {
        // todo error handling
      });
  };

  const handleStarsClick: FormEventHandler = (event) => {
    setStars(parseInt((event.target as HTMLInputElement).value, 10));
  };

  const handleReviewText: FormEventHandler = (event) => {
    setReviewText((event.target as HTMLTextAreaElement).value);
  };
  const starNames = [undefined, 'terribly', 'badly', 'not bad', 'good', 'perfect'] as const;
  const isFormValid = stars > 0 && reviewText.length >= 50 && reviewText.length <= 300;

  return (
    <form className="reviews__form form" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {[5, 4, 3, 2, 1].map((feedbackStars) => (
          <Fragment key={feedbackStars}>
            <input disabled={isSubmitting} className="form__rating-input visually-hidden" name="rating" value={`${feedbackStars}`} id={`${feedbackStars}-stars`}
              type="radio" checked={stars === feedbackStars} onChange={handleStarsClick}
            />
            <label htmlFor={`${feedbackStars}-stars`} className="reviews__rating-label form__rating-label" title={starNames[feedbackStars]}>
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </Fragment>
        ))}
      </div>
      <textarea className="reviews__textarea form__textarea" id="review" name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        onInput={handleReviewText} value={reviewText} disabled={isSubmitting}
      >
      </textarea>
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and
          describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
          {reviewText.length > 0 && (
            <span className="reviews__char-count">
              {' '}
              ({reviewText.length}/50)
            </span>
          )}
        </p>
        <button className="reviews__submit form__submit button" type="submit"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

export default FeedbackForm;
