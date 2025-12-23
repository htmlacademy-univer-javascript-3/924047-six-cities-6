import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './spinner';

describe('Spinner', () => {
  it('should render spinner with default size', () => {
    render(<Spinner />);
    const svg = screen.getByLabelText('Loading');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('height', '40');
  });

  it('should render spinner with custom size', () => {
    render(<Spinner size={60} />);
    const svg = screen.getByLabelText('Loading');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '60');
    expect(svg).toHaveAttribute('height', '60');
  });

  it('should render spinner with correct viewBox', () => {
    render(<Spinner />);
    const svg = screen.getByLabelText('Loading');
    expect(svg).toHaveAttribute('viewBox', '0 0 50 50');
  });

  it('should render circle element', () => {
    render(<Spinner />);
    const circle = document.querySelector('circle');
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveAttribute('cx', '25');
    expect(circle).toHaveAttribute('cy', '25');
    expect(circle).toHaveAttribute('r', '20');
  });
});

