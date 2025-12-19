import {Select} from './select.tsx';
import {sortOptions} from '../const/sortOptions.ts';
import OffersList from './offers/offersList.tsx';
import MapWidget from '../widgets/map/map.tsx';
import {MapPoint} from '../widgets/map/types.ts';
import {Offer} from '../types/offer.ts';
import {setActiveOffer, setOffers} from '../store/action.ts';
import {SelectOption} from '../types/select.ts';
import {getSortedOffers} from '../utils/offersSort.ts';
import {useAppDispatch, useAppSelector} from '../store/typedHooks.ts';
import {useState} from 'react';

export function OffersContainer() {
  const dispatch = useAppDispatch();

  const currentCity = useAppSelector((state) => state.offers.currentCity);
  const activeOfferId = useAppSelector((state) => state.offers.activeOfferId);
  const offers = useAppSelector((state) => state.offers.currentCityOffers);

  const [sort, setSort] = useState<SelectOption['key']>(sortOptions[0].key);

  function handleSortChange(sortOption: SelectOption['key']) {
    setSort(sortOption);

    const sortedOffers = getSortedOffers(offers, sortOption);
    dispatch(setOffers(sortedOffers));
  }

  const handleOfferHover = (offerId: Offer['id']) => {
    dispatch(setActiveOffer(offerId));
  };

  const markers: MapPoint[] = offers.map((offer) => ({
    id: offer.id,
    coordinates: offer.location,
    popupNode: offer.title
  }));

  return(
    <div className="cities__places-container container">
      <section className="cities__places places">
        <h2 className="visually-hidden">Places</h2>
        <b className="places__found">{offers.length} places to stay in {currentCity.name}</b>
        <Select
          options={sortOptions}
          activeOptionKey={sort}
          onSelect={(sortOption) => handleSortChange(sortOption)}
        >
        Sort by
        </Select>
        <OffersList offers={offers} onCardHover={handleOfferHover} containerClassName="cities__places-list places__list tabs__content" />
      </section>
      <div className="cities__right-section">
        <MapWidget mapCenter={currentCity.location} activeMarkers={activeOfferId ? [activeOfferId] : []} markers={markers} mapContainerClassName="cities__map map"/>
      </div>
    </div>
  );
}
