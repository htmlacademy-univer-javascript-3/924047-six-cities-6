import react from 'react';
import {Place} from "../types/place.ts";

function PlaceCard(PlaceCardProps: Place): react.JSX.Element {
  return (
    <article className="cities__card place-card">
      { PlaceCardProps.isPremium && <div className="place-card__mark">
        <span>Premium</span>
      </div> }
      <div className="cities__image-wrapper place-card__image-wrapper">
        <a href="#">
          <img className="place-card__image" src={PlaceCardProps.placeImageSrc} width="260" height="200"
               alt="Place image"/>
        </a>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{PlaceCardProps.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className={PlaceCardProps.isBookmarked ? "place-card__bookmark-button place-card__bookmark-button--active button" : "place-card__bookmark-button button"} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${PlaceCardProps.starsCount*20}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <a href="#">{PlaceCardProps.placeName}</a>
        </h2>
        <p className="place-card__type">{PlaceCardProps.placeType}</p>
      </div>
    </article>
  );
}

export default PlaceCard;
