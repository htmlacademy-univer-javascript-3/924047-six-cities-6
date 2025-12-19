import react from 'react';
import {Offer} from '../../types/offer.ts';
import FavoriteOfferCard from './favoriteOfferCard.tsx';

type FavoriteOffersListProps = {
  offers: Offer[];
}

function FavoriteOffersList({offers}: FavoriteOffersListProps): react.JSX.Element {
  const offersByCity = offers.reduce<Record<string, Offer[]>>((groupedOffers, currentOffer) => {
    const cityName = currentOffer.city.name;

    if (!groupedOffers[cityName]) {
      groupedOffers[cityName] = [];
    }

    groupedOffers[cityName].push(currentOffer);

    return groupedOffers;
  }, {});
  return (
    <div className="cities__places-list places__list tabs__content">
      {Object.entries(offersByCity).map(([city, cityOffers]) => (
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
