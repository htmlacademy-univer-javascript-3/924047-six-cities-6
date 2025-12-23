import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CityList } from './cities-list';
import { City, CitiesMap } from '../../types/city';

const mockCities: CitiesMap = {
  Amsterdam: {
    name: 'Amsterdam',
    location: { latitude: 52.37454, longitude: 4.897976, zoom: 13 },
  },
  Paris: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
  },
  Cologne: {
    name: 'Cologne',
    location: { latitude: 50.9375, longitude: 6.9603, zoom: 13 },
  },
};

const mockActiveCity: City = {
  name: 'Amsterdam',
  location: { latitude: 52.37454, longitude: 4.897976, zoom: 13 },
};

describe('CityList', () => {
  it('should render all cities', () => {
    render(
      <CityList
        cities={mockCities}
        activeCity={mockActiveCity}
        onCityClick={vi.fn()}
      />
    );
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
  });

  it('should render with correct list class', () => {
    render(
      <CityList
        cities={mockCities}
        activeCity={mockActiveCity}
        onCityClick={vi.fn()}
      />
    );
    const list = document.querySelector('.locations__list');
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass('tabs__list');
  });

  it('should mark active city', () => {
    render(
      <CityList
        cities={mockCities}
        activeCity={mockActiveCity}
        onCityClick={vi.fn()}
      />
    );
    const amsterdamLink = screen.getByText('Amsterdam').closest('a');
    expect(amsterdamLink).toHaveClass('tabs__item--active');
  });

  it('should not mark inactive cities', () => {
    render(
      <CityList
        cities={mockCities}
        activeCity={mockActiveCity}
        onCityClick={vi.fn()}
      />
    );
    const parisLink = screen.getByText('Paris').closest('a');
    const cologneLink = screen.getByText('Cologne').closest('a');
    expect(parisLink).not.toHaveClass('tabs__item--active');
    expect(cologneLink).not.toHaveClass('tabs__item--active');
  });
});

