import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeedbackList from './feedback-list';
import { Feedback } from '../../types/feedback';

const mockFeedbacks: Feedback[] = [
  {
    id: 1,
    date: '2024-01-15T10:30:00.000Z',
    user: {
      name: 'John Doe',
      avatarUrl: 'avatar1.jpg',
      isPro: true,
    },
    comment: 'Great place to stay!',
    rating: 5,
  },
  {
    id: 2,
    date: '2024-01-10T08:20:00.000Z',
    user: {
      name: 'Jane Smith',
      avatarUrl: 'avatar2.jpg',
      isPro: false,
    },
    comment: 'Nice apartment, but could be better.',
    rating: 4,
  },
];

describe('FeedbackList', () => {
  it('should render feedback count', () => {
    render(<FeedbackList feedbackList={mockFeedbacks} />);
    expect(screen.getByText('2', { selector: '.reviews__amount' })).toBeInTheDocument();
  });

  it('should render all feedbacks', () => {
    render(<FeedbackList feedbackList={mockFeedbacks} />);
    expect(screen.getByText('Great place to stay!')).toBeInTheDocument();
    expect(screen.getByText('Nice apartment, but could be better.')).toBeInTheDocument();
  });

  it('should render user names', () => {
    render(<FeedbackList feedbackList={mockFeedbacks} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should render empty list when no feedbacks', () => {
    render(<FeedbackList feedbackList={[]} />);
    expect(screen.getByText('0', { selector: '.reviews__amount' })).toBeInTheDocument();
  });
});

