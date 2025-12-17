import {FC} from 'react';
import {City as CityType} from '../../types/city.ts';
import {City} from './city.tsx';

type CityListProps = {
  cities: CityType[];
  activeCity: CityType;
  onCityClick: (city: CityType) => void;
};

export const CityList: FC<CityListProps> = ({cities, activeCity, onCityClick}) => {
  const activeCityName = activeCity.name;
  return (
    <ul className="locations__list tabs__list">
      {cities.map((city) => (
        <City
          key={city.id}
          city={city}
          href={'/#'}
          onCityClick={onCityClick}
          isActive={activeCityName === city.name}
        />
      ))}
    </ul>
  );
};
