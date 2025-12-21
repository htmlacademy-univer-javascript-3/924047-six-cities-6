import react, {memo} from 'react';
import {Offer} from '../../types/offer.ts';
import FavoriteOfferCard from './favorite-offer-card.tsx';

type FavoriteOffersListProps = {
  offers: Offer[];
}

function FavoriteOffersList({offers}: FavoriteOffersListProps): react.JSX.Element {
  const favoriteOffersByCity = offers.reduce((acc, offer) => {
    if (!acc[offer.city.name]) {
      acc[offer.city.name] = [];
    }
    acc[offer.city.name].push(offer);
    return acc;
  }, {} as Record<string, Offer[]>);

  return (
    <div className="cities__places-list places__list tabs__content">
      {Object.entries(favoriteOffersByCity).map(([city, cityOffers]) => (
        <li className="favorites__locations-items" key={city}>
          <div className="favorites__locations locations locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#">
                <span>{city}</span>
              </a>
            </div>
          </div>
          <div className="favorites__places">
            {cityOffers.map((offer) => (<FavoriteOfferCard key={offer.id} offer={offer} />))}
          </div>
        </li>
      ))}
    </div>
  );
}

export default memo(FavoriteOffersList);
