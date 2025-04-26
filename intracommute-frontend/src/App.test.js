import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders navbar with logo text', () => {
  render(<App />);
  const logoElement = screen.getByText(/RideShare/i);
  expect(logoElement).toBeInTheDocument();
});

test('renders home page content', () => {
  render(<App />);
  const headingElement = screen.getByText(/Get to your destination faster and safer/i);
  expect(headingElement).toBeInTheDocument();
});