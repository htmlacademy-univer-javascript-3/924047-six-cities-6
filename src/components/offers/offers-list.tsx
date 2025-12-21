import react, {useCallback, memo} from 'react';
import OfferCard from './offer-card.tsx';
import {Offer} from '../../types/offer.ts';

type OffersListProps = {
  offers: Offer[];
  containerClassName: string;
  onCardHover?: (offerId: Offer['id']) => void;
}

function OffersList({offers, containerClassName, onCardHover}: OffersListProps): react.JSX.Element {
  const handleMouseEnter = useCallback(
    (event: react.MouseEvent<HTMLElement>) => {
      const id = event.currentTarget.dataset.offerId;
      if (id) {
        onCardHover?.(id);
      }
    }, [onCardHover]);

  return (
    <div className={containerClassName}>
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} onMouseEnter={handleMouseEnter} />
      ))}
    </div>
  );
}

export default memo(OffersList);
