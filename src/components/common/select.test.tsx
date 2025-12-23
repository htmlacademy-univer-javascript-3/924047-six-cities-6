import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './select';
import { SelectOption } from '../../types/select';

const mockOptions: SelectOption[] = [
  { key: 'popular', value: 'Popular' },
  { key: 'price-low', value: 'Price: low to high' },
  { key: 'price-high', value: 'Price: high to low' },
  { key: 'top-rated', value: 'Top rated first' },
];

describe('Select', () => {
  it('should render select with active option', () => {
    const onSelect = vi.fn();
    render(
      <Select
        options={mockOptions}
        activeOptionKey="popular"
        onSelect={onSelect}
      >
        Sort by
      </Select>
    );

    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.getByText('Sort by')).toBeInTheDocument();
  });

  it('should expand options list when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Select
        options={mockOptions}
        activeOptionKey="popular"
        onSelect={onSelect}
      >
        Sort by
      </Select>
    );

    const selectButton = screen.getByText('Popular');
    await user.click(selectButton);

    expect(screen.getByText('Price: low to high')).toBeInTheDocument();
    expect(screen.getByText('Price: high to low')).toBeInTheDocument();
    expect(screen.getByText('Top rated first')).toBeInTheDocument();
  });

  it('should call onSelect when option is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Select
        options={mockOptions}
        activeOptionKey="popular"
        onSelect={onSelect}
      >
        Sort by
      </Select>
    );

    const selectButton = screen.getByText('Popular');
    await user.click(selectButton);

    const option = screen.getByText('Price: low to high');
    await user.click(option);

    expect(onSelect).toHaveBeenCalledWith('price-low');
  });

  it('should close options list after selecting an option', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Select
        options={mockOptions}
        activeOptionKey="popular"
        onSelect={onSelect}
      >
        Sort by
      </Select>
    );

    const selectButton = screen.getByText('Popular');
    await user.click(selectButton);

    const option = screen.getByText('Price: low to high');
    await user.click(option);

    expect(screen.queryByText('Top rated first')).not.toBeInTheDocument();
  });

  it('should mark active option', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Select
        options={mockOptions}
        activeOptionKey="price-low"
        onSelect={onSelect}
      >
        Sort by
      </Select>
    );

    const selectButton = screen.getByText('Price: low to high');
    await user.click(selectButton);

    const activeOption = screen.getAllByText('Price: low to high').find((el) => el.closest('li'));
    expect(activeOption?.closest('li')).toHaveClass('places__option--active');
  });

  it('should toggle options list on multiple clicks', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Select
        options={mockOptions}
        activeOptionKey="popular"
        onSelect={onSelect}
      >
        Sort by
      </Select>
    );

    const selectButton = screen.getByText('Popular');
    await user.click(selectButton);
    expect(screen.getByText('Price: low to high')).toBeInTheDocument();

    await user.click(selectButton);
    expect(screen.queryByText('Price: low to high')).not.toBeInTheDocument();
  });
});

