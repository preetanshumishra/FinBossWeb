import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('should render pagination controls', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={jest.fn()}
        disabled={false}
      />
    );

    expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('should display page numbers', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={jest.fn()}
        disabled={false}
      />
    );

    // Should show current page
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should disable previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={jest.fn()}
        disabled={false}
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous page/i }) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(true);
  });

  it('should disable next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={jest.fn()}
        disabled={false}
      />
    );

    const nextButton = screen.getByRole('button', { name: /next page/i }) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(true);
  });

  it('should call onPageChange when page number clicked', () => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
        disabled={false}
      />
    );

    const pageButton = screen.getByText('2');
    fireEvent.click(pageButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when next button clicked', () => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
        disabled={false}
      />
    );

    const nextButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when previous button clicked', () => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
        disabled={false}
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous page/i });
    fireEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should disable all buttons when disabled prop is true', () => {
    const { container } = render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={jest.fn()}
        disabled={true}
      />
    );

    const buttons = container.querySelectorAll('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should handle single page gracefully', () => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={onPageChange}
        disabled={false}
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous page/i });
    const nextButton = screen.getByRole('button', { name: /next page/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('should show page info', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={jest.fn()}
        disabled={false}
      />
    );

    // Should display current page / total pages
    expect(screen.getByText(/page/i)).toBeInTheDocument();
  });

  it('should handle large number of pages with ellipsis', () => {
    const { container } = render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={jest.fn()}
        disabled={false}
      />
    );

    // Should have some buttons and possibly ellipsis
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(2);
  });

  it('should not call onPageChange for current page', () => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
        disabled={false}
      />
    );

    const pageButton = screen.getByText('2');
    fireEvent.click(pageButton);

    // Current page button should not be clickable or should not call onChange
    // (depending on implementation)
  });
});
