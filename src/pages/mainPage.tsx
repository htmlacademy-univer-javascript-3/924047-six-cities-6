import react, {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import {useAppDispatch, useAppSelector} from '../store/typedHooks.ts';
import {setCity} from '../store/action.ts';
import {City} from '../types/city.ts';
import {CityList} from '../components/cities/citiesList.tsx';
import {Spinner} from '../components/spinner.tsx';
import {OffersContainer} from '../components/offers-container.tsx';
import {loadOffers} from '../store/api.ts';
import Header from '../components/header.tsx';

function MainPage(): react.JSX.Element {
  const dispatch = useAppDispatch();
  const cities = useAppSelector((state) => state.offers.cities);
  const isLoading = useAppSelector((state) => state.offers.isOffersLoading);
  const currentCity = useAppSelector((state) => state.offers.currentCity);

  const setActiveCity = (city: City) => {
    dispatch(setCity(city));
  };

  useEffect(() => {
    dispatch(loadOffers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <Helmet>
        <title> 6 cities - main </title>
      </Helmet>
      <div className="page page--gray page--main">
        <Header />

        <main className="page__main page__main--index">
          <h1 className="visually-hidden">Cities</h1>
          <div className="tabs">
            <section className="locations container">
              <CityList cities={cities} activeCity={currentCity} onCityClick={setActiveCity}/>
            </section>
          </div>
          <div className="cities">
            {isLoading ? <Spinner/> : <OffersContainer />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainPage;
