import react, {MouseEventHandler} from 'react';
import {Offer} from '../types/offer.ts';
import {Link} from 'react-router-dom';
import {AppRoute} from '../const/routes.ts';

type OfferCardProps = {
  offer: Offer;
  onMouseEnter: MouseEventHandler;
}

function OfferCard({offer, onMouseEnter}: OfferCardProps): react.JSX.Element {
  return (
    <article className="cities__card place-card" onMouseEnter={onMouseEnter}>
      {
        offer.isPremium &&
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      }
      <div className="cities__image-wrapper place-card__image-wrapper">
        <Link to={AppRoute.Offer.replace(':id', String(offer.id))}>
          <img className="place-card__image" src={offer.placeImageSrc} width="260" height="200"
            alt="Offer image"
          />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className={offer.isBookmarked ? 'place-card__bookmark-button place-card__bookmark-button--active button' : 'place-card__bookmark-button button'} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${offer.starsCount * 20}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={AppRoute.Offer.replace(':id', String(offer.id))}>{offer.placeName}</Link>
        </h2>
        <p className="place-card__type">{offer.placeType}</p>
      </div>
    </article>
  );
}

export default OfferCard;
