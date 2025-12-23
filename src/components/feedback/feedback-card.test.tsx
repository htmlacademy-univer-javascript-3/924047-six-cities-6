import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeedbackCard from './feedback-card';
import { Feedback } from '../../types/feedback';

const mockFeedback: Feedback = {
  id: 1,
  date: '2024-01-15T10:30:00.000Z',
  user: {
    name: 'John Doe',
    avatarUrl: 'avatar.jpg',
    isPro: true,
  },
  comment: 'Great place to stay!',
  rating: 5,
};

describe('FeedbackCard', () => {
  it('should render user name', () => {
    render(<FeedbackCard feedback={mockFeedback} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render comment', () => {
    render(<FeedbackCard feedback={mockFeedback} />);
    expect(screen.getByText('Great place to stay!')).toBeInTheDocument();
  });

  it('should render user avatar', () => {
    render(<FeedbackCard feedback={mockFeedback} />);
    const avatar = screen.getByAltText('Reviews avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'avatar.jpg');
  });

  it('should render formatted date', () => {
    render(<FeedbackCard feedback={mockFeedback} />);
    expect(screen.getByText(/January 2024/)).toBeInTheDocument();
  });

  it('should render rating stars with correct width', () => {
    render(<FeedbackCard feedback={mockFeedback} />);
    const ratingSpan = document.querySelector('.reviews__stars span');
    expect(ratingSpan).toHaveStyle({ width: '100%' });
  });

  it('should render with correct dateTime attribute', () => {
    render(<FeedbackCard feedback={mockFeedback} />);
    const timeElement = screen.getByText(/January 2024/);
    expect(timeElement).toHaveAttribute('dateTime', '2024-01-15');
  });
});

