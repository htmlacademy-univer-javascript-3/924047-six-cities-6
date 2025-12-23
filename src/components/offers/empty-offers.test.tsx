import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyOffers from './empty-offers';
import { City } from '../../types/city';

const mockCity: City = {
  name: 'Amsterdam',
  location: { latitude: 52.37454, longitude: 4.897976, zoom: 13 },
};

describe('EmptyOffers', () => {
  it('should render empty offers message', () => {
    render(<EmptyOffers city={mockCity} />);
    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
  });

  it('should render city name in description', () => {
    render(<EmptyOffers city={mockCity} />);
    expect(screen.getByText(/We could not find any property available at the moment in/)).toBeInTheDocument();
    expect(screen.getByText(/Amsterdam/)).toBeInTheDocument();
  });

  it('should render with correct classes', () => {
    render(<EmptyOffers city={mockCity} />);
    const container = document.querySelector('.cities__places-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('cities__places-container--empty');
  });
});

