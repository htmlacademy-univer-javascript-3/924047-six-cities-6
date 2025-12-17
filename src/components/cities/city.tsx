import {FC} from 'react';
import {City as CityType} from '../../types/city.ts';

type CityProps = {
  city: CityType;
  href: string;
  isActive?: boolean;
  onCityClick?: (city: CityType) => void;
};

export const City: FC<CityProps> = ({city, href, onCityClick, isActive = false}) => {
  const linkClassName: string[] = ['locations__item-link tabs__item'];
  if (isActive) {
    linkClassName.push('tabs__item--active');
  }

  return (
    <li className="locations__item">
      <a className={linkClassName.join(' ')} href={href} onClick={() => onCityClick?.(city)}>
        <span>{city.name}</span>
      </a>
    </li>
  );
};
