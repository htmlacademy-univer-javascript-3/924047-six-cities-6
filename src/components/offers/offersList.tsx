import react, {useState} from 'react';
import OfferCard from './offerCard.tsx';
import {Offer} from '../../types/offer.ts';

type OffersListProps = {
  offers: Offer[];
  containerClassName: string;
}

function OffersList({offers, containerClassName}: OffersListProps): react.JSX.Element {
  const [, setActiveCardId] = useState<number | null>(null);
  return (
    <div className={containerClassName}>
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} onMouseEnter={() => {
          setActiveCardId(offer.id);
        }}
        />
      ))}
    </div>
  );
}

export default OffersList;
