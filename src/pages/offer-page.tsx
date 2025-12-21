import react, {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import FeedbackForm from '../components/feedback/feedback-form.tsx';
import FeedbackList from '../components/feedback/feedback-list.tsx';
import {MapPoint} from '../widgets/map/types.ts';
import MapWidget from '../widgets/map/map.tsx';
import OffersList from '../components/offers/offers-list.tsx';
import {useAppDispatch, useAppSelector} from '../store/typed-hooks.ts';
import Header from '../components/common/header.tsx';
import {AuthorizationStatus} from '../const/routes.ts';
import {useParams} from 'react-router-dom';
import {Spinner} from '../components/common/spinner.tsx';
import NotFoundPage from './not-found-page.tsx';
import {getOfferComments, getOfferDetails, getOffersNearby} from '../store/offers/api.ts';

function OfferPage(): react.JSX.Element {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const currentCity = useAppSelector((state) => state.offers.currentCity);
  const authorizationStatus = useAppSelector((state) => state.user.authorizationStatus);
  const { currentOffer, nearbyOffers, feedbacks, isOfferLoading } =
    useAppSelector((state) => ({
      currentOffer: state.offers.currentOffer,
      nearbyOffers: state.offers.nearbyOffers,
      feedbacks: state.offers.feedbacks,
      isOfferLoading: state.offers.isOfferLoading,
    }));
  const markers: MapPoint[] = nearbyOffers.map((offer) => ({
    id: offer.id,
    coordinates: offer.location,
    popupNode: offer.title
  }));

  useEffect(() => {
    if (id) {
      dispatch(getOfferDetails(id));
      dispatch(getOffersNearby(id));
      dispatch(getOfferComments(id));
    }
  }, [dispatch, id]);

  if (isOfferLoading) {
    return (
      <div className="page">
        <Header />
        <main className="page__main page__main--offer">
          <Spinner />
        </main>
      </div>
    );
  }

  if (!currentOffer) {
    return <NotFoundPage />;
  }

  const offer = currentOffer;

  return (
    <div className="page">
      <Helmet>
        <title> 6 cities - offer </title>
      </Helmet>

      <Header />

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer.images.map((image, index) => (
                <div key={image} className="offer__image-wrapper">
                  <img
                    className="offer__image"
                    src={image}
                    alt={`Photo ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              <div className="offer__mark">
                <span>Premium</span>
              </div>
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {offer.title}
                </h1>
                <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{width: `${offer.rating * 20}%`}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offer.rating.toFixed(1)}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offer.bedrooms} Bedroom{offer.bedrooms !== 1 ? 's' : ''}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offer.maxAdults} adult{offer.maxAdults !== 1 ? 's' : ''}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offer.goods.map((good) => (
                    <li key={good} className="offer__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div
                    className={`offer__avatar-wrapper ${
                      offer.host.isPro ? 'offer__avatar-wrapper--pro' : ''
                    } user__avatar-wrapper`}
                  >
                    <img className="offer__avatar user__avatar" src={offer.host.avatarUrl} width="74" height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">
                    {offer.host.name}
                  </span>
                  {offer.host.isPro && (
                    <span className="offer__user-status">Pro</span>
                  )}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{offer.description}</p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <FeedbackList feedbackList={feedbacks}/>
                {authorizationStatus === AuthorizationStatus.Auth && <FeedbackForm />}
              </section>
            </div>
          </div>
          <MapWidget mapCenter={currentCity.location} markers={markers} mapContainerClassName="offer__map map"/>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <OffersList offers={nearbyOffers} containerClassName="near-places__list places__list" />
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
