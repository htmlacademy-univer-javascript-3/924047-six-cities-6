import react from 'react';
import OfferCard from './offerCard.tsx';
import {Offer} from '../../types/offer.ts';

type OffersListProps = {
  offers: Offer[];
  containerClassName: string;
  onCardHover?: (offerId: Offer['id']) => void;
}

function OffersList({offers, containerClassName, onCardHover}: OffersListProps): react.JSX.Element {
  return (
    <div className={containerClassName}>
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} onMouseEnter={() => {
          onCardHover?.(offer.id);
        }}
        />
      ))}
    </div>
  );
}

export default OffersList;
