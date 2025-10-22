import react, {FormEventHandler, Fragment, useState} from 'react';

function FeedbackForm(): react.JSX.Element {
  const [starsCount, setStars] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleStarsClick: FormEventHandler = (event) => {
    setStars(parseInt((event.target as HTMLInputElement).value, 10));
  };

  const handleReviewText: FormEventHandler = (event) => {
    setReviewText((event.target as HTMLTextAreaElement).value);
  };

  console.log(starsCount, reviewText);
  const starNames = [undefined, 'terribly', 'badly', 'not bad', 'good', 'perfect'] as const;

  return (
    <form className="reviews__form form" action="#" method="post">
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {[5, 4, 3, 2, 1].map((stars) => (
          <Fragment key={stars}>
            <input className="form__rating-input visually-hidden" name="rating" value={`${stars}`} id={`${stars}-stars`}
                   type="radio" onInput={handleStarsClick}
            />
            <label htmlFor={`${stars}-stars`} className="reviews__rating-label form__rating-label" title={starNames[stars]}>
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </Fragment>
        ))}

      </div>
      <textarea className="reviews__textarea form__textarea" id="review" name="review"
                placeholder="Tell how was your stay, what you like and what can be improved"
                onInput={handleReviewText}
      >
                  </textarea>
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and
          describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button className="reviews__submit form__submit button" type="submit">Submit</button>
      </div>
    </form>
  );
}

export default FeedbackForm;
