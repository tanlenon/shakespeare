import { render, screen } from '@testing-library/react';
import Container from './App';

test('renders learn react link', () => {
  render(<Container />);
  const reviewsElement = screen.getByText(/Shakepeare's Reviews/i);
  expect(reviewsElement).toBeInTheDocument();
});