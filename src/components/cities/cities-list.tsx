import {FC} from 'react';
import {CitiesMap, City as CityType} from '../../types/city.ts';
import {City} from './city.tsx';

type CityListProps = {
  cities: CitiesMap;
  activeCity: CityType;
  onCityClick: (city: CityType) => void;
};

export const CityList: FC<CityListProps> = ({cities, activeCity, onCityClick}) => {
  const activeCityName = activeCity.name;
  return (
    <ul className="locations__list tabs__list">
      {Object.values(cities).map((city) => (
        <City
          key={city.name}
          city={city}
          href={'/#'}
          onCityClick={onCityClick}
          isActive={activeCityName === city.name}
        />
      ))}
    </ul>
  );
};
