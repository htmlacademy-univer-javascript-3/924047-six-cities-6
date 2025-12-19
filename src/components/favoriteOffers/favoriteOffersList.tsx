import react from 'react';
import {OffersByCity} from '../../types/offer.ts';
import FavoriteOfferCard from './favoriteOfferCard.tsx';

type FavoriteOffersListProps = {
  offers: OffersByCity;
}

function FavoriteOffersList({offers}: FavoriteOffersListProps): react.JSX.Element {
  return (
    <div className="cities__places-list places__list tabs__content">
      {Object.entries(offers).map(([city, cityOffers]) => (
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

export default FavoriteOffersList;
