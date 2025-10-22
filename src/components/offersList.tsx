import react, {useState} from "react";
import OfferCard from "./offerCard.tsx";
import {Offer} from "../types/offer.ts";

type OffersListProps = {
  offers: Offer[];
}

function OffersList({offers}: OffersListProps): react.JSX.Element {
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  console.log(activeCardId);
  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} onMouseEnter={() => {setActiveCardId(offer.id)}} />
      ))}
    </div>
  )
}

export default OffersList;
