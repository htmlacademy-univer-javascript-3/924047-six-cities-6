import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { City } from './city';
import { City as CityType } from '../../types/city';

const mockCity: CityType = {
  name: 'Paris',
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
};

describe('City', () => {
  it('should render city name', () => {
    render(<City city={mockCity} href="/paris" />);
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('should render with correct href', () => {
    render(<City city={mockCity} href="/paris" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/paris');
  });

  it('should render with active class when isActive is true', () => {
    render(<City city={mockCity} href="/paris" isActive />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('tabs__item--active');
  });

  it('should render without active class when isActive is false', () => {
    render(<City city={mockCity} href="/paris" isActive={false} />);
    const link = screen.getByRole('link');
    expect(link).not.toHaveClass('tabs__item--active');
  });

  it('should render without active class when isActive is not provided', () => {
    render(<City city={mockCity} href="/paris" />);
    const link = screen.getByRole('link');
    expect(link).not.toHaveClass('tabs__item--active');
  });

  it('should render with base classes', () => {
    render(<City city={mockCity} href="/paris" />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('locations__item-link');
    expect(link).toHaveClass('tabs__item');
  });
});

